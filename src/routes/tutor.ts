import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get tutor mode data for a topic
router.get('/exams/:code/topics/:topicId/tutor', authMiddleware, async (req: AuthRequest, res) => {
  const { code, topicId } = req.params;
  const userId = req.userId!;
  
  try {

    // Get topic with video
    const topic = await prisma.videoTopic.findUnique({
      where: { id: topicId },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    // Get exam context (optional - exam might not exist)
    let exam = null;
    let objective = null;
    let domain = null;
    let skills: string[] = [];

    try {
      exam = await prisma.exam.findUnique({
        where: { code },
        include: {
          domains: {
            include: {
              objectives: {
                include: {
                  topics: {
                    where: { topicId },
                    include: {
                      objective: {
                        include: {
                          domain: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (exam) {
        const examTopic = exam.domains
          .flatMap((d) => d.objectives)
          .flatMap((o) => o.topics)
          .find((t) => t.topicId === topicId);

        objective = examTopic?.objective;
        domain = objective?.domain;
        skills = objective?.skillIds || [];
      }
    } catch (examError) {
      console.warn('Exam lookup failed (non-critical):', examError);
      // Continue without exam context
    }

    // Get related topics from same video
    const relatedTopics = await prisma.videoTopic.findMany({
      where: {
        videoId: topic.videoId,
        id: { not: topicId },
      },
      select: {
        id: true,
        title: true,
        startSeconds: true,
        endSeconds: true,
      },
      orderBy: { startSeconds: 'asc' },
    });

    // Get mastery for skills
    const mastery = await prisma.skillMastery.findMany({
      where: {
        userId,
        skillId: { in: skills },
      },
    });

    const masteryMap = mastery.reduce(
      (acc, m) => {
        acc[m.skillId] = {
          masteryScore: m.masteryScore,
          confidence: m.confidence || 'Low',
          lastAssessedAt: m.lastAssessedAt,
        };
        return acc;
      },
      {} as Record<string, { masteryScore: number; confidence: string; lastAssessedAt: Date | null }>
    );

    // Get labs for this topic
    const labs = await prisma.labExercise.findMany({
      where: {
        topicIds: { has: topicId },
      },
      select: {
        id: true,
        title: true,
        description: true,
        steps: true,
        tags: true,
      },
    });

    // Get micro-drill for this topic
    const drill = await prisma.drill.findFirst({
      where: {
        topicIds: { has: topicId },
      },
      select: {
        id: true,
        title: true,
        description: true,
        questions: true,
      },
    });

    // Get relevant videos for each section
    // Videos with similar tags or topics
    const relevantVideosWhere: any = {
      id: { not: topic.videoId },
    };

    const orConditions: any[] = [];
    
    if (topic.techTags && topic.techTags.length > 0) {
      orConditions.push({ tags: { some: { tag: { in: topic.techTags } } } });
    }
    
    // Note: difficulty field removed, using video level instead if needed
    // orConditions.push({ level: video.level }); // Can add if needed
    
    if (topic.keywords && topic.keywords.length > 0) {
      orConditions.push({ topics: { some: { keywords: { hasSome: topic.keywords } } } });
    }

    if (orConditions.length > 0) {
      relevantVideosWhere.OR = orConditions;
    }

    let relevantVideos: any[] = [];
    try {
      relevantVideos = await prisma.video.findMany({
        where: relevantVideosWhere,
        include: {
          tags: true,
          _count: {
            select: {
              topics: true,
            },
          },
        },
        take: 6,
      });
    } catch (videoError) {
      console.warn('Relevant videos query failed, using fallback:', videoError);
      // Fallback: just get any other videos
      relevantVideos = await prisma.video.findMany({
        where: {
          id: { not: topic.videoId },
        },
        include: {
          tags: true,
          _count: {
            select: {
              topics: true,
            },
          },
        },
        take: 6,
      });
    }

    // Parse JSON fields
    const keyConcepts = (topic.keyConcepts as string[]) || [];
    const highlights = (topic.highlights as string[]) || [];

    res.json({
      topic: {
        id: topic.id,
        title: topic.title,
        startSeconds: topic.startSeconds,
        endSeconds: topic.endSeconds,
        transcriptExcerpt: topic.transcriptExcerpt,
        keywords: topic.keywords,
        techTags: topic.techTags,
        keyConcepts,
        highlights,
        examAngleNotes: topic.examAngleNotes,
      },
      video: topic.video,
      blueprintContext: {
        domain: domain
          ? {
              code: domain.code,
              title: domain.title,
            }
          : null,
        objective: objective
          ? {
              code: objective.code,
              title: objective.title,
            }
          : null,
        skills,
      },
      mastery: Object.keys(masteryMap).length > 0 ? masteryMap : null,
      keyConcepts,
      highlights,
      techTags: topic.techTags,
      relatedTopicsSameVideo: relatedTopics,
      labs: labs.map((lab) => ({
        labId: lab.id,
        title: lab.title,
        steps: lab.steps as any[],
        checklist: (lab.steps as any[]).flatMap((s) => s.checklist || []),
        tags: lab.tags,
      })),
      microDrill: drill
        ? {
            drillId: drill.id,
            questions: (drill.questions as any[]).map((q) => ({
              id: q.id,
              questionText: q.questionText,
              options: q.options,
            })),
          }
        : null,
      relevantVideos: relevantVideos.map((v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        thumbnailUrl: v.thumbnailUrl,
        durationSeconds: v.durationSeconds,
        level: v.level,
        tags: v.tags.map((t: { tag: string }) => t.tag),
        topicCount: v._count.topics,
      })),
    });
  } catch (error) {
    console.error('Get tutor data error:', error);
    console.error('Error details:', {
      code,
      topicId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export { router as tutorRouter };

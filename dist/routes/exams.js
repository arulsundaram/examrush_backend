import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { microsoftCertifications } from '../data/microsoft-certifications.js';
const router = Router();
const prisma = new PrismaClient();
// Get all exams - combines database exams with Microsoft certifications catalog
router.get('/', async (req, res) => {
    try {
        // Get exams from database
        const dbExams = await prisma.exam.findMany({
            include: {
                domains: {
                    include: {
                        objectives: {
                            include: {
                                topics: {
                                    include: {
                                        topic: {
                                            select: {
                                                id: true,
                                                title: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        topics: true,
                    },
                },
            },
            orderBy: { code: 'asc' },
        });
        // Format database exams
        const formattedDbExams = dbExams.map((exam) => ({
            id: exam.id,
            code: exam.code,
            title: exam.title,
            description: exam.description,
            domains: exam.domains.map((domain) => ({
                id: domain.id,
                code: domain.code,
                title: domain.title,
                description: domain.description,
                objectives: domain.objectives.map((obj) => ({
                    id: obj.id,
                    code: obj.code,
                    title: obj.title,
                    description: obj.description,
                    skillIds: obj.skillIds,
                    topicCount: obj.topics.length,
                })),
            })),
            topicCount: exam._count.topics,
            hasContent: exam._count.topics > 0,
        }));
        // Get all Microsoft certifications and merge with database exams
        const allExams = microsoftCertifications.map((cert) => {
            const dbExam = formattedDbExams.find((e) => e.code === cert.code);
            // If exam exists in database, use database data but enrich with catalog info
            if (dbExam) {
                return {
                    ...dbExam,
                    category: cert.category,
                    level: cert.level,
                    requiredExams: cert.requiredExams,
                    skills: cert.skills,
                    product: cert.product,
                    role: cert.role,
                    credentialType: cert.credentialType || 'Certification',
                    hasContent: dbExam.hasContent,
                };
            }
            // If exam doesn't exist in database, return catalog data only
            return {
                id: `catalog-${cert.code}`,
                code: cert.code,
                title: cert.title,
                description: cert.description,
                category: cert.category,
                level: cert.level,
                requiredExams: cert.requiredExams,
                skills: cert.skills,
                product: cert.product,
                role: cert.role,
                credentialType: cert.credentialType || 'Certification',
                domains: [],
                topicCount: 0,
                hasContent: false,
            };
        });
        // Sort by code
        allExams.sort((a, b) => a.code.localeCompare(b.code));
        res.json({ exams: allExams });
    }
    catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get exam by code with comprehensive video data
router.get('/:code', async (req, res) => {
    try {
        const { code } = req.params;
        const exam = await prisma.exam.findUnique({
            where: { code },
            include: {
                domains: {
                    include: {
                        objectives: {
                            include: {
                                topics: {
                                    include: {
                                        topic: {
                                            include: {
                                                video: {
                                                    include: {
                                                        tags: true,
                                                        topics: {
                                                            select: {
                                                                id: true,
                                                                title: true,
                                                                startSeconds: true,
                                                                endSeconds: true,
                                                                techTags: true,
                                                                keyConcepts: true,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        topics: true,
                    },
                },
            },
        });
        if (!exam) {
            res.status(404).json({ error: 'Exam not found' });
            return;
        }
        // Collect all unique videos and topics
        const allVideos = new Map();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allTopics = [];
        const techTagsMap = new Map();
        const conceptVideosMap = new Map();
        exam.domains.forEach((domain) => {
            domain.objectives.forEach((objective) => {
                objective.topics.forEach((et) => {
                    const topic = et.topic;
                    const video = topic.video;
                    // Collect topic
                    allTopics.push({
                        id: topic.id,
                        title: topic.title,
                        startSeconds: topic.startSeconds,
                        endSeconds: topic.endSeconds,
                        techTags: topic.techTags || [],
                        keyConcepts: topic.keyConcepts || [],
                        video: {
                            id: video.id,
                            title: video.title,
                            description: video.description,
                            thumbnailUrl: video.thumbnailUrl,
                            durationSeconds: video.durationSeconds,
                            level: video.level,
                        },
                        objective: {
                            id: objective.id,
                            code: objective.code,
                            title: objective.title,
                        },
                        domain: {
                            id: domain.id,
                            code: domain.code,
                            title: domain.title,
                        },
                    });
                    // Collect video (avoid duplicates)
                    if (!allVideos.has(video.id)) {
                        allVideos.set(video.id, {
                            id: video.id,
                            title: video.title,
                            description: video.description,
                            thumbnailUrl: video.thumbnailUrl,
                            durationSeconds: video.durationSeconds,
                            level: video.level,
                            tags: video.tags.map((t) => t.tag),
                            topics: video.topics.map((t) => ({
                                id: t.id,
                                title: t.title,
                                startSeconds: t.startSeconds,
                                endSeconds: t.endSeconds,
                            })),
                        });
                    }
                    // Organize by technical tags
                    if (topic.techTags && topic.techTags.length > 0) {
                        topic.techTags.forEach((tag) => {
                            if (!techTagsMap.has(tag)) {
                                techTagsMap.set(tag, []);
                            }
                            techTagsMap.get(tag).push({
                                topicId: topic.id,
                                topicTitle: topic.title,
                                video: {
                                    id: video.id,
                                    title: video.title,
                                    thumbnailUrl: video.thumbnailUrl,
                                    durationSeconds: video.durationSeconds,
                                },
                            });
                        });
                    }
                    // Organize by concepts (keyConcepts)
                    if (topic.keyConcepts && Array.isArray(topic.keyConcepts) && topic.keyConcepts.length > 0) {
                        topic.keyConcepts.forEach((concept) => {
                            const conceptName = typeof concept === 'string' ? concept : concept.name || concept.title;
                            if (conceptName) {
                                if (!conceptVideosMap.has(conceptName)) {
                                    conceptVideosMap.set(conceptName, []);
                                }
                                conceptVideosMap.get(conceptName).push({
                                    topicId: topic.id,
                                    topicTitle: topic.title,
                                    video: {
                                        id: video.id,
                                        title: video.title,
                                        thumbnailUrl: video.thumbnailUrl,
                                        durationSeconds: video.durationSeconds,
                                    },
                                });
                            }
                        });
                    }
                });
            });
        });
        // Format videos by technical tags
        const videosByTechTags = Array.from(techTagsMap.entries()).map(([tag, videos]) => ({
            tag,
            videos: Array.from(new Map(videos.map((v) => [v.video.id, v])).values()),
        }));
        // Format videos by concepts
        const videosByConcepts = Array.from(conceptVideosMap.entries()).map(([concept, videos]) => ({
            concept,
            videos: Array.from(new Map(videos.map((v) => [v.video.id, v])).values()),
        }));
        // Demo videos are all unique videos (different pieces of the exam)
        const demoVideos = Array.from(allVideos.values());
        const formattedExam = {
            id: exam.id,
            code: exam.code,
            title: exam.title,
            description: exam.description,
            domains: exam.domains.map((domain) => ({
                id: domain.id,
                code: domain.code,
                title: domain.title,
                description: domain.description,
                objectives: domain.objectives.map((obj) => ({
                    id: obj.id,
                    code: obj.code,
                    title: obj.title,
                    description: obj.description,
                    skillIds: obj.skillIds,
                    topics: obj.topics.map((et) => ({
                        id: et.topic.id,
                        title: et.topic.title,
                        startSeconds: et.topic.startSeconds,
                        endSeconds: et.topic.endSeconds,
                        techTags: et.topic.techTags || [],
                        keyConcepts: et.topic.keyConcepts || [],
                        video: {
                            id: et.topic.video.id,
                            title: et.topic.video.title,
                            description: et.topic.video.description,
                            thumbnailUrl: et.topic.video.thumbnailUrl,
                            durationSeconds: et.topic.video.durationSeconds,
                            level: et.topic.video.level,
                        },
                    })),
                })),
            })),
            topicCount: exam._count.topics,
            // Additional structured data
            allTopics,
            videosByTechTags,
            videosByConcepts,
            demoVideos,
            totalVideos: allVideos.size,
            totalTopics: allTopics.length,
        };
        res.json({ exam: formattedExam });
    }
    catch (error) {
        console.error('Get exam error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export { router as examsRouter };
//# sourceMappingURL=exams.js.map
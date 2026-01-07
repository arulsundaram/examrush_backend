import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { clipSearchSchema } from '@ai-video-learning/shared';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
// Prompt-to-clip search within a topic's video
router.post('/topics/:topicId/prompt-clip', authMiddleware, async (req, res) => {
    try {
        const { topicId } = req.params;
        const validated = clipSearchSchema.parse(req.body);
        const { prompt } = validated;
        const userId = req.userId;
        // Get topic to find video
        const topic = await prisma.videoTopic.findUnique({
            where: { id: topicId },
        });
        if (!topic) {
            res.status(404).json({ error: 'Topic not found' });
            return;
        }
        // Get all topics for this video
        const topics = await prisma.videoTopic.findMany({
            where: { videoId: topic.videoId },
            orderBy: { startSeconds: 'asc' },
        });
        if (topics.length === 0) {
            res.status(404).json({ error: 'No topics found for this video' });
            return;
        }
        // Tokenize prompt
        const promptWords = prompt
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 2);
        // Score each topic
        const scoredTopics = topics.map((t) => {
            const titleWords = t.title.toLowerCase().split(/\s+/);
            const keywordWords = t.keywords.map((k) => k.toLowerCase());
            const titleMatches = promptWords.filter((pw) => titleWords.some((tw) => tw.includes(pw) || pw.includes(tw))).length;
            const keywordMatches = promptWords.filter((pw) => keywordWords.some((kw) => kw.includes(pw) || pw.includes(kw))).length;
            const score = titleMatches * 2 + keywordMatches;
            return { topic: t, score };
        });
        scoredTopics.sort((a, b) => b.score - a.score);
        const getConfidence = (score, maxScore) => {
            if (maxScore === 0)
                return 'Low';
            const ratio = score / maxScore;
            if (ratio >= 0.7)
                return 'High';
            if (ratio >= 0.3)
                return 'Medium';
            return 'Low';
        };
        const maxScore = scoredTopics[0]?.score || 0;
        const bestMatch = scoredTopics[0];
        if (!bestMatch || bestMatch.score === 0) {
            const firstTopic = topics[0];
            res.json({
                prompt,
                bestMatch: {
                    topicId: firstTopic.id,
                    title: firstTopic.title,
                    startSeconds: firstTopic.startSeconds,
                    endSeconds: firstTopic.endSeconds,
                    confidence: 'Low',
                    transcriptExcerpt: firstTopic.transcriptExcerpt,
                },
                related: topics.slice(1, 4).map((t) => ({
                    topicId: t.id,
                    title: t.title,
                    startSeconds: t.startSeconds,
                    endSeconds: t.endSeconds,
                    confidence: 'Low',
                    transcriptExcerpt: t.transcriptExcerpt,
                })),
            });
            return;
        }
        const bestMatchConfidence = getConfidence(bestMatch.score, maxScore);
        const related = scoredTopics
            .slice(1, 6)
            .filter((st) => st.score > 0)
            .map((st) => ({
            topicId: st.topic.id,
            title: st.topic.title,
            startSeconds: st.topic.startSeconds,
            endSeconds: st.topic.endSeconds,
            confidence: getConfidence(st.score, maxScore),
            transcriptExcerpt: st.topic.transcriptExcerpt,
        }));
        // Log engagement
        await prisma.topicEngagement.create({
            data: {
                userId,
                topicId,
                eventType: 'PromptSearch',
                metadata: { prompt, bestMatchTopicId: bestMatch.topic.id },
            },
        });
        // Update skill mastery lastPromptUsed if topic has skills
        const examTopic = await prisma.examTopic.findFirst({
            where: { topicId },
            include: {
                objective: true,
            },
        });
        if (examTopic?.objective.skillIds) {
            for (const skillId of examTopic.objective.skillIds) {
                await prisma.skillMastery.upsert({
                    where: {
                        userId_skillId: {
                            userId,
                            skillId,
                        },
                    },
                    update: {
                        lastPromptUsed: new Date(),
                    },
                    create: {
                        userId,
                        skillId,
                        skillName: skillId,
                        lastPromptUsed: new Date(),
                    },
                });
            }
        }
        res.json({
            prompt,
            bestMatch: {
                topicId: bestMatch.topic.id,
                title: bestMatch.topic.title,
                startSeconds: bestMatch.topic.startSeconds,
                endSeconds: bestMatch.topic.endSeconds,
                confidence: bestMatchConfidence,
                transcriptExcerpt: bestMatch.topic.transcriptExcerpt,
            },
            related,
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error });
            return;
        }
        console.error('Prompt clip error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export { router as topicPromptRouter };
//# sourceMappingURL=topicPrompt.js.map
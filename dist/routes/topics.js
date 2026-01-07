import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { clipSearchSchema } from '@ai-video-learning/shared';
const router = Router();
const prisma = new PrismaClient();
// Get all topics for a video
router.get('/:videoId/topics', async (req, res) => {
    try {
        const { videoId } = req.params;
        const topics = await prisma.videoTopic.findMany({
            where: { videoId },
            orderBy: { startSeconds: 'asc' },
        });
        res.json({ topics });
    }
    catch (error) {
        console.error('Get topics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Clip search (prompt-to-clip)
router.post('/:videoId/clip-search', async (req, res) => {
    try {
        const { videoId } = req.params;
        const validated = clipSearchSchema.parse(req.body);
        const { prompt } = validated;
        // Get all topics for this video
        const topics = await prisma.videoTopic.findMany({
            where: { videoId },
            orderBy: { startSeconds: 'asc' },
        });
        if (topics.length === 0) {
            res.status(404).json({ error: 'No topics found for this video' });
            return;
        }
        // Tokenize prompt (simple word splitting)
        const promptWords = prompt
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 2);
        // Score each topic
        const scoredTopics = topics.map((topic) => {
            const titleWords = topic.title.toLowerCase().split(/\s+/);
            const keywordWords = topic.keywords.map((k) => k.toLowerCase());
            // Count matches in title
            const titleMatches = promptWords.filter((pw) => titleWords.some((tw) => tw.includes(pw) || pw.includes(tw))).length;
            // Count matches in keywords
            const keywordMatches = promptWords.filter((pw) => keywordWords.some((kw) => kw.includes(pw) || pw.includes(kw))).length;
            // Score: title matches weighted more
            const score = titleMatches * 2 + keywordMatches;
            return {
                topic,
                score,
            };
        });
        // Sort by score descending
        scoredTopics.sort((a, b) => b.score - a.score);
        // Determine confidence
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
            // No good match, return first topic as best match with Low confidence
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
                allTopics: topics.map((t) => ({
                    topicId: t.id,
                    title: t.title,
                    startSeconds: t.startSeconds,
                    endSeconds: t.endSeconds,
                    keywords: t.keywords,
                })),
            });
            return;
        }
        const bestMatchConfidence = getConfidence(bestMatch.score, maxScore);
        // Get related topics (next top 3-5, excluding best match)
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
            allTopics: topics.map((t) => ({
                topicId: t.id,
                title: t.title,
                startSeconds: t.startSeconds,
                endSeconds: t.endSeconds,
                keywords: t.keywords,
            })),
        });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error });
            return;
        }
        console.error('Clip search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export { router as topicsRouter };
//# sourceMappingURL=topics.js.map
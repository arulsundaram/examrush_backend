import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { progressSchema } from '@ai-video-learning/shared';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();
const prisma = new PrismaClient();
// Update progress
router.post('/', authMiddleware, async (req, res) => {
    try {
        const validated = progressSchema.parse(req.body);
        const { videoId, progressPercent, lastPositionSeconds } = validated;
        // Get existing progress before updating
        const existingProgress = await prisma.userVideoProgress.findUnique({
            where: {
                userId_videoId: {
                    userId: req.userId,
                    videoId,
                },
            },
        });
        const wasComplete = existingProgress?.progressPercent === 100;
        const isNowComplete = progressPercent === 100;
        const progress = await prisma.userVideoProgress.upsert({
            where: {
                userId_videoId: {
                    userId: req.userId,
                    videoId,
                },
            },
            update: {
                progressPercent,
                lastPositionSeconds,
            },
            create: {
                userId: req.userId,
                videoId,
                progressPercent,
                lastPositionSeconds,
            },
        });
        // Award XP if video was just completed (first time reaching 100%)
        if (isNowComplete && !wasComplete) {
            const gamification = await prisma.userGamification.findUnique({
                where: { userId: req.userId },
            });
            if (gamification) {
                await prisma.userGamification.update({
                    where: { userId: req.userId },
                    data: {
                        xp: gamification.xp + 100, // 100 XP for completing a video
                    },
                });
            }
        }
        res.json({ progress });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error });
            return;
        }
        console.error('Update progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export { router as progressRouter };
//# sourceMappingURL=progress.js.map
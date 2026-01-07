import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get achievements
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const gamification = await prisma.userGamification.findUnique({
      where: { userId: req.userId! },
    });

    const progress = await prisma.userVideoProgress.findMany({
      where: { userId: req.userId! },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    res.json({
      xp: gamification?.xp || 0,
      streakCount: gamification?.streakCount || 0,
      recentProgress: progress.map((p) => ({
        videoId: p.video.id,
        videoTitle: p.video.title,
        thumbnailUrl: p.video.thumbnailUrl,
        progressPercent: p.progressPercent,
        lastPositionSeconds: p.lastPositionSeconds,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as achievementsRouter };


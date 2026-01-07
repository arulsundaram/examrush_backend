import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Complete a lab
router.post('/labs/:labId/complete', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { labId } = req.params;
    const userId = req.userId!;

    const lab = await prisma.labExercise.findUnique({
      where: { id: labId },
    });

    if (!lab) {
      res.status(404).json({ error: 'Lab not found' });
      return;
    }

    // Create or update completion
    const completion = await prisma.labCompletion.upsert({
      where: {
        userId_labId: {
          userId,
          labId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId,
        labId,
        completedAt: new Date(),
      },
    });

    // Update skill mastery if lab has skills
    if (lab.skillIds.length > 0) {
      for (const skillId of lab.skillIds) {
        await prisma.skillMastery.upsert({
          where: {
            userId_skillId: {
              userId,
              skillId,
            },
          },
          update: {
            masteryScore: { increment: 10 }, // Add 10 points for lab completion
            lastAssessedAt: new Date(),
          },
          create: {
            userId,
            skillId,
            skillName: skillId,
            masteryScore: 10,
            lastAssessedAt: new Date(),
          },
        });
      }
    }

    res.json({ completion, message: 'Lab completed successfully' });
  } catch (error) {
    console.error('Complete lab error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as labsRouter };


import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { videoQuerySchema } from '@ai-video-learning/shared';
const router = Router();
const prisma = new PrismaClient();
// Get all videos with filters
router.get('/', async (req, res) => {
    try {
        const validated = videoQuerySchema.parse(req.query);
        const { query, tag, level, sort } = validated;
        const where = {};
        if (level) {
            where.level = level;
        }
        if (tag) {
            where.tags = {
                some: {
                    tag: tag,
                },
            };
        }
        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }
        const orderBy = {};
        if (sort === 'newest') {
            orderBy.createdAt = 'desc';
        }
        else if (sort === 'oldest') {
            orderBy.createdAt = 'asc';
        }
        else if (sort === 'duration') {
            orderBy.durationSeconds = 'desc';
        }
        else {
            orderBy.createdAt = 'desc';
        }
        const videos = await prisma.video.findMany({
            where,
            include: {
                tags: true,
                _count: {
                    select: {
                        topics: true,
                    },
                },
            },
            orderBy,
        });
        const formattedVideos = videos.map((video) => ({
            id: video.id,
            title: video.title,
            description: video.description,
            durationSeconds: video.durationSeconds,
            level: video.level,
            tags: video.tags.map((t) => t.tag),
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
            createdAt: video.createdAt,
            topicCount: video._count.topics,
        }));
        res.json({ videos: formattedVideos });
    }
    catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            res.status(400).json({ error: 'Validation error', details: error });
            return;
        }
        console.error('Get videos error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Get video by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const video = await prisma.video.findUnique({
            where: { id },
            include: {
                tags: true,
                _count: {
                    select: {
                        topics: true,
                    },
                },
            },
        });
        if (!video) {
            res.status(404).json({ error: 'Video not found' });
            return;
        }
        res.json({
            id: video.id,
            title: video.title,
            description: video.description,
            durationSeconds: video.durationSeconds,
            level: video.level,
            tags: video.tags.map((t) => t.tag),
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
            createdAt: video.createdAt,
            topicCount: video._count.topics,
        });
    }
    catch (error) {
        console.error('Get video error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export { router as videosRouter };
//# sourceMappingURL=videos.js.map
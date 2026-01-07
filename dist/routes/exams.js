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
// Get exam by code
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
                                            select: {
                                                id: true,
                                                title: true,
                                                video: {
                                                    select: {
                                                        id: true,
                                                        title: true,
                                                        thumbnailUrl: true,
                                                        durationSeconds: true,
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
                        video: et.topic.video,
                    })),
                })),
            })),
            topicCount: exam._count.topics,
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
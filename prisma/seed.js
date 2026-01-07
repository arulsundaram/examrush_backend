import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            passwordHash: hashedPassword,
            name: 'Test User',
            gamification: {
                create: {
                    xp: 0,
                    streakCount: 0,
                },
            },
        },
    });
    console.log(`✅ Created test user: ${testUser.email}`);
    // Create videos with topics
    const videos = [
        {
            title: 'Introduction to Machine Learning',
            description: 'Learn the fundamentals of machine learning, including supervised and unsupervised learning, neural networks, and practical applications.',
            durationSeconds: 3600, // 60 minutes
            level: 'Beginner',
            tags: ['machine-learning', 'ai', 'data-science', 'beginner'],
            thumbnailUrl: 'https://via.placeholder.com/640x360?text=ML+Intro',
            videoUrl: 'https://example.com/videos/ml-intro.mp4',
            topics: [
                {
                    title: 'What is Machine Learning?',
                    startSeconds: 0,
                    endSeconds: 300,
                    keywords: ['machine learning', 'definition', 'overview', 'introduction', 'basics'],
                    transcriptExcerpt: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
                    orderIndex: 0,
                },
                {
                    title: 'Types of Machine Learning',
                    startSeconds: 300,
                    endSeconds: 900,
                    keywords: ['supervised', 'unsupervised', 'reinforcement', 'types', 'categories'],
                    transcriptExcerpt: 'There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.',
                    orderIndex: 1,
                },
                {
                    title: 'Supervised Learning Explained',
                    startSeconds: 900,
                    endSeconds: 1500,
                    keywords: ['supervised learning', 'labeled data', 'classification', 'regression'],
                    transcriptExcerpt: 'Supervised learning uses labeled training data to teach algorithms to predict outcomes for new, unseen data.',
                    orderIndex: 2,
                },
                {
                    title: 'Unsupervised Learning Explained',
                    startSeconds: 1500,
                    endSeconds: 2100,
                    keywords: ['unsupervised learning', 'clustering', 'anomaly detection', 'patterns'],
                    transcriptExcerpt: 'Unsupervised learning finds hidden patterns in data without labeled examples, commonly used for clustering and anomaly detection.',
                    orderIndex: 3,
                },
                {
                    title: 'Neural Networks Basics',
                    startSeconds: 2100,
                    endSeconds: 2700,
                    keywords: ['neural networks', 'neurons', 'layers', 'deep learning', 'architecture'],
                    transcriptExcerpt: 'Neural networks are computing systems inspired by biological neural networks, consisting of interconnected nodes organized in layers.',
                    orderIndex: 4,
                },
                {
                    title: 'Training a Model',
                    startSeconds: 2700,
                    endSeconds: 3300,
                    keywords: ['training', 'epochs', 'loss function', 'optimization', 'gradient descent'],
                    transcriptExcerpt: 'Training a machine learning model involves feeding it data, calculating errors, and adjusting parameters to minimize the loss function.',
                    orderIndex: 5,
                },
                {
                    title: 'Model Evaluation',
                    startSeconds: 3300,
                    endSeconds: 3600,
                    keywords: ['evaluation', 'accuracy', 'precision', 'recall', 'metrics'],
                    transcriptExcerpt: 'Model evaluation uses metrics like accuracy, precision, and recall to assess how well the model performs on unseen data.',
                    orderIndex: 6,
                },
            ],
        },
        {
            title: 'Deep Learning with PyTorch',
            description: 'Master deep learning using PyTorch. Build neural networks, train models, and deploy them to production.',
            durationSeconds: 5400, // 90 minutes
            level: 'Intermediate',
            tags: ['deep-learning', 'pytorch', 'neural-networks', 'python'],
            thumbnailUrl: 'https://via.placeholder.com/640x360?text=PyTorch',
            videoUrl: 'https://example.com/videos/pytorch-deep-learning.mp4',
            topics: [
                {
                    title: 'PyTorch Introduction',
                    startSeconds: 0,
                    endSeconds: 600,
                    keywords: ['pytorch', 'tensor', 'introduction', 'setup', 'installation'],
                    transcriptExcerpt: 'PyTorch is an open-source machine learning framework developed by Facebook, widely used for deep learning research and production.',
                    orderIndex: 0,
                },
                {
                    title: 'Tensors and Operations',
                    startSeconds: 600,
                    endSeconds: 1500,
                    keywords: ['tensors', 'operations', 'matrix', 'computations', 'gpu'],
                    transcriptExcerpt: 'Tensors are multi-dimensional arrays in PyTorch, similar to NumPy arrays but with GPU acceleration support.',
                    orderIndex: 1,
                },
                {
                    title: 'Building Neural Networks',
                    startSeconds: 1500,
                    endSeconds: 2400,
                    keywords: ['neural network', 'nn.Module', 'layers', 'architecture', 'forward pass'],
                    transcriptExcerpt: 'PyTorch provides the nn.Module class to define neural network architectures with layers like Linear, Conv2d, and ReLU.',
                    orderIndex: 2,
                },
                {
                    title: 'Training Loop',
                    startSeconds: 2400,
                    endSeconds: 3300,
                    keywords: ['training loop', 'optimizer', 'loss', 'backpropagation', 'gradient'],
                    transcriptExcerpt: 'The training loop involves forward pass, loss calculation, backpropagation, and optimizer step to update model weights.',
                    orderIndex: 3,
                },
                {
                    title: 'Convolutional Neural Networks',
                    startSeconds: 3300,
                    endSeconds: 4200,
                    keywords: ['CNN', 'convolution', 'image recognition', 'filters', 'pooling'],
                    transcriptExcerpt: 'CNNs use convolutional layers to detect features in images, making them ideal for computer vision tasks.',
                    orderIndex: 4,
                },
                {
                    title: 'Transfer Learning',
                    startSeconds: 4200,
                    endSeconds: 4800,
                    keywords: ['transfer learning', 'pretrained', 'fine-tuning', 'resnet', 'efficiency'],
                    transcriptExcerpt: 'Transfer learning allows you to use pretrained models and fine-tune them for your specific task, saving time and resources.',
                    orderIndex: 5,
                },
                {
                    title: 'Model Deployment',
                    startSeconds: 4800,
                    endSeconds: 5400,
                    keywords: ['deployment', 'torchscript', 'onnx', 'production', 'inference'],
                    transcriptExcerpt: 'Deploying PyTorch models involves converting them to optimized formats like TorchScript or ONNX for production inference.',
                    orderIndex: 6,
                },
            ],
        },
        {
            title: 'Natural Language Processing Fundamentals',
            description: 'Explore NLP techniques including tokenization, embeddings, transformers, and building chatbots.',
            durationSeconds: 4800, // 80 minutes
            level: 'Intermediate',
            tags: ['nlp', 'transformers', 'text-processing', 'language-models'],
            thumbnailUrl: 'https://via.placeholder.com/640x360?text=NLP',
            videoUrl: 'https://example.com/videos/nlp-fundamentals.mp4',
            topics: [
                {
                    title: 'Introduction to NLP',
                    startSeconds: 0,
                    endSeconds: 600,
                    keywords: ['nlp', 'natural language', 'text processing', 'linguistics', 'overview'],
                    transcriptExcerpt: 'Natural Language Processing enables computers to understand, interpret, and generate human language in valuable ways.',
                    orderIndex: 0,
                },
                {
                    title: 'Text Preprocessing',
                    startSeconds: 600,
                    endSeconds: 1500,
                    keywords: ['tokenization', 'stemming', 'lemmatization', 'stop words', 'cleaning'],
                    transcriptExcerpt: 'Text preprocessing includes tokenization, removing stop words, stemming, and lemmatization to prepare text for analysis.',
                    orderIndex: 1,
                },
                {
                    title: 'Word Embeddings',
                    startSeconds: 1500,
                    endSeconds: 2400,
                    keywords: ['embeddings', 'word2vec', 'glove', 'vectors', 'semantic'],
                    transcriptExcerpt: 'Word embeddings represent words as dense vectors in a continuous space, capturing semantic relationships between words.',
                    orderIndex: 2,
                },
                {
                    title: 'Recurrent Neural Networks for NLP',
                    startSeconds: 2400,
                    endSeconds: 3300,
                    keywords: ['RNN', 'LSTM', 'GRU', 'sequence', 'recurrent'],
                    transcriptExcerpt: 'RNNs and their variants like LSTM and GRU are designed to handle sequential data, making them suitable for NLP tasks.',
                    orderIndex: 3,
                },
                {
                    title: 'Transformer Architecture',
                    startSeconds: 3300,
                    endSeconds: 4200,
                    keywords: ['transformer', 'attention', 'BERT', 'GPT', 'self-attention'],
                    transcriptExcerpt: 'Transformers use self-attention mechanisms to process sequences in parallel, revolutionizing NLP with models like BERT and GPT.',
                    orderIndex: 4,
                },
                {
                    title: 'Building a Chatbot',
                    startSeconds: 4200,
                    endSeconds: 4800,
                    keywords: ['chatbot', 'dialogue', 'conversation', 'response generation', 'context'],
                    transcriptExcerpt: 'Building chatbots involves understanding user intent, maintaining conversation context, and generating appropriate responses.',
                    orderIndex: 5,
                },
            ],
        },
        {
            title: 'Computer Vision with OpenCV',
            description: 'Learn computer vision techniques using OpenCV, including image processing, object detection, and face recognition.',
            durationSeconds: 4500, // 75 minutes
            level: 'Beginner',
            tags: ['computer-vision', 'opencv', 'image-processing', 'python'],
            thumbnailUrl: 'https://via.placeholder.com/640x360?text=OpenCV',
            videoUrl: 'https://example.com/videos/opencv-cv.mp4',
            topics: [
                {
                    title: 'OpenCV Basics',
                    startSeconds: 0,
                    endSeconds: 600,
                    keywords: ['opencv', 'installation', 'image loading', 'basics', 'setup'],
                    transcriptExcerpt: 'OpenCV is a powerful library for computer vision tasks, providing tools for image and video processing.',
                    orderIndex: 0,
                },
                {
                    title: 'Image Manipulation',
                    startSeconds: 600,
                    endSeconds: 1500,
                    keywords: ['resize', 'crop', 'rotate', 'filter', 'transformations'],
                    transcriptExcerpt: 'OpenCV provides functions for basic image operations like resizing, cropping, rotating, and applying filters.',
                    orderIndex: 1,
                },
                {
                    title: 'Color Spaces and Thresholding',
                    startSeconds: 1500,
                    endSeconds: 2400,
                    keywords: ['color space', 'RGB', 'HSV', 'thresholding', 'binary'],
                    transcriptExcerpt: 'Understanding color spaces like RGB and HSV, and using thresholding to create binary images for analysis.',
                    orderIndex: 2,
                },
                {
                    title: 'Edge Detection',
                    startSeconds: 2400,
                    endSeconds: 3300,
                    keywords: ['edge detection', 'canny', 'sobel', 'gradient', 'contours'],
                    transcriptExcerpt: 'Edge detection algorithms like Canny and Sobel identify boundaries in images, useful for object detection.',
                    orderIndex: 3,
                },
                {
                    title: 'Object Detection',
                    startSeconds: 3300,
                    endSeconds: 4200,
                    keywords: ['object detection', 'haar cascades', 'bounding box', 'detection'],
                    transcriptExcerpt: 'Object detection locates and identifies objects in images using techniques like Haar cascades and modern deep learning methods.',
                    orderIndex: 4,
                },
                {
                    title: 'Face Recognition',
                    startSeconds: 4200,
                    endSeconds: 4500,
                    keywords: ['face recognition', 'face detection', 'biometrics', 'identification'],
                    transcriptExcerpt: 'Face recognition systems detect and identify faces in images, with applications in security and authentication.',
                    orderIndex: 5,
                },
            ],
        },
        {
            title: 'Advanced AI Architectures',
            description: 'Dive deep into advanced AI architectures including GANs, reinforcement learning, and transformer models.',
            durationSeconds: 6000, // 100 minutes
            level: 'Advanced',
            tags: ['advanced', 'GANs', 'reinforcement-learning', 'transformers', 'research'],
            thumbnailUrl: 'https://via.placeholder.com/640x360?text=Advanced+AI',
            videoUrl: 'https://example.com/videos/advanced-ai.mp4',
            topics: [
                {
                    title: 'Generative Adversarial Networks',
                    startSeconds: 0,
                    endSeconds: 900,
                    keywords: ['GAN', 'generator', 'discriminator', 'adversarial', 'generative'],
                    transcriptExcerpt: 'GANs consist of two neural networks competing against each other: a generator creating fake data and a discriminator trying to detect it.',
                    orderIndex: 0,
                },
                {
                    title: 'Training GANs',
                    startSeconds: 900,
                    endSeconds: 1800,
                    keywords: ['GAN training', 'loss functions', 'convergence', 'mode collapse', 'stability'],
                    transcriptExcerpt: 'Training GANs requires careful balancing of generator and discriminator, with challenges like mode collapse and instability.',
                    orderIndex: 1,
                },
                {
                    title: 'Reinforcement Learning Basics',
                    startSeconds: 1800,
                    endSeconds: 2700,
                    keywords: ['reinforcement learning', 'agent', 'environment', 'reward', 'policy'],
                    transcriptExcerpt: 'Reinforcement learning involves an agent learning to make decisions by interacting with an environment and receiving rewards.',
                    orderIndex: 2,
                },
                {
                    title: 'Q-Learning and Deep Q-Networks',
                    startSeconds: 2700,
                    endSeconds: 3600,
                    keywords: ['Q-learning', 'DQN', 'value function', 'action-value', 'deep RL'],
                    transcriptExcerpt: 'Q-learning estimates action values, and Deep Q-Networks use neural networks to approximate Q-functions for complex environments.',
                    orderIndex: 3,
                },
                {
                    title: 'Policy Gradient Methods',
                    startSeconds: 3600,
                    endSeconds: 4500,
                    keywords: ['policy gradient', 'REINFORCE', 'actor-critic', 'PPO', 'policy optimization'],
                    transcriptExcerpt: 'Policy gradient methods directly optimize the policy function, with algorithms like REINFORCE and Proximal Policy Optimization.',
                    orderIndex: 4,
                },
                {
                    title: 'Transformer Variants',
                    startSeconds: 4500,
                    endSeconds: 5400,
                    keywords: ['transformer', 'BERT', 'GPT', 'T5', 'variants', 'architecture'],
                    transcriptExcerpt: 'Modern transformer variants like BERT, GPT, and T5 have different architectures optimized for various NLP tasks.',
                    orderIndex: 5,
                },
                {
                    title: 'Vision Transformers',
                    startSeconds: 5400,
                    endSeconds: 6000,
                    keywords: ['vision transformer', 'ViT', 'image classification', 'patches', 'attention'],
                    transcriptExcerpt: 'Vision Transformers apply transformer architecture to images by splitting them into patches and using self-attention.',
                    orderIndex: 6,
                },
            ],
        },
    ];
    for (const videoData of videos) {
        const { topics, tags, ...videoFields } = videoData;
        const video = await prisma.video.create({
            data: {
                ...videoFields,
                tags: {
                    create: tags.map((tag) => ({ tag })),
                },
                topics: {
                    create: topics,
                },
            },
        });
        console.log(`✅ Created video: ${video.title} with ${topics.length} topics`);
    }
    console.log('✨ Seeding completed!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map
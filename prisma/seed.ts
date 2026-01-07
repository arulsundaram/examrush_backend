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
      description:
        'Learn the fundamentals of machine learning, including supervised and unsupervised learning, neural networks, and practical applications.',
      durationSeconds: 3600, // 60 minutes
      level: 'Beginner' as const,
      tags: ['machine-learning', 'ai', 'data-science', 'beginner'],
      thumbnailUrl: 'https://via.placeholder.com/640x360?text=ML+Intro',
      videoUrl: 'https://example.com/videos/ml-intro.mp4',
      topics: [
        {
          title: 'What is Machine Learning?',
          startSeconds: 0,
          endSeconds: 300,
          keywords: ['machine learning', 'definition', 'overview', 'introduction', 'basics'],
          transcriptExcerpt:
            'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
          techTags: ['Azure AI', 'Machine Learning'],
          keyConcepts: [
            'Machine learning enables systems to learn from data',
            'No explicit programming required for pattern recognition',
            'Core foundation of modern AI applications'
          ],
          highlights: [
            'Most asked in exam: Definition and key characteristics',
            'Common pitfall: Confusing ML with traditional programming',
            'Decision point: When to use ML vs rule-based systems'
          ],
          examAngleNotes: 'Focus on understanding the difference between ML and traditional programming approaches.'
        },
        {
          title: 'Types of Machine Learning',
          startSeconds: 300,
          endSeconds: 900,
          keywords: ['supervised', 'unsupervised', 'reinforcement', 'types', 'categories'],
          transcriptExcerpt:
            'There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.',
          
          techTags: ['Azure AI', 'Machine Learning', 'Supervised Learning', 'Unsupervised Learning'],
          keyConcepts: [
            'Supervised learning uses labeled data',
            'Unsupervised learning finds patterns in unlabeled data',
            'Reinforcement learning learns through rewards and penalties'
          ],
          highlights: [
            'Most asked in exam: Differences between the three types',
            'Common pitfall: Misidentifying learning type from scenario',
            'Decision point: Choosing the right ML type for a problem'
          ],
          examAngleNotes: 'Be able to identify which type of ML is appropriate for different scenarios.'
        },
        {
          title: 'Supervised Learning Explained',
          startSeconds: 900,
          endSeconds: 1500,
          keywords: ['supervised learning', 'labeled data', 'classification', 'regression'],
          transcriptExcerpt:
            'Supervised learning uses labeled training data to teach algorithms to predict outcomes for new, unseen data.',
          
          techTags: ['Azure AI', 'Supervised Learning', 'Classification', 'Regression'],
          keyConcepts: [
            'Requires labeled training dataset',
            'Two main tasks: classification and regression',
            'Model learns mapping from inputs to outputs'
          ],
          highlights: [
            'Most asked in exam: Classification vs regression scenarios',
            'Common pitfall: Insufficient labeled data quality',
            'Decision point: Classification vs regression for prediction tasks'
          ],
          examAngleNotes: 'Understand when to use classification (categories) vs regression (continuous values).'
        },
        {
          title: 'Unsupervised Learning Explained',
          startSeconds: 1500,
          endSeconds: 2100,
          keywords: ['unsupervised learning', 'clustering', 'anomaly detection', 'patterns'],
          transcriptExcerpt:
            'Unsupervised learning finds hidden patterns in data without labeled examples, commonly used for clustering and anomaly detection.',
          
        },
        {
          title: 'Neural Networks Basics',
          startSeconds: 2100,
          endSeconds: 2700,
          keywords: ['neural networks', 'neurons', 'layers', 'deep learning', 'architecture'],
          transcriptExcerpt:
            'Neural networks are computing systems inspired by biological neural networks, consisting of interconnected nodes organized in layers.',
          
        },
        {
          title: 'Training a Model',
          startSeconds: 2700,
          endSeconds: 3300,
          keywords: ['training', 'epochs', 'loss function', 'optimization', 'gradient descent'],
          transcriptExcerpt:
            'Training a machine learning model involves feeding it data, calculating errors, and adjusting parameters to minimize the loss function.',
          
        },
        {
          title: 'Model Evaluation',
          startSeconds: 3300,
          endSeconds: 3600,
          keywords: ['evaluation', 'accuracy', 'precision', 'recall', 'metrics'],
          transcriptExcerpt:
            'Model evaluation uses metrics like accuracy, precision, and recall to assess how well the model performs on unseen data.',
          
        },
      ],
    },
    {
      title: 'Deep Learning with PyTorch',
      description:
        'Master deep learning using PyTorch. Build neural networks, train models, and deploy them to production.',
      durationSeconds: 5400, // 90 minutes
      level: 'Intermediate' as const,
      tags: ['deep-learning', 'pytorch', 'neural-networks', 'python'],
      thumbnailUrl: 'https://via.placeholder.com/640x360?text=PyTorch',
      videoUrl: 'https://example.com/videos/pytorch-deep-learning.mp4',
      topics: [
        {
          title: 'PyTorch Introduction',
          startSeconds: 0,
          endSeconds: 600,
          keywords: ['pytorch', 'tensor', 'introduction', 'setup', 'installation'],
          transcriptExcerpt:
            'PyTorch is an open-source machine learning framework developed by Facebook, widely used for deep learning research and production.',
          
        },
        {
          title: 'Tensors and Operations',
          startSeconds: 600,
          endSeconds: 1500,
          keywords: ['tensors', 'operations', 'matrix', 'computations', 'gpu'],
          transcriptExcerpt:
            'Tensors are multi-dimensional arrays in PyTorch, similar to NumPy arrays but with GPU acceleration support.',
          
        },
        {
          title: 'Building Neural Networks',
          startSeconds: 1500,
          endSeconds: 2400,
          keywords: ['neural network', 'nn.Module', 'layers', 'architecture', 'forward pass'],
          transcriptExcerpt:
            'PyTorch provides the nn.Module class to define neural network architectures with layers like Linear, Conv2d, and ReLU.',
          
        },
        {
          title: 'Training Loop',
          startSeconds: 2400,
          endSeconds: 3300,
          keywords: ['training loop', 'optimizer', 'loss', 'backpropagation', 'gradient'],
          transcriptExcerpt:
            'The training loop involves forward pass, loss calculation, backpropagation, and optimizer step to update model weights.',
          
        },
        {
          title: 'Convolutional Neural Networks',
          startSeconds: 3300,
          endSeconds: 4200,
          keywords: ['CNN', 'convolution', 'image recognition', 'filters', 'pooling'],
          transcriptExcerpt:
            'CNNs use convolutional layers to detect features in images, making them ideal for computer vision tasks.',
          
        },
        {
          title: 'Transfer Learning',
          startSeconds: 4200,
          endSeconds: 4800,
          keywords: ['transfer learning', 'pretrained', 'fine-tuning', 'resnet', 'efficiency'],
          transcriptExcerpt:
            'Transfer learning allows you to use pretrained models and fine-tune them for your specific task, saving time and resources.',
          
        },
        {
          title: 'Model Deployment',
          startSeconds: 4800,
          endSeconds: 5400,
          keywords: ['deployment', 'torchscript', 'onnx', 'production', 'inference'],
          transcriptExcerpt:
            'Deploying PyTorch models involves converting them to optimized formats like TorchScript or ONNX for production inference.',
          
        },
      ],
    },
    {
      title: 'Natural Language Processing Fundamentals',
      description:
        'Explore NLP techniques including tokenization, embeddings, transformers, and building chatbots.',
      durationSeconds: 4800, // 80 minutes
      level: 'Intermediate' as const,
      tags: ['nlp', 'transformers', 'text-processing', 'language-models'],
      thumbnailUrl: 'https://via.placeholder.com/640x360?text=NLP',
      videoUrl: 'https://example.com/videos/nlp-fundamentals.mp4',
      topics: [
        {
          title: 'Introduction to NLP',
          startSeconds: 0,
          endSeconds: 600,
          keywords: ['nlp', 'natural language', 'text processing', 'linguistics', 'overview'],
          transcriptExcerpt:
            'Natural Language Processing enables computers to understand, interpret, and generate human language in valuable ways.',
          
        },
        {
          title: 'Text Preprocessing',
          startSeconds: 600,
          endSeconds: 1500,
          keywords: ['tokenization', 'stemming', 'lemmatization', 'stop words', 'cleaning'],
          transcriptExcerpt:
            'Text preprocessing includes tokenization, removing stop words, stemming, and lemmatization to prepare text for analysis.',
          
        },
        {
          title: 'Word Embeddings',
          startSeconds: 1500,
          endSeconds: 2400,
          keywords: ['embeddings', 'word2vec', 'glove', 'vectors', 'semantic'],
          transcriptExcerpt:
            'Word embeddings represent words as dense vectors in a continuous space, capturing semantic relationships between words.',
          
        },
        {
          title: 'Recurrent Neural Networks for NLP',
          startSeconds: 2400,
          endSeconds: 3300,
          keywords: ['RNN', 'LSTM', 'GRU', 'sequence', 'recurrent'],
          transcriptExcerpt:
            'RNNs and their variants like LSTM and GRU are designed to handle sequential data, making them suitable for NLP tasks.',
          
        },
        {
          title: 'Transformer Architecture',
          startSeconds: 3300,
          endSeconds: 4200,
          keywords: ['transformer', 'attention', 'BERT', 'GPT', 'self-attention'],
          transcriptExcerpt:
            'Transformers use self-attention mechanisms to process sequences in parallel, revolutionizing NLP with models like BERT and GPT.',
          
        },
        {
          title: 'Building a Chatbot',
          startSeconds: 4200,
          endSeconds: 4800,
          keywords: ['chatbot', 'dialogue', 'conversation', 'response generation', 'context'],
          transcriptExcerpt:
            'Building chatbots involves understanding user intent, maintaining conversation context, and generating appropriate responses.',
          
        },
      ],
    },
    {
      title: 'Computer Vision with OpenCV',
      description:
        'Learn computer vision techniques using OpenCV, including image processing, object detection, and face recognition.',
      durationSeconds: 4500, // 75 minutes
      level: 'Beginner' as const,
      tags: ['computer-vision', 'opencv', 'image-processing', 'python'],
      thumbnailUrl: 'https://via.placeholder.com/640x360?text=OpenCV',
      videoUrl: 'https://example.com/videos/opencv-cv.mp4',
      topics: [
        {
          title: 'OpenCV Basics',
          startSeconds: 0,
          endSeconds: 600,
          keywords: ['opencv', 'installation', 'image loading', 'basics', 'setup'],
          transcriptExcerpt:
            'OpenCV is a powerful library for computer vision tasks, providing tools for image and video processing.',
          
        },
        {
          title: 'Image Manipulation',
          startSeconds: 600,
          endSeconds: 1500,
          keywords: ['resize', 'crop', 'rotate', 'filter', 'transformations'],
          transcriptExcerpt:
            'OpenCV provides functions for basic image operations like resizing, cropping, rotating, and applying filters.',
          
        },
        {
          title: 'Color Spaces and Thresholding',
          startSeconds: 1500,
          endSeconds: 2400,
          keywords: ['color space', 'RGB', 'HSV', 'thresholding', 'binary'],
          transcriptExcerpt:
            'Understanding color spaces like RGB and HSV, and using thresholding to create binary images for analysis.',
          
        },
        {
          title: 'Edge Detection',
          startSeconds: 2400,
          endSeconds: 3300,
          keywords: ['edge detection', 'canny', 'sobel', 'gradient', 'contours'],
          transcriptExcerpt:
            'Edge detection algorithms like Canny and Sobel identify boundaries in images, useful for object detection.',
          
        },
        {
          title: 'Object Detection',
          startSeconds: 3300,
          endSeconds: 4200,
          keywords: ['object detection', 'haar cascades', 'bounding box', 'detection'],
          transcriptExcerpt:
            'Object detection locates and identifies objects in images using techniques like Haar cascades and modern deep learning methods.',
          
        },
        {
          title: 'Face Recognition',
          startSeconds: 4200,
          endSeconds: 4500,
          keywords: ['face recognition', 'face detection', 'biometrics', 'identification'],
          transcriptExcerpt:
            'Face recognition systems detect and identify faces in images, with applications in security and authentication.',
          
        },
      ],
    },
    {
      title: 'Advanced AI Architectures',
      description:
        'Dive deep into advanced AI architectures including GANs, reinforcement learning, and transformer models.',
      durationSeconds: 6000, // 100 minutes
      level: 'Advanced' as const,
      tags: ['advanced', 'GANs', 'reinforcement-learning', 'transformers', 'research'],
      thumbnailUrl: 'https://via.placeholder.com/640x360?text=Advanced+AI',
      videoUrl: 'https://example.com/videos/advanced-ai.mp4',
      topics: [
        {
          title: 'Generative Adversarial Networks',
          startSeconds: 0,
          endSeconds: 900,
          keywords: ['GAN', 'generator', 'discriminator', 'adversarial', 'generative'],
          transcriptExcerpt:
            'GANs consist of two neural networks competing against each other: a generator creating fake data and a discriminator trying to detect it.',
          
        },
        {
          title: 'Training GANs',
          startSeconds: 900,
          endSeconds: 1800,
          keywords: ['GAN training', 'loss functions', 'convergence', 'mode collapse', 'stability'],
          transcriptExcerpt:
            'Training GANs requires careful balancing of generator and discriminator, with challenges like mode collapse and instability.',
          
        },
        {
          title: 'Reinforcement Learning Basics',
          startSeconds: 1800,
          endSeconds: 2700,
          keywords: ['reinforcement learning', 'agent', 'environment', 'reward', 'policy'],
          transcriptExcerpt:
            'Reinforcement learning involves an agent learning to make decisions by interacting with an environment and receiving rewards.',
          
        },
        {
          title: 'Q-Learning and Deep Q-Networks',
          startSeconds: 2700,
          endSeconds: 3600,
          keywords: ['Q-learning', 'DQN', 'value function', 'action-value', 'deep RL'],
          transcriptExcerpt:
            'Q-learning estimates action values, and Deep Q-Networks use neural networks to approximate Q-functions for complex environments.',
          
        },
        {
          title: 'Policy Gradient Methods',
          startSeconds: 3600,
          endSeconds: 4500,
          keywords: ['policy gradient', 'REINFORCE', 'actor-critic', 'PPO', 'policy optimization'],
          transcriptExcerpt:
            'Policy gradient methods directly optimize the policy function, with algorithms like REINFORCE and Proximal Policy Optimization.',
          
        },
        {
          title: 'Transformer Variants',
          startSeconds: 4500,
          endSeconds: 5400,
          keywords: ['transformer', 'BERT', 'GPT', 'T5', 'variants', 'architecture'],
          transcriptExcerpt:
            'Modern transformer variants like BERT, GPT, and T5 have different architectures optimized for various NLP tasks.',
          
        },
        {
          title: 'Vision Transformers',
          startSeconds: 5400,
          endSeconds: 6000,
          keywords: ['vision transformer', 'ViT', 'image classification', 'patches', 'attention'],
          transcriptExcerpt:
            'Vision Transformers apply transformer architecture to images by splitting them into patches and using self-attention.',
          
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
          create: topics.map((topic) => ({
            ...topic,
            keyConcepts: topic.keyConcepts || [],
            highlights: topic.highlights || [],
          })),
        },
      },
    });

    console.log(`✅ Created video: ${video.title} with ${topics.length} topics`);
  }

  // Create AI-900 exam structure
  const mlTopic = await prisma.videoTopic.findFirst({
    where: { title: 'What is Machine Learning?' },
  });

  if (mlTopic) {
    const exam900 = await prisma.exam.upsert({
      where: { code: 'AI-900' },
      update: {},
      create: {
        code: 'AI-900',
        title: 'Microsoft Azure AI Fundamentals',
        description: 'Azure AI Fundamentals certification exam',
        domains: {
          create: [
            {
              code: 'AI-WORKLOADS',
              title: 'AI Workloads and Considerations',
              objectives: {
                create: [
                  {
                    code: 'AI-01',
                    title: 'Identify features of common AI workloads',
                    skillIds: ['ai-workloads', 'ai-features'],
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // Link topic to exam
    const objective = await prisma.examObjective.findFirst({
      where: { code: 'AI-01' },
    });

    if (objective) {
      await prisma.examTopic.create({
        data: {
          examId: exam900.id,
          objectiveId: objective.id,
          topicId: mlTopic.id,
        },
      });
    }

    console.log(`✅ Created exam: ${exam900.code}`);
  }

  // Create AI-102 exam structure based on Microsoft Learn study guide
  // Reference: https://learn.microsoft.com/en-gb/credentials/certifications/resources/study-guides/ai-102
  const exam102 = await prisma.exam.upsert({
    where: { code: 'AI-102' },
    update: {},
    create: {
      code: 'AI-102',
      title: 'Designing and Implementing a Microsoft Azure AI Solution',
      description: 'Microsoft Azure AI Engineer Associate certification exam covering Azure AI solutions, generative AI, computer vision, NLP, and knowledge mining.',
      domains: {
        create: [
          {
            code: 'PLAN-MANAGE',
            title: 'Plan and manage an Azure AI solution',
            description: '20-25% of exam',
            objectives: {
              create: [
                {
                  code: 'PLAN-01',
                  title: 'Select the appropriate Microsoft Foundry Services',
                  description: 'Select services for generative AI, computer vision, NLP, speech, information extraction, and knowledge mining solutions',
                  skillIds: ['foundry-services', 'service-selection', 'azure-ai-services'],
                },
                {
                  code: 'PLAN-02',
                  title: 'Plan, create and deploy a Microsoft Foundry Service',
                  description: 'Plan for Responsible AI, create Azure AI resources, choose models, deploy, install SDKs, integrate CI/CD, plan container deployment',
                  skillIds: ['foundry-deployment', 'responsible-ai', 'ci-cd', 'containers'],
                },
                {
                  code: 'PLAN-03',
                  title: 'Manage, monitor, and secure a Microsoft Foundry Service',
                  description: 'Monitor resources, manage costs, protect keys, manage authentication',
                  skillIds: ['monitoring', 'cost-management', 'security', 'authentication'],
                },
                {
                  code: 'PLAN-04',
                  title: 'Implement AI solutions responsibly',
                  description: 'Content moderation, responsible AI insights, content filters, blocklists, prompt shields, harm detection, governance framework',
                  skillIds: ['responsible-ai', 'content-moderation', 'governance'],
                },
              ],
            },
          },
          {
            code: 'GENERATIVE-AI',
            title: 'Implement generative AI solutions',
            description: '15-20% of exam',
            objectives: {
              create: [
                {
                  code: 'GEN-01',
                  title: 'Build generative AI solutions with Microsoft Foundry',
                  description: 'Plan and prepare, deploy hub/project/resources, deploy models, implement prompt flows, RAG patterns, evaluate models, integrate SDK, use prompt templates',
                  skillIds: ['foundry', 'prompt-flow', 'rag', 'model-evaluation'],
                },
                {
                  code: 'GEN-02',
                  title: 'Use Azure OpenAI in Foundry Models to generate content',
                  description: 'Provision Azure OpenAI, select/deploy models, submit prompts, use DALL-E, integrate into applications, use multimodal models',
                  skillIds: ['azure-openai', 'dall-e', 'multimodal', 'prompt-engineering'],
                },
                {
                  code: 'GEN-03',
                  title: 'Optimize and operationalize a generative AI solution',
                  description: 'Configure parameters, monitoring, diagnostics, optimize resources, enable tracing, model reflection, containers, orchestration, prompt engineering, fine-tuning',
                  skillIds: ['optimization', 'monitoring', 'tracing', 'fine-tuning', 'orchestration'],
                },
              ],
            },
          },
          {
            code: 'AGENTIC',
            title: 'Implement an agentic solution',
            description: '5-10% of exam',
            objectives: {
              create: [
                {
                  code: 'AGENT-01',
                  title: 'Create custom agents',
                  description: 'Understand agent role/use cases, configure resources, create agents with Foundry Agent Service, implement with Agent Framework, complex workflows, multi-agent orchestration, test/optimize/deploy',
                  skillIds: ['agents', 'foundry-agents', 'agent-framework', 'orchestration'],
                },
              ],
            },
          },
          {
            code: 'COMPUTER-VISION',
            title: 'Implement computer vision solutions',
            description: '10-15% of exam',
            objectives: {
              create: [
                {
                  code: 'CV-01',
                  title: 'Analyze images',
                  description: 'Select visual features, detect objects, generate tags, include analysis features, interpret responses, extract text with Vision, convert handwritten text',
                  skillIds: ['image-analysis', 'object-detection', 'ocr', 'vision-api'],
                },
                {
                  code: 'CV-02',
                  title: 'Implement custom vision models',
                  description: 'Choose classification vs detection, label images, train models, evaluate metrics, publish, consume, build code-first',
                  skillIds: ['custom-vision', 'image-classification', 'object-detection', 'training'],
                },
                {
                  code: 'CV-03',
                  title: 'Analyze videos',
                  description: 'Use Video Indexer for insights, use Vision Spatial Analysis for presence/movement detection',
                  skillIds: ['video-indexer', 'spatial-analysis', 'video-analysis'],
                },
              ],
            },
          },
          {
            code: 'NLP',
            title: 'Implement natural language processing solutions',
            description: '15-20% of exam',
            objectives: {
              create: [
                {
                  code: 'NLP-01',
                  title: 'Analyze and translate text',
                  description: 'Extract key phrases/entities, determine sentiment, detect language, detect PII, translate text/documents with Translator',
                  skillIds: ['text-analytics', 'entity-extraction', 'sentiment', 'translation', 'pii'],
                },
                {
                  code: 'NLP-02',
                  title: 'Process and translate speech',
                  description: 'Integrate generative AI speaking, text-to-speech, speech-to-text, SSML, custom speech, intent/keyword recognition, speech-to-speech translation',
                  skillIds: ['speech-service', 'tts', 'stt', 'ssml', 'speech-translation'],
                },
                {
                  code: 'NLP-03',
                  title: 'Implement custom language models',
                  description: 'Create intents/entities/utterances, train/evaluate/deploy/test LUIS, optimize/backup/recover, consume from client, create QnA project, add QnA pairs, train/test/publish KB, multi-turn, alternate phrasing, chit-chat, export KB, multi-language QnA, custom translation',
                  skillIds: ['luis', 'qna-maker', 'language-understanding', 'custom-translation'],
                },
              ],
            },
          },
          {
            code: 'KNOWLEDGE-MINING',
            title: 'Implement knowledge mining and information extraction solutions',
            description: '15-20% of exam',
            objectives: {
              create: [
                {
                  code: 'KM-01',
                  title: 'Implement an Azure AI Search solution',
                  description: 'Provision resource, create index/skillset, create data sources/indexers, implement custom skills, create/run indexer, query index, manage Knowledge Store, implement semantic/vector solutions',
                  skillIds: ['azure-search', 'indexing', 'skillsets', 'knowledge-store', 'semantic-search', 'vector-search'],
                },
                {
                  code: 'KM-02',
                  title: 'Implement an Azure Document Intelligence in Foundry Tools solution',
                  description: 'Provision resource, use prebuilt models, implement custom models, train/test/publish custom models, create composed models',
                  skillIds: ['document-intelligence', 'form-recognition', 'custom-models'],
                },
                {
                  code: 'KM-03',
                  title: 'Extract information with Azure Content Understanding in Foundry Tools',
                  description: 'Create OCR pipeline, summarize/classify/detect attributes, extract entities/tables/images, process/ingest documents/images/videos/audio',
                  skillIds: ['content-understanding', 'ocr', 'document-processing'],
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created exam: ${exam102.code} with ${exam102.domains?.length || 0} domains`);

  // Map existing topics to AI-102 objectives
  // Find topics that relate to AI-102 skills
  const topicsForAI102 = await prisma.videoTopic.findMany({
    where: {
      OR: [
        { title: { contains: 'Machine Learning', mode: 'insensitive' } },
        { title: { contains: 'Neural', mode: 'insensitive' } },
        { title: { contains: 'NLP', mode: 'insensitive' } },
        { title: { contains: 'Natural Language', mode: 'insensitive' } },
        { title: { contains: 'Vision', mode: 'insensitive' } },
        { title: { contains: 'Computer Vision', mode: 'insensitive' } },
        { keywords: { has: 'azure' } },
        { keywords: { has: 'ai' } },
      ],
    },
    take: 10,
  });

  // Link some topics to AI-102 objectives
  if (topicsForAI102.length > 0) {
    const nlpObjective = await prisma.examObjective.findFirst({
      where: { code: 'NLP-01' },
    });
    const cvObjective = await prisma.examObjective.findFirst({
      where: { code: 'CV-01' },
    });
    const genObjective = await prisma.examObjective.findFirst({
      where: { code: 'GEN-01' },
    });

    // Link NLP topics
    if (nlpObjective) {
      const nlpTopics = topicsForAI102.filter((t) =>
        t.title.toLowerCase().includes('nlp') ||
        t.title.toLowerCase().includes('natural language') ||
        t.keywords.some((k) => k.toLowerCase().includes('nlp'))
      );
      for (const topic of nlpTopics.slice(0, 2)) {
        await prisma.examTopic.upsert({
          where: {
            examId_topicId: {
              examId: exam102.id,
              topicId: topic.id,
            },
          },
          update: {},
          create: {
            examId: exam102.id,
            objectiveId: nlpObjective.id,
            topicId: topic.id,
          },
        });
      }
    }

    // Link Computer Vision topics
    if (cvObjective) {
      const cvTopics = topicsForAI102.filter((t) =>
        t.title.toLowerCase().includes('vision') ||
        t.title.toLowerCase().includes('opencv') ||
        t.keywords.some((k) => k.toLowerCase().includes('vision'))
      );
      for (const topic of cvTopics.slice(0, 2)) {
        await prisma.examTopic.upsert({
          where: {
            examId_topicId: {
              examId: exam102.id,
              topicId: topic.id,
            },
          },
          update: {},
          create: {
            examId: exam102.id,
            objectiveId: cvObjective.id,
            topicId: topic.id,
          },
        });
      }
    }

    console.log(`✅ Mapped ${topicsForAI102.length} topics to AI-102 objectives`);
  }

  // Create additional sample certifications for catalog
  const exam900 = await prisma.exam.findUnique({
    where: { code: 'AI-900' },
  });

  if (!exam900) {
    // Create AI-900 if it doesn't exist
    await prisma.exam.create({
      data: {
        code: 'AI-900',
        title: 'Microsoft Azure AI Fundamentals',
        description: 'Azure AI Fundamentals certification exam covering AI workloads, machine learning, computer vision, and natural language processing.',
      },
    });
    console.log(`✅ Created exam: AI-900`);
  }

  // Create sample AZ-104 for catalog
  const examAZ104 = await prisma.exam.upsert({
    where: { code: 'AZ-104' },
    update: {},
    create: {
      code: 'AZ-104',
      title: 'Microsoft Azure Administrator',
      description: 'Azure Administrator Associate certification covering Azure infrastructure, storage, networking, and security.',
      domains: {
        create: [
          {
            code: 'MANAGE-IDENTITY',
            title: 'Manage Azure identities and governance',
            objectives: {
              create: [
                {
                  code: 'AZ-01',
                  title: 'Manage Azure AD objects',
                  skillIds: ['azure-ad', 'identity-management'],
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✅ Created exam: ${examAZ104.code}`);

  // Create sample SC-900 for catalog
  const examSC900 = await prisma.exam.upsert({
    where: { code: 'SC-900' },
    update: {},
    create: {
      code: 'SC-900',
      title: 'Microsoft Security, Compliance, and Identity Fundamentals',
      description: 'Security Fundamentals certification covering Microsoft security, compliance, and identity solutions.',
      domains: {
        create: [
          {
            code: 'SECURITY-CONCEPTS',
            title: 'Describe security, compliance, and identity concepts',
            objectives: {
              create: [
                {
                  code: 'SC-01',
                  title: 'Describe security and compliance concepts',
                  skillIds: ['security', 'compliance'],
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`✅ Created exam: ${examSC900.code}`);

  // Create a sample lab
  const mlTopicForLab = await prisma.videoTopic.findFirst({
    where: { title: 'What is Machine Learning?' },
  });

  if (mlTopicForLab) {
    const lab = await prisma.labExercise.create({
      data: {
        title: 'Build Your First ML Model',
        description: 'Hands-on lab to create a simple machine learning model',
        steps: [
          {
            id: '1',
            title: 'Set up Azure ML workspace',
            description: 'Create and configure your Azure Machine Learning workspace',
            checklist: ['Create resource group', 'Create ML workspace', 'Verify access'],
          },
          {
            id: '2',
            title: 'Prepare your data',
            description: 'Upload and prepare your dataset',
            checklist: ['Upload dataset', 'Explore data', 'Clean data'],
          },
          {
            id: '3',
            title: 'Train a model',
            description: 'Train a simple classification model',
            checklist: ['Select algorithm', 'Configure training', 'Run training'],
          },
        ],
        tags: ['Azure ML', 'Hands-on', 'Beginner'],
        skillIds: ['ml-basics', 'azure-ml'],
        topicIds: [mlTopicForLab.id],
      },
    });
    console.log(`✅ Created lab: ${lab.title}`);
  }

  // Create a sample drill
  const mlTopic1 = await prisma.videoTopic.findFirst({
    where: { title: 'What is Machine Learning?' },
  });
  const mlTopic2 = await prisma.videoTopic.findFirst({
    where: { title: 'Types of Machine Learning' },
  });

  if (mlTopic1 && mlTopic2) {
    const drill = await prisma.drill.create({
      data: {
        title: 'ML Fundamentals Quiz',
        description: 'Quick 5-question quiz on machine learning basics',
        questions: [
          {
            id: 'q1',
            questionText: 'What is the main difference between supervised and unsupervised learning?',
            options: [
              { id: 'a1', text: 'Supervised uses labeled data, unsupervised uses unlabeled data' },
              { id: 'a2', text: 'Supervised is faster than unsupervised' },
              { id: 'a3', text: 'Unsupervised requires more data' },
              { id: 'a4', text: 'There is no difference' },
            ],
            correctAnswerId: 'a1',
            explanation: 'Supervised learning uses labeled training data, while unsupervised learning finds patterns in unlabeled data.',
          },
          {
            id: 'q2',
            questionText: 'Which type of ML is best for recommendation systems?',
            options: [
              { id: 'a1', text: 'Supervised learning' },
              { id: 'a2', text: 'Unsupervised learning' },
              { id: 'a3', text: 'Reinforcement learning' },
              { id: 'a4', text: 'All of the above' },
            ],
            correctAnswerId: 'a2',
            explanation: 'Unsupervised learning, particularly clustering, is commonly used for recommendation systems.',
          },
          {
            id: 'q3',
            questionText: 'What does ML enable systems to do?',
            options: [
              { id: 'a1', text: 'Learn from experience without explicit programming' },
              { id: 'a2', text: 'Process data faster' },
              { id: 'a3', text: 'Store more information' },
              { id: 'a4', text: 'Connect to the internet' },
            ],
            correctAnswerId: 'a1',
            explanation: 'Machine learning enables systems to learn and improve from experience without being explicitly programmed.',
          },
          {
            id: 'q4',
            questionText: 'Which is an example of supervised learning?',
            options: [
              { id: 'a1', text: 'Customer segmentation' },
              { id: 'a2', text: 'Email spam detection' },
              { id: 'a3', text: 'Anomaly detection' },
              { id: 'a4', text: 'Market basket analysis' },
            ],
            correctAnswerId: 'a2',
            explanation: 'Email spam detection uses labeled examples (spam/not spam) to train the model, making it supervised learning.',
          },
          {
            id: 'q5',
            questionText: 'What is reinforcement learning?',
            options: [
              { id: 'a1', text: 'Learning through rewards and penalties' },
              { id: 'a2', text: 'Learning from labeled data' },
              { id: 'a3', text: 'Learning from unlabeled data' },
              { id: 'a4', text: 'Learning from textbooks' },
            ],
            correctAnswerId: 'a1',
            explanation: 'Reinforcement learning involves an agent learning to make decisions through trial and error, receiving rewards or penalties.',
          },
        ],
        skillIds: ['ml-basics', 'ml-types'],
        topicIds: [mlTopic1.id, mlTopic2.id],
      },
    });
    console.log(`✅ Created drill: ${drill.title}`);
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


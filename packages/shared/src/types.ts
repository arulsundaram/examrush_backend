export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt: Date;
};

export type VideoTopic = {
  id: string;
  videoId: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  keywords: string[];
  transcriptExcerpt: string;
  difficulty?: string;
  certificationObjective?: string;
  orderIndex: number;
};

export type UserVideoProgress = {
  id: string;
  userId: string;
  videoId: string;
  progressPercent: number;
  lastPositionSeconds: number;
  updatedAt: Date;
};

export type UserGamification = {
  userId: string;
  xp: number;
  streakCount: number;
  lastActiveDate: Date;
};

export type ClipSearchResult = {
  prompt: string;
  bestMatch: {
    topicId: string;
    title: string;
    startSeconds: number;
    endSeconds: number;
    confidence: 'High' | 'Medium' | 'Low';
    transcriptExcerpt: string;
  };
  related: Array<{
    topicId: string;
    title: string;
    startSeconds: number;
    endSeconds: number;
    confidence: 'High' | 'Medium' | 'Low';
    transcriptExcerpt: string;
  }>;
  allTopics: Array<{
    topicId: string;
    title: string;
    startSeconds: number;
    endSeconds: number;
    keywords: string[];
  }>;
};


import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Video schemas
export const videoQuerySchema = z.object({
  query: z.string().optional(),
  tag: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  sort: z.enum(['newest', 'oldest', 'duration']).optional(),
});

// Clip search schema
export const clipSearchSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

// Progress schema
export const progressSchema = z.object({
  videoId: z.string().uuid('Invalid video ID'),
  progressPercent: z.number().min(0).max(100),
  lastPositionSeconds: z.number().min(0),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VideoQueryInput = z.infer<typeof videoQuerySchema>;
export type ClipSearchInput = z.infer<typeof clipSearchSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;


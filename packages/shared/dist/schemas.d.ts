import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
}, {
    email: string;
    password: string;
    name: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const videoQuerySchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodEnum<["Beginner", "Intermediate", "Advanced"]>>;
    sort: z.ZodOptional<z.ZodEnum<["newest", "oldest", "duration"]>>;
}, "strip", z.ZodTypeAny, {
    sort?: "newest" | "oldest" | "duration" | undefined;
    query?: string | undefined;
    tag?: string | undefined;
    level?: "Beginner" | "Intermediate" | "Advanced" | undefined;
}, {
    sort?: "newest" | "oldest" | "duration" | undefined;
    query?: string | undefined;
    tag?: string | undefined;
    level?: "Beginner" | "Intermediate" | "Advanced" | undefined;
}>;
export declare const clipSearchSchema: z.ZodObject<{
    prompt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    prompt: string;
}, {
    prompt: string;
}>;
export declare const progressSchema: z.ZodObject<{
    videoId: z.ZodString;
    progressPercent: z.ZodNumber;
    lastPositionSeconds: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    videoId: string;
    progressPercent: number;
    lastPositionSeconds: number;
}, {
    videoId: string;
    progressPercent: number;
    lastPositionSeconds: number;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VideoQueryInput = z.infer<typeof videoQuerySchema>;
export type ClipSearchInput = z.infer<typeof clipSearchSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;

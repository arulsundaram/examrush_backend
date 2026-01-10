"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressSchema = exports.clipSearchSchema = exports.videoQuerySchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Auth schemas
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    name: zod_1.z.string().min(1, 'Name is required'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Video schemas
exports.videoQuerySchema = zod_1.z.object({
    query: zod_1.z.string().optional(),
    tag: zod_1.z.string().optional(),
    level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    sort: zod_1.z.enum(['newest', 'oldest', 'duration']).optional(),
});
// Clip search schema
exports.clipSearchSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(1, 'Prompt is required'),
});
// Progress schema
exports.progressSchema = zod_1.z.object({
    videoId: zod_1.z.string().uuid('Invalid video ID'),
    progressPercent: zod_1.z.number().min(0).max(100),
    lastPositionSeconds: zod_1.z.number().min(0),
});

import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().min(1),
});

export const loginSchema = z.object({
    email: z.string().min(1),
    password: z.string().min(1),
});

export const experienceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    description: z.string().optional(),
});
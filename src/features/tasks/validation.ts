import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    priority: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),
    assignedUserId: z.string().optional(),
    dueDate: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
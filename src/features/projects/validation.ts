import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
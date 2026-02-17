import { z } from "zod";
import { TaskStatus } from "../../app/generated/prisma/enums";

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    description: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type TaskFilters = {
    status?: TaskStatus;
};

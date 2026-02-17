import prisma from "@/lib/prisma";
import { CreateTaskInput } from "../validations/task";

export class TaskService {
    /**
     * Creates a new task for a specific user
     */
    static async createTask(data: CreateTaskInput, userId: number) {
        return await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}

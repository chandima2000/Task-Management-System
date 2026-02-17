import prisma from "@/lib/prisma";
import { CreateTaskInput, TaskFilters } from "../validations/task";

export class TaskService {
    /**
     * Retrieves tasks for a specific user with optional filtering
     */
    static async getTasks(userId: number, filters?: TaskFilters) {
        return await prisma.task.findMany({
            where: {
                userId: userId,
                ...(filters?.status && { status: filters.status }),
            },
            orderBy: {
                createdAt: "desc",
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

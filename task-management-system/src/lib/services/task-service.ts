import prisma from "@/lib/prisma";
import { CreateTaskInput, TaskFilters, updateTaskSchema } from "../validations/task";
import { z } from "zod";

export class TaskService {
    /**
     * Updates a task if the user is the owner
     */
    static async updateTask(id: number, userId: number, data: z.infer<typeof updateTaskSchema>) {
        // 1. Check ownership
        const task = await prisma.task.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!task) {
            throw new Error("TASK_NOT_FOUND");
        }

        if (task.userId !== userId) {
            throw new Error("FORBIDDEN");
        }

        // 2. Perform update
        return await prisma.task.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
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
     * Deletes a task if the user is the owner
     */
    static async deleteTask(id: number, userId: number) {
        // 1. Check ownership
        const task = await prisma.task.findUnique({
            where: { id },
            select: { userId: true },
        });

        if (!task) {
            throw new Error("TASK_NOT_FOUND");
        }

        if (task.userId !== userId) {
            throw new Error("FORBIDDEN");
        }

        // 2. Perform delete
        return await prisma.task.delete({
            where: { id },
        });
    }

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

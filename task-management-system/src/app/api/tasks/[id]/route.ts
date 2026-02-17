import { NextResponse } from "next/server";
import { updateTaskSchema } from "@/lib/validations/task";
import { TaskService } from "@/lib/services/task-service";
import { verifySessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

/**
 * PATH: /api/tasks/[id]
 */

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);

        // 1. Authenticate Request
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionPayload = await verifySessionToken(token);
        if (!sessionPayload || !sessionPayload.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = sessionPayload.id as number;

        // 2. Validate Input
        const body = await request.json();
        const validatedData = updateTaskSchema.parse(body);

        // 3. Call Service
        const updatedTask = await TaskService.updateTask(taskId, userId, validatedData);

        return NextResponse.json(updatedTask);
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        if (error.message === "TASK_NOT_FOUND") {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        if (error.message === "FORBIDDEN") {
            return NextResponse.json({ error: "Forbidden: You do not own this task" }, { status: 403 });
        }

        console.error("Task update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);

        // 1. Authenticate Request
        const cookieStore = await cookies();
        const token = cookieStore.get("session")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionPayload = await verifySessionToken(token);
        if (!sessionPayload || !sessionPayload.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = sessionPayload.id as number;

        // 2. Call Service
        await TaskService.deleteTask(taskId, userId);

        return new Response(null, { status: 204 });
    } catch (error: any) {
        if (error.message === "TASK_NOT_FOUND") {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        if (error.message === "FORBIDDEN") {
            return NextResponse.json({ error: "Forbidden: You do not own this task" }, { status: 403 });
        }

        console.error("Task deletion error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

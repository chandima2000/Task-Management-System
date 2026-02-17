import { NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/validations/task";
import { TaskService } from "@/lib/services/task-service";
import { verifySessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { TaskStatus } from "@/app/generated/prisma/enums";

export async function GET(request: Request) {
    try {
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

        // 2. Parse Filters
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") as TaskStatus | null;

        const filters = status ? { status } : {};

        // 3. Call Service
        const tasks = await TaskService.getTasks(userId, filters);

        return NextResponse.json(tasks);
    } catch (error: any) {
        console.error("Task list error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
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
        const validatedData = createTaskSchema.parse(body);

        // 3. Call Service
        const task = await TaskService.createTask(validatedData, userId);

        return NextResponse.json(task, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        console.error("Task creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

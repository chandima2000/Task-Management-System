import { NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/validations/task";
import { TaskService } from "@/lib/services/task-service";
import { verifySessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

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

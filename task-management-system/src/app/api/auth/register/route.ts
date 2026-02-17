import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { AuthService } from "@/lib/services/auth-service";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate Input
        const validatedData = registerSchema.parse(body);

        // 2. Call Service
        const user = await AuthService.registerUser(validatedData);

        // 3. Return Success
        return NextResponse.json(
            {
                message: "User registered successfully",
                user,
            },
            { status: 201 }
        );
    } catch (error: any) {
        // 4. Handle Errors
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        if (error.code === "DUPLICATE_EMAIL") {
            return NextResponse.json(
                { error: error.message, code: "DUPLICATE_EMAIL" },
                { status: 409 }
            );
        }

        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

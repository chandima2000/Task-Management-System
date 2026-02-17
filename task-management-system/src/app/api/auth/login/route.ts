import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { AuthService } from "@/lib/services/auth-service";
import { createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate Input
        const validatedData = loginSchema.parse(body);

        // 2. Call Service
        const user = await AuthService.loginUser(validatedData);

        // 3. Generate Session Token
        const token = await createSessionToken(user);

        // 4. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set("session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json(
            {
                message: "Logged in successfully",
                user,
            },
            { status: 200 }
        );
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json(
                { error: "Validation failed", details: error.errors },
                { status: 400 }
            );
        }

        if (error.code === "INVALID_CREDENTIALS") {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }

        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

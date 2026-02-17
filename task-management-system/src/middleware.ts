import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("session")?.value;

    // 1. Check for token
    if (!token) {
        return handleUnauthenticated(request);
    }

    // 2. Verify token
    const payload = await verifySessionToken(token);
    if (!payload) {
        return handleUnauthenticated(request);
    }

    // 3. Authorized
    return NextResponse.next();
}

function handleUnauthenticated(request: NextRequest) {
    const isApiRequest = request.nextUrl.pathname.startsWith("/api");

    if (isApiRequest) {
        return NextResponse.json(
            { error: "Unauthorized. Please log in." },
            { status: 401 }
        );
    }

    return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/tasks/:path*",
        "/tasks/:path*",
    ],
};

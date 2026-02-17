import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development-only";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export async function createSessionToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(encodedSecret);
}

export async function verifySessionToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedSecret);
        return payload;
    } catch (error) {
        return null;
    }
}

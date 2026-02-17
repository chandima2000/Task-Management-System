import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterInput } from "../validations/auth";

export class AuthService {
    /**
     * Registers a new user with hashed password
     * @throws Error if email already exists
     */
    static async registerUser(data: RegisterInput) {

        // 1. Check for duplicate email
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            const error = new Error("User with this email already exists");
            (error as any).code = "DUPLICATE_EMAIL";
            throw error;
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // 3. Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        return user;
    }
}

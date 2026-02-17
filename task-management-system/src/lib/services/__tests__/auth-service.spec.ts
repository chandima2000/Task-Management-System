import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import { PrismaClient } from '../../../app/generated/prisma/client'

// Hoist mock before any imports that use prisma
vi.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

import prisma from '@/lib/prisma'
import { AuthService } from '../auth-service'
import bcrypt from 'bcryptjs'

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})

describe('AuthService', () => {
    describe('registerUser', () => {
        const mockInput = {
            email: 'test@example.com',
            password: 'Password123',
        }

        it('should successfully register a new user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)
            const mockCreatedUser = {
                id: 1,
                email: mockInput.email,
                createdAt: new Date(),
            }
            prismaMock.user.create.mockResolvedValue(mockCreatedUser as any)

            const result = await AuthService.registerUser(mockInput)
            expect(result).toEqual(mockCreatedUser)
        })
    })

    describe('loginUser', () => {
        const mockInput = {
            email: 'test@example.com',
            password: 'Password123',
        }

        it('should successfully verify credentials', async () => {
            const hashedPassword = await bcrypt.hash(mockInput.password, 12)
            prismaMock.user.findUnique.mockResolvedValue({
                id: 1,
                email: mockInput.email,
                password: hashedPassword,
                createdAt: new Date(),
            } as any)

            const result = await AuthService.loginUser(mockInput)
            expect(result.email).toBe(mockInput.email)
            expect(result.id).toBe(1)
        })

        it('should throw error for non-existent user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)
            await expect(AuthService.loginUser(mockInput)).rejects.toThrow('Invalid email or password')
        })

        it('should throw error for incorrect password', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 1,
                email: mockInput.email,
                password: 'wrong-hash',
            } as any)

            await expect(AuthService.loginUser(mockInput)).rejects.toThrow('Invalid email or password')
        })
    })
})

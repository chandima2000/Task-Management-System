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
            // Setup: No existing user
            prismaMock.user.findUnique.mockResolvedValue(null)

            // Setup: Mock created user
            const mockCreatedUser = {
                id: 1,
                email: mockInput.email,
                createdAt: new Date(),
            }
            prismaMock.user.create.mockResolvedValue(mockCreatedUser as any)

            const result = await AuthService.registerUser(mockInput)

            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { email: mockInput.email },
            })
            expect(prismaMock.user.create).toHaveBeenCalled()
            expect(result).toEqual(mockCreatedUser)
        })

        it('should throw an error if user already exists', async () => {
            // Setup: User already exists
            prismaMock.user.findUnique.mockResolvedValue({ id: 1 } as any)

            await expect(AuthService.registerUser(mockInput)).rejects.toThrow(
                'User with this email already exists'
            )
            expect(prismaMock.user.create).not.toHaveBeenCalled()
        })

        it('should hash the password before saving', async () => {
            const hashSpy = vi.spyOn(bcrypt, 'hash')

            prismaMock.user.findUnique.mockResolvedValue(null)
            prismaMock.user.create.mockResolvedValue({ id: 1 } as any)

            await AuthService.registerUser(mockInput)

            expect(hashSpy).toHaveBeenCalledWith(mockInput.password, 12)
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'
import { TaskStatus } from '../../../app/generated/prisma/enums'
import { PrismaClient } from '../../../app/generated/prisma/client'

// Hoist mock before any imports that use prisma
vi.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>(),
}))

import prisma from '@/lib/prisma'
import { TaskService } from '../task-service'

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
    mockReset(prismaMock)
})

describe('TaskService', () => {
    describe('createTask', () => {
        const mockInput = {
            title: 'Test Task',
            description: 'Test Description',
            status: TaskStatus.TODO,
        }
        const userId = 1

        it('should successfully create a task', async () => {
            const mockCreatedTask = {
                id: 1,
                ...mockInput,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            prismaMock.task.create.mockResolvedValue(mockCreatedTask as any)

            const result = await TaskService.createTask(mockInput, userId)
            expect(result).toEqual(mockCreatedTask)
            expect(prismaMock.task.create).toHaveBeenCalledWith({
                data: {
                    ...mockInput,
                    userId,
                },
                select: expect.any(Object),
            })
        })
    })
})

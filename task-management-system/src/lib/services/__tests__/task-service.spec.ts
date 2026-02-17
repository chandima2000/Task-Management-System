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

    describe('getTasks', () => {
        const userId = 1
        const mockTasks = [
            { id: 1, title: 'Task 1', status: TaskStatus.TODO, userId },
            { id: 2, title: 'Task 2', status: TaskStatus.DONE, userId },
        ]

        it('should fetch all tasks for a user', async () => {
            prismaMock.task.findMany.mockResolvedValue(mockTasks as any)

            const result = await TaskService.getTasks(userId)
            expect(result).toEqual(mockTasks)
            expect(prismaMock.task.findMany).toHaveBeenCalledWith({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                select: expect.any(Object),
            })
        })

        it('should fetch filtered tasks for a user', async () => {
            prismaMock.task.findMany.mockResolvedValue([mockTasks[0]] as any)

            const result = await TaskService.getTasks(userId, { status: TaskStatus.TODO })
            expect(result).toEqual([mockTasks[0]])
            expect(prismaMock.task.findMany).toHaveBeenCalledWith({
                where: { userId, status: TaskStatus.TODO },
                orderBy: { createdAt: 'desc' },
                select: expect.any(Object),
            })
        })
    })
})

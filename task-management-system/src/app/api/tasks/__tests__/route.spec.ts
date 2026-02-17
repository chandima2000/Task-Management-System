import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '../route'
import { TaskService } from '@/lib/services/task-service'
import { verifySessionToken } from '@/lib/auth'

vi.mock('@/lib/services/task-service')
vi.mock('@/lib/auth')
vi.mock('next/headers', () => ({
    cookies: vi.fn(),
}))

import { cookies } from 'next/headers'

describe('Task API Routes', () => {
    describe('POST /api/tasks', () => {
        it('should return 201 and created task on success', async () => {
            const mockTask = { id: 1, title: 'New Task', userId: 1 }
            vi.mocked(verifySessionToken).mockResolvedValue({ id: 1 })
            vi.mocked(TaskService.createTask).mockResolvedValue(mockTask as any)

            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request('http://localhost/api/tasks', {
                method: 'POST',
                body: JSON.stringify({ title: 'New Task' }),
            })

            const response = await POST(request)
            const data = await response.json()

            expect(response.status).toBe(201)
            expect(data).toEqual(mockTask)
        })

        it('should return 401 if unauthorized', async () => {
            vi.mocked(verifySessionToken).mockResolvedValue(null)
            const mockCookieStore = { get: vi.fn().mockReturnValue(null) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request('http://localhost/api/tasks', {
                method: 'POST',
                body: JSON.stringify({ title: 'New Task' }),
            })

            const response = await POST(request)
            expect(response.status).toBe(401)
        })

        it('should return 400 for validation errors', async () => {
            vi.mocked(verifySessionToken).mockResolvedValue({ id: 1 })
            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request('http://localhost/api/tasks', {
                method: 'POST',
                body: JSON.stringify({ title: '' }), // Invalid title
            })

            const response = await POST(request)
            expect(response.status).toBe(400)
        })
    })

    describe('GET /api/tasks', () => {
        it('should return 200 and user tasks', async () => {
            const mockTasks = [{ id: 1, title: 'My Task', userId: 1 }]
            vi.mocked(verifySessionToken).mockResolvedValue({ id: 1 })
            vi.mocked(TaskService.getTasks).mockResolvedValue(mockTasks as any)

            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request('http://localhost/api/tasks')
            const response = await GET(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data).toEqual(mockTasks)
            expect(TaskService.getTasks).toHaveBeenCalledWith(1, {})
        })

        it('should apply status filter from query params', async () => {
            vi.mocked(verifySessionToken).mockResolvedValue({ id: 1 })
            vi.mocked(TaskService.getTasks).mockResolvedValue([])

            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request('http://localhost/api/tasks?status=TODO')
            await GET(request)

            expect(TaskService.getTasks).toHaveBeenCalledWith(1, { status: 'TODO' })
        })
    })
})

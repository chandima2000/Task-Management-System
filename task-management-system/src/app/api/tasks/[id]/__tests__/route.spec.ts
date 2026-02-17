import { describe, it, expect, vi } from 'vitest'
import { PATCH, DELETE } from '../route'
import { TaskService } from '@/lib/services/task-service'
import { verifySessionToken } from '@/lib/auth'

vi.mock('@/lib/services/task-service')
vi.mock('@/lib/auth')
vi.mock('next/headers', () => ({
    cookies: vi.fn(),
}))

import { cookies } from 'next/headers'

describe('Task [id] API Routes', () => {
    const taskId = '10'
    const userId = 1

    describe('PATCH /api/tasks/[id]', () => {
        it('should return 200 on success', async () => {
            vi.mocked(verifySessionToken).mockResolvedValue({ id: userId })
            vi.mocked(TaskService.updateTask).mockResolvedValue({ id: 10, title: 'Updated' } as any)

            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request(`http://localhost/api/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: 'Updated' }),
            })

            const response = await PATCH(request, { params: Promise.resolve({ id: taskId }) })
            expect(response.status).toBe(200)
        })

        it('should return 403 on IDOR attempt', async () => {
            vi.mocked(verifySessionToken).mockResolvedValue({ id: userId })
            vi.mocked(TaskService.updateTask).mockRejectedValue(new Error('FORBIDDEN'))

            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request(`http://localhost/api/tasks/${taskId}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: 'Updated' }),
            })

            const response = await PATCH(request, { params: Promise.resolve({ id: taskId }) })
            expect(response.status).toBe(403)
        })
    })

    describe('DELETE /api/tasks/[id]', () => {
        it('should return 204 on success', async () => {
            vi.mocked(verifySessionToken).mockResolvedValue({ id: userId })
            vi.mocked(TaskService.deleteTask).mockResolvedValue({} as any)

            const mockCookieStore = { get: vi.fn().mockReturnValue({ value: 'valid-token' }) }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request(`http://localhost/api/tasks/${taskId}`, {
                method: 'DELETE',
            })

            const response = await DELETE(request, { params: Promise.resolve({ id: taskId }) })
            expect(response.status).toBe(204)
        })
    })
})

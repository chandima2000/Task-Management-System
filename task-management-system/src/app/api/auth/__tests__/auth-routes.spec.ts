import { describe, it, expect, vi } from 'vitest'
import { POST as loginPOST } from '../login/route'
import { POST as logoutPOST } from '../logout/route'
import { AuthService } from '@/lib/services/auth-service'
import { createSessionToken } from '@/lib/auth'

vi.mock('@/lib/services/auth-service')
vi.mock('@/lib/auth')
vi.mock('next/headers', () => ({
    cookies: vi.fn(),
}))

import { cookies } from 'next/headers'

describe('Auth API Routes', () => {
    describe('POST /api/auth/login', () => {
        it('should return 200 and set cookie on success', async () => {
            const mockUser = { id: 1, email: 'test@example.com' }
            vi.mocked(AuthService.loginUser).mockResolvedValue(mockUser as any)
            vi.mocked(createSessionToken).mockResolvedValue('mock-token')

            const mockCookieStore = { set: vi.fn() }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const request = new Request('http://localhost/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'Password123' }),
            })

            const response = await loginPOST(request)
            expect(response.status).toBe(200)
            expect(mockCookieStore.set).toHaveBeenCalledWith('session', 'mock-token', expect.any(Object))
        })

        it('should return 401 for invalid credentials', async () => {
            const error = new Error('Invalid email or password');
            (error as any).code = 'INVALID_CREDENTIALS'
            vi.mocked(AuthService.loginUser).mockRejectedValue(error)

            const request = new Request('http://localhost/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
            })

            const response = await loginPOST(request)
            expect(response.status).toBe(401)
        })
    })

    describe('POST /api/auth/logout', () => {
        it('should return 200 and delete cookie', async () => {
            const mockCookieStore = { delete: vi.fn() }
            vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

            const response = await logoutPOST()
            expect(response.status).toBe(200)
            expect(mockCookieStore.delete).toHaveBeenCalledWith('session')
        })
    })
})

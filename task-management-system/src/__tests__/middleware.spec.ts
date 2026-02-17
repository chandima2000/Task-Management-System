import { describe, it, expect, vi } from 'vitest'
import { middleware } from '../middleware'
import { verifySessionToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

vi.mock('@/lib/auth')

describe('Middleware', () => {
    const createRequest = (path: string, token?: string) => {
        const url = `http://localhost${path}`
        const request = new NextRequest(url)
        if (token) {
            request.cookies.set('session', token)
        }
        return request
    }

    it('should redirect to /login if no token is present for dashboard', async () => {
        const request = createRequest('/dashboard')
        const response = await middleware(request)

        expect(response?.status).toBe(307)
        expect(response?.headers.get('location')).toContain('/login')
    })

    it('should return 401 if no token is present for API routes', async () => {
        const request = createRequest('/api/tasks')
        const response = await middleware(request)
        const data = await response?.json()

        expect(response?.status).toBe(401)
        expect(data.error).toContain('Unauthorized')
    })

    it('should proceed if token is valid', async () => {
        vi.mocked(verifySessionToken).mockResolvedValue({ userId: 1 })
        const request = createRequest('/dashboard', 'valid-token')
        const response = await middleware(request)

        // NextResponse.next() returns a specific internal structure or null in mocks depending on setup
        // but here we just check it doesn't redirect
        expect(response?.status).not.toBe(307)
        expect(response?.status).not.toBe(401)
    })
})

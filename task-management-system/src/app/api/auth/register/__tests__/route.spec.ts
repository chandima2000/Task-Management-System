import { describe, it, expect, vi } from 'vitest'
import { POST } from '../route'
import { AuthService } from '@/lib/services/auth-service'

vi.mock('@/lib/services/auth-service')

describe('POST /api/auth/register', () => {

    it('should return 201 and user data on successful registration', async () => {
        const mockUser = { id: 1, email: 'test@example.com' }
        vi.mocked(AuthService.registerUser).mockResolvedValue(mockUser as any)

        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'Password123',
            }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(201)
        expect(data.user).toEqual(mockUser)
    })

    it('should return 400 for invalid input', async () => {
        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: 'invalid-email',
                password: '123',
            }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Validation failed')
    })

    it('should return 409 for duplicate email', async () => {
        const error = new Error('User with this email already exists');
        (error as any).code = 'DUPLICATE_EMAIL'
        vi.mocked(AuthService.registerUser).mockRejectedValue(error)

        const request = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'Password123',
            }),
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(409)
        expect(data.code).toBe('DUPLICATE_EMAIL')
    })
})

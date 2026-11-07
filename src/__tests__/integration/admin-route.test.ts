import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { PATCH } from '@/app/api/admin/orders/[id]/route'
import { AdminAuthError } from '@/lib/supabase/admin'

const mockVerifyAdminUser = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockSelect = vi.fn()
const mockSingle = vi.fn()

vi.mock('@/lib/supabase/admin', () => ({
  AdminAuthError: class extends Error {
    status: number
    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  },
  verifyAdminUser: () => mockVerifyAdminUser(),
  createAdminClient: () => ({
    from: () => ({
      update: (...args: unknown[]) => {
        mockUpdate(...args)
        return {
          eq: (...eqArgs: unknown[]) => {
            mockEq(...eqArgs)
            return {
              select: (...sArgs: unknown[]) => {
                mockSelect(...sArgs)
                return {
                  single: () => mockSingle(),
                }
              },
            }
          },
        }
      },
    }),
  }),
}))

describe('PATCH /api/admin/orders/[id] — Admin Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns HTTP 401 when user is not authenticated', async () => {
    mockVerifyAdminUser.mockRejectedValue(new AdminAuthError('Authentication required.', 401))

    const req = new NextRequest('http://localhost:3000/api/admin/orders/11111111-1111-1111-1111-111111111111', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: 'confirmed' }),
    })

    const res = await PATCH(req, { params: Promise.resolve({ id: '11111111-1111-1111-1111-111111111111' }) })
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error).toContain('Authentication required')
  })

  it('returns HTTP 403 when user is authenticated but not an allowlisted admin', async () => {
    mockVerifyAdminUser.mockRejectedValue(new AdminAuthError('Forbidden.', 403))

    const req = new NextRequest('http://localhost:3000/api/admin/orders/11111111-1111-1111-1111-111111111111', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: 'confirmed' }),
    })

    const res = await PATCH(req, { params: Promise.resolve({ id: '11111111-1111-1111-1111-111111111111' }) })
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toContain('Forbidden')
  })

  it('returns HTTP 400 for invalid UUID route parameter', async () => {
    mockVerifyAdminUser.mockResolvedValue({ id: 'admin-user', email: 'admin@5000shop.pk' })

    const req = new NextRequest('http://localhost:3000/api/admin/orders/invalid-uuid-string', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: 'confirmed' }),
    })

    const res = await PATCH(req, { params: Promise.resolve({ id: 'invalid-uuid-string' }) })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid order ID format')
  })

  it('returns HTTP 400 for invalid order_status enum value', async () => {
    mockVerifyAdminUser.mockResolvedValue({ id: 'admin-user', email: 'admin@5000shop.pk' })

    const req = new NextRequest('http://localhost:3000/api/admin/orders/11111111-1111-1111-1111-111111111111', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: 'hacked_status' }),
    })

    const res = await PATCH(req, { params: Promise.resolve({ id: '11111111-1111-1111-1111-111111111111' }) })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Validation failed')
  })

  it('returns HTTP 200 on successful admin order update', async () => {
    mockVerifyAdminUser.mockResolvedValue({ id: 'admin-user', email: 'admin@5000shop.pk' })
    mockSingle.mockResolvedValue({
      data: {
        id: '11111111-1111-1111-1111-111111111111',
        order_number: '5HT-261102-TEST',
        order_status: 'shipped',
        payment_status: 'pending',
        courier_name: 'TCS',
        tracking_number: 'TRK-999',
        admin_notes: 'Dispatched via TCS Express',
        updated_at: new Date().toISOString(),
      },
      error: null,
    })

    const req = new NextRequest('http://localhost:3000/api/admin/orders/11111111-1111-1111-1111-111111111111', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_status: 'shipped',
        courier_name: 'TCS',
        tracking_number: 'TRK-999',
        admin_notes: 'Dispatched via TCS Express',
      }),
    })

    const res = await PATCH(req, { params: Promise.resolve({ id: '11111111-1111-1111-1111-111111111111' }) })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.order_status).toBe('shipped')
    expect(json.courier_name).toBe('TCS')
  })
})

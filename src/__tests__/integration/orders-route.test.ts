import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/orders/route'

// Mock createOrder so integration test verifies HTTP route handler contracts deterministically
vi.mock('@/lib/orders/create-order', () => ({
  createOrder: vi.fn(async () => ({
    success: true,
    orderId: 'mock-order-id-123',
    orderNumber: '5HT-261102-TEST',
    confirmationToken: 'mock-token-abc',
    total: 2100,
  })),
}))

describe('POST /api/orders — HTTP Route Security & Validation Handler', () => {
  it('returns HTTP 415 when Content-Type is not application/json', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'plain text',
    })

    const res = await POST(req)
    expect(res.status).toBe(415)
    const json = await res.json()
    expect(json.error).toContain('Unsupported Media Type')
  })

  it('returns HTTP 413 when payload exceeds 16 KB via Content-Length header', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '20000',
      },
      body: JSON.stringify({ test: 'x' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(413)
    const json = await res.json()
    expect(json.error).toContain('Payload Too Large')
  })

  it('returns HTTP 413 when raw body buffer exceeds 16 KB', async () => {
    const largeBody = JSON.stringify({ padding: 'a'.repeat(18 * 1024) })
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: largeBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(413)
    const json = await res.json()
    expect(json.error).toContain('Payload Too Large')
  })

  it('returns HTTP 400 when body is malformed JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"unclosed_json: true',
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toContain('Invalid JSON')
  })

  it('returns HTTP 422 with structured field errors when validation fails', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'A', // Too short
        phone: '02131234567', // Landline
        province: 'InvalidProvince',
        items: [], // Empty
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(422)
    const json = await res.json()
    expect(json.error).toContain('Validation failed')
    expect(json.details).toBeDefined()
    expect(json.details.phone).toBeDefined()
    expect(json.details.province).toBeDefined()
  })

  it('returns HTTP 201 Created and order details for valid checkout payload', async () => {
    const validOrder = {
      customerName: 'Zainab Bibi',
      phone: '03001234567',
      province: 'Punjab',
      city: 'Rawalpindi',
      area: 'Saddar',
      address: 'Street 5, House 10',
      paymentMethod: 'cod',
      idempotencyKey: 'route-test-idemp',
      items: [
        {
          productId: 'prod-uuid-1',
          slug: 'leather-bag',
          quantity: 1,
        },
      ],
    }

    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validOrder),
    })

    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.orderNumber).toBe('5HT-261102-TEST')
    expect(json.confirmationToken).toBe('mock-token-abc')
  })
})

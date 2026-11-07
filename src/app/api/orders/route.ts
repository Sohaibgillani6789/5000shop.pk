/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Order API Route Handler
 *
 * POST /api/orders
 *
 * Validates checkout payload, creates order server-side,
 * and returns order confirmation data.
 *
 * Security:
 *   - All prices re-verified against database
 *   - Idempotency key prevents double-submit
 *   - No client-submitted financial data is trusted
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse, type NextRequest } from 'next/server'
import { validateCheckout } from '@/lib/checkout/validation'
import { createOrder, type CreateOrderError } from '@/lib/orders/create-order'

export async function POST(request: NextRequest) {
  try {
    // ── 1. Content-Type Check ──────────────────────────────
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Unsupported Media Type. Content-Type must be application/json.' },
        { status: 415 }
      )
    }

    // ── 2. Payload Size Limit Check (Max 16 KB) ─────────────
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 16 * 1024) {
      return NextResponse.json(
        { error: 'Payload Too Large. Maximum allowed size is 16 KB.' },
        { status: 413 }
      )
    }

    // ── 3. Parse request body ──────────────────────────────
    const rawText = await request.text()
    if (Buffer.byteLength(rawText, 'utf8') > 16 * 1024) {
      return NextResponse.json(
        { error: 'Payload Too Large. Maximum allowed size is 16 KB.' },
        { status: 413 }
      )
    }

    let body: unknown
    try {
      body = JSON.parse(rawText)
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      )
    }

    // ── 4. Validate checkout data ──────────────────────────
    const validation = validateCheckout(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed. Please check your information.',
          details: validation.errors,
        },
        { status: 422 }
      )
    }

    // ── Create order (server-side verification + RPC) ──────

    const orderResult = await createOrder(validation.data)

    return NextResponse.json(orderResult, { status: 201 })
  } catch (error: unknown) {
    // Handle typed CreateOrderError
    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      'message' in error
    ) {
      const orderError = error as CreateOrderError
      return NextResponse.json(
        {
          error: orderError.message,
          ...(orderError.details ? { details: orderError.details } : {}),
        },
        { status: orderError.status }
      )
    }

    // Unexpected server error
    console.error('[5000shop] Unexpected order error:', {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

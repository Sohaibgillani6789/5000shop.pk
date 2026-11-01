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
    // ── Parse request body ─────────────────────────────────

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      )
    }

    // ── Validate checkout data ─────────────────────────────

    const validation = validateCheckout(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed. Please check your information.',
          details: validation.errors,
        },
        { status: 400 }
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
    console.error('[5000shop] Unexpected order error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

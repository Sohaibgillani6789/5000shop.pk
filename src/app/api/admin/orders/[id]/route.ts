/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Order PATCH Route
 *
 *  PATCH /api/admin/orders/[id]
 *
 *  Updates mutable admin fields on an existing order:
 *    - order_status, payment_status
 *    - courier_name, tracking_number
 *    - admin_notes
 *
 *  Security:
 *    - Verifies admin session + ADMIN_EMAILS allowlist
 *    - Validates payload with Zod before DB write
 *    - Uses service-role client for write (bypasses RLS correctly)
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { verifyAdminUser, createAdminClient, AdminAuthError } from '@/lib/supabase/admin'
import { ORDER_STATUSES, PAYMENT_STATUSES } from '@/lib/orders/admin-order-types'

// ── Zod Validation Schema ─────────────────────────────────────

const orderUpdateSchema = z
  .object({
    order_status: z.enum(ORDER_STATUSES).optional(),
    payment_status: z.enum(PAYMENT_STATUSES).optional(),
    courier_name: z.string().trim().max(100).nullable().optional(),
    tracking_number: z.string().trim().max(100).nullable().optional(),
    admin_notes: z.string().trim().max(2000).nullable().optional(),
  })
  .strict()

type OrderUpdatePayload = z.infer<typeof orderUpdateSchema>

// ── Route Handler ─────────────────────────────────────────────

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  // ── 1. Verify Admin Auth ──────────────────────────────────
  try {
    await verifyAdminUser()
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 401 }
    )
  }

  // ── 2. Validate UUID ──────────────────────────────────────
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid order ID format.' }, { status: 400 })
  }

  // ── 3. Parse and validate body ────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  const parsed = orderUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const updateData: OrderUpdatePayload = parsed.data

  // Ensure at least one field is being updated
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'No fields provided to update.' },
      { status: 400 }
    )
  }

  // ── 4. Apply update via service-role client ───────────────
  const adminDb = createAdminClient()

  const { data: updatedOrder, error: updateError } = await adminDb
    .from('orders')
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('id, order_number, order_status, payment_status, courier_name, tracking_number, admin_notes, updated_at')
    .single()

  if (updateError) {
    // PGRST116 = no rows matched (order not found)
    if (updateError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    console.error('[admin] Order update error:', updateError)
    return NextResponse.json(
      { error: 'Failed to update order. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json(updatedOrder, { status: 200 })
}

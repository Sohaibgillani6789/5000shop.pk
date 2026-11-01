/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Authoritative Server-Side Order Creation
 *
 * SECURITY CRITICAL: This module is the ONLY path to create orders.
 * It re-fetches product prices from Supabase, verifies stock and
 * price ceiling (≤ ₨5,000), computes all financial totals, and
 * calls the atomic create_order_with_items RPC.
 *
 * Never trust client-submitted prices, totals, or discounts.
 * ──────────────────────────────────────────────────────────────
 */
import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { randomBytes } from 'crypto'
import type { CheckoutValidated } from '@/lib/checkout/validation'
import {
  MAX_PRODUCT_PRICE_PKR,
  MIN_PRODUCT_PRICE_PKR,
  computeLineTotal,
  computeSubtotal,
  computeDeliveryFee,
  computeOrderTotal,
} from '@/lib/checkout/pricing'
import type {
  OrderLineItem,
  OrderPayload,
  OrderCreateResult,
  OrderApiResponse,
} from './order-types'

// ── Service-Role Supabase Client (Server-Only) ──────────────

function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    )
  }

  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // Service-role client doesn't use cookies
      },
    },
  })
}

// ── Order Number Generator ───────────────────────────────────

/**
 * Generates a human-readable order number in format: 5HT-YYMMDD-XXXX
 * Uses cryptographic random bytes for the suffix.
 */
function generateOrderNumber(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')

  // 4-character alphanumeric suffix from crypto random
  const suffix = randomBytes(3)
    .toString('base64url')
    .slice(0, 4)
    .toUpperCase()

  return `5HT-${yy}${mm}${dd}-${suffix}`
}

// ── Order Creation ───────────────────────────────────────────

export interface CreateOrderError {
  status: number
  message: string
  details?: Record<string, string[]>
}

/**
 * Creates an order after full server-side validation:
 * 1. Re-fetches all products from database
 * 2. Validates stock and price constraints
 * 3. Computes financial totals
 * 4. Calls atomic RPC
 */
export async function createOrder(
  validated: CheckoutValidated
): Promise<OrderApiResponse> {
  const supabase = createServiceClient()

  // ── Step 1: Re-fetch all requested products ──────────────

  const productIds = validated.items.map((item) => item.productId)

  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, title, slug, price, image_url, in_stock')
    .in('id', productIds)

  if (fetchError) {
    const err: CreateOrderError = {
      status: 500,
      message: 'Failed to verify products. Please try again.',
    }
    throw err
  }

  if (!products || products.length === 0) {
    const err: CreateOrderError = {
      status: 400,
      message: 'None of the requested products were found.',
    }
    throw err
  }

  // Build a lookup map for quick access
  const productMap = new Map(products.map((p) => [p.id, p]))

  // ── Step 2: Validate each item against database ──────────

  const orderItems: OrderLineItem[] = []
  const itemErrors: Record<string, string[]> = {}

  for (const requestedItem of validated.items) {
    const dbProduct = productMap.get(requestedItem.productId)

    if (!dbProduct) {
      itemErrors[requestedItem.slug] = [
        `Product "${requestedItem.slug}" is no longer available.`,
      ]
      continue
    }

    if (!dbProduct.in_stock) {
      itemErrors[requestedItem.slug] = [
        `"${dbProduct.title}" is currently out of stock.`,
      ]
      continue
    }

    if (dbProduct.price <= 0 || dbProduct.price > MAX_PRODUCT_PRICE_PKR) {
      itemErrors[requestedItem.slug] = [
        `"${dbProduct.title}" has an invalid price and cannot be ordered.`,
      ]
      continue
    }

    if (dbProduct.price < MIN_PRODUCT_PRICE_PKR) {
      itemErrors[requestedItem.slug] = [
        `"${dbProduct.title}" has an invalid price.`,
      ]
      continue
    }

    const lineTotal = computeLineTotal(dbProduct.price, requestedItem.quantity)

    orderItems.push({
      product_id: dbProduct.id,
      product_title: dbProduct.title,
      product_slug: dbProduct.slug,
      unit_price: dbProduct.price,
      quantity: requestedItem.quantity,
      line_total: lineTotal,
      image_url: dbProduct.image_url || null,
    })
  }

  if (Object.keys(itemErrors).length > 0) {
    const err: CreateOrderError = {
      status: 400,
      message: 'Some products could not be ordered.',
      details: itemErrors,
    }
    throw err
  }

  if (orderItems.length === 0) {
    const err: CreateOrderError = {
      status: 400,
      message: 'No valid products in the order.',
    }
    throw err
  }

  // ── Step 3: Compute financial totals (server-side only) ──

  const lineTotals = orderItems.map((item) => item.line_total)
  const subtotal = computeSubtotal(lineTotals)
  const deliveryFee = computeDeliveryFee(validated.province)
  const discount = 0 // No discount system in MVP
  const total = computeOrderTotal(subtotal, deliveryFee, discount)

  // ── Step 4: Generate order number ────────────────────────

  const orderNumber = generateOrderNumber()

  // ── Step 5: Build payload and call atomic RPC ────────────

  const orderPayload: OrderPayload = {
    order_number: orderNumber,
    idempotency_key: validated.idempotencyKey,
    customer_name: validated.customerName,
    phone: validated.phone,
    email: validated.email ?? null,
    province: validated.province,
    city: validated.city,
    area: validated.area,
    address: validated.address,
    landmark: validated.landmark ?? null,
    postal_code: validated.postalCode ?? null,
    delivery_notes: validated.deliveryNotes ?? null,
    subtotal,
    delivery_fee: deliveryFee,
    discount,
    total,
    payment_method: 'cod',
  }

  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    'create_order_with_items',
    {
      p_order: orderPayload,
      p_items: orderItems,
    }
  )

  if (rpcError) {
    console.error('[5000shop] Order RPC failed:', rpcError)
    const err: CreateOrderError = {
      status: 500,
      message: 'Failed to place order. Please try again.',
    }
    throw err
  }

  const result = rpcResult as OrderCreateResult

  return {
    orderId: result.id,
    orderNumber: result.order_number,
    confirmationToken: result.confirmation_token,
    total: result.total,
  }
}

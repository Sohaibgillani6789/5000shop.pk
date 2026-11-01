/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Order Type Definitions
 *
 * Server-side types used during authoritative order creation.
 * Client never submits these — they are computed from database
 * records after product validation.
 * ──────────────────────────────────────────────────────────────
 */

/** A single server-verified line item within an order. */
export interface OrderLineItem {
  product_id: string
  product_title: string
  product_slug: string
  unit_price: number
  quantity: number
  line_total: number
  image_url: string | null
}

/** Full order payload sent to the create_order_with_items RPC. */
export interface OrderPayload {
  order_number: string
  idempotency_key: string
  customer_name: string
  phone: string
  email: string | null
  province: string
  city: string
  area: string
  address: string
  landmark: string | null
  postal_code: string | null
  delivery_notes: string | null
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  payment_method: 'cod'
}

/** Result returned from create_order_with_items RPC. */
export interface OrderCreateResult {
  id: string
  order_number: string
  confirmation_token: string
  total: number
  created_at: string
  idempotent_hit: boolean
}

/** API response shape for the POST /api/orders endpoint. */
export interface OrderApiResponse {
  orderId: string
  orderNumber: string
  confirmationToken: string
  total: number
}

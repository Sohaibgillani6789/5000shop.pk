/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Order TypeScript Interfaces
 *
 *  Full fidelity types for admin views of orders and order_items.
 *  These expose all fields including PII (phone, address) which
 *  must NEVER be returned to unauthenticated client requests.
 * ──────────────────────────────────────────────────────────────
 */

// ── Order Status Enums ─────────────────────────────────────────

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const PAYMENT_STATUSES = [
  'pending',
  'paid',
  'failed',
  'refunded',
] as const

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const PAKISTANI_COURIERS = [
  'TCS',
  'Leopards',
  'PostEx',
  'Trax',
  'CallCourier',
  'Rider',
  'Bykea',
  'Pakistan Post',
  'Other',
] as const

export type PakistaniCourier = (typeof PAKISTANI_COURIERS)[number]

// ── Core Admin Types ───────────────────────────────────────────

export interface AdminOrder {
  id: string
  order_number: string
  confirmation_token: string
  idempotency_key: string | null

  // Customer PII — only visible to authenticated admins
  customer_name: string
  phone: string
  email: string | null

  // Delivery address
  province: string
  city: string
  area: string
  address: string
  landmark: string | null
  postal_code: string | null
  delivery_notes: string | null

  // Financials
  subtotal: number
  delivery_fee: number
  discount: number
  total: number

  // Payment & Status
  payment_method: 'cod'
  payment_status: PaymentStatus
  order_status: OrderStatus

  // Courier
  courier_name: string | null
  tracking_number: string | null
  admin_notes: string | null

  // Timestamps
  created_at: string
  updated_at: string
}

export interface AdminOrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_title: string
  product_slug: string
  unit_price: number
  quantity: number
  line_total: number
  image_url: string | null
  created_at: string
}

export interface AdminOrderWithItems extends AdminOrder {
  order_items: AdminOrderItem[]
}

// ── PATCH Payload ──────────────────────────────────────────────

export interface OrderStatusUpdate {
  order_status?: OrderStatus
  payment_status?: PaymentStatus
  courier_name?: string | null
  tracking_number?: string | null
  admin_notes?: string | null
}

// ── List Query Types ───────────────────────────────────────────

export type AdminOrderListItem = Pick<
  AdminOrder,
  | 'id'
  | 'order_number'
  | 'customer_name'
  | 'phone'
  | 'city'
  | 'province'
  | 'total'
  | 'payment_method'
  | 'payment_status'
  | 'order_status'
  | 'courier_name'
  | 'tracking_number'
  | 'created_at'
>

export interface AdminOrdersPage {
  orders: AdminOrderListItem[]
  totalCount: number
  page: number
  pageSize: number
}

/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Centralized Pricing Configuration
 *
 * Server-side only. All financial calculations happen here.
 * Client prices are display estimates — never trusted.
 * ──────────────────────────────────────────────────────────────
 */
import 'server-only'

export {
  MAX_PRODUCT_PRICE_PKR,
  MAX_ITEM_QUANTITY,
  STANDARD_DELIVERY_FEE_PKR,
  MIN_PRODUCT_PRICE_PKR,
} from './constants'

import { STANDARD_DELIVERY_FEE_PKR } from './constants'

/**
 * Compute line total for a single order item.
 * Pure function — no side effects.
 */
export function computeLineTotal(unitPrice: number, quantity: number): number {
  return Math.round(unitPrice * quantity * 100) / 100
}

/**
 * Compute subtotal from an array of line totals.
 */
export function computeSubtotal(lineTotals: number[]): number {
  const sum = lineTotals.reduce((acc, lt) => acc + lt, 0)
  return Math.round(sum * 100) / 100
}

/**
 * Compute delivery fee. Currently a flat rate.
 * Future: could vary by province/city/weight.
 */
export function computeDeliveryFee(province?: string): number {
  void province
  return STANDARD_DELIVERY_FEE_PKR
}

/**
 * Compute final order total.
 * total = subtotal + deliveryFee - discount
 * Discount is always >= 0 and <= subtotal (cannot produce negative totals).
 */
export function computeOrderTotal(
  subtotal: number,
  deliveryFee: number,
  discount: number,
): number {
  const clampedDiscount = Math.min(Math.max(discount, 0), subtotal)
  const total = subtotal + deliveryFee - clampedDiscount
  return Math.round(total * 100) / 100
}

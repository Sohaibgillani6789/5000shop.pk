/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Pakistani COD Checkout Validation (Server-Side)
 *
 * All checkout payloads are validated here before any database
 * interaction. Uses Zod v4 for schema-driven validation.
 *
 * Phone normalization:
 *   +923001234567 → 03001234567
 *   00923001234567 → 03001234567
 *   923001234567 → 03001234567
 *   03001234567 → 03001234567
 *
 * Validates Jazz, Zong, Ufone, Telenor, SCOM prefixes.
 * Rejects PTCL landlines and invalid formats.
 * ──────────────────────────────────────────────────────────────
 */
import 'server-only'

import { z } from 'zod'
import {
  PAKISTAN_PROVINCES,
  type PakistanProvince,
  PAKISTAN_MOBILE_REGEX,
} from './constants'

export { PAKISTAN_PROVINCES, type PakistanProvince }

// ── Phone Normalization ──────────────────────────────────────

/**
 * Strips whitespace, dashes, parentheses and converts international
 * Pakistani prefixes (+92, 0092, 92) to the local 0-prefix format.
 */
function normalizePakistaniPhone(raw: string): string {
  // Strip spaces, dashes, parentheses
  let cleaned = raw.replace(/[\s\-()]/g, '')

  // Convert international prefix variants to local
  if (cleaned.startsWith('+92')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('0092')) {
    cleaned = '0' + cleaned.slice(4)
  } else if (cleaned.startsWith('92') && cleaned.length === 12) {
    cleaned = '0' + cleaned.slice(2)
  }

  return cleaned
}

/**
 * Validates Pakistani mobile numbers across:
 *   Jazz/Warid:  030x, 031x, 032x
 *   Zong:        031x
 *   Telenor:     034x
 *   Ufone:       033x
 *   SCOM:        0355, 0364
 *
 * Pattern: ^03([0-4][0-9]|55|64)[0-9]{7}$
 */
const PAKISTANI_MOBILE_REGEX = PAKISTAN_MOBILE_REGEX

// ── Checkout Item Schema ─────────────────────────────────────

const checkoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  slug: z.string().min(1, 'Product slug is required'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Minimum quantity is 1')
    .max(10, 'Maximum quantity is 10'),
})

// ── Main Checkout Schema ─────────────────────────────────────

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),

  phone: z
    .string()
    .transform(normalizePakistaniPhone)
    .refine(
      (val) => PAKISTANI_MOBILE_REGEX.test(val),
      {
        message:
          'Please enter a valid Pakistani mobile number (e.g. 0300-1234567)',
      }
    ),

  email: z
    .string()
    .trim()
    .transform((val) => (val === '' ? null : val))
    .pipe(z.string().email('Please enter a valid email address').nullable()),

  province: z.enum(PAKISTAN_PROVINCES, {
    message: 'Please select a valid province',
  }),

  city: z
    .string()
    .trim()
    .min(1, 'City is required'),

  area: z
    .string()
    .trim()
    .min(1, 'Area is required'),

  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters'),

  landmark: z
    .string()
    .trim()
    .transform((val) => (val === '' ? null : val))
    .pipe(z.string().nullable())
    .optional()
    .default(''),

  postalCode: z
    .string()
    .trim()
    .transform((val) => (val === '' ? null : val))
    .pipe(z.string().nullable())
    .optional()
    .default(''),

  deliveryNotes: z
    .string()
    .trim()
    .transform((val) => (val === '' ? null : val))
    .pipe(z.string().nullable())
    .optional()
    .default(''),

  paymentMethod: z.literal('cod', {
    message: 'Only Cash on Delivery is available',
  }),

  idempotencyKey: z
    .string()
    .min(1, 'Idempotency key is required'),

  items: z
    .array(checkoutItemSchema)
    .min(1, 'At least one item is required'),
})

export type CheckoutInput = z.input<typeof checkoutSchema>
export type CheckoutValidated = z.output<typeof checkoutSchema>

/**
 * Validates a raw checkout payload. Returns either validated data
 * or a structured error object.
 */
export function validateCheckout(data: unknown):
  | { success: true; data: CheckoutValidated }
  | { success: false; errors: Record<string, string[]> } {
  const result = checkoutSchema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  // Flatten Zod errors into a field → messages map
  const errors: Record<string, string[]> = {}
  for (const issue of result.error.issues) {
    const path = issue.path.join('.') || '_root'
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  }

  return { success: false, errors }
}

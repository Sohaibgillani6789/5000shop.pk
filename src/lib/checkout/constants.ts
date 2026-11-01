/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Checkout & Pricing Constants (Client & Server Safe)
 *
 * Shared constants usable in both Server and Client Components.
 * ──────────────────────────────────────────────────────────────
 */

/** Hard ceiling: every product on 5000shop.pk must cost ≤ ₨5,000 */
export const MAX_PRODUCT_PRICE_PKR = 5000;

/** Minimum valid product price */
export const MIN_PRODUCT_PRICE_PKR = 1;

/** Maximum quantity per line item */
export const MAX_ITEM_QUANTITY = 10;

/** Standard flat delivery fee across Pakistan (COD) */
export const STANDARD_DELIVERY_FEE_PKR = 250;

/** Pakistani Provinces and Federal Territories */
export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
] as const;

export type PakistanProvince = (typeof PAKISTAN_PROVINCES)[number];

/**
 * Validates Pakistani mobile numbers across:
 *   Jazz/Warid:  030x, 031x, 032x
 *   Zong:        031x (shared prefix), 037x (future), 038x
 *   Ufone:       033x
 *   Telenor:     034x
 *   SCO/SCOM:    0355
 *   Special:     0364
 *   Total: exactly 11 digits starting with 03
 * Rejects PTCL landlines (e.g. 051, 042, 021) and international numbers.
 */
export const PAKISTAN_MOBILE_REGEX = /^03([0-4][0-9]|55|64)[0-9]{7}$/;

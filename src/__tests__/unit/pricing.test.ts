import { describe, it, expect } from 'vitest'
import {
  computeLineTotal,
  computeSubtotal,
  computeDeliveryFee,
  computeOrderTotal,
  MAX_PRODUCT_PRICE_PKR,
  MIN_PRODUCT_PRICE_PKR,
  STANDARD_DELIVERY_FEE_PKR,
  MAX_ITEM_QUANTITY,
} from '@/lib/checkout/pricing'

describe('Pricing Engine & Financial Invariants', () => {
  describe('Constants & Invariants', () => {
    it('enforces nationwide price ceiling of ₨5,000', () => {
      expect(MAX_PRODUCT_PRICE_PKR).toBe(5000)
    })

    it('enforces minimum product price of ₨1', () => {
      expect(MIN_PRODUCT_PRICE_PKR).toBe(1)
    })

    it('enforces flat nationwide delivery fee of ₨250', () => {
      expect(STANDARD_DELIVERY_FEE_PKR).toBe(250)
    })

    it('enforces maximum per-item order quantity of 10', () => {
      expect(MAX_ITEM_QUANTITY).toBe(10)
    })
  })

  describe('computeLineTotal', () => {
    it('computes exact unit price × quantity', () => {
      expect(computeLineTotal(1850, 2)).toBe(3700)
      expect(computeLineTotal(4999.99, 1)).toBe(4999.99)
    })

    it('rounds to 2 decimal places to prevent floating-point anomalies', () => {
      expect(computeLineTotal(19.99, 3)).toBe(59.97)
    })
  })

  describe('computeSubtotal', () => {
    it('sums all line totals correctly', () => {
      const lineTotals = [1850, 2400, 750]
      expect(computeSubtotal(lineTotals)).toBe(5000)
    })

    it('returns 0 for empty order', () => {
      expect(computeSubtotal([])).toBe(0)
    })
  })

  describe('computeDeliveryFee', () => {
    it('returns flat ₨250 delivery fee regardless of province', () => {
      expect(computeDeliveryFee('Sindh')).toBe(250)
      expect(computeDeliveryFee('Punjab')).toBe(250)
      expect(computeDeliveryFee('Balochistan')).toBe(250)
      expect(computeDeliveryFee('Gilgit-Baltistan')).toBe(250)
      expect(computeDeliveryFee()).toBe(250)
    })
  })

  describe('computeOrderTotal', () => {
    it('computes subtotal + delivery fee with 0 discount', () => {
      // subtotal 3700 + fee 250 = 3950
      expect(computeOrderTotal(3700, 250, 0)).toBe(3950)
    })

    it('applies discount correctly', () => {
      // subtotal 3700 + fee 250 - discount 200 = 3750
      expect(computeOrderTotal(3700, 250, 200)).toBe(3750)
    })

    it('clamps negative discount to 0 (cannot inflate order total)', () => {
      // negative discount treated as 0: 3700 + 250 - 0 = 3950
      expect(computeOrderTotal(3700, 250, -500)).toBe(3950)
    })

    it('clamps discount to subtotal (total cannot drop below delivery fee)', () => {
      // discount of 5000 on subtotal of 1000 is clamped to 1000: 1000 + 250 - 1000 = 250
      expect(computeOrderTotal(1000, 250, 5000)).toBe(250)
    })
  })
})

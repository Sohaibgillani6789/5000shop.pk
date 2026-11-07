import { describe, it, expect } from 'vitest'
import {
  validateCheckout,
  PAKISTAN_PROVINCES,
} from '@/lib/checkout/validation'
import { PAKISTAN_MOBILE_REGEX } from '@/lib/checkout/constants'

describe('Checkout & Pakistani Phone Validation', () => {
  describe('PAKISTAN_MOBILE_REGEX', () => {
    it('accepts valid 11-digit mobile numbers across all Pakistani carriers', () => {
      // Jazz / Warid
      expect(PAKISTAN_MOBILE_REGEX.test('03001234567')).toBe(true)
      expect(PAKISTAN_MOBILE_REGEX.test('03099999999')).toBe(true)
      expect(PAKISTAN_MOBILE_REGEX.test('03217654321')).toBe(true)
      // Zong
      expect(PAKISTAN_MOBILE_REGEX.test('03121234567')).toBe(true)
      expect(PAKISTAN_MOBILE_REGEX.test('03181234567')).toBe(true)
      // Ufone
      expect(PAKISTAN_MOBILE_REGEX.test('03335555555')).toBe(true)
      expect(PAKISTAN_MOBILE_REGEX.test('03312345678')).toBe(true)
      // Telenor
      expect(PAKISTAN_MOBILE_REGEX.test('03451112233')).toBe(true)
      expect(PAKISTAN_MOBILE_REGEX.test('03409876543')).toBe(true)
      // SCOM (AJK & GB)
      expect(PAKISTAN_MOBILE_REGEX.test('03551234567')).toBe(true)
      expect(PAKISTAN_MOBILE_REGEX.test('03641234567')).toBe(true)
    })

    it('rejects PTCL landlines and invalid area codes', () => {
      // Karachi landline (021)
      expect(PAKISTAN_MOBILE_REGEX.test('02131234567')).toBe(false)
      // Lahore landline (042)
      expect(PAKISTAN_MOBILE_REGEX.test('04231234567')).toBe(false)
      // Islamabad landline (051)
      expect(PAKISTAN_MOBILE_REGEX.test('05131234567')).toBe(false)
      // Invalid 03-prefixes (e.g. 0350, 0370, 0390)
      expect(PAKISTAN_MOBILE_REGEX.test('03501234567')).toBe(false)
      expect(PAKISTAN_MOBILE_REGEX.test('03901234567')).toBe(false)
    })

    it('rejects short, long, or non-numeric strings', () => {
      expect(PAKISTAN_MOBILE_REGEX.test('0300123456')).toBe(false) // 10 digits
      expect(PAKISTAN_MOBILE_REGEX.test('030012345678')).toBe(false) // 12 digits
      expect(PAKISTAN_MOBILE_REGEX.test('0300123456a')).toBe(false)
      expect(PAKISTAN_MOBILE_REGEX.test('')).toBe(false)
    })
  })

  describe('validateCheckout', () => {
    const validPayload = {
      customerName: 'Muhammad Ali',
      phone: '03001234567',
      email: 'ali@example.com',
      province: 'Punjab',
      city: 'Lahore',
      area: 'Gulberg III',
      address: 'House 12, Street 4, Block B',
      paymentMethod: 'cod',
      idempotencyKey: 'idemp-test-123',
      items: [
        {
          productId: 'prod-1',
          slug: 'leather-wallet',
          quantity: 2,
        },
      ],
    }

    it('passes for a valid complete checkout payload', () => {
      const result = validateCheckout(validPayload)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.customerName).toBe('Muhammad Ali')
        expect(result.data.phone).toBe('03001234567')
        expect(result.data.email).toBe('ali@example.com')
        expect(result.data.province).toBe('Punjab')
      }
    })

    it('normalizes international phone prefixes (+92, 0092, 92, dashes, spaces)', () => {
      const variations = [
        '+92 300 1234567',
        '+923001234567',
        '00923001234567',
        '923001234567',
        '0300-1234567',
        '(0300) 1234567',
      ]

      for (const phone of variations) {
        const res = validateCheckout({ ...validPayload, phone })
        expect(res.success).toBe(true)
        if (res.success) {
          expect(res.data.phone).toBe('03001234567')
        }
      }
    })

    it('handles optional email (null, undefined, empty string) cleanly', () => {
      const omittedEmail = { ...validPayload, email: undefined }
      const res1 = validateCheckout(omittedEmail)
      expect(res1.success).toBe(true)
      if (res1.success) expect(res1.data.email).toBeNull()

      const nullEmail = { ...validPayload, email: null }
      const res2 = validateCheckout(nullEmail)
      expect(res2.success).toBe(true)
      if (res2.success) expect(res2.data.email).toBeNull()

      const emptyEmail = { ...validPayload, email: '   ' }
      const res3 = validateCheckout(emptyEmail)
      expect(res3.success).toBe(true)
      if (res3.success) expect(res3.data.email).toBeNull()
    })

    it('rejects invalid email formats when an email is provided', () => {
      const res = validateCheckout({ ...validPayload, email: 'not-an-email' })
      expect(res.success).toBe(false)
      if (!res.success) {
        expect(res.errors['email']).toBeDefined()
      }
    })

    it('validates all 7 canonical Pakistani provinces and territories', () => {
      for (const province of PAKISTAN_PROVINCES) {
        const res = validateCheckout({ ...validPayload, province })
        expect(res.success).toBe(true)
      }

      const invalidProvince = validateCheckout({ ...validPayload, province: 'New York' })
      expect(invalidProvince.success).toBe(false)
    })

    it('rejects customer name shorter than 2 characters or longer than 100 characters', () => {
      const shortName = validateCheckout({ ...validPayload, customerName: 'A' })
      expect(shortName.success).toBe(false)

      const longName = validateCheckout({ ...validPayload, customerName: 'A'.repeat(101) })
      expect(longName.success).toBe(false)
    })

    it('rejects address shorter than 5 characters', () => {
      const shortAddr = validateCheckout({ ...validPayload, address: 'Home' })
      expect(shortAddr.success).toBe(false)
    })

    it('enforces COD-only payment method', () => {
      const cardPay = validateCheckout({ ...validPayload, paymentMethod: 'credit_card' as unknown as 'cod' })
      expect(cardPay.success).toBe(false)
    })

    it('rejects empty items array', () => {
      const emptyItems = validateCheckout({ ...validPayload, items: [] })
      expect(emptyItems.success).toBe(false)
      if (!emptyItems.success) {
        expect(emptyItems.errors['items']).toBeDefined()
      }
    })

    it('rejects duplicate products in items array', () => {
      const dupItems = validateCheckout({
        ...validPayload,
        items: [
          { productId: 'prod-1', slug: 'wallet', quantity: 1 },
          { productId: 'prod-1', slug: 'wallet', quantity: 2 },
        ],
      })
      expect(dupItems.success).toBe(false)
      if (!dupItems.success) {
        expect(dupItems.errors['items']).toBeDefined()
      }
    })

    it('rejects item quantities outside 1 to 10 range', () => {
      const zeroQty = validateCheckout({
        ...validPayload,
        items: [{ productId: 'prod-1', slug: 'wallet', quantity: 0 }],
      })
      expect(zeroQty.success).toBe(false)

      const excessiveQty = validateCheckout({
        ...validPayload,
        items: [{ productId: 'prod-1', slug: 'wallet', quantity: 11 }],
      })
      expect(excessiveQty.success).toBe(false)
    })
  })
})

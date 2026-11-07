import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  clampQuantity,
  isValidCartItem,
  calculateSubtotal,
  calculateItemCount,
  loadCartFromStorage,
  saveCartToStorage,
  CART_STORAGE_KEY,
  PRICE_CEILING,
} from '@/lib/cart/cart-utils'
import type { CartItemType } from '@/lib/cart/cart-types'

describe('Cart Utilities & Quantity Clamping', () => {
  describe('clampQuantity', () => {
    it('returns minimum quantity (1) for values less than 1', () => {
      expect(clampQuantity(0)).toBe(1)
      expect(clampQuantity(-5)).toBe(1)
    })

    it('returns maximum quantity (10) for values exceeding 10', () => {
      expect(clampQuantity(11)).toBe(10)
      expect(clampQuantity(100)).toBe(10)
    })

    it('floors decimal quantities to the nearest lower integer', () => {
      expect(clampQuantity(3.7)).toBe(3)
      expect(clampQuantity(9.9)).toBe(9)
      expect(clampQuantity(0.8)).toBe(1)
    })

    it('handles NaN gracefully by returning minimum quantity', () => {
      expect(clampQuantity(NaN)).toBe(1)
    })

    it('preserves valid integer quantities between 1 and 10', () => {
      for (let q = 1; q <= 10; q++) {
        expect(clampQuantity(q)).toBe(q)
      }
    })
  })

  describe('isValidCartItem', () => {
    const validSample: CartItemType = {
      productId: 'prod-123',
      slug: 'test-item',
      title: 'Premium Leather Wallet',
      price: 1850,
      imageUrl: '/images/wallet.jpg',
      quantity: 2,
    }

    it('accepts completely valid cart items', () => {
      expect(isValidCartItem(validSample)).toBe(true)
    })

    it('accepts valid cart items with null imageUrl', () => {
      expect(isValidCartItem({ ...validSample, imageUrl: null })).toBe(true)
    })

    it('rejects items with empty or whitespace-only strings', () => {
      expect(isValidCartItem({ ...validSample, productId: '' })).toBe(false)
      expect(isValidCartItem({ ...validSample, slug: '   ' })).toBe(false)
      expect(isValidCartItem({ ...validSample, title: '' })).toBe(false)
    })

    it('rejects prices exceeding the ₨5,000 ceiling or negative prices', () => {
      expect(isValidCartItem({ ...validSample, price: PRICE_CEILING + 1 })).toBe(false)
      expect(isValidCartItem({ ...validSample, price: -10 })).toBe(false)
      expect(isValidCartItem({ ...validSample, price: NaN })).toBe(false)
    })

    it('rejects quantities outside 1 to 10 bounds or non-integers', () => {
      expect(isValidCartItem({ ...validSample, quantity: 0 })).toBe(false)
      expect(isValidCartItem({ ...validSample, quantity: 11 })).toBe(false)
      expect(isValidCartItem({ ...validSample, quantity: 2.5 })).toBe(false)
    })

    it('rejects null, non-objects, and primitives', () => {
      expect(isValidCartItem(null)).toBe(false)
      expect(isValidCartItem(undefined)).toBe(false)
      expect(isValidCartItem('string')).toBe(false)
      expect(isValidCartItem(123)).toBe(false)
    })
  })

  describe('calculateSubtotal & calculateItemCount', () => {
    const items: CartItemType[] = [
      {
        productId: '1',
        slug: 'a',
        title: 'Item A',
        price: 1500,
        imageUrl: null,
        quantity: 2,
      },
      {
        productId: '2',
        slug: 'b',
        title: 'Item B',
        price: 2450,
        imageUrl: null,
        quantity: 1,
      },
    ]

    it('calculates total cart line amount accurately', () => {
      // 1500 * 2 + 2450 * 1 = 3000 + 2450 = 5450
      expect(calculateSubtotal(items)).toBe(5450)
    })

    it('calculates total item units count accurately', () => {
      // 2 + 1 = 3
      expect(calculateItemCount(items)).toBe(3)
    })

    it('returns 0 for empty arrays', () => {
      expect(calculateSubtotal([])).toBe(0)
      expect(calculateItemCount([])).toBe(0)
    })
  })

  describe('LocalStorage Cart Persistence', () => {
    const mockStorage: Record<string, string> = {}

    beforeEach(() => {
      for (const k in mockStorage) delete mockStorage[k]

      const fakeLocalStorage = {
        getItem: vi.fn((key: string) => mockStorage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key]
        }),
        clear: vi.fn(() => {
          for (const k in mockStorage) delete mockStorage[k]
        }),
      }

      vi.stubGlobal('window', {
        localStorage: fakeLocalStorage,
      })
    })

    it('returns empty array when localStorage is empty', () => {
      expect(loadCartFromStorage()).toEqual([])
    })

    it('recovers gracefully from corrupted non-JSON strings without throwing', () => {
      mockStorage[CART_STORAGE_KEY] = 'CORRUPTED_{{DATA'
      const loaded = loadCartFromStorage()
      expect(loaded).toEqual([])
    })

    it('recovers gracefully from non-array JSON objects', () => {
      mockStorage[CART_STORAGE_KEY] = JSON.stringify({ not: 'an array' })
      expect(loadCartFromStorage()).toEqual([])
    })

    it('filters out corrupted items while recovering valid items', () => {
      const mixed = [
        {
          productId: 'valid-1',
          slug: 'valid-slug',
          title: 'Valid Item',
          price: 999,
          imageUrl: null,
          quantity: 1,
        },
        {
          productId: '', // Invalid!
          slug: 'invalid',
          price: 999999, // Exceeds ₨5,000!
          quantity: 0,
        },
      ]
      mockStorage[CART_STORAGE_KEY] = JSON.stringify(mixed)

      const recovered = loadCartFromStorage()
      expect(recovered).toHaveLength(1)
      expect(recovered[0].productId).toBe('valid-1')
    })

    it('persists sanitized items via saveCartToStorage', () => {
      const itemsToSave: CartItemType[] = [
        {
          productId: 'p-1',
          slug: 's-1',
          title: 'Item 1',
          price: 1200,
          imageUrl: null,
          quantity: 3,
        },
      ]
      saveCartToStorage(itemsToSave)

      expect(mockStorage[CART_STORAGE_KEY]).toBeDefined()
      const parsed = JSON.parse(mockStorage[CART_STORAGE_KEY])
      expect(parsed).toHaveLength(1)
      expect(parsed[0].productId).toBe('p-1')
    })
  })
})

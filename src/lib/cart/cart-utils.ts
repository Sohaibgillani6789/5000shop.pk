/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Cart Utilities & LocalStorage Persistence Engine
 * ──────────────────────────────────────────────────────────────
 */

import type { CartItemType } from './cart-types';

export const CART_STORAGE_KEY = '5000shop_cart_v1';
export const MIN_ITEM_QUANTITY = 1;
export const MAX_ITEM_QUANTITY = 10;
export const PRICE_CEILING = 5000;

/**
 * Validates whether an unknown object conforms strictly to CartItemType.
 */
export function isValidCartItem(item: unknown): item is CartItemType {
  if (!item || typeof item !== 'object') return false;

  const candidate = item as Record<string, unknown>;

  const hasValidId = typeof candidate.productId === 'string' && candidate.productId.trim().length > 0;
  const hasValidSlug = typeof candidate.slug === 'string' && candidate.slug.trim().length > 0;
  const hasValidTitle = typeof candidate.title === 'string' && candidate.title.trim().length > 0;
  const hasValidPrice =
    typeof candidate.price === 'number' &&
    !Number.isNaN(candidate.price) &&
    candidate.price >= 0 &&
    candidate.price <= PRICE_CEILING;
  const hasValidQuantity =
    typeof candidate.quantity === 'number' &&
    Number.isInteger(candidate.quantity) &&
    candidate.quantity >= MIN_ITEM_QUANTITY &&
    candidate.quantity <= MAX_ITEM_QUANTITY;
  const hasValidImage = candidate.imageUrl === null || typeof candidate.imageUrl === 'string';

  return (
    hasValidId &&
    hasValidSlug &&
    hasValidTitle &&
    hasValidPrice &&
    hasValidQuantity &&
    hasValidImage
  );
}

/**
 * Safely reads and validates cart items from browser localStorage.
 * Defensive against corrupted or tampered JSON.
 */
export function loadCartFromStorage(): CartItemType[] {
  if (typeof window === 'undefined') return [];

  try {
    const rawData = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawData) return [];

    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize each item defensively
    const validItems: CartItemType[] = [];
    for (const item of parsed) {
      if (isValidCartItem(item)) {
        validItems.push({
          productId: item.productId,
          slug: item.slug,
          title: item.title,
          price: Number(item.price),
          imageUrl: item.imageUrl || null,
          quantity: clampQuantity(item.quantity),
        });
      }
    }

    return validItems;
  } catch (error) {
    // If localStorage read or JSON parse fails, fail safe to empty cart
    console.warn('[5000shop Cart] Corrupted storage recovered, resetting cart:', error);
    return [];
  }
}

/**
 * Persists cart items to browser localStorage.
 */
export function saveCartToStorage(items: CartItemType[]): void {
  if (typeof window === 'undefined') return;

  try {
    const sanitized = items
      .filter(isValidCartItem)
      .map(item => ({
        productId: item.productId,
        slug: item.slug,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: clampQuantity(item.quantity),
      }));

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.error('[5000shop Cart] Failed to persist cart to localStorage:', error);
  }
}

/**
 * Clamps quantity strictly between MIN_ITEM_QUANTITY and MAX_ITEM_QUANTITY.
 */
export function clampQuantity(quantity: number): number {
  const integerVal = Math.floor(quantity);
  if (Number.isNaN(integerVal)) return MIN_ITEM_QUANTITY;
  return Math.min(MAX_ITEM_QUANTITY, Math.max(MIN_ITEM_QUANTITY, integerVal));
}

/**
 * Computes financial subtotal for cart items.
 */
export function calculateSubtotal(items: CartItemType[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Computes total line item count.
 */
export function calculateItemCount(items: CartItemType[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

// ── React 19 External Store Synchronization ──────────────────

let memoryCart: CartItemType[] | null = null;
const cartListeners = new Set<() => void>();

function notifyCartListeners(): void {
  cartListeners.forEach((listener) => listener());
}

export function getCartSnapshot(): CartItemType[] {
  if (typeof window === "undefined") return [];
  if (memoryCart === null) {
    memoryCart = loadCartFromStorage();
  }
  return memoryCart;
}

const EMPTY_CART_SNAPSHOT: CartItemType[] = [];
export function getCartServerSnapshot(): CartItemType[] {
  return EMPTY_CART_SNAPSHOT;
}

export function setCartItems(items: CartItemType[]): void {
  memoryCart = items;
  saveCartToStorage(items);
  notifyCartListeners();
}

export function subscribeToCart(callback: () => void): () => void {
  cartListeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      memoryCart = loadCartFromStorage();
      callback();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    cartListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Cart Type Definitions
 * ──────────────────────────────────────────────────────────────
 */

export interface CartItemType {
  productId: string;
  slug: string;
  title: string;
  price: number; // Display estimate only; server re-verifies on checkout
  imageUrl: string | null;
  quantity: number; // Integer between 1 and 10
}

export interface CartContextValue {
  items: CartItemType[];
  isHydrated: boolean;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItemType, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

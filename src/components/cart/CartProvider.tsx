"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartItemType, CartContextValue } from "@/lib/cart/cart-types";
import {
  getCartSnapshot,
  getCartServerSnapshot,
  setCartItems,
  subscribeToCart,
  clampQuantity,
  calculateSubtotal,
  calculateItemCount,
  MAX_ITEM_QUANTITY,
} from "@/lib/cart/cart-utils";

const CartContext = createContext<CartContextValue | null>(null);

const emptySubscribe = () => () => {};

const EMPTY_ITEMS: CartItemType[] = [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // ── React 19 Hydration Integrity via useSyncExternalStore ──
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const rawItems = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  const items = useMemo(
    () => (isHydrated ? rawItems : EMPTY_ITEMS),
    [isHydrated, rawItems]
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (item: Omit<CartItemType, "quantity">, quantity: number = 1) => {
      const addQty = clampQuantity(quantity);
      const currentItems = getCartSnapshot();

      const existingIndex = currentItems.findIndex(
        (p) => p.productId === item.productId
      );

      let updated: CartItemType[];
      if (existingIndex > -1) {
        updated = [...currentItems];
        const existing = updated[existingIndex];
        const newQty = Math.min(MAX_ITEM_QUANTITY, existing.quantity + addQty);
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
        };
      } else {
        updated = [
          ...currentItems,
          {
            ...item,
            quantity: addQty,
          },
        ];
      }

      setCartItems(updated);
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    const currentItems = getCartSnapshot();
    const updated = currentItems.filter((i) => i.productId !== productId);
    setCartItems(updated);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId);
        return;
      }

      const clamped = clampQuantity(quantity);
      const currentItems = getCartSnapshot();
      const updated = currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity: clamped } : item
      );
      setCartItems(updated);
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const itemCount = useMemo(
    () => (isHydrated ? calculateItemCount(items) : 0),
    [items, isHydrated]
  );

  const subtotal = useMemo(
    () => (isHydrated ? calculateSubtotal(items) : 0),
    [items, isHydrated]
  );

  const contextValue: CartContextValue = useMemo(
    () => ({
      items,
      isHydrated,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      isHydrated,
      isOpen,
      itemCount,
      subtotal,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

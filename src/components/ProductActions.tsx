"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Minus, Plus, AlertCircle, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { MAX_ITEM_QUANTITY, MIN_ITEM_QUANTITY } from "@/lib/cart/cart-utils";

interface ProductActionsProps {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  inStock: boolean;
  /** Optional stock ceiling (if inventory count is ever exposed). Capped at MAX_ITEM_QUANTITY. */
  maxStock?: number;
}

export default function ProductActions({
  productId,
  slug,
  title,
  price,
  imageUrl,
  inStock,
  maxStock,
}: ProductActionsProps) {
  const router = useRouter();
  const { addItem, closeCart } = useCart();
  const [quantity, setQuantity] = useState<number>(MIN_ITEM_QUANTITY);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Effective ceiling: respect stock if provided, never exceed cart hard limit
  const maxQty = Math.max(
    MIN_ITEM_QUANTITY,
    Math.min(MAX_ITEM_QUANTITY, maxStock ?? MAX_ITEM_QUANTITY)
  );

  // Clear pending "Added" feedback timer on unmount (avoids setState on unmounted)
  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    };
  }, []);

  // Prefetch checkout so Buy Now navigation is instant
  useEffect(() => {
    if (inStock) router.prefetch("/checkout");
  }, [inStock, router]);

  const increment = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setQuantity((prev) => Math.min(maxQty, prev + 1));
    },
    [maxQty]
  );

  const decrement = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(MIN_ITEM_QUANTITY, prev - 1));
  }, []);

  const buildPayload = useCallback(
    () => ({
      productId,
      slug,
      title,
      price,
      imageUrl: imageUrl || null,
    }),
    [productId, slug, title, price, imageUrl]
  );

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;

    // Synchronous external-store write → Navbar badge updates in the same tick
    addItem(buildPayload(), quantity);

    setIsAdded(true);
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || isBuying) return;

    setIsBuying(true);
    // Persist to cart (localStorage + memory store) WITHOUT opening the drawer,
    // otherwise the drawer/backdrop overlays the checkout page after navigation.
    addItem(buildPayload(), quantity, { openDrawer: false });
    closeCart();

    // Direct routing to checkout stage
    router.push("/checkout");
  };

  if (!inStock) {
    return (
      <div className="w-full p-4 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-600 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-neutral-500 shrink-0" />
        <span className="text-sm font-semibold">
          This product is currently out of stock. Check back soon!
        </span>
      </div>
    );
  }

  const subtotal = price * quantity;

  return (
    <div className="w-full flex flex-col gap-4 font-['Outfit',var(--font-outfit),sans-serif]">
      {/* ── Quantity Selector & Subtotal ── */}
      <div className="flex items-center justify-between py-2 border-y border-[rgba(180,150,120,0.2)]">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4A3B32]">
            Quantity
          </span>
          <div className="inline-flex items-center bg-white border border-[#D5C9B8] rounded-full p-1 shadow-2xs">
            <button
              type="button"
              onClick={decrement}
              disabled={quantity <= MIN_ITEM_QUANTITY}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1108] hover:bg-[#F5F0E6] disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Minus size={15} strokeWidth={2.5} />
            </button>
            <span
              className="w-10 text-center font-bold text-sm text-[#1A1108]"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={increment}
              disabled={quantity >= maxQty}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1108] hover:bg-[#F5F0E6] disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-semibold text-[#8B7B70] uppercase tracking-wider block">
            Subtotal
          </span>
          <span className="text-base font-extrabold text-[#1A1108]">
            ₨ {subtotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-3.5 px-6 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#DF5E03] text-white hover:text-black font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 group-hover:text-black" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isBuying}
          aria-busy={isBuying}
          className="w-full py-3.5 px-6 rounded-full bg-[#F47514] hover:bg-[#DF5E03] active:bg-[#B44100] text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group disabled:opacity-70 disabled:cursor-wait"
        >
          <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{isBuying ? "Redirecting…" : "Buy Now"}</span>
        </button>
      </div>
    </div>
  );
}

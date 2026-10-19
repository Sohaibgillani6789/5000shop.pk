"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Minus, Plus, AlertCircle, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

interface ProductActionsProps {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl?: string | null;
  inStock: boolean;
}

export default function ProductActions({
  productId,
  slug,
  title,
  price,
  imageUrl,
  inStock,
}: ProductActionsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const increment = () => setQuantity((prev) => Math.min(10, prev + 1));
  const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!inStock) return;

    addItem(
      {
        productId,
        slug,
        title,
        price,
        imageUrl: imageUrl || null,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!inStock) return;

    addItem(
      {
        productId,
        slug,
        title,
        price,
        imageUrl: imageUrl || null,
      },
      quantity
    );

    // Direct routing to cart/checkout stage
    router.push("/cart");
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
              disabled={quantity <= 1}
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
              disabled={quantity >= 10}
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
          className="w-full py-3.5 px-6 rounded-full bg-[#F47514] hover:bg-[#DF5E03] active:bg-[#B44100] text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
        >
          <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}

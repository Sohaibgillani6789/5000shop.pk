"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemType } from "@/lib/cart/cart-types";
import { useCart } from "./CartProvider";

interface CartItemProps {
  item: CartItemType;
  onNavigate?: () => void;
}

export default function CartItem({ item, onNavigate }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [imgSrc, setImgSrc] = useState(item.imageUrl || "/images/hero-sneakers.png");

  const lineSubtotal = item.price * item.quantity;
  const isPng = imgSrc.endsWith(".png");

  return (
    <div className="flex items-center gap-3.5 py-4 border-b border-[rgba(244,117,20,0.12)] last:border-b-0 font-['Outfit',var(--font-outfit),sans-serif]">
      {/* ── Product Thumbnail ── */}
      <Link
        href={`/product/${item.slug}`}
        onClick={onNavigate}
        className="relative w-20 h-20 rounded-xl bg-white border border-[#E5DAC8] shrink-0 overflow-hidden flex items-center justify-center p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F47514]"
      >
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          sizes="80px"
          onError={() => setImgSrc("/images/hero-sneakers.png")}
          style={{
            objectFit: isPng ? "contain" : "cover",
            padding: isPng ? "0.25rem" : "0",
          }}
          className="rounded-lg"
        />
      </Link>

      {/* ── Details & Controls ── */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${item.slug}`}
            onClick={onNavigate}
            className="text-sm font-bold text-neutral-900 hover:text-[#F47514] transition-colors line-clamp-1"
          >
            {item.title}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            aria-label={`Remove ${item.title} from cart`}
            className="text-neutral-400 hover:text-red-600 transition-colors p-1 -mr-1 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="text-xs text-neutral-500 font-semibold mt-0.5">
          ₨ {item.price.toLocaleString()} each
        </div>

        <div className="flex items-center justify-between mt-2 pt-1">
          {/* Quantity Stepper */}
          <div className="inline-flex items-center bg-[#FAF6F0] border border-[#D5C9B8] rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              aria-label={`Decrease quantity of ${item.title}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-800 hover:bg-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span
              className="w-7 text-center text-xs font-bold text-neutral-900"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= 10}
              aria-label={`Increase quantity of ${item.title}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-neutral-800 hover:bg-white transition-colors cursor-pointer disabled:opacity-40"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Line Subtotal */}
          <div className="text-sm font-extrabold text-neutral-900">
            ₨ {lineSubtotal.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

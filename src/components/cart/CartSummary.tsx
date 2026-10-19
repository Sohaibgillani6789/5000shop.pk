"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "./CartProvider";

interface CartSummaryProps {
  onCheckoutClick?: () => void;
  showCheckoutButton?: boolean;
}

export const FREE_DELIVERY_THRESHOLD = 5000;
export const STANDARD_DELIVERY_FEE = 200;

export default function CartSummary({
  onCheckoutClick,
  showCheckoutButton = true,
}: CartSummaryProps) {
  const { subtotal, itemCount } = useCart();

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE) : 0;
  const estimatedTotal = subtotal + deliveryFee;

  const remainingForFree = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <div className="w-full flex flex-col gap-3 font-['Outfit',var(--font-outfit),sans-serif]">
      {/* ── Free Delivery Progress Indicator ── */}
      {subtotal > 0 && (
        <div className="p-3 rounded-xl bg-[#FFF6EE] border border-[#F47514]/25 text-xs text-[#8C3A02]">
          {isFreeDelivery ? (
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <Truck size={15} className="shrink-0" />
              <span>🎉 Congratulations! Your order qualifies for FREE Delivery!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 font-semibold">
              <Truck size={15} className="text-[#F47514] shrink-0" />
              <span>
                Add <span className="font-bold text-[#F47514]">₨ {remainingForFree.toLocaleString()}</span> more for FREE Delivery!
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Financial Ledger ── */}
      <div className="space-y-2 py-3 border-y border-[rgba(244,117,20,0.15)] text-sm">
        <div className="flex justify-between items-center text-neutral-600">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
          <span className="font-bold text-neutral-900">₨ {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-neutral-600">
          <span className="flex items-center gap-1.5">
            <span>Estimated Delivery (COD)</span>
          </span>
          <span className="font-semibold text-neutral-900">
            {isFreeDelivery ? (
              <span className="text-emerald-700 font-extrabold uppercase text-xs">FREE</span>
            ) : (
              `₨ ${deliveryFee.toLocaleString()}`
            )}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-[rgba(0,0,0,0.06)] text-base font-extrabold text-neutral-950">
          <span>Estimated Total</span>
          <span className="text-lg text-[#DF5E03]">₨ {estimatedTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* ── Trust Badges ── */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 px-1">
        <span className="flex items-center gap-1 text-[#8C3A02]">
          <ShieldCheck size={14} className="text-[#F47514]" />
          Cash on Delivery
        </span>
        <span className="flex items-center gap-1 text-neutral-500">
          <Sparkles size={13} className="text-[#F47514]" />
          All under ₨5,000
        </span>
      </div>

      {/* ── Checkout Button ── */}
      {showCheckoutButton && (
        <div className="pt-1">
          <Link
            href="/checkout"
            onClick={onCheckoutClick}
            className="w-full py-3.5 px-6 rounded-full bg-[#F47514] hover:bg-[#DF5E03] active:bg-[#B44100] text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      )}
    </div>
  );
}

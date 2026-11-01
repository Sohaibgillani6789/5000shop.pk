"use client";

import React from "react";
import Image from "next/image";
import { Package, ShieldCheck, Truck, Sparkles } from "lucide-react";
import type { CartItemType } from "@/lib/cart/cart-types";
import { STANDARD_DELIVERY_FEE_PKR } from "@/lib/checkout/constants";

interface CheckoutSummaryProps {
  items: CartItemType[];
  subtotal: number;
}

export default function CheckoutSummary({ items, subtotal }: CheckoutSummaryProps) {
  const deliveryFee = STANDARD_DELIVERY_FEE_PKR;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-sm font-['Outfit',var(--font-outfit),sans-serif] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(244,117,20,0.15)]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C3A02] flex items-center gap-1.5">
          <Package size={14} className="text-[#F47514]" />
          <span>Order Summary ({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h2>
        <span className="text-xs font-semibold text-neutral-500">
          All items ≤ ₨5,000
        </span>
      </div>

      {/* ── Line Items List ── */}
      <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.productId} className="py-3 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <Package size={20} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-neutral-900 truncate">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Qty: <span className="font-semibold text-neutral-800">{item.quantity}</span> × ₨ {item.price.toLocaleString()}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-extrabold text-neutral-950">
                ₨ {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Ledger ── */}
      <div className="space-y-2.5 pt-4 border-t border-[rgba(244,117,20,0.15)] text-sm">
        <div className="flex justify-between items-center text-neutral-600">
          <span>Subtotal</span>
          <span className="font-bold text-neutral-900">₨ {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-neutral-600">
          <span className="flex items-center gap-1.5">
            <Truck size={14} className="text-[#F47514]" />
            <span>Standard Courier Delivery (COD)</span>
          </span>
          <span className="font-bold text-neutral-900">
            ₨ {deliveryFee.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-neutral-200 text-base font-black text-neutral-950">
          <span>Total (Pay on Delivery)</span>
          <span className="text-xl text-[#DF5E03]">
            ₨ {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* ── Trust & Policy Highlights ── */}
      <div className="rounded-2xl p-4 bg-[#FFF9F3] border border-[#F47514]/20 space-y-2 text-xs text-neutral-700">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#DF5E03] shrink-0" />
          <span className="font-semibold">Pay cash strictly upon physical inspection</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#F47514] shrink-0" />
          <span>Delivery across Pakistan via verified courier partners</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, RefreshCw, Sparkles } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, isHydrated, itemCount, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#050708] text-white flex flex-col font-['Outfit',var(--font-outfit),sans-serif]">
      {/* ── Dark Hero Header ── */}
      <header className="relative pt-28 pb-10 sm:pt-36 sm:pb-14 border-b border-[rgba(244,117,20,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb navigation"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4"
          >
            <Link
              href="/"
              className="hover:text-[#F47514] transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
          </nav>

          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                Shopping Cart
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                Review your items before proceeding to secure Cash on Delivery checkout.
              </p>
            </div>

            {isHydrated && items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear All Items
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Cart Stage ── */}
      <main
        className="flex-1 py-10 sm:py-16"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          color: "#1A1108",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isHydrated ? (
            /* Hydration loading skeleton */
            <div className="py-20 text-center text-neutral-400">
              <div className="w-10 h-10 border-4 border-[#F47514] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs uppercase font-bold tracking-wider">
                Loading Your Cart...
              </p>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart View */
            <div className="max-w-md mx-auto py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-[#FFF5EB] border border-[#F47514]/25 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <ShoppingBag size={44} className="text-[#F47514]" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
                Explore our curated catalog across Fashion, Beauty, Electronics, Living Space, and Accessories — every single item under ₨5,000.
              </p>
              <Link
                href="/#categories"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#DF5E03] text-white hover:text-black font-extrabold text-sm uppercase tracking-wider shadow-xl transition-all"
              >
                <span>Browse Categories</span>
              </Link>
            </div>
          ) : (
            /* Active Cart Two-Column Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Line Items (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[rgba(244,117,20,0.15)] mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8C3A02]">
                    Order Items ({itemCount})
                  </span>
                  <span className="text-xs font-semibold text-neutral-500">
                    Max 10 per line item
                  </span>
                </div>

                <div className="divide-y divide-[rgba(244,117,20,0.12)]">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              </div>

              {/* Right Column: Ledger & Actions (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-5 sticky top-28">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-sm">
                  <h3 className="text-base font-extrabold uppercase tracking-wide text-neutral-950 mb-4 pb-3 border-b border-[rgba(244,117,20,0.15)]">
                    Order Summary
                  </h3>
                  <CartSummary showCheckoutButton={true} />
                </div>

                {/* Marketplace Assurances */}
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-[#4A3B32]">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC8] flex items-center gap-2.5 shadow-2xs">
                    <Truck size={18} className="text-[#F47514] shrink-0" />
                    <span>Nationwide COD in 2-4 Days</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC8] flex items-center gap-2.5 shadow-2xs">
                    <ShieldCheck size={18} className="text-[#F47514] shrink-0" />
                    <span>Strict ₨5,000 Price Ceiling</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC8] flex items-center gap-2.5 shadow-2xs">
                    <RefreshCw size={18} className="text-[#F47514] shrink-0" />
                    <span>7-Day Hassle-Free Returns</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-[#E5DAC8] flex items-center gap-2.5 shadow-2xs">
                    <Sparkles size={18} className="text-[#F47514] shrink-0" />
                    <span>100% Quality Audited</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartDrawer() {
  const { isOpen, closeCart, items, itemCount, clearCart } = useCart();

  // Escape key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = useCallback(() => {
    closeCart();
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1200] overflow-hidden font-['Outfit',var(--font-outfit),sans-serif]">
          {/* ── Backdrop ── */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* ── Slide-over Drawer Panel ── */}
          <motion.aside
            key="cart-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart Drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#FAF8F5] text-neutral-900 shadow-2xl flex flex-col z-[1210] border-l border-[#E5DAC8]"
          >
            {/* ── Drawer Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(244,117,20,0.18)] bg-white/80 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-[#F47514]" />
                <h2 className="text-base font-extrabold uppercase tracking-wide text-neutral-950">
                  Your Cart
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F47514]/20 text-[#8C3A02]">
                  {itemCount}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart drawer"
                  className="p-1.5 rounded-full text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* ── Drawer Body ── */}
            {items.length === 0 ? (
              /* Empty Cart State */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-[#FFF5EB] border border-[#F47514]/20 flex items-center justify-center mb-4">
                  <ShoppingBag size={36} className="text-[#F47514]" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mb-6">
                  Discover Pakistan&apos;s best deals on Fashion, Tech, Beauty & Home — all strictly under ₨5,000.
                </p>
                <Link
                  href="/#categories"
                  onClick={handleLinkClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#DF5E03] text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              /* Populated Items List */
              <>
                <div className="flex-1 overflow-y-auto px-6 divide-y divide-[rgba(244,117,20,0.1)]">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onNavigate={handleLinkClick}
                    />
                  ))}
                </div>

                {/* ── Drawer Footer / Summary ── */}
                <div className="p-6 bg-white border-t border-[rgba(244,117,20,0.18)] shadow-lg">
                  <CartSummary onCheckoutClick={handleLinkClick} />
                  <div className="mt-2 text-center">
                    <Link
                      href="/cart"
                      onClick={handleLinkClick}
                      className="text-xs font-bold text-neutral-500 hover:text-[#F47514] underline decoration-[#F47514]/40 hover:decoration-[#F47514] transition-colors"
                    >
                      View Full Cart Details
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Checkout — 5 Hazaar Tak | Cash on Delivery",
  description:
    "Complete your Cash on Delivery order across Pakistan. Zero upfront payment, genuine products under ₨5,000.",
};

export default function CheckoutPage() {
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
              href="/cart"
              className="hover:text-[#F47514] transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
            >
              <ArrowLeft size={14} />
              <span>Back to Cart</span>
            </Link>
          </nav>

          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F47514] mb-2">
                <Lock size={13} />
                <span>100% Secure Checkout</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                Delivery &amp; Checkout
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                Cash on Delivery (COD) across Pakistan. No credit card required.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Zero Upfront Payment • Pay on Arrival</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Stage ── */}
      <main
        className="flex-1 py-10 sm:py-16"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          color: "#1A1108",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckoutForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}

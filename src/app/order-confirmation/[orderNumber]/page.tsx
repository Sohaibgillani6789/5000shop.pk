import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  MessageCircle,
  Home,
  ShoppingBag,
  Package,
  MapPin,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmation — ${orderNumber} | 5 Hazaar Tak`,
    description: `Order ${orderNumber} details and Cash on Delivery tracking information.`,
  };
}

interface OrderConfirmationItem {
  product_title: string;
  product_slug: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url: string | null;
}

interface OrderConfirmationData {
  order_number: string;
  customer_name: string;
  city: string;
  province: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  order_status: string;
  created_at: string;
  items: OrderConfirmationItem[];
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Assalam-o-Alaikum! I just placed order ${orderNumber} on 5 Hazaar Tak.`
  )}`;

  let orderData: OrderConfirmationData | null = null;

  // Validate token format before database call to prevent Postgres UUID parse error
  if (token && UUID_REGEX.test(token)) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("get_order_confirmation", {
        p_order_number: orderNumber,
        p_token: token,
      });

      if (!error && data) {
        orderData = data as OrderConfirmationData;
      }
    } catch {
      orderData = null;
    }
  }

  // ── Case 1: Token Missing, Invalid, or Not Matching (Safe Generic View) ──
  if (!orderData) {
    return (
      <div className="min-h-screen bg-[#050708] text-white flex flex-col font-['Outfit',var(--font-outfit),sans-serif]">
        <main
          className="flex-1 py-16 sm:py-24"
          style={{
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
            color: "#1A1108",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DAC8] shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-[#FFF5EB] border border-[#F47514]/30 flex items-center justify-center mx-auto mb-6 text-[#DF5E03]">
                <ShieldCheck size={40} />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-[#8C3A02] bg-[#FFF5EB] px-3.5 py-1 rounded-full border border-[#F47514]/20">
                Order Received
              </span>

              <h1 className="mt-4 text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
                Order #{orderNumber}
              </h1>

              <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
                Your order has been recorded in our system. For privacy and security reasons, full itemized details are only accessible via the direct verification link generated at checkout.
              </p>

              <div className="mt-8 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DAC8] text-left text-xs text-neutral-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-neutral-900">
                  <Lock size={14} className="text-[#F47514]" />
                  <span>Next Steps for Your Order:</span>
                </div>
                <p>
                  1. Our dispatch center will call or message your mobile number to confirm before shipping.
                </p>
                <p>
                  2. Cash on Delivery (COD) payment is strictly collected when the courier arrives.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg transition-all"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Support</span>
                </a>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#DF5E03] text-white hover:text-black font-extrabold text-sm uppercase tracking-wider transition-all"
                >
                  <Home size={16} />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Case 2: Authenticated with Token (Full Safe Order Confirmation) ──
  const formattedDate = new Date(orderData.created_at).toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#050708] text-white flex flex-col font-['Outfit',var(--font-outfit),sans-serif]">
      {/* ── Dark Hero Celebration Header ── */}
      <header className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 border-b border-[rgba(244,117,20,0.18)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 size={42} strokeWidth={2.2} />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F47514] mb-2">
            <span>Cash on Delivery Order Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Thank You, {orderData.customer_name}!
          </h1>

          <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto">
            Your order has been placed. We are preparing it for delivery to{" "}
            <span className="font-bold text-white">
              {orderData.city}, {orderData.province}
            </span>
            .
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3">
            <div className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white tracking-wider">
              ORDER #{orderData.order_number}
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              COD • Pay on Delivery
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Confirmation Stage ── */}
      <main
        className="flex-1 py-10 sm:py-16"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          color: "#1A1108",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* ── 3-Step Dispatch Timeline ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C3A02] mb-6 flex items-center gap-1.5">
              <Clock size={14} className="text-[#F47514]" />
              <span>What Happens Next</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF5EB] border border-[#F47514]/30 flex items-center justify-center font-black text-sm text-[#DF5E03]">
                  1
                </div>
                <h3 className="font-bold text-sm text-neutral-900">
                  Phone Verification
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Our dispatch center will call or message your WhatsApp to confirm parcel delivery before dispatch.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF5EB] border border-[#F47514]/30 flex items-center justify-center font-black text-sm text-[#DF5E03]">
                  2
                </div>
                <h3 className="font-bold text-sm text-neutral-900">
                  Courier Dispatch
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Packed securely and handed to our trusted courier partners with SMS tracking updates.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center font-black text-sm text-emerald-700">
                  3
                </div>
                <h3 className="font-bold text-sm text-neutral-900">
                  Inspect &amp; Pay Cash
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Pay the exact amount of ₨ {orderData.total.toLocaleString()} to the courier rider upon delivery.
                </p>
              </div>
            </div>
          </div>

          {/* ── Order Summary Card ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DAC8] shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[rgba(244,117,20,0.15)]">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C3A02]">
                  Order Details
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">Placed on {formattedDate}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-700">
                <MapPin size={14} className="text-[#F47514]" />
                <span className="font-semibold">
                  {orderData.city}, {orderData.province}
                </span>
              </div>
            </div>

            {/* Line items list */}
            <div className="divide-y divide-neutral-100">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="py-3.5 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.product_title}
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
                      {item.product_title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Qty: <span className="font-semibold text-neutral-800">{item.quantity}</span> × ₨ {Number(item.unit_price).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-neutral-950">
                      ₨ {Number(item.line_total).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Ledger */}
            <div className="space-y-2 pt-4 border-t border-[rgba(244,117,20,0.15)] text-sm">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">
                  ₨ {Number(orderData.subtotal).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#F47514]" />
                  <span>Delivery Charges (COD)</span>
                </span>
                <span className="font-bold text-neutral-900">
                  ₨ {Number(orderData.delivery_fee).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-neutral-200 text-lg font-black text-neutral-950">
                <span>Total Payable on Delivery</span>
                <span className="text-2xl text-[#DF5E03]">
                  ₨ {Number(orderData.total).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Actions & Support Bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all"
            >
              <MessageCircle size={18} />
              <span>Track / Verify on WhatsApp</span>
            </a>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <Link
                href="/#categories"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white border border-[#E5DAC8] hover:border-[#F47514] text-neutral-800 font-extrabold text-sm uppercase tracking-wider transition-all"
              >
                <ShoppingBag size={16} />
                <span>Categories</span>
              </Link>

              <Link
                href="/"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#DF5E03] text-white hover:text-black font-extrabold text-sm uppercase tracking-wider transition-all"
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

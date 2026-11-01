import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, CheckCircle2, HelpCircle, PhoneCall, ShieldAlert } from 'lucide-react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | 5 Hazaar Tak',
  description:
    'Standard return, exchange, and refund guidelines for orders placed on 5 Hazaar Tak (5000shop.pk). Transparent 7-day inspection window with hassle-free WhatsApp support.',
}

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050708] text-white selection:bg-[#F47514] selection:text-white">
      {/* Header Bar */}
      <header className="border-b border-[rgba(255,220,180,0.15)] bg-[#0A0704]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5B84C] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          <span className="text-xs font-semibold text-[#A8988B] uppercase tracking-wider">
            Official Store Policies
          </span>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center font-['Outfit',var(--font-outfit),sans-serif]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold uppercase tracking-widest text-[#E5B84C] mb-4">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Fair &amp; Transparent</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
          Return &amp; Exchange Policy
        </h1>
        <p className="text-sm sm:text-base text-[#D5C9B8] max-w-2xl mx-auto leading-relaxed">
          We want you to shop with absolute peace of mind. Every product on 5 Hazaar Tak is strictly capped under ₨5,000 and backed by our standardized 7-day return procedure.
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 font-['Outfit',var(--font-outfit),sans-serif]">
        <div className="space-y-8">
          {/* Key Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#120D08] border border-[rgba(255,220,180,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <RefreshCw className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold uppercase text-white mb-1">Inspection Window</h3>
              <p className="text-2xl font-black text-[#E5B84C]">7 Days</p>
              <p className="text-xs text-[#A8988B] mt-1">From the date of physical parcel delivery.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D08] border border-[rgba(255,220,180,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold uppercase text-white mb-1">Eligible Claims</h3>
              <p className="text-2xl font-black text-[#E5B84C]">100% Free</p>
              <p className="text-xs text-[#A8988B] mt-1">Free replacement for defective or wrong items.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D08] border border-[rgba(255,220,180,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <PhoneCall className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold uppercase text-white mb-1">Claim Channel</h3>
              <p className="text-2xl font-black text-[#E5B84C]">WhatsApp</p>
              <p className="text-xs text-[#A8988B] mt-1">Direct support without tedious ticket forms.</p>
            </div>
          </div>

          {/* Section 1: Return Eligibility */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>1. What Is Eligible for Return or Replacement</span>
            </h2>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              You are eligible for a full replacement or refund if you contact us within 7 calendar days of delivery under any of the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#D5C9B8]">
              <li><strong className="text-white">Defective or Non-Functional:</strong> The electronic item, watch, or lamp does not function out of the box.</li>
              <li><strong className="text-white">Damaged in Transit:</strong> The product arrived with physical cracks, breaks, or leaks caused during courier transit.</li>
              <li><strong className="text-white">Incorrect Item Received:</strong> The item delivered does not match your ordered product, size, or color.</li>
              <li><strong className="text-white">Missing Components:</strong> Essential accessories or cables mentioned in the product description are missing.</li>
            </ul>
          </section>

          {/* Section 2: Non-Returnable Items */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>2. Non-Returnable &amp; Non-Refundable Items</span>
            </h2>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              For hygiene, sanitary, and consumable reasons, the following items cannot be returned once unsealed or used:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#D5C9B8]">
              <li>Apothecary &amp; Skincare products (perfumes, serums, creams) whose protective seal or packaging has been opened.</li>
              <li>In-ear audio products (earbuds) that have been worn inside the ear canal, unless strictly dead-on-arrival.</li>
              <li>Items showing signs of user-inflicted physical abuse, water ingress, or voltage surge damage.</li>
              <li>Items returned without original packaging, product tags, instruction manuals, or courier flyers.</li>
            </ul>
          </section>

          {/* Section 3: Step-by-Step Return Process */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#F47514]" />
              <span>3. How to Initiate a Return</span>
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-[#D5C9B8]">
              <li>
                <strong className="text-white">Record Evidence:</strong> Take a clear photo or short 5-second video of the defective item and the courier parcel label showing your Order Number (e.g. 5HT-...).
              </li>
              <li>
                <strong className="text-white">Contact Dispatch via WhatsApp:</strong> Send your order number and photos to our support line at <span className="font-mono text-amber-300">+{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000'}</span>.
              </li>
              <li>
                <strong className="text-white">Dispatch Verification:</strong> Our logistics supervisor will inspect the claim within 24 business hours and issue return authorization.
              </li>
              <li>
                <strong className="text-white">Courier Pickup / Return Dispatch:</strong> We will coordinate a reverse-pickup with our courier partner or advise you on the nearest drop-off branch.
              </li>
              <li>
                <strong className="text-white">Refund or Replacement:</strong> Once the return parcel is verified at our hub, a replacement item is dispatched or your refund is transferred via Easypaisa, JazzCash, or online Bank Transfer within 3 business days.
              </li>
            </ol>
          </section>

          {/* Action CTA */}
          <section className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-[#1E140C] to-[#120D08] border border-amber-500/20 text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-bold uppercase text-white">Need Assistance With an Order?</h3>
            <p className="text-sm text-[#D5C9B8] max-w-lg mx-auto">
              Our Karachi dispatch desk is available Monday through Saturday (10:00 AM – 7:00 PM PKT).
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000'}?text=${encodeURIComponent('Assalam-o-Alaikum! I want to request a return or exchange for my order.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F47514] hover:bg-[#DF5E03] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                <span>Initiate Return via WhatsApp</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

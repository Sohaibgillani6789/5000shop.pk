import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Truck, Clock, MapPin, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Shipping & Cash on Delivery Policy | 5 Hazaar Tak',
  description:
    'Comprehensive information on nationwide shipping, standard delivery fees, Pakistani courier dispatch, and Cash on Delivery (COD) payment procedures at 5 Hazaar Tak.',
}

export default function ShippingPolicyPage() {
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
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Nationwide Logistics</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
          Shipping &amp; Cash on Delivery Policy
        </h1>
        <p className="text-sm sm:text-base text-[#D5C9B8] max-w-2xl mx-auto leading-relaxed">
          At 5 Hazaar Tak (5000shop.pk), we provide transparent, flat-rate shipping across all provinces of Pakistan with safe Cash on Delivery.
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 font-['Outfit',var(--font-outfit),sans-serif]">
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#120D08] border border-[rgba(255,220,180,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <Truck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold uppercase text-white mb-1">Standard Delivery Fee</h3>
              <p className="text-2xl font-black text-[#E5B84C]">₨250 Flat</p>
              <p className="text-xs text-[#A8988B] mt-1">Single transparent fee nationwide on all orders.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D08] border border-[rgba(255,220,180,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold uppercase text-white mb-1">Delivery Timeline</h3>
              <p className="text-2xl font-black text-[#E5B84C]">2–5 Days</p>
              <p className="text-xs text-[#A8988B] mt-1">2–3 days in major cities; 4–5 days in peripheral areas.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#120D08] border border-[rgba(255,220,180,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold uppercase text-white mb-1">Payment Method</h3>
              <p className="text-2xl font-black text-[#E5B84C]">COD Only</p>
              <p className="text-xs text-[#A8988B] mt-1">Pay only when the courier hands you the parcel.</p>
            </div>
          </div>

          {/* Section 1: Coverage & Couriers */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F47514]" />
              <span>1. Geographic Coverage &amp; Courier Partners</span>
            </h2>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              We ship to all regions across Pakistan including Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Islamabad Capital Territory, Azad Jammu &amp; Kashmir, and Gilgit-Baltistan.
            </p>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              Shipments are fulfilled through licensed Pakistani domestic courier networks, including:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {['TCS Express', 'Leopards Courier', 'PostEx', 'Trax Logistics', 'CallCourier', 'Rider', 'M&P Courier', 'Pakistan Post'].map((c) => (
                <div key={c} className="p-3 rounded-xl bg-[#1A120B] border border-[#2D2014] text-xs font-semibold text-[#E5B84C] text-center">
                  {c}
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Order Verification Process */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#F47514]" />
              <span>2. Phone &amp; WhatsApp Verification</span>
            </h2>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              To minimize fraudulent orders and delivery failures (Return-to-Origin), every first-time order requires a quick verification:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#D5C9B8]">
              <li>Our dispatch team sends an SMS or WhatsApp confirmation prompt to the Pakistani mobile number provided during checkout.</li>
              <li>Please ensure your mobile number is active and typed in the valid <span className="font-mono text-amber-300">03XXXXXXXXX</span> format.</li>
              <li>Orders that remain unverified after 48 hours of phone contact attempts may be cancelled.</li>
            </ul>
          </section>

          {/* Section 3: Cash on Delivery Protocols */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F47514]" />
              <span>3. Cash on Delivery (COD) Rules</span>
            </h2>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              When receiving your order from the courier rider:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#D5C9B8]">
              <li>Please have the exact invoice cash amount ready in Pakistani Rupees (₨) to ensure a smooth handover.</li>
              <li>Under standard Pakistani courier regulations, riders are not authorized to allow opening the outer tamper-evident flyer before cash payment is collected.</li>
              <li>Once payment is collected, immediately open and inspect your parcel. If any item is damaged or incorrect, our <Link href="/return-policy" className="text-amber-400 underline font-bold">Return Policy</Link> fully protects you.</li>
            </ul>
          </section>

          {/* Section 4: Tracking & Inquiries */}
          <section className="p-6 sm:p-8 rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] space-y-4">
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#F47514]" />
              <span>4. Tracking Your Parcel</span>
            </h2>
            <p className="text-sm text-[#D5C9B8] leading-relaxed">
              As soon as your package is dispatched, your tracking number and courier tracking link will be provided via SMS/WhatsApp. You can also contact our support team anytime with your order number.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000'}?text=${encodeURIComponent('Assalam-o-Alaikum! I have a question about shipping on 5 Hazaar Tak.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F47514] hover:bg-[#DF5E03] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                <span>WhatsApp Shipping Support</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

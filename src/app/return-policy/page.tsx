import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, CheckCircle2, PhoneCall, RefreshCw, ShieldAlert, Wallet } from 'lucide-react'
import { getWhatsAppNumber, getWhatsAppLink } from '@/lib/env/public'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Return & Exchange Policy | 5 Hazaar Tak',
  description:
    'Return, exchange, and refund guidelines for orders placed on 5 Hazaar Tak (5000shop.pk). 7-day inspection window with direct WhatsApp support.',
}

const STATS = [
  { value: '7 Days', label: 'INSPECTION WINDOW' },
  { value: '₨0', label: 'REPLACEMENT FEE' },
  { value: '24 Hours', label: 'CLAIM REVIEW' },
  { value: '3 Days', label: 'REFUND PAYOUT' },
]

const PILLARS = [
  {
    id: 'window',
    icon: RefreshCw,
    title: '7-Day Inspection Window',
    subtitle: 'Starts from the day the courier delivers your parcel.',
    orange: true,
  },
  {
    id: 'free',
    icon: CheckCircle2,
    title: 'Free Defect Replacement',
    subtitle: 'Damaged, broken, or wrong items replaced at zero cost.',
    orange: false,
  },
  {
    id: 'whatsapp',
    icon: PhoneCall,
    title: 'Direct WhatsApp Desk',
    subtitle: 'Send a quick photo of the box and item—no long forms.',
    orange: false,
  },
  {
    id: 'payout',
    icon: Wallet,
    title: 'Fast Local Refunds',
    subtitle: 'Paid out via Easypaisa, JazzCash, or Bank Transfer.',
    orange: false,
  },
]

export default function ReturnPolicyPage() {
  const whatsAppNum = getWhatsAppNumber()

  return (
    <div
      className="min-h-screen flex flex-col selection:bg-[#F47514] selection:text-white"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 50%, #F5F0E6 100%)',
        color: '#1A1108',
        position: 'relative',
        width: '100%',
        overflowX: 'clip',
        fontFamily: 'var(--font-outfit), sans-serif',
      }}
    >
      {/* Warm ambient cream lighting orb (from homepage CategoryShowcase) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '4%',
          left: '8%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.07) 0%, rgba(245, 158, 11, 0.02) 42%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Background Open Parcel Box & Pickup Van Illustration (Bottom Right, mix-blend-mode: multiply like homepage) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'clamp(300px, 48vw, 680px)',
          zIndex: 1,
          pointerEvents: 'none',
          lineHeight: 0,
        }}
      >
        <Image
          src="/images/return-boxes-car-bg.jpg"
          alt=""
          width={1200}
          height={675}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            objectPosition: 'bottom right',
            mixBlendMode: 'multiply',
            opacity: 0.9,
          }}
        />
      </div>

      <main
        className="flex-1 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24"
        style={{ paddingTop: 'calc(var(--site-header-height, 89px) + 1.5rem)' }}
      >
        {/* Minimal Top Navigation Row */}
        <div
          className="flex items-center justify-between gap-4 pb-5 mb-10"
          style={{ borderBottom: '1.5px dotted rgba(180, 160, 140, 0.45)' }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6E6259] hover:text-[#1A1108] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#E29752]" />
            <span>Back to Store</span>
          </Link>

          <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider">
            <Link
              href="/shipping-policy"
              className="text-[#9C9084] hover:text-[#1A1108] transition-colors pb-0.5"
            >
              Shipping &amp; COD
            </Link>
            <span className="text-[#1A1108] border-b-2 border-[#F47514] pb-0.5">
              Return Policy
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HOMEPAGE STORY-GRID LAYOUT + OPEN BOX/CAR ARTWORK
            ═══════════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-20">
          {/* Left Column: Editorial Mixed Typography & Unboxed Stat Nodes */}
          <div className="lg:col-span-6">
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#9C9084',
                marginBottom: '0.75rem',
              }}
            >
              5000shop.pk / Buyer Protection
            </p>

            <h1
              style={{
                fontSize: 'clamp(30px, 4.6vw, 52px)',
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: '-0.028em',
                color: '#1A1108',
                margin: '0 0 1.25rem',
              }}
            >
              Return &amp; Exchange Policy{' '}
              <span
                style={{
                  fontStyle: 'italic',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontWeight: 400,
                  color: '#E88B46',
                  display: 'block',
                  marginTop: '0.15rem',
                }}
              >
                Within 7 Calendar Days.
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 1.2vw, 1.0625rem)',
                lineHeight: 1.75,
                color: '#6E6259',
                margin: '0 0 1.75rem',
                maxWidth: '480px',
              }}
            >
              Every item on 5 Hazaar Tak is priced under ₨5,000 and backed by a 7-day inspection window. If your parcel arrives damaged, defective, or incorrect, we replace it or refund your money without hassle.
            </p>

            {/* Tactile Dotted Divider Line (matches CategoryShowcase.tsx) */}
            <div
              style={{
                borderTop: '1.5px dotted rgba(180, 160, 140, 0.45)',
                marginBottom: '1.75rem',
                width: '100%',
              }}
            />

            {/* Unboxed Editorial Stat Nodes (matches CategoryShowcase.tsx) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 'clamp(22px, 2.6vw, 32px)',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      color: '#E29752',
                      lineHeight: 1.1,
                      marginBottom: '0.35rem',
                      textShadow:
                        '0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(226, 151, 82, 0.2)',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#9C9084',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Open Box & Pickup Car Illustration + 2x2 Tactile Cards */}
          <div className="lg:col-span-6 space-y-4">
            {/* Open Parcel Box & Return Car Illustration blended into the cream page */}
            <div className="relative w-full aspect-[16/8] pointer-events-none select-none">
              <Image
                src="/images/return-boxes-car-bg.jpg"
                alt="5 Hazaar Tak open parcel box and return courier van"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 540px"
                style={{
                  objectFit: 'contain',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>

            {/* 2x2 Tactile Cards (Matches homepage trust-cards-grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon
                const isOrange = pillar.orange
                return (
                  <div
                    key={pillar.id}
                    style={{
                      borderRadius: '1rem',
                      padding: '1.25rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      position: 'relative',
                      overflow: 'hidden',
                      background: isOrange
                        ? 'linear-gradient(135deg, rgba(244, 117, 20, 0.94) 0%, rgba(223, 94, 3, 0.92) 50%, rgba(245, 158, 11, 0.94) 100%)'
                        : 'linear-gradient(135deg, rgba(32, 18, 10, 0.9) 0%, rgba(20, 11, 6, 0.86) 50%, rgba(12, 7, 4, 0.95) 100%)',
                      border: isOrange
                        ? '1px solid rgba(255, 235, 215, 0.6)'
                        : '1px solid rgba(255, 215, 175, 0.18)',
                      boxShadow: isOrange
                        ? '0 16px 34px rgba(244, 117, 20, 0.28), inset 0 1.5px 2px rgba(255, 255, 255, 0.8)'
                        : '0 14px 30px rgba(18, 10, 5, 0.22), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.28)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: isOrange
                            ? 'rgba(255, 255, 255, 0.28)'
                            : 'rgba(255, 183, 125, 0.18)',
                          border: isOrange
                            ? '1px solid rgba(255, 255, 255, 0.7)'
                            : '1px solid rgba(255, 183, 125, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          size={18}
                          color={isOrange ? '#FFFFFF' : '#FFB77D'}
                          strokeWidth={2.2}
                        />
                      </div>
                      <h2
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#FDFBF7',
                          margin: 0,
                          lineHeight: 1.25,
                        }}
                      >
                        {pillar.title}
                      </h2>
                    </div>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: isOrange ? 'rgba(255,255,255,0.9)' : '#D5C9B8',
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {pillar.subtitle}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 2: SIMPLE EDITORIAL POLICY SHEET (3 CLEAN ROWS)
            ═══════════════════════════════════════════════════════════════════ */}
        <section
          className="rounded-[1.75rem] p-6 sm:p-10 lg:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(180, 150, 120, 0.32)',
            boxShadow: '0 20px 50px -15px rgba(26, 17, 8, 0.1)',
          }}
        >
          <div className="divide-y divide-[#E2D9C8]">
            {/* Row 01: Eligible Returns */}
            <div className="pb-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
              <div className="md:col-span-4">
                <span className="text-xs font-extrabold tracking-widest text-[#E29752] uppercase">
                  01 / What We Cover
                </span>
                <h2 className="text-xl font-bold text-[#1A1108] mt-1">
                  Eligible Returns &amp; Replacements
                </h2>
              </div>
              <div className="md:col-span-8 space-y-2.5 text-sm sm:text-[15px] text-[#4A3B32] leading-relaxed">
                <p>
                  Contact us within 7 calendar days of delivery for a free replacement or full refund if:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-[#3D3028]">
                  <li>
                    <strong className="text-[#1A1108]">Defective out of the box:</strong> Electronics, watches, or lamps do not power on or work properly.
                  </li>
                  <li>
                    <strong className="text-[#1A1108]">Damaged in transit:</strong> The item arrived cracked, broken, or leaking inside the parcel box.
                  </li>
                  <li>
                    <strong className="text-[#1A1108]">Wrong or incomplete order:</strong> Different item, size, or color than ordered, or missing listed accessories.
                  </li>
                </ul>
              </div>
            </div>

            {/* Row 02: Non-Returnable Exceptions */}
            <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
              <div className="md:col-span-4">
                <span className="text-xs font-extrabold tracking-widest text-[#E29752] uppercase">
                  02 / Exceptions
                </span>
                <h2 className="text-xl font-bold text-[#1A1108] mt-1">
                  Non-Returnable Items
                </h2>
              </div>
              <div className="md:col-span-8 space-y-2 text-sm sm:text-[15px] text-[#4A3B32] leading-relaxed">
                <p>
                  For hygiene and safety, we cannot accept returns on unsealed perfumes, skincare serums, or creams, or in-ear earbuds that have been worn (unless dead on arrival). Returned items must include their original box, tags, and courier flyer without user-caused physical or water damage.
                </p>
              </div>
            </div>

            {/* Row 03: How to Claim via WhatsApp */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
              <div className="md:col-span-4">
                <span className="text-xs font-extrabold tracking-widest text-[#E29752] uppercase">
                  03 / How to Claim
                </span>
                <h2 className="text-xl font-bold text-[#1A1108] mt-1">
                  Start a Return on WhatsApp
                </h2>
              </div>
              <div className="md:col-span-8 space-y-4 text-sm sm:text-[15px] text-[#4A3B32] leading-relaxed">
                <p>
                  Take a clear photo or short 5-second video of the item and the parcel label showing your Order Number, then send it to our WhatsApp desk at <code className="px-1.5 py-0.5 rounded bg-[#F5F0E6] border border-[#D5C9B8] font-mono text-xs font-bold text-[#1A1108]">+{whatsAppNum}</code>. Our team reviews claims within 24 hours, arranges courier pickup or drop-off, and sends your replacement or refund (via Easypaisa, JazzCash, or Bank Transfer) within 3 working days of receiving the box.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href={getWhatsAppLink(
                      'Assalam-o-Alaikum! I want to request a return or exchange for my order.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1108] hover:bg-[#F47514] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#F47514]" />
                    <span>Initiate Return via WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <span className="text-xs text-[#6E6259]">
                    Karachi Dispatch Desk: Mon–Sat, 10:00 AM – 7:00 PM PKT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Globe,
  MessageSquare,
  Send,
  Sparkles,
  Truck,
  CreditCard,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { AnchorLink } from "@/components/SmoothScroll";


// Pakistani Cities for Marquee Ticker
const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Peshawar",
  "Multan",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Trigger ref for footer fixed bottom scroll reveal
  const footerRef = useRef<HTMLDivElement>(null);

  // Fade in fixed background layer only when footer enters viewport
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const fixedOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0, 1, 1]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubscribed(true);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("5HAZAARVIP");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <footer ref={footerRef} className="relative bg-[#0A0704]">
      {/* ═══════════════════════════════════════════════════════════════
          FIXED BOTTOM SCROLL REVEAL LAYER
          ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        style={{ opacity: fixedOpacity }}
        className="fixed bottom-0 left-0 w-full h-[85dvh] min-h-[660px] sm:h-[52vh] sm:min-h-[420px] z-0 flex flex-col justify-between px-4 sm:px-8 py-4 sm:py-6 overflow-hidden select-none pointer-events-auto shadow-[inset_0_30px_60px_rgba(0,0,0,0.4)]"
      >
        {/* Warm Orange Studio Backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 90% 80% at 50% 35%, #F47514 0%, #DF5E03 35%, #B44100 70%, #762600 100%)",
            zIndex: 0,
          }}
        />

        {/* Theatrical Wall Shadows */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 12%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 88%, rgba(0,0,0,0.45) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Top Spotlight Glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "350px",
            background:
              "radial-gradient(circle, rgba(255, 235, 200, 0.35) 0%, rgba(255, 170, 80, 0.15) 45%, transparent 70%)",
            filter: "blur(60px)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Top Tagline Badge (hidden on smallest screens to leave room for card overhang) */}
        <div className="relative z-10 hidden sm:flex justify-center px-2">
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 rounded-full bg-[#200E02]/70 border border-[rgba(255,220,180,0.3)] text-[10px] sm:text-[11px] font-semibold text-[#FFF5EB] tracking-wider uppercase backdrop-blur-md font-['Outfit',var(--font-outfit),sans-serif] shadow-lg text-center">
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span>Pakistan&apos;s Smartest Marketplace</span>
          </div>
        </div>

        {/* Central 3D "5000 RS SHOP" Centerpiece (comfortable clearance below any card overhang) */}
        <div className="relative z-10 flex-1 flex items-center justify-center pt-36 sm:pt-4 pb-4">
          {/* Ambient Backlight for 5000 RS Logo */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "55%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(500px, 85vw)",
              height: "200px",
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 215, 140, 0.38) 0%, rgba(244, 117, 20, 0.16) 55%, transparent 80%)",
              filter: "blur(38px)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <div className="relative z-10 w-full max-w-[300px] sm:max-w-[440px] md:max-w-[540px] h-[clamp(130px,22vh,280px)]">
            <Image
              src="/images/logo.jpeg"
              alt="5000 RS SHOP"
              fill
              priority
              sizes="(max-width: 480px) 300px, (max-width: 768px) 440px, 540px"
              style={{
                objectFit: "contain",
                filter:
                  "drop-shadow(0 20px 35px rgba(50, 15, 0, 0.8)) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.6))",
              }}
            />
          </div>
        </div>

        {/* Footer Bottom Bar with Sleek Back to Top */}
        <div className="relative z-10 flex items-center justify-between gap-4 pt-2.5 border-t border-[rgba(255,220,180,0.25)] font-['Outfit',var(--font-outfit),sans-serif]">
          <span className="text-xs font-semibold text-[#FFF5EB]/90 tracking-wider uppercase">
            5 HAZAAR TAK
          </span>

          <AnchorLink
            href="#home"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#200E02]/80 hover:bg-[#200E02] border border-[rgba(255,220,180,0.4)] text-[#FFF5EB] hover:text-white text-xs font-bold uppercase tracking-wider transition-all group shadow-md"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-amber-300 group-hover:text-white" />
          </AnchorLink>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          UPPER FOOTER DIV (CREAM BACKGROUND + DARK BROWN SHAPEGRID)
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative z-20 shadow-2xl overflow-visible"
        style={{
          background: "linear-gradient(180deg, #F5F0E6 0%, #EDE5D4 100%)",
          color: "#1A1108",
          borderTop: "1px solid rgba(180, 150, 120, 0.25)",
        }}
      >
        {/* Orange Marquee Bar */}
        <div
          style={{
            background: "#F47514",
            padding: "0.65rem 0",
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="flex whitespace-nowrap animate-[footerMarquee_30s_linear_infinite] group hover:[animation-play-state:paused] w-max">
            {[...PAKISTAN_CITIES, ...PAKISTAN_CITIES, ...PAKISTAN_CITIES].map((city, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 mx-4 text-xs font-semibold text-[#FFF1E0] tracking-wider uppercase font-['Outfit',var(--font-outfit),sans-serif]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer Hero Image: Mobile (320px+ 90dvh) & Desktop (Exact previous size with maxHeight 850px) ── */}
        {/* Mobile View: 90% Viewport Height Cover */}
        <div className="relative z-[1] w-full h-[90dvh] min-h-[460px] overflow-hidden md:hidden">
          <Image
            src="/images/footer.jpg"
            alt="5000 RS Shop Footer"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>

        {/* Desktop View: Restored to Previous Exact Sizing */}
        <div className="relative z-[1] w-full overflow-hidden hidden md:block" style={{ maxHeight: "850px" }}>
          <Image
            src="/images/footer.jpg"
            alt=""
            width={1824}
            height={1227}
            sizes="100vw"
            style={{ width: "100%", height: "auto", display: "block" }}
            priority={false}
          />
        </div>

        {/* ── 3D Coupon / Newsletter Card (Increased Width & Height) ── 
            Mobile: Attached at 70% from the top of the footer image, remaining extends down into bottom section.
            Desktop: Restored to exact previous bottom-right overlapping position. */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[calc(38px+63dvh)] md:left-auto md:translate-x-0 md:top-auto md:bottom-5 md:right-8 md:translate-y-0 lg:bottom-8 lg:right-12 lg:translate-y-0 xl:bottom-0 xl:right-14 xl:translate-y-1/2 z-40 w-[92%] max-w-[420px] sm:max-w-[440px] md:w-[410px] lg:w-[460px] xl:w-[490px] md:max-w-none"
          style={{ perspective: "1000px" }}
        >
            <div
              className="relative w-full transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "#F5F0E6",
                borderRadius: "30px",
                padding: "clamp(28px, 4.5vw, 38px) clamp(20px, 3.5vw, 32px) clamp(24px, 4vw, 32px)",
                border: "1px solid rgba(180, 150, 120, 0.35)",
                boxShadow:
                  "0 32px 64px -12px rgba(26, 17, 8, 0.28), 0 0 35px rgba(244, 117, 20, 0.12), inset 0 1px 1.5px rgba(255, 255, 255, 0.8)",
                transform: "rotateY(-3deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Ambient inner warm orange glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-15%",
                  right: "-10%",
                  width: "220px",
                  height: "220px",
                  background: "radial-gradient(circle, rgba(244,117,20,0.12) 0%, transparent 70%)",
                  filter: "blur(36px)",
                  pointerEvents: "none",
                }}
              />

              {/* Offer pill badge */}
              <div className="flex justify-center mb-3.5 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-[11px] sm:text-xs font-bold text-[#C2540A] uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  GET ₨500 OFF COUPON
                </span>
              </div>

              {/* Main Title matching reference screenshot */}
              <h3 className="relative z-10 text-[#1A1108] text-[28px] sm:text-[34px] md:text-[38px] font-black uppercase tracking-tight text-center leading-[1.06] font-['Outfit',var(--font-outfit),sans-serif]">
                HEAR MORE<br />FROM US
              </h3>

              {/* Subtitle */}
              <p className="relative z-10 mt-2.5 text-center text-xs sm:text-[13px] text-[#4A3B32] font-medium leading-relaxed font-['Outfit',var(--font-outfit),sans-serif] px-1 max-w-[340px] mx-auto">
                Get the latest news about skincare tips, new products &amp; claim ₨500 OFF.
              </p>

              {/* Form / Email Input & Action */}
              <div className="relative z-10">
                {!isSubscribed ? (
                  <form onSubmit={handleSubscribe} className="mt-5 flex flex-col items-center">
                    <div className="w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER YOUR EMAIL"
                        required
                        className="w-full py-3 sm:py-3.5 px-5 rounded-full bg-white border border-[#D5C9B8] text-[#1A1108] placeholder-[#1A1108]/45 text-xs sm:text-sm font-semibold tracking-widest text-center focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/25 transition-all font-['Outfit',var(--font-outfit),sans-serif] shadow-sm"
                      />
                    </div>

                    {/* Circular Arrow Button */}
                    <button
                      type="submit"
                      aria-label="Subscribe and get coupon"
                      className="mt-4 w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#1A1108] hover:bg-[#F47514] active:bg-[#D96509] border border-[#1A1108]/10 flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
                    >
                      <ArrowUpRight className="w-6 h-6 sm:w-6.5 sm:h-6.5 stroke-[2.2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>

                    {/* Underlined Subscribe Text */}
                    <button
                      type="submit"
                      className="mt-2 text-xs sm:text-sm font-bold tracking-widest text-[#1A1108]/90 hover:text-[#F47514] uppercase underline underline-offset-4 cursor-pointer transition-colors font-['Outfit',var(--font-outfit),sans-serif]"
                    >
                      SUBSCRIBE
                    </button>
                  </form>
                ) : (
                  <div className="mt-5 p-4 rounded-2xl bg-[#EDE5D4] border border-orange-500/30 text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-orange-500/20 flex items-center justify-center mb-2">
                      <Check className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-xs font-bold text-[#1A1108] uppercase tracking-wider">Coupon Unlocked!</p>
                    <div className="mt-2 flex items-center justify-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#D5C9B8] shadow-sm">
                      <span className="font-mono text-sm font-bold text-orange-600">5HAZAARVIP</span>
                      <button
                        type="button"
                        onClick={handleCopyCoupon}
                        className="text-[#1A1108]/70 hover:text-[#1A1108] p-1 transition-colors cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#1A1108]/70" />}
                      </button>
                    </div>
                    <p className="mt-2 text-[10px] text-[#1A1108]/70">₨500 OFF copied to your clipboard!</p>
                  </div>
                )}
              </div>

              {/* Horizontal Divider line */}
              <div className="w-full h-px bg-[#1A1108]/15 my-4 relative z-10" />

              {/* Microcopy disclaimer */}
              <p className="relative z-10 text-[10.5px] sm:text-[11px] text-[#1A1108]/60 text-center leading-relaxed font-['Outfit',var(--font-outfit),sans-serif]">
                No Spam, only quality articles to help you be more radiant. You can opt out anytime.
              </p>
            </div>
          </div>

        </div>

      {/* ═══════════════════════════════════════════════════════════════
          SPACER FOR REVEAL
          (Allows upper content to scroll off, revealing fixed layer)
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 h-[85dvh] min-h-[660px] sm:h-[52vh] sm:min-h-[420px] bg-transparent pointer-events-none"
        aria-hidden="true"
      />

      <style jsx global>{`
        @keyframes footerMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </footer>
  );
}

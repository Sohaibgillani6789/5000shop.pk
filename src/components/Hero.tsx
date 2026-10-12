"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Star } from "lucide-react";
import { AnchorLink } from "./SmoothScroll";

/* ── Word-split stagger animation ──────────────────────────── */
function AnimatedWords({
  words,
  delay = 0,
  className = "",
  style = {},
}: {
  words: string[];
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <span className={className} style={{ display: "block", ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 50, rotateX: 25 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            display: "inline-block",
            marginRight: "0.3em",
            transformOrigin: "bottom center",
            perspective: "800px",
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Floating product data — positioned tightly around the center logo ── */
const FLOATING_PRODUCTS = [
  {
    src: "/images/hero-headphones.png",
    alt: "Premium headphones",
    className: "hero-product-float hero-product-float-1",
    /* top-left hugging logo */
    style: { top: "4%", left: "4%", width: "clamp(40px, 8vw, 125px)" },
  },
  {
    src: "/images/hero-watch.png",
    alt: "Luxury watch",
    className: "hero-product-float hero-product-float-6",
    /* top-right hugging logo */
    style: { top: "3%", right: "4%", width: "clamp(36px, 7.5vw, 115px)" },
  },
  {
    src: "/images/hero-handbag.png",
    alt: "Leather handbag",
    className: "hero-product-float hero-product-float-4",
    /* bottom-left hugging logo */
    style: { bottom: "4%", left: "4%", width: "clamp(40px, 8vw, 125px)" },
  },
  {
    src: "/images/hero-sneakers.png",
    alt: "Stylish sneakers",
    className: "hero-product-float hero-product-float-3",
    /* bottom-right hugging logo */
    style: { bottom: "4%", right: "4%", width: "clamp(42px, 8.5vw, 135px)" },
  },
];

/* ── Trust pillar data ─────────────────────────────────────── */
const TRUST_PILLARS = [
  {
    icon: <Truck size={18} strokeWidth={2.2} />,
    title: "FAST DELIVERY",
    subtitle: "All Over Pakistan",
  },
  {
    icon: <ShieldCheck size={18} strokeWidth={2.2} />,
    title: "SECURE PAYMENT",
    subtitle: "100% Safe & Secure",
  },
  {
    icon: <Star size={18} strokeWidth={2.2} />,
    title: "BEST QUALITY",
    subtitle: "Products You Can Trust",
  },
];


/* ═══════════════════════════════════════════════════════════════
   HERO COMPONENT — Matching reference design exactly
   Viewport-fitting hero with:
   - Orange announcement bar
   - Split layout: text left, big logo + products right
   - Trust badges
   - Category bar at bottom
   - Everything fits 100dvh
   ═══════════════════════════════════════════════════════════════ */
export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="hero-root-section"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflowX: "clip",
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          MAIN HERO — Dark background, split layout
          ═══════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          /* Dark base with radial amber lighting from right side */
          background:
            "radial-gradient(ellipse 80% 90% at 70% 50%, rgba(120,60,0,0.30) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 60% at 75% 40%, rgba(217,119,6,0.15) 0%, transparent 60%), " +
            "linear-gradient(135deg, #0c0804 0%, #1a0e00 35%, #0f0906 60%, #0a0703 100%)",
        }}
      >
        {/* ── Diagonal leather-stitch texture ──────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(217,119,6,0.025) 30px, rgba(217,119,6,0.025) 31px)",
            pointerEvents: "none",
          }}
        />

        {/* ── Warm ambient orb — right side ────────────────── */}
        <motion.div
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.08, 0.95, 1],
            opacity: [0.25, 0.4, 0.3, 0.25],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,119,6,0.22) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />

        {/* ── Split Layout Grid — fills remaining space ───── */}
        <div
          className="hero-split-layout"
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            maxWidth: "1440px",
            margin: "0 auto",
            width: "100%",
            padding: "calc(94px + clamp(1.5rem, 4vh, 3.5rem)) clamp(0.75rem, 3vw, 3rem) clamp(1rem, 2vh, 2rem)",
          }}
        >
          {/* ── LEFT COLUMN: Typography + CTA ──────────────── */}
          <div className="hero-left-col" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Main headline */}
            <h1
              style={{
                fontSize: "clamp(1.75rem, 5.2vw, 5.5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontFamily: "var(--font-outfit), sans-serif",
                margin: 0,
                overflow: "visible",
                paddingBottom: "0.12em",
                color: "#FFFFFF",
              }}
            >
              <AnimatedWords words={["ONE", "SHOP."]} delay={0.2} />
              <AnimatedWords
                words={["EVERYTHING"]}
                delay={0.4}
                style={{
                  fontStyle: "italic",
                  color: "#F47514",
                }}
              />
              <AnimatedWords
                words={["YOU", "NEED."]}
                delay={0.55}
                style={{ color: "#FFFFFF" }}
              />
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{
                fontSize: "clamp(0.78rem, 1.25vw, 1.05rem)",
                color: "rgba(255,255,255,0.55)",
                marginTop: "clamp(0.75rem, 2vh, 1.5rem)",
                lineHeight: 1.6,
                maxWidth: "420px",
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 400,
              }}
            >
              Fashion, Electronics, Lamps, Home Essentials
              <br />and much more – all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="hero-cta-wrapper"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.625rem",
                marginTop: "clamp(1rem, 2.5vh, 2rem)",
                width: "100%",
              }}
            >
              {/* Shop Now Button — solid orange rounded */}
              <AnchorLink
                href="#categories"
                className="hero-cta-shop"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "clamp(0.625rem, 1.2vh, 0.875rem) clamp(1rem, 2.5vw, 2rem)",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #D97706 100%)",
                  backgroundSize: "200% 100%",
                  color: "#000000",
                  fontSize: "clamp(0.72rem, 1.1vw, 0.9375rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-outfit), sans-serif",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  boxShadow: "0 8px 25px rgba(217,119,6,0.35)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  minHeight: "44px",
                }}
              >
                <span>SHOP NOW</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </AnchorLink>

              {/* Explore Categories Button — outlined */}
              <AnchorLink
                href="#categories"
                className="hero-cta-explore"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "clamp(0.625rem, 1.2vh, 0.875rem) clamp(1rem, 2.5vw, 2rem)",
                  borderRadius: "9999px",
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "clamp(0.72rem, 1.1vw, 0.9375rem)",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  transition: "all 0.3s ease",
                  minHeight: "44px",
                }}
              >
                <span>EXPLORE CATEGORIES</span>
              </AnchorLink>
            </motion.div>

            {/* Trust Pillars — horizontal row (desktop: after CTA, mobile: before CTA) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.15 }}
              className="hero-trust-pillars-wrapper"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "clamp(0.625rem, 1.8vw, 1.75rem)",
                marginTop: "clamp(1rem, 2.5vh, 2.5rem)",
                width: "100%",
              }}
            >
              {TRUST_PILLARS.map((pill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.25 + i * 0.12 }}
                  className="hero-trust-badge"
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(217,119,6,0.20) 0%, rgba(217,119,6,0.08) 100%)",
                      border: "1px solid rgba(217,119,6,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#F59E0B",
                      flexShrink: 0,
                    }}
                  >
                    {pill.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "clamp(0.5625rem, 0.85vw, 0.75rem)",
                        fontWeight: 800,
                        color: "rgba(255,255,255,0.85)",
                        letterSpacing: "0.06em",
                        fontFamily: "var(--font-outfit), sans-serif",
                        textTransform: "uppercase",
                      }}
                    >
                      {pill.title}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(0.5rem, 0.75vw, 0.6875rem)",
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "var(--font-outfit), sans-serif",
                        marginTop: "0.0625rem",
                      }}
                    >
                      {pill.subtitle}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Big Logo + Floating Products ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hero-right-col"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Amber glow behind logo */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "clamp(220px, 60vw, 880px)",
                height: "clamp(220px, 60vw, 880px)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(244,117,20,0.32) 0%, rgba(180,83,9,0.12) 40%, transparent 70%)",
                filter: "blur(40px)",
                animation: shouldReduceMotion ? "none" : "hero-logo-glow 4s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />

            {/* Brand Logo — BIG and centered */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                width: "clamp(190px, 52vw, 760px)",
                height: "clamp(190px, 52vw, 760px)",
              }}
            >
              <Image
                src="/images/logo.jpeg"
                alt="5000 RS Shop — 5 Hazaar Tak"
                fill
                priority
                sizes="(max-width: 480px) 240px, (max-width: 768px) 380px, (max-width: 1024px) 620px, 760px"
                style={{
                  objectFit: "contain",
                  filter: "drop-shadow(0 22px 65px rgba(244,117,20,0.45))",
                }}
              />
            </div>

            {/* ── Floating Product Images — blend into background ── */}
            {FLOATING_PRODUCTS.map((product, i) => (
              <div
                key={i}
                className={product.className}
                style={{
                  position: "absolute",
                  ...product.style,
                  zIndex: i % 2 === 0 ? 3 : 1,
                }}
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  width={140}
                  height={140}
                  sizes="140px"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.5))",
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hero Responsive Styles */}
      <style jsx global>{`
        .hero-root-section {
          height: 100dvh;
          min-height: 580px;
          overflow: hidden;
        }

        /* ── Trust badge base (desktop: row, mobile overridden to column) ── */
        .hero-trust-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ── Mobile Layout (≤768px) ── */
        @media (max-width: 768px) {
          .hero-root-section {
            height: auto !important;
            min-height: 100dvh;
            overflow: visible !important;
            overflow-x: clip !important;
          }

          /* Single column layout */
          .hero-split-layout {
            grid-template-columns: 1fr !important;
            padding-top: calc(70px + 1.25rem) !important;
            padding-bottom: 2.5rem !important;
            padding-left: clamp(1rem, 4vw, 1.5rem) !important;
            padding-right: clamp(1rem, 4vw, 1.5rem) !important;
          }

          /* Left column (Text & actions) appears FIRST at top */
          .hero-left-col {
            order: 1 !important;
            align-items: flex-start !important;
            text-align: left !important;
            width: 100% !important;
          }

          /* Headline: Covers full viewport width, left-aligned, high impact */
          .hero-left-col h1 {
            order: 1 !important;
            text-align: left !important;
            font-size: clamp(2.4rem, 11vw, 3.8rem) !important;
            line-height: 0.95 !important;
            letter-spacing: -0.03em !important;
            width: 100% !important;
          }

          .hero-left-col h1 span {
            text-align: left !important;
          }

          /* Tagline: Below headline, left-aligned, full width */
          .hero-left-col p {
            order: 2 !important;
            text-align: left !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            margin-top: 0.75rem !important;
            width: 100% !important;
            max-width: 100% !important;
            font-size: clamp(0.85rem, 3.4vw, 1.05rem) !important;
          }

          /* 3 Cards: Below text in a straight horizontal line */
          .hero-trust-pillars-wrapper {
            order: 3 !important;
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.5rem !important;
            margin-top: 1.25rem !important;
            margin-bottom: 0 !important;
            width: 100% !important;
          }

          /* Each badge card in straight horizontal line, vertically balanced inside */
          .hero-trust-badge {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 0.35rem !important;
            padding: 0.6rem 0.25rem !important;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(217, 119, 6, 0.18);
            border-radius: 0.75rem;
            min-width: 0 !important;
          }

          .hero-trust-badge > div:last-child {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }

          .hero-trust-badge > div:last-child > div:first-child {
            font-size: clamp(0.52rem, 2.2vw, 0.68rem) !important;
            line-height: 1.15;
            text-align: center;
          }

          .hero-trust-badge > div:last-child > div:last-child {
            font-size: clamp(0.42rem, 1.8vw, 0.58rem) !important;
            line-height: 1.2;
            text-align: center;
          }

          /* CTA Buttons: Placed at the bottom */
          .hero-cta-wrapper {
            order: 4 !important;
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.625rem !important;
            margin-top: 1.25rem !important;
          }

          .hero-cta-shop, .hero-cta-explore {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
          }

          /* Right column (Logo) appears on TOP on mobile */
          .hero-right-col {
            order: -1 !important;
            width: clamp(190px, 58vw, 300px) !important;
            height: clamp(190px, 58vw, 300px) !important;
            margin: 0 auto 1.25rem !important;
          }
        }

        @media (max-width: 480px) {
          .hero-trust-pillars-wrapper {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.35rem !important;
          }
          .hero-trust-badge {
            padding: 0.45rem 0.15rem !important;
          }
        }
      `}</style>
    </section>
  );
}

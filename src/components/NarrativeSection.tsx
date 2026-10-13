"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ShieldCheck, Truck, Sparkles, RefreshCw, Award, ArrowRight, Quote } from "lucide-react";
import { AnchorLink } from "@/components/SmoothScroll";

interface CounterProps {
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ from = 0, to, prefix = "", suffix = "", duration = 2 }: CounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return;
    let startTime: number | null = null;
    let id: number;
    const update = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / (duration * 1000), 1);
      setCount(Math.floor(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) id = requestAnimationFrame(update);
      else setCount(to);
    };
    id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [isInView, from, to, duration, shouldReduceMotion]);

  const displayCount = shouldReduceMotion ? to : count;

  return (
    <span ref={ref} className="font-display tabular-nums">
      {prefix}{displayCount.toLocaleString()}{suffix}
    </span>
  );
}

const trustPillars = [
  { id: "cod", icon: Truck, title: "Nationwide Cash on Delivery", subtitle: "150+ Cities Covered", description: "Pay conveniently at your doorstep anywhere in Pakistan with our trusted logistics network.", badge: "Pak-Wide COD" },
  { id: "ceiling", icon: ShieldCheck, title: "Strict ₨5,000 Price Ceiling", subtitle: "Zero Price Inflation", description: "Every item is hard-capped at ₨5,000. No hidden surcharges, no surprise delivery hikes.", badge: "100% Guaranteed" },
  { id: "returns", icon: RefreshCw, title: "7-Day Easy Returns", subtitle: "Risk-Free Shopping", description: "Not satisfied? Return or exchange hassle-free within 7 business days.", badge: "Instant Refund" },
  { id: "craft", icon: Award, title: "Curated Craftsmanship", subtitle: "Verified Local Suppliers", description: "Direct-from-manufacturer sourcing ensures premium grade materials without retailer markups.", badge: "Quality Audited" },
];

export default function NarrativeSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section
      id="about"
      style={{
        position: "relative",
        padding: "10rem 1.5rem 10rem",
        /* Continues the dark canvas, warm amber tint */
        background:
          "linear-gradient(180deg, #050708 0%, #0a0703 15%, #0c0804 40%, #0a0703 70%, #050708 100%)",
        overflow: "hidden",
      }}
    >
      {/* Top blend */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, #050708 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />
      {/* Bottom blend */}
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to top, #050708 0%, transparent 100%)", pointerEvents: "none", zIndex: 2 }} />

      {/* Ambient orbs */}
      <motion.div
        animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 0.95, 1], opacity: [0.20, 0.38, 0.22, 0.20] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
        style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "800px", height: "600px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(217,119,6,0.22) 0%, transparent 70%)", filter: "blur(100px)", pointerEvents: "none" }}
      />
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -18, 8, 0], opacity: [0.12, 0.24, 0.14, 0.12] }}
        transition={{ duration: 10, delay: 2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
        style={{ position: "absolute", bottom: "10%", right: "-5%", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,146,42,0.20) 0%, transparent 65%)", filter: "blur(90px)", pointerEvents: "none" }}
      />

      {/* Dot grid */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(217,119,6,0.07) 1px, transparent 1px)", backgroundSize: "44px 44px", opacity: 0.45, pointerEvents: "none", maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)" }} />

      <div style={{ position: "relative", zIndex: 3, maxWidth: "1280px", margin: "0 auto" }}>

        {/* ── PAS Brand Narrative ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center", marginBottom: "6rem" }}
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 1.25rem", borderRadius: "9999px", background: "linear-gradient(135deg,rgba(217,119,6,0.20) 0%,rgba(201,146,42,0.10) 100%)", border: "1px solid rgba(217,119,6,0.32)", fontSize: "0.78rem", fontWeight: 700, color: "#F59E0B", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.75rem", backdropFilter: "blur(12px)" }}>
            <Sparkles style={{ width: "13px", height: "13px", color: "#F59E0B" }} />
            <span>Our Uncompromising Promise</span>
          </motion.div>

          {/* H2 word-stagger */}
          <motion.h2
            variants={itemVariants}
            style={{ fontSize: "clamp(2.25rem,5vw,4.5rem)", fontWeight: 900, fontFamily: "var(--font-outfit),sans-serif", letterSpacing: "-0.035em", lineHeight: 1.05, color: "#FFFFFF", margin: "0 0 1.75rem" }}
          >
            Why Should{" "}
            <span style={{ background: "linear-gradient(135deg,#9A6F1E 0%,#C9922A 35%,#E5B84C 60%,#C9922A 85%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Quality
            </span>{" "}
            Cost a Fortune?
          </motion.h2>

          {/* PAS copy */}
          <motion.div variants={itemVariants} style={{ color: "rgba(255,255,255,0.62)", fontSize: "clamp(1rem,1.8vw,1.2rem)", lineHeight: 1.75, fontWeight: 400, fontFamily: "var(--font-outfit),sans-serif" }}>
            <p style={{ marginBottom: "1.25rem" }}>
              In today&apos;s Pakistani retail landscape, consumers face a frustrating choice: pay exorbitant prices over{" "}
              <span style={{ color: "#E5B84C", fontWeight: 700 }}>₨15,000</span> for branded hype, or settle for sub-par quality on unverified marketplaces.
            </p>
            <p style={{ marginBottom: "1.25rem", color: "rgba(255,255,255,0.50)" }}>
              Artificial discounts and inflated prices have degraded trust. We asked:{" "}
              <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>What if premium craftsmanship was accessible to everyone with a strict cost ceiling?</strong>
            </p>
            <p style={{ color: "rgba(255,255,255,0.88)", fontWeight: 500, fontSize: "clamp(1.1rem,2vw,1.3rem)" }}>
              Welcome to{" "}
              <span style={{ background: "linear-gradient(135deg,#C9922A,#E5B84C,#C9922A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 800 }}>
                5 HAZAAR TAK
              </span>
              . Five core retail verticals, every product capped strictly under{" "}
              <span style={{ color: "#F59E0B", fontWeight: 800 }}>₨5,000</span>.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} style={{ paddingTop: "2rem" }}>
            <AnchorLink
              href="#categories"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.625rem", padding: "1rem 2.25rem", borderRadius: "9999px", background: "linear-gradient(135deg,#D97706 0%,#F59E0B 100%)", color: "#000000", fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none", boxShadow: "0 12px 35px rgba(217,119,6,0.40), 0 4px 12px rgba(0,0,0,0.4)", border: "1px solid rgba(245,158,11,0.35)", transition: "all 0.3s ease", fontFamily: "var(--font-outfit),sans-serif" }}
              className="narrative-cta"
            >
              <span>Explore Curated Collections</span>
              <ArrowRight style={{ width: "18px", height: "18px" }} />
            </AnchorLink>
          </motion.div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1.5rem", marginBottom: "7rem", padding: "2.5rem", borderRadius: "2rem", background: "linear-gradient(135deg,rgba(217,119,6,0.08) 0%,rgba(201,146,42,0.06) 100%)", border: "1px solid rgba(201,146,42,0.15)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", position: "relative", overflow: "hidden" }}
          className="stats-grid"
        >
          <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: "radial-gradient(circle,rgba(201,146,42,0.12) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

          {[
            { prefix: "₨", to: 5000, suffix: "", label: "Maximum Price Cap", badge: "Guaranteed Ceiling", badgeColor: "#F59E0B", badgeBg: "rgba(217,119,6,0.15)", isGold: true },
            { prefix: "", to: 100, suffix: "%", label: "Quality Audited", badge: "Verified Suppliers", badgeColor: "#E5B84C", badgeBg: "rgba(201,146,42,0.12)", isGold: false },
            { prefix: "", to: 5, suffix: "", label: "Core Verticals", badge: "Curated Index", badgeColor: "rgba(255,255,255,0.7)", badgeBg: "rgba(255,255,255,0.06)", isGold: true },
            { prefix: "", to: 24, suffix: "h", label: "Avg Dispatch Time", badge: "Fast Nationwide", badgeColor: "#F59E0B", badgeBg: "rgba(217,119,6,0.15)", isGold: false },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", background: stat.isGold ? "linear-gradient(135deg,#C9922A,#E5B84C,#C9922A)" : "linear-gradient(135deg,#FFFFFF,rgba(255,255,255,0.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                <AnimatedCounter prefix={stat.prefix} to={stat.to} suffix={stat.suffix} />
              </div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.5rem" }}>{stat.label}</p>
              <span style={{ display: "inline-block", fontSize: "0.6875rem", color: stat.badgeColor, background: stat.badgeBg, padding: "0.2rem 0.6rem", borderRadius: "9999px", marginTop: "0.5rem", fontWeight: 600 }}>{stat.badge}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Trust Pillars ── */}
        <div style={{ marginBottom: "6rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <h3 style={{ fontSize: "clamp(1.75rem,3.5vw,3rem)", fontWeight: 900, fontFamily: "var(--font-outfit),sans-serif", color: "#FFFFFF", letterSpacing: "-0.03em", margin: "0 0 0.75rem" }}>
              Built on{" "}
              <span style={{ background: "linear-gradient(135deg,#C9922A,#E5B84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Trust
              </span>{" "}
              &amp; Transparency
            </h3>
            <p style={{ color: "rgba(255,255,255,0.50)", fontSize: "clamp(0.9375rem,1.5vw,1.1rem)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.65 }}>
              Every detail engineered to give you complete peace of mind while shopping in Pakistan.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(1,1fr)", gap: "1.25rem" }}
            className="trust-grid"
          >
            {trustPillars.map((pillar) => {
              const Icon = pillar.icon;
              const isReturns = pillar.id === "returns";
              return (
                <motion.div
                  key={pillar.id}
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : { y: -6, transition: { duration: 0.25 } }}
                  style={{ padding: "2rem", borderRadius: "1.5rem", background: "linear-gradient(155deg,rgba(201,146,42,0.08) 0%,rgba(217,119,6,0.04) 50%,rgba(10,14,11,0.95) 100%)", border: "1px solid rgba(201,146,42,0.15)", backdropFilter: isReturns ? "blur(16px)" : "blur(4px)", WebkitBackdropFilter: isReturns ? "blur(16px)" : "blur(4px)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1rem", cursor: "default", transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
                  className={`trust-card trust-card-${pillar.id}`}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg,rgba(201,146,42,0.15),rgba(217,119,6,0.10))", border: "1px solid rgba(201,146,42,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon style={{ width: "22px", height: "22px", color: "#E5B84C" }} />
                    </div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.25rem 0.7rem", borderRadius: "6px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)" }}>{pillar.badge}</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: "1.0625rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.25rem", fontFamily: "var(--font-outfit),sans-serif" }}>{pillar.title}</h4>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#F59E0B", margin: 0 }}>{pillar.subtitle}</p>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.50)", lineHeight: 1.65, margin: 0 }}>{pillar.description}</p>
                  <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>Verified Policy</span>
                    <span style={{ color: "#E5B84C", fontSize: "1rem" }}>→</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ── Testimonial ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: "760px", margin: "0 auto", padding: "3rem 3.5rem", borderRadius: "2rem", background: "linear-gradient(135deg,rgba(217,119,6,0.08) 0%,rgba(201,146,42,0.06) 100%)", border: "1px solid rgba(201,146,42,0.18)", textAlign: "center", position: "relative", overflow: "hidden" }}
        >
          <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "400px", height: "200px", background: "radial-gradient(ellipse,rgba(217,119,6,0.15) 0%,transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
          <Quote style={{ width: "36px", height: "36px", color: "rgba(229,184,76,0.25)", margin: "0 auto 1.5rem" }} />
          <blockquote style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", fontStyle: "italic", color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 1.75rem", fontFamily: "var(--font-outfit),sans-serif", fontWeight: 300 }}>
            &ldquo;Finally, an online store in Pakistan that delivers exactly what it promises. No inflated prices, no misleading claims. Every product under ₨5,000 feels like a luxury steal.&rdquo;
          </blockquote>
          <div>
            <p style={{ fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.25rem", fontFamily: "var(--font-outfit),sans-serif" }}>Zara S.</p>
            <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.40)", margin: 0 }}>Verified Buyer — Lahore, Pakistan</p>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .narrative-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(217,119,6,0.45), 0 6px 20px rgba(0,0,0,0.5) !important;
        }
        .trust-card-cod { order: 1; }
        .trust-card-returns { order: 2; }
        .trust-card-ceiling { order: 3; }
        .trust-card-craft { order: 4; }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4,1fr) !important; }
          .trust-grid { grid-template-columns: repeat(2,1fr) !important; }
          .trust-card-cod,
          .trust-card-ceiling,
          .trust-card-returns,
          .trust-card-craft {
            order: initial !important;
          }
        }
        @media (min-width: 1024px) {
          .trust-grid { grid-template-columns: repeat(4,1fr) !important; }
        }
        .trust-card:hover {
          border-color: rgba(201,146,42,0.38) !important;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,146,42,0.12) !important;
        }
      `}</style>
    </section>
  );
}

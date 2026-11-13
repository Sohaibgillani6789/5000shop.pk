"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Award } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  number: string;
  mobileNumber?: string;
  colSpan: string; // "8" for md:col-span-8, "4" for md:col-span-4
  image: string;
  alt: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "fashion",
    name: "Mens & Womens Fashion",
    number: "01",
    mobileNumber: "01",
    colSpan: "8",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmu2EHEPPB0E1DxXu1ukcgpFTUMGTy14FNiEULF2AF5a1Olk59Xr2px-YPHI5SFVhdqGoyHqPbSt5WCho65tknyDj3QZS9IbwPDo02nd9cZ8HJROjyMIEzSvtBgq6vRgbYxXSgVSNaPwi16kRG2DLmUMv3-ayw09cfeRrPLg1VS6wI1NsmY636kdaBz8-mJ5tATKKDwn8ROLV6_z_ykOkHh0HoUTwNkeh784QnG-z4zDZt4IFHHP8G2KhEtpVjZ9Hkch7KvKCoqRCh",
    alt: "A cinematic, low-key photograph of a premium, rich brown leather jacket draped elegantly over a dark oak chair.",
  },
  {
    id: "beauty",
    name: "Apothecary",
    number: "02",
    mobileNumber: "03",
    colSpan: "4",
    image: "/images/perfume1.jpg",
    alt: "A minimalist still life of an elegant, frosted glass perfume bottle resting on a slab of polished black obsidian.",
  },
  {
    id: "electronics",
    name: "Tech Accents",
    number: "03",
    mobileNumber: "05",
    colSpan: "4",
    image: "/images/watchi.jpg",
    alt: "Sleek, matte black wireless earbuds resting in their open charging case on a darkly stained walnut wood desk.",
  },
  {
    id: "home",
    name: "Living Space",
    number: "04",
    mobileNumber: "04",
    colSpan: "4",
    image: "/images/pot.jpg",
    alt: "An artisan, handcrafted matte charcoal ceramic vase containing sprigs of dried pampas grass.",
  },
  {
    id: "accessories",
    name: "Accessories",
    number: "05",
    mobileNumber: "02",
    colSpan: "4",
    image: "/images/earbud.jpg",
    alt: "A close-up, macro shot of a minimalist gold wristwatch with a dark brown leather strap on dark velvet.",
  },
];

const TRUST_PILLARS = [
  {
    id: "cod",
    icon: Truck,
    title: "Cash on Delivery",
  },
  {
    id: "ceiling",
    icon: ShieldCheck,
    title: "Strict Price Ceiling",
  },
  {
    id: "returns",
    icon: RefreshCw,
    title: "7-Day Returns",
  },
  {
    id: "craft",
    icon: Award,
    title: "Curated Craft",
  },
];

const STATS = [
  { value: "₨5,000", label: "ABSOLUTE MAX PRICE" },
  { value: "100%", label: "QUALITY AUDITED" },
  { value: "05", label: "CORE VERTICALS" },
  { value: "24H", label: "PRIORITY DISPATCH" },
];

/* ── Bento Card Component (Lightweight CSS Image Scale Hover) ── */
function CategoryBentoCard({ cat }: { cat: CategoryItem }) {
  return (
    <div
      className={`category-bento-card-wrapper category-bento-col-${cat.colSpan} bento-item-${cat.number}`}
      style={{
        height: "100%",
        minHeight: 0,
      }}
    >
      <Link
        href={`/category/${cat.id}`}
        aria-label={`Explore ${cat.name} collection`}
        className="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F47514] rounded-[1.25rem]"
      >
        <div
          className="category-bento-card group"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "100%",
            borderRadius: "1.25rem",
            overflow: "hidden",
            textDecoration: "none",
            background: "#120A05",
            cursor: "pointer",
            boxShadow:
              "0 20px 48px -10px rgba(24, 12, 6, 0.36), 0 8px 20px -4px rgba(0, 0, 0, 0.25), 0 2px 6px 0 rgba(0, 0, 0, 0.15), inset 0 1.25px 1.5px 0 rgba(255, 255, 255, 0.28), inset 0 0 0 1px rgba(255, 215, 175, 0.14), inset 0 -2px 6px 0 rgba(0, 0, 0, 0.55)",
          }}
        >
          {/* Precision Metallic Specular Top Edge (0.5px Optical Rim Highlight) */}
          <div
            aria-hidden="true"
            className="category-bento-top-edge"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1.5px",
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.55) 50%, rgba(255, 255, 255, 0.05) 100%)",
              zIndex: 4,
              pointerEvents: "none",
            }}
          />

          {/* Tactile Micro-Texture Grain Sheen Overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.045,
              zIndex: 3,
              pointerEvents: "none",
              backgroundImage:
                "radial-gradient(#FFF 1px, transparent 1px), radial-gradient(#FFF 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />

          {/* Background Cover Image with Simple GPU-Accelerated Hover Scale */}
          <div
            className="category-bento-image"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url('${cat.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={cat.alt}
          />

          {/* Multi-layered Cinematic Volumetric Darkness Vignettes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10, 5, 2, 0.98) 0%, rgba(12, 6, 3, 0.72) 36%, rgba(12, 6, 3, 0.25) 68%, transparent 100%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Ambient Top Cavity Curvature (Adds concave tactile physical depth) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.12) 0%, transparent 62%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Card Content Overlay */}
          <div
            className="category-bento-label-overlay"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 4,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              pointerEvents: "none",
            }}
          >
            <div style={{ maxWidth: "calc(100% - 56px)" }}>
              {/* Neu-Tactile Debossed Index Badge */}
              <div
                className="tactile-number-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2px 10px",
                  marginBottom: "0.55rem",
                  borderRadius: "0.5rem",
                  background: "linear-gradient(180deg, rgba(32, 17, 8, 0.94) 0%, rgba(14, 7, 3, 0.98) 100%)",
                  border: "1px solid rgba(255, 215, 175, 0.24)",
                  boxShadow:
                    "0 4px 10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -1px 2px rgba(0, 0, 0, 0.8)",
                }}
              >
                <span
                  className="category-bento-number"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontSize: "clamp(13px, 1.8vw, 15px)",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    lineHeight: 1.2,
                    color: "#F47514",
                    textShadow:
                      "0 1px 0 rgba(255, 255, 255, 0.3), 0 0 12px rgba(244, 117, 20, 0.5)",
                    transition: "color 0.35s ease, text-shadow 0.35s ease",
                  }}
                >
                  <span className="bento-num-mobile">{cat.mobileNumber || cat.number}</span>
                  <span className="bento-num-desktop">{cat.number}</span>
                </span>
              </div>

              {/* Chiseled Editorial Category Title */}
              <h3
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "clamp(1.1875rem, 3.2vw, 1.5625rem)",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  color: "#FDFBF7",
                  margin: 0,
                  textShadow:
                    "0 2px 6px rgba(0, 0, 0, 0.95), 0 4px 18px rgba(0, 0, 0, 0.85), 0 1px 0 rgba(255, 255, 255, 0.12)",
                  transition: "color 0.35s ease, text-shadow 0.35s ease",
                }}
                className="category-bento-title"
              >
                {cat.name}
              </h3>
            </div>

            {/* Neu-Tactile Push-Dial Action Button */}
            <div
              className="category-bento-arrow-disc"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                background:
                  "linear-gradient(135deg, rgba(42, 23, 12, 0.9) 0%, rgba(20, 10, 5, 0.95) 100%)",
                border: "1px solid rgba(255, 215, 175, 0.25)",
                boxShadow:
                  "0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.28), inset 0 -1px 2px rgba(0, 0, 0, 0.7)",
                transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
              }}
            >
              <span
                className="category-bento-arrow"
                style={{
                  color: "#F47514",
                  opacity: 0.75,
                  transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s ease, opacity 0.35s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CategoryShowcase() {
  return (
    <section
      id="categories"
      className="category-showcase-section"
      style={{
        position: "relative",
        background: "transparent",
        overflowX: "clip",
      }}
    >
      {/* ── Warm ambient cream lighting orbs (pure soft radial-gradient, zero GPU blur filter) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "5%",
          left: "10%",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.065) 0%, rgba(245, 158, 11, 0.025) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "850px",
          height: "850px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 119, 7, 0.06) 0%, rgba(217, 119, 7, 0.02) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Section Background Art (Bottom Right behind Review Card) ── */}
      <div
        aria-hidden="true"
        className="category-bg-graphic"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 1,
          pointerEvents: "none",
          lineHeight: 0,
        }}
      >
        <Image
          src="/images/sectionbackground.jpg"
          alt=""
          width={800}
          height={600}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            objectPosition: "bottom right",
            mixBlendMode: "multiply",
            opacity: 0.92,
          }}
        />
      </div>

      {/* ── Section Container ── */}
      <div
        className="category-showcase-container"
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* ──────────────────────────────────────────────── */}
        {/* PART 1: CURATED BENTO SHOWCASE HEADER           */}
        {/* ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "clamp(-4rem, -5vw, -2rem)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "500px",
              margin: "-1.25rem auto 0",
            }}
          >
            <Image
              src="/images/pty.png"
              alt="Our Selections"
              width={2528}
              height={1684}
              sizes="(max-width: 640px) 90vw, 500px"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* PART 1: 5-CATEGORY BENTO GRID                   */}
        {/* ──────────────────────────────────────────────── */}
        <div className="category-bento-grid">
          {CATEGORIES.map((cat) => (
            <CategoryBentoCard key={cat.id} cat={cat} />
          ))}
        </div>

        {/* ──────────────────────────────────────────────── */}
        {/* PART 2: STORY / NARRATIVE / VALUE PROPOSITION    */}
        {/* (Built directly inside second section as requested) */}
        {/* ──────────────────────────────────────────────── */}
        <div className="story-section-wrapper">
          <div className="story-grid">
            {/* ── Left Column: Headline, Narrative Copy & Stats ── */}
            <div
              style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <h2
                className="story-headline"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "clamp(24px, 4.2vw, 50px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.028em",
                  color: "#E29752",
                  margin: "0 0 1.5rem",
                  textShadow: "0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(226, 151, 82, 0.18)",
                }}
              >
                <span className="story-line-one">
                  <span className="story-why-wrapper">
                    <span className="story-why-word">
                      <span className="story-why-w">W</span>hy?
                    </span>
                  </span>
                  <span className="story-quality-phrase">Should Quality</span>
                </span>
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#E88B46",
                    display: "block",
                    textShadow: "0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 10px rgba(232, 139, 70, 0.22)",
                  }}
                >
                  Cost a Fortune?
                </span>
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "clamp(0.9375rem, 1.25vw, 1.0625rem)",
                  lineHeight: 1.75,
                  color: "#6E6259",
                  margin: "0 0 2rem",
                  maxWidth: "480px",
                }}
              >
                We challenge the modern retail paradigm. By removing intermediaries and
                partnering directly with master craftspeople, we curate an elite selection
                of goods where the price is capped, but the standard never is.
              </p>

              {/* Tactile Dotted divider line */}
              <div
                style={{
                  borderTop: "1.5px dotted rgba(180, 160, 140, 0.45)",
                  marginBottom: "2rem",
                  width: "100%",
                }}
              />

              {/* Neu-Tactile Stats Grid */}
              <div className="story-stats-grid">
                {STATS.map((stat, i) => {
                  const isPriceCeiling = stat.value === "₨5,000";

                  return (
                    <div
                      key={i}
                      className="story-stat-node"
                      style={{
                        position: "relative",
                        paddingLeft: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "clamp(22px, 2.8vw, 36px)",
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          color: isPriceCeiling ? "#FF6B00" : "#E29752",
                          lineHeight: 1.1,
                          marginBottom: "0.35rem",
                          textShadow: isPriceCeiling
                            ? "0 0 12px rgba(255, 107, 0, 0.7), 0 0 28px rgba(244, 117, 20, 0.45), 0 0 42px rgba(255, 140, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.8)"
                            : "0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 8px rgba(226, 151, 82, 0.22)",
                        }}
                      >
                        {stat.value}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "clamp(9px, 1.1vw, 11px)",
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#9C9084",
                        }}
                      >
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right Column: 4 Neu-Tactile Trust Cards ── */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}
            >
              {/* 2x2 Neu-Tactile Trust Cards */}
              <div className="trust-cards-grid">
                {TRUST_PILLARS.map((pillar) => {
                  const Icon = pillar.icon;
                  const isReturns = pillar.id === "returns";

                  return (
                    <div
                      key={pillar.id}
                      className={`trust-pill-card trust-card-${pillar.id} ${isReturns ? "trust-pill-orange" : "trust-pill-brown"}`}
                      style={{
                        borderRadius: "1rem",
                        padding: "clamp(1rem, 2.5vw, 1.5rem) clamp(0.875rem, 2vw, 1.35rem)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.85rem",
                        cursor: "default",
                        position: "relative",
                        overflow: "hidden",
                        /* Brown-card background + (optional) backdrop blur live in the
                           .trust-pill-brown CSS class so they can be tiered per device. */
                        background: isReturns
                          ? "linear-gradient(135deg, rgba(244, 117, 20, 0.94) 0%, rgba(223, 94, 3, 0.92) 50%, rgba(245, 158, 11, 0.94) 100%)"
                          : undefined,
                        border: isReturns
                          ? "1px solid rgba(255, 235, 215, 0.6)"
                          : "1px solid rgba(255, 215, 175, 0.28)",
                        boxShadow: isReturns
                          ? "0 18px 40px rgba(244, 117, 20, 0.36), 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 2px 2px 0 rgba(255, 255, 255, 0.85), inset 0 -2px 3px 0 rgba(140, 45, 0, 0.45)"
                          : "0 14px 34px rgba(18, 10, 5, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      {/* Top Specular Rim Lighting Sheen */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "1px",
                          background: isReturns
                            ? "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.95) 50%, transparent 100%)"
                            : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Neu-Tactile Bezel Socket for Icon */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "11px",
                          background: isReturns
                            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.18) 100%)"
                            : "linear-gradient(135deg, rgba(255, 183, 125, 0.24) 0%, rgba(20, 10, 5, 0.45) 100%)",
                          border: isReturns
                            ? "1px solid rgba(255, 255, 255, 0.75)"
                            : "1px solid rgba(255, 183, 125, 0.32)",
                          boxShadow: isReturns
                            ? "0 4px 10px rgba(0, 0, 0, 0.15), inset 0 1.5px 2px rgba(255, 255, 255, 0.85), inset 0 -1px 2px rgba(120, 45, 0, 0.35)"
                            : "0 3px 8px rgba(0, 0, 0, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.35), inset 0 -1.5px 2px rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={19} color={isReturns ? "#FFFFFF" : "#FFB77D"} strokeWidth={2.2} />
                      </div>

                      <h4
                        style={{
                          fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                          fontSize: "clamp(0.9375rem, 1.8vw, 1.125rem)",
                          fontWeight: isReturns ? 800 : 700,
                          lineHeight: 1.3,
                          letterSpacing: "-0.015em",
                          color: isReturns ? "#FFFFFF" : "#FDFBF7",
                          textShadow: isReturns
                            ? "0 1px 3px rgba(120, 40, 0, 0.45)"
                            : "0 1px 3px rgba(0, 0, 0, 0.65)",
                          margin: 0,
                        }}
                      >
                        {pillar.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* ── Bento Grid Layout (12-column grid, responsive row heights) ── */
        .category-bento-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          grid-auto-rows: clamp(230px, 65vw, 300px);
        }

        /* Responsive category numbering */
        .bento-num-desktop {
          display: none;
        }
        .bento-num-mobile {
          display: inline;
        }

        /* Mobile preview ordering: 05 second, 03 (watch) on bottom */
        .bento-item-01 { order: 1; }
        .bento-item-05 { order: 2; }
        .bento-item-02 { order: 3; }
        .bento-item-04 { order: 4; }
        .bento-item-03 { order: 5; }

        @media (min-width: 640px) {
          .category-bento-grid {
            gap: 24px;
            grid-auto-rows: 300px;
          }
        }

        @media (min-width: 768px) {
          .bento-num-desktop {
            display: inline;
          }
          .bento-num-mobile {
            display: none;
          }
          .category-bento-grid {
            grid-template-columns: repeat(12, 1fr);
          }
          .category-bento-col-8 {
            grid-column: span 8;
          }
          .category-bento-col-4 {
            grid-column: span 4;
          }
          /* Reset ordering on desktop to preserve original layout */
          .bento-item-01,
          .bento-item-02,
          .bento-item-03,
          .bento-item-04,
          .bento-item-05 {
            order: initial !important;
          }
        }

        .category-showcase-section {
          padding: clamp(1rem, 2vw, 2rem) clamp(0.75rem, 3vw, 1.5rem) clamp(2.5rem, 5vw, 5rem);
        }

        .category-showcase-container {
          padding: 0 clamp(0px, 2vw, 48px);
        }

        .category-bento-label-overlay {
          padding: 2rem;
        }

        @media (max-width: 640px) {
          .category-bento-label-overlay {
            padding: 1.25rem 1rem !important;
          }
        }

        @media (max-width: 360px) {
          .category-bento-label-overlay {
            padding: 1rem 0.75rem !important;
          }
        }

        .category-bento-card-wrapper {
          height: 100%;
          min-height: 0;
        }

        .category-bento-card {
          border: none !important;
          outline: none !important;
        }

        .category-bento-image {
          transform: scale(1);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── Bento Card Hover (Optimized GPU Scale + Preserved Typography & Button Styles) ── */
        @media (hover: hover) and (pointer: fine) {
          .category-bento-card:hover .category-bento-image {
            transform: scale(1.06);
          }

          .category-bento-card:hover .category-bento-title {
            color: #FFA559 !important;
            text-shadow: 0 0 20px rgba(244, 117, 20, 0.6), 0 2px 8px rgba(0, 0, 0, 0.95) !important;
          }

          .category-bento-card:hover .tactile-number-badge {
            border-color: rgba(244, 117, 20, 0.6) !important;
            background: linear-gradient(180deg, rgba(48, 24, 10, 0.95) 0%, rgba(20, 10, 4, 0.98) 100%) !important;
            box-shadow: 0 4px 14px rgba(244, 117, 20, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.6), inset 0 -1px 2px rgba(0, 0, 0, 0.9) !important;
          }

          .category-bento-card:hover .category-bento-number {
            color: #FFFFFF !important;
            text-shadow: 0 0 14px #F47514, 0 0 26px rgba(244, 117, 20, 0.9) !important;
          }

          .category-bento-card:hover .category-bento-arrow-disc {
            background: linear-gradient(135deg, #F47514 0%, #D97706 100%) !important;
            border-color: rgba(255, 235, 215, 0.65) !important;
            box-shadow: 0 8px 20px rgba(244, 117, 20, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.7), inset 0 -1.5px 2px rgba(120, 45, 0, 0.6) !important;
            transform: scale(1.05);
          }

          .category-bento-card:hover .category-bento-arrow {
            color: #FFFFFF !important;
            opacity: 1 !important;
            transform: translateX(2px);
          }
        }

        /* ── Story Section Spacing (Desktop preserved, mobile tight & balanced) ── */
        .story-section-wrapper {
          margin-top: 7rem;
          padding-top: 2rem;
        }

        @media (max-width: 768px) {
          .story-section-wrapper {
            margin-top: 2.25rem !important;
            padding-top: 0.5rem !important;
          }
        }

        /* ── Story Headline "Why? Should Quality" One-Line Container ── */
        .story-line-one {
          display: inline-flex;
          align-items: baseline;
          flex-wrap: nowrap;
          white-space: nowrap;
          max-width: 100%;
        }

        .story-quality-phrase {
          display: inline;
          white-space: nowrap;
        }

        /* ── Story Headline "Why?" Kinetic Typography ── */
        .story-why-wrapper {
          display: inline-block;
          overflow: hidden;
          vertical-align: -0.05em;
          line-height: 1.05;
          margin-right: 0.28em;
          padding-right: 0.12em;
          padding-top: 0.08em;
          padding-bottom: 0.08em;
          background: transparent !important;
          box-shadow: none !important;
        }

        .story-why-word {
          display: inline-flex;
          align-items: baseline;
          font-size: clamp(34px, 5.6vw, 68px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.01em;
          padding-right: 0.08em;
          background: linear-gradient(135deg, #110B07 0%, #2B1608 45%, #42220D 75%, #0B0704 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: none !important;
          text-shadow: none !important;
          animation: revealWhy 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform, opacity;
        }

        .story-why-w {
          display: inline-block;
          font-size: 1.25em;
          line-height: 0.85;
          font-weight: 950;
          vertical-align: -0.02em;
          background: linear-gradient(135deg, #0A0604 0%, #231207 40%, #3D200C 70%, #000000 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: none !important;
          text-shadow: none !important;
        }

        @keyframes revealWhy {
          0% {
            opacity: 0;
            transform: translateY(105%) rotate(4deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0%) rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .story-why-word {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        /* ── Story Grid (Left Narrative + Right Trust Cards) ── */
        .story-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(2.5rem, 5vw, 3.5rem);
          align-items: center;
        }

        @media (min-width: 1024px) {
          .story-grid {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }

        .story-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: clamp(1rem, 3vw, 2.5rem);
          row-gap: clamp(1.25rem, 2.5vw, 2rem);
        }

        .trust-cards-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        /* ── Brown glass trust cards: tiered "frosted" rendering ──
           Default (mobile / touch / low-end): NO backdrop-filter. backdrop-filter
           forces a per-frame offscreen read-back + Gaussian pass of everything
           underneath (incl. the mix-blend-mode bg art) for each of the 3 cards,
           which is what janks low-end GPUs while scrolling. A 4px blur over the
           soft cream/painted background is visually ~identical to a marginally
           denser tint, so we fake it with +0.05 alpha — zero GPU cost, the
           gradient is rasterised once and cached with the layer. */
        .trust-pill-brown {
          background: linear-gradient(
            135deg,
            rgba(32, 18, 10, 0.5) 0%,
            rgba(20, 11, 6, 0.43) 50%,
            rgba(12, 7, 4, 0.53) 100%
          );
          contain: layout paint;
        }

        /* Capable devices only (large screen + fine pointer + no reduced-
           transparency/motion preference): restore the real frosted glass. */
        @media (min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          @supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
            .trust-pill-brown {
              background: linear-gradient(
                135deg,
                rgba(32, 18, 10, 0.45) 0%,
                rgba(20, 11, 6, 0.38) 50%,
                rgba(12, 7, 4, 0.48) 100%
              );
              -webkit-backdrop-filter: blur(4px);
              backdrop-filter: blur(4px);
            }
          }
        }

        @media (prefers-reduced-transparency: reduce) {
          .trust-pill-brown {
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
          }
        }

        /* Mobile trust cards ordering: 7-Day Returns in 2nd position */
        .trust-card-cod { order: 1; }
        .trust-card-returns { order: 2; }
        .trust-card-ceiling { order: 3; }
        .trust-card-craft { order: 4; }

        @media (min-width: 768px) {
          /* Desktop: restore original layout order */
          .trust-card-cod,
          .trust-card-ceiling,
          .trust-card-returns,
          .trust-card-craft {
            order: initial !important;
          }
        }

        @media (max-width: 480px) {
          .trust-cards-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }

        /* ── Section Background Art (Responsive down to 320px) ── */
        .category-bg-graphic {
          width: clamp(340px, 48vw, 720px);
          max-width: 100%;
        }

        @media (max-width: 768px) {
          .category-bg-graphic {
            width: clamp(280px, 62vw, 520px);
          }
        }

        @media (max-width: 480px) {
          .category-bg-graphic {
            width: clamp(240px, 85vw, 380px);
          }
        }

        @media (max-width: 340px) {
          .category-bg-graphic {
            width: 100%;
            max-width: 290px;
          }
        }
      `}</style>
    </section>
  );
}


"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import ProductCard from "@/components/ProductCard";

// ─── Skeleton card (minimalist 3-line themed) ──────────────────────────────
function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "240px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "260px",
          background: "#FFFFFF",
          borderRadius: "0.375rem",
          marginBottom: "0.75rem",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        }}
        className="fps-skeleton"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <div style={{ height: "12px", width: "45%", borderRadius: "3px", background: "#EAE3D5" }} className="fps-skeleton" />
        <div style={{ height: "12px", width: "80%", borderRadius: "3px", background: "#E2D9C8" }} className="fps-skeleton" />
        <div style={{ height: "12px", width: "35%", borderRadius: "3px", background: "#EAE3D5" }} className="fps-skeleton" />
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function FeaturedProductsSection() {
  const shouldReduceMotion = useReducedMotion();
  const { data: products, isLoading, error, fetch } = useFeaturedProducts(10);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); scrollNext(); }
    },
    [scrollPrev, scrollNext]
  );

  return (
    <section
      id="featured-products"
      aria-label="Featured Products"
      style={{
        background: "transparent",
        paddingTop: "clamp(1.25rem, 2.5vw, 2.25rem)",
        paddingBottom: "clamp(3.5rem, 5.5vw, 5rem)",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      {/* ── Soft ambient warm radiance behind centered header ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(350px, 70vw, 750px)",
          height: "300px",
          background: "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(245, 158, 11, 0.08) 0%, rgba(250, 248, 245, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Middle-Centered Header with 3D Emblem ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: "0 clamp(1rem, 2.5vw, 2.5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── fa.png — Centered 3D Emblem without any black effect ── */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "clamp(240px, 34vw, 440px)",
            aspectRatio: "2207 / 892",
            margin: "0 auto 0.4rem",
            filter: "drop-shadow(0 12px 24px rgba(180, 140, 60, 0.15))",
          }}
        >
          <Image
            src="/images/fa.png"
            alt="Featured Products Collection"
            fill
            priority
            sizes="(max-width: 768px) 280px, 440px"
            style={{ objectFit: "contain" }}
          />
        </motion.div>

        {/* Centered Descriptive Tagline */}
        <motion.p
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(0.85rem, 1.1vw, 1rem)",
            color: "#736453",
            maxWidth: "520px",
            margin: "0 auto 1.25rem",
            lineHeight: 1.5,
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Handpicked masterworks blending artisan quality with accessible luxury.
        </motion.p>
      </div>

      {/* ── Carousel Sub-Bar: Drag Hint & Navigation Controls (Full Width) ── */}
      <div
        style={{
          width: "100%",
          padding: "0 clamp(1rem, 2.5vw, 2.5rem)",
          margin: "0 auto 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#C9922A",
            }}
          />
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "#8F6B28",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: 0,
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Swipe or drag to explore
          </p>
        </div>

        {/* Prev / Next buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={scrollPrev}
            aria-label="Previous products"
            className="fps-nav-btn"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "1px solid rgba(180, 140, 60, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#9A6F1E",
              boxShadow: "0 2px 8px rgba(180, 140, 60, 0.08)",
              transition: "all 0.22s ease",
            }}
          >
            <ChevronLeft style={{ width: "18px", height: "18px" }} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next products"
            className="fps-nav-btn"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#FFFFFF",
              border: "1px solid rgba(180, 140, 60, 0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#9A6F1E",
              boxShadow: "0 2px 8px rgba(180, 140, 60, 0.08)",
              transition: "all 0.22s ease",
            }}
          >
            <ChevronRight style={{ width: "18px", height: "18px" }} />
          </button>
        </div>
      </div>

      {/* ── Carousel Slider (Full-Width Viewport) ── */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Embla viewport */}
        <div
          ref={emblaRef}
          role="region"
          aria-label="Featured products carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          style={{
            overflow: "hidden",
            width: "100%",
            paddingLeft: "clamp(1rem, 2.5vw, 2.5rem)",
            cursor: "grab",
            outline: "none",
          }}
          className="fps-carousel-viewport"
        >
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              paddingRight: "clamp(1rem, 2.5vw, 2.5rem)",
            }}
          >
            {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

            {!isLoading && error && (
              <div
                style={{
                  padding: "2rem 3rem",
                  borderRadius: "1.5rem",
                  border: "1px solid rgba(200,80,80,0.15)",
                  color: "#9A6F1E",
                  fontSize: "0.875rem",
                }}
              >
                Failed to load products: {error}
              </div>
            )}

            {!isLoading && !error && products.map((product, idx) => (
              <div key={product.id} style={{ flexShrink: 0 }}>
                <ProductCard product={product} priority={idx < 3} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .fps-carousel-viewport:active { cursor: grabbing !important; }
        .fps-carousel-viewport:focus-visible {
          outline: 2px solid rgba(201,146,42,0.5) !important;
          outline-offset: 4px;
          border-radius: 4px;
        }
        .fps-nav-btn:hover {
          background: #EDE5D4 !important;
          border-color: rgba(180,140,60,0.45) !important;
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(180,140,60,0.18) !important;
        }
        @keyframes fps-skeleton-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .fps-skeleton { animation: fps-skeleton-pulse 1.6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}

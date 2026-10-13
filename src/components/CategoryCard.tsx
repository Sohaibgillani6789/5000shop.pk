"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
}

interface CategoryCardProps {
  category: CategoryData;
  index: number;
}

// Brand Colors (Dark Glassmorphic Card with Vibrant Yellow/Gold Numbers & Accents)
const BRAND_GOLD = "#C9922A";
const BRAND_GOLD_LIGHT = "#E5B84C";
const CARD_BG_GRADIENT =
  "linear-gradient(155deg, rgba(201, 146, 42, 0.12) 0%, rgba(217, 119, 6, 0.06) 45%, rgba(10, 10, 10, 0.95) 100%)";

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Motion values for raw cursor position relative to card center [-0.5, 0.5]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map cursor offset to rotation degrees (-12deg to 12deg)
  const rotateXRaw = useTransform(y, [-0.5, 0.5], [12, -12]);
  const rotateYRaw = useTransform(x, [-0.5, 0.5], [-12, 12]);

  // Apply spring physics for smooth, organic 3D movement & natural return
  const springConfig = { stiffness: 280, damping: 22 };
  const rotateX = useSpring(rotateXRaw, springConfig);
  const rotateY = useSpring(rotateYRaw, springConfig);

  // Dynamic specular shine overlay position based on cursor position
  const shineOpacity = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY);
      return Math.min(distance * 1.5, 0.35);
    }
  );

  const shineGradient = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const angle = Math.atan2(latestY, latestX) * (180 / Math.PI) + 90;
      return `linear-gradient(${angle}deg, rgba(229, 184, 76, 0.25) 0%, transparent 65%)`;
    }
  );

  // Mouse move handler calculating normalized offset [-0.5, 0.5]
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normalizedX = mouseX / width - 0.5;
    const normalizedY = mouseY / height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Editorial diagonal staggered offset on desktop screens
  const desktopOffset = index % 2 === 1 ? "32px" : "0px";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        marginTop: desktopOffset,
        perspective: 1000,
      }}
      className="category-card-wrapper"
    >
      <Link
        href={`/category/${category.slug}`}
        aria-label={`Explore ${category.name} collection`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B84C] rounded-[24px]"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.98 }}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
          position: "relative",
          width: "100%",
          minHeight: "340px",
          borderRadius: "24px",
          padding: "2.25rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CARD_BG_GRADIENT,
          border: "1px solid rgba(201, 146, 42, 0.22)",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 25px rgba(201, 146, 42, 0.12)",
          cursor: "pointer",
          overflow: "hidden",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
        }}
        className="category-card-container"
      >
        {/* Specular Gold Glare/Shine Overlay */}
        {!shouldReduceMotion && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: shineGradient,
              opacity: shineOpacity,
              pointerEvents: "none",
              borderRadius: "24px",
              zIndex: 2,
            }}
          />
        )}

        {/* Ambient Internal Glow Orb (3D translateZ: 10px) */}
        <div
          style={{
            transform: "translateZ(10px)",
            position: "absolute",
            top: "-25%",
            right: "-25%",
            width: "240px",
            height: "240px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201, 146, 42, 0.25) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 75%)",
            filter: "blur(45px)",
            pointerEvents: "none",
          }}
        />

        {/* Card Number (3D translateZ: 20px - Vibrant Brand Yellow/Gold text fill) */}
        <div
          style={{
            transform: "translateZ(20px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontSize: "3.75rem",
              fontWeight: 900,
              lineHeight: 1,
              fontFamily: "var(--font-outfit), sans-serif",
              background: "linear-gradient(135deg, #C9922A 0%, #E5B84C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.04em",
              userSelect: "none",
            }}
          >
            0{index + 1}
          </span>
        </div>

        {/* Category Name & Minimalist Typography (3D translateZ: 30px) */}
        <div
          style={{
            transform: "translateZ(30px)",
            position: "relative",
            margin: "1.5rem 0 1rem",
            zIndex: 3,
          }}
        >
          <h3
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {category.name}
          </h3>
        </div>

        {/* Bottom Action CTA (3D translateZ: 40px) */}
        <div
          style={{
            transform: "translateZ(40px)",
            position: "relative",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.85)",
              fontFamily: "var(--font-outfit), sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            Explore Collection
          </span>

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "rgba(201, 146, 42, 0.15)",
              border: "1px solid rgba(201, 146, 42, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND_GOLD_LIGHT,
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, border-color 0.3s ease",
            }}
            className="card-cta-icon"
          >
            <ArrowUpRight size={19} strokeWidth={2.5} />
          </div>
        </div>
        </motion.div>
      </Link>

      <style jsx global>{`
        .category-card-container:hover {
          border-color: rgba(229, 184, 76, 0.5) !important;
          box-shadow: 0 30px 60px -15px rgba(201, 146, 42, 0.35), 0 0 30px rgba(217, 119, 6, 0.20) !important;
        }

        .category-card-container:hover .card-cta-icon {
          background: linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_GOLD_LIGHT} 100%) !important;
          color: #052E1B !important;
          border-color: transparent !important;
          transform: translate(3px, -3px) scale(1.08);
        }
      `}</style>
    </motion.div>
  );
}

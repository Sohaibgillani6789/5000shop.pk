"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const isPng = product.image_url?.endsWith(".png");

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
      aria-label={`${product.category} - ${product.title} - Rs ${product.price.toLocaleString()}`}
      style={{
        position: "relative",
        width: "240px",
        flexShrink: 0,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        background: "transparent",
      }}
      className="product-card group"
    >
      {/* ── Product Image Container ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "260px",
          background: "#FFFFFF",
          borderRadius: "0.375rem",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "0.75rem",
          border: "1px solid rgba(0, 0, 0, 0.04)",
        }}
      >
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          priority={priority}
          sizes="240px"
          style={{
            objectFit: isPng ? "contain" : "cover",
            padding: isPng ? "1.25rem" : "0",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="product-card-img"
        />

        {/* ── Tag Badge: Top-Left Rectangular Tag with Solid Orange Background & Black Text ── */}
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "0.6875rem",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#000000",
            background: "#F47514",
            border: "none",
            padding: "2.5px 7px",
            borderRadius: "2px",
            lineHeight: 1.15,
            zIndex: 2,
            boxShadow: "0 1px 4px rgba(244, 117, 20, 0.25)",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          {product.badge || "NEW"}
        </span>

        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255, 255, 255, 0.78)",
              backdropFilter: "blur(2px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
            }}
          >
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── 3-Line Description: Category > Product Name > Rs Price ── */}
      <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        {/* Line 1: Category Name */}
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            color: "#1A120A",
            margin: "0 0 2px 0",
            lineHeight: 1.3,
            fontFamily: "var(--font-outfit), sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {product.category}
        </p>

        {/* Line 2: Product Name */}
        <h3
          style={{
            fontSize: "0.8125rem",
            fontWeight: 400,
            color: "#4B5563",
            margin: "0 0 4px 0",
            lineHeight: 1.35,
            fontFamily: "var(--font-outfit), sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.1em",
          }}
        >
          {product.title}
        </h3>

        {/* Line 3: Rs Price */}
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "#1A120A",
            margin: 0,
            lineHeight: 1.3,
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Rs {product.price.toLocaleString()}
        </p>
      </div>

      <style>{`
        .product-card:hover .product-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </motion.article>
  );
}

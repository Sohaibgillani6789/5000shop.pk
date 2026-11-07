"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/supabase/types";

/**
 * CategoryProductCard
 *
 * Clean, bordered, high-conversion card used exclusively on the 5 Category
 * pages (`/category/[slug]`). The shared `ProductCard` (Home carousel,
 * related products) is intentionally left untouched.
 *
 * Structure: top-left badge → contained image → label → 2-line title →
 * price / compare-at / % OFF row. The whole card is a single <Link>, so it
 * contains no nested interactive elements (valid HTML, no event conflicts).
 */

const FALLBACK_IMAGE = "/images/hero-sneakers.png";

interface CategoryProductCardProps {
  product: Product;
  /** Optional small label above the title (e.g. category name). */
  label?: string | null;
  priority?: boolean;
}

function CategoryProductCard({
  product,
  label,
  priority = false,
}: CategoryProductCardProps) {
  const [imgSrc, setImgSrc] = useState(
    product.image_url && product.image_url.trim() !== ""
      ? product.image_url
      : FALLBACK_IMAGE
  );

  const hasDiscount =
    product.compare_at_price != null && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
      )
    : 0;

  // "DEAL" when discounted, otherwise the first Supabase tag, otherwise "NEW"
  const badge = hasDiscount
    ? "DEAL"
    : product.tags && product.tags.length > 0
      ? product.tags[0]
      : "NEW";

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.title} - Rs ${product.price.toLocaleString()}`}
      className="group relative flex flex-col justify-between bg-white border border-neutral-200/90 rounded-xl p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F47514] focus-visible:ring-offset-2"
    >
      {/* ── Top-Left Badge ── */}
      <span className="self-start bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded leading-none">
        {badge}
      </span>

      {/* ── Product Image ── */}
      <div className="relative w-full aspect-[4/3] my-4 flex items-center justify-center overflow-hidden bg-white">
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
        />

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── Meta ── */}
      <div className="flex flex-col flex-1">
        {label && (
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 mb-1">
            {label}
          </p>
        )}

        <h3 className="text-sm sm:text-[15px] font-bold text-neutral-900 leading-snug line-clamp-2 min-h-[2.5rem] mb-2.5 pb-0!">
          {product.title}
        </h3>

        <div className="flex items-center flex-wrap gap-2 mt-auto">
          <span className="text-base font-extrabold text-[#F47514]">
            Rs {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs font-medium text-neutral-400 line-through">
                Rs {product.compare_at_price!.toLocaleString()}
              </span>
              <span className="bg-orange-50 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default memo(CategoryProductCard);

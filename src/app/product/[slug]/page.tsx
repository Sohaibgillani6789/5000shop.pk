import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
  Sparkles,
  Tag,
} from "lucide-react";

import { getProductBySlug, getRelatedProducts } from "@/lib/supabase/products";
import ProductActions from "@/components/ProductActions";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | 5 Hazaar Tak",
      description: "The requested product does not exist.",
    };
  }

  const categoryName = product.category?.name || "Curated Products";
  const title = `${product.title} | ${categoryName} Under ₨5,000`;
  const description =
    product.description ||
    `Order ${product.title} for Rs. ${product.price.toLocaleString()} at 5 Hazaar Tak. Nationwide Cash on Delivery in Pakistan.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: product.image_url,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isPng = product.image_url?.endsWith(".png");
  const badge = product.tags && product.tags.length > 0 ? product.tags[0] : "NEW";

  const hasDiscount =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100
      )
    : 0;
  const discountAmount = hasDiscount
    ? product.compare_at_price! - product.price
    : 0;

  // Fetch related products if category exists
  const relatedProducts = product.category_id
    ? await getRelatedProducts(product.category_id, product.id, 4)
    : [];

  // Schema.org Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image_url.startsWith("http")
      ? product.image_url
      : `https://5000shop.pk${product.image_url}`,
    description: product.description || product.title,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <div className="min-h-screen bg-[#050708] text-white">
      {/* Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════════════════════════════════════════════════════
          BREADCRUMBS & CONTEXT BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="pt-28 sm:pt-36 pb-6 bg-[#080503] border-b border-[rgba(180,140,60,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb navigation"
            className="flex items-center flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 font-['Outfit',var(--font-outfit),sans-serif]"
          >
            <Link
              href="/"
              className="hover:text-[#F47514] transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />

            {product.category ? (
              <>
                <Link
                  href={`/category/${product.category.slug}`}
                  className="hover:text-[#F47514] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
                >
                  {product.category.name}
                </Link>
                <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
              </>
            ) : (
              <>
                <Link
                  href="/#categories"
                  className="hover:text-[#F47514] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
                >
                  Categories
                </Link>
                <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
              </>
            )}

            <span className="text-[#F47514] truncate max-w-[200px] sm:max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN PRODUCT DETAIL STAGE (WARM CREAM PALETTE)
          ═══════════════════════════════════════════════════════════════ */}
      <main
        className="py-10 sm:py-16 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          color: "#1A1108",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ── Left Column: Product Visual Showcase (5 or 6 cols on lg) ── */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square max-h-[560px] bg-white rounded-3xl overflow-hidden border border-[#E5DAC8] shadow-2xl shadow-amber-900/10 flex items-center justify-center p-4 sm:p-8">
                {/* Product Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    style={{
                      objectFit: isPng ? "contain" : "cover",
                      padding: isPng ? "2rem" : "0",
                    }}
                    className="rounded-2xl transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Tag Badge: Top-Left */}
                <span className="absolute top-5 left-5 text-[11px] font-extrabold uppercase tracking-widest text-black bg-[#F47514] px-3 py-1 rounded-sm shadow-md font-['Outfit',var(--font-outfit),sans-serif]">
                  {badge}
                </span>

                {/* Discount Badge: Top-Right */}
                {hasDiscount && (
                  <span className="absolute top-5 right-5 text-[11px] font-extrabold uppercase tracking-wider text-white bg-red-600 px-3 py-1 rounded-sm shadow-md font-['Outfit',var(--font-outfit),sans-serif]">
                    -{discountPercent}% OFF
                  </span>
                )}

                {/* Out of Stock Overlay */}
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
                    <span className="text-sm font-bold uppercase tracking-widest text-neutral-600 bg-white px-5 py-2 rounded-full border border-neutral-300 shadow">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Verified Product Quality Pill */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#F5EFE4] border border-[#E2D5BE] text-xs font-semibold text-[#665649] font-['Outfit',var(--font-outfit),sans-serif]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F47514]" />
                  <span>100% Quality Audited Before Dispatch</span>
                </div>
                <span className="text-[11px] uppercase font-bold text-[#9C6D1F]">
                  Authentic Guarantee
                </span>
              </div>
            </div>

            {/* ── Right Column: Product Info & Actions (6 cols on lg) ── */}
            <div className="lg:col-span-6 flex flex-col font-['Outfit',var(--font-outfit),sans-serif]">
              {/* Category Breadcrumb Tag */}
              {product.category && (
                <div className="mb-2">
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#B44100] hover:text-[#F47514] transition-colors"
                  >
                    <span>{product.category.name}</span>
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1A1108] tracking-tight uppercase leading-[1.12]">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#1A1108]">
                  ₨ {product.price.toLocaleString()}
                </span>

                {hasDiscount && (
                  <>
                    <span className="text-lg text-neutral-400 line-through font-semibold">
                      ₨ {product.compare_at_price!.toLocaleString()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 uppercase tracking-wide">
                      Save ₨ {discountAmount.toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Price Ceiling Assurance Badge */}
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF5EB] border border-[#F47514]/30 text-xs font-bold text-[#B44100] uppercase tracking-wide w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#F47514]" />
                <span>Strict Price Ceiling: Always ₨5,000 or Less</span>
              </div>

              {/* Stock Status Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                {product.in_stock ? (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock • Ready to Dispatch in 24h</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-[rgba(180,150,120,0.25)]">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#4A3B32] mb-2">
                  Product Overview
                </h2>
                <p className="text-sm sm:text-base text-[#594B40] leading-relaxed">
                  {product.description ||
                    "Expertly curated for everyday elegance. Built with premium materials adhering strictly to our 5 Hazaar Tak quality benchmark."}
                </p>
              </div>

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8B7B70] flex items-center gap-1 mr-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Tags:</span>
                  </span>
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#D5C9B8] text-xs font-semibold text-[#1A1108] shadow-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Interactive Purchase Controls */}
              <div className="mt-6 pt-2">
                <ProductActions
                  productId={product.id}
                  slug={product.slug}
                  title={product.title}
                  price={product.price}
                  imageUrl={product.image_url}
                  inStock={product.in_stock}
                />
              </div>

              {/* Marketplace Trust Perks */}
              <div className="mt-8 pt-6 border-t border-[rgba(180,150,120,0.25)] grid grid-cols-2 gap-3 text-xs font-medium text-[#4A3B32]">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E5DAC8] shadow-xs">
                  <Truck className="w-4 h-4 text-[#F47514] shrink-0" />
                  <span>Free delivery over ₨5,000</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E5DAC8] shadow-xs">
                  <Award className="w-4 h-4 text-[#F47514] shrink-0" />
                  <span>Cash on Delivery Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E5DAC8] shadow-xs">
                  <RefreshCw className="w-4 h-4 text-[#F47514] shrink-0" />
                  <span>7-Day Return Guarantee</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#E5DAC8] shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#F47514] shrink-0" />
                  <span>Guaranteed Price Under ₨5K</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              RELATED PRODUCTS SECTION (REUSING PRODUCT CARD)
              ═══════════════════════════════════════════════════════════════ */}
          {relatedProducts.length > 0 && (
            <section
              aria-label="Related Products"
              className="mt-16 sm:mt-24 pt-12 border-t border-[rgba(180,150,120,0.3)] font-['Outfit',var(--font-outfit),sans-serif]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#B44100] block mb-1">
                    More in this vertical
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#1A1108] tracking-tight">
                    Related Collection
                  </h3>
                </div>

                {product.category && (
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1A1108] hover:text-[#F47514] transition-colors"
                  >
                    <span>View All</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
                {relatedProducts.map((relProduct) => (
                  <div
                    key={relProduct.id}
                    className="w-full max-w-[280px] sm:max-w-none"
                  >
                    <ProductCard product={relProduct} layoutMode="grid" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

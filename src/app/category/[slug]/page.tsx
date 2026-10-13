import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, Sparkles, ShieldCheck, PackageSearch } from "lucide-react";

import {
  getCategoryBySlug,
  getProductsByCategory,
  getCategorySlugs,
} from "@/lib/supabase/products";
import ProductCard from "@/components/ProductCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CANONICAL_SLUGS = [
  "fashion",
  "beauty",
  "electronics",
  "home",
  "accessories",
] as const;

export async function generateStaticParams() {
  const dynamicSlugs = await getCategorySlugs();
  const slugs = dynamicSlugs.length > 0 ? dynamicSlugs : CANONICAL_SLUGS;
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | 5 Hazaar Tak",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.name} Under ₨5,000 | 5 Hazaar Tak`,
    description:
      category.description ||
      `Discover handpicked ${category.name} all strictly under ₨5,000. Cash on delivery across Pakistan.`,
    openGraph: {
      title: `${category.name} Under ₨5,000 | 5 Hazaar Tak`,
      description:
        category.description ||
        `Curated ${category.name} under ₨5,000. 100% quality audited.`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  return (
    <div className="min-h-screen bg-[#050708] text-white">
      {/* ═══════════════════════════════════════════════════════════════
          DARK HERO CATEGORY HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <header className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 overflow-hidden border-b border-[rgba(244,117,20,0.15)]">
        {/* Ambient Top Glow Orbs */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(244,117,20,0.18)_0%,transparent_70%)] pointer-events-none blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 font-['Outfit',var(--font-outfit),sans-serif] mb-6"
          >
            <Link
              href="/"
              className="hover:text-[#F47514] transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <Link
              href="/#categories"
              className="hover:text-[#F47514] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F47514] rounded"
            >
              Categories
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-[#F47514]">{category.name}</span>
          </nav>

          {/* Category Hero Content */}
          <div className="max-w-3xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#200E02] border border-[#F47514]/30 text-[11px] font-bold text-[#FFF5EB] tracking-wider uppercase backdrop-blur-md mb-4 font-['Outfit',var(--font-outfit),sans-serif]">
              <Sparkles className="w-3 h-3 text-[#F47514] shrink-0" />
              <span>Curated Vertical</span>
              <span className="text-[#F47514]/60">•</span>
              <span className="text-[#F47514]">All Under ₨5,000</span>
            </div>

            {/* Main Category Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.05] font-['Outfit',var(--font-outfit),sans-serif] text-white">
              {category.name}
            </h1>

            {/* Category Description */}
            {category.description && (
              <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-['Outfit',var(--font-outfit),sans-serif] max-w-2xl">
                {category.description}
              </p>
            )}

            {/* Quality & Value Proposition Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-300 font-['Outfit',var(--font-outfit),sans-serif]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F47514]" />
                <span>Strict Price Ceiling</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-400">
                <span>{products.length} {products.length === 1 ? "Product" : "Products"} Available</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          WARM CREAM PRODUCT GRID AREA
          ═══════════════════════════════════════════════════════════════ */}
      <main
        className="relative py-12 sm:py-18 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          color: "#1A1108",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Subheader bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-[rgba(180,150,120,0.25)] mb-8 font-['Outfit',var(--font-outfit),sans-serif]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#1A1108] tracking-tight">
                Collection Showcase
              </h2>
              <p className="text-xs sm:text-sm text-[#736453] mt-0.5 font-medium">
                Showing in-stock items curated for quality craftsmanship.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A6F1E] bg-[#FFF8EE] px-3.5 py-1.5 rounded-full border border-[#E5B84C]/40 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-[#C9922A] animate-pulse" />
              <span>{products.length} In Stock</span>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
              {products.map((product, idx) => (
                <div key={product.id} className="w-full max-w-[280px] sm:max-w-none">
                  <ProductCard
                    product={product}
                    layoutMode="grid"
                    priority={idx < 4}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="max-w-lg mx-auto py-16 px-6 text-center rounded-3xl bg-white border border-[#E8DEC9] shadow-xl shadow-amber-900/5 font-['Outfit',var(--font-outfit),sans-serif]">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3E8] border border-[#E8DEC9] flex items-center justify-center text-[#C9922A] mb-4 shadow-sm">
                <PackageSearch className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#1A1108]">
                Catalog Being Refreshed
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#736453] leading-relaxed">
                We are actively curating new additions for {category.name}. Every piece is quality checked and guaranteed to be under ₨5,000.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#categories"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1A1108] hover:bg-[#F47514] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Explore Other Categories
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#FAF3E8] hover:bg-[#EDE5D4] text-[#1A1108] text-xs font-bold uppercase tracking-wider transition-colors border border-[#E8DEC9]"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

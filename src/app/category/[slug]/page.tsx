import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageSearch } from "lucide-react";

import {
  getCategoryBySlug,
  getProductsByCategory,
  getCategorySlugs,
} from "@/lib/supabase/products";
import CategoryProductCard from "@/components/CategoryProductCard";
import Footer from "@/components/Footer";

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
        `Curated ${category.name} strictly under ₨5,000. Nationwide Cash on Delivery.`,
      type: "website",
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // Parallel fetch (no sequential waterfall between category + products)
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-['Outfit',var(--font-outfit),sans-serif]">
      {/* Offset for the fixed site header (height published by Navbar) */}
      <main
        className="flex-1 bg-white relative z-10"
        style={{ paddingTop: "var(--site-header-height, 89px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ── Section Header: accent lines + centered title ── */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <span aria-hidden="true" className="flex-1 h-[1.5px] bg-[#F47514]/80" />
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-neutral-900 whitespace-nowrap pb-0!">
              {category.name}
            </h1>
            <span aria-hidden="true" className="flex-1 h-[1.5px] bg-[#F47514]/80" />
          </div>

          {/* ── Product Grid ── */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, idx) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  label={product.category?.name ?? category.name}
                  priority={idx < 4}
                />
              ))}
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="max-w-md mx-auto py-14 px-6 text-center rounded-xl bg-white border border-neutral-200/90">
              <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-[#F47514] mb-4">
                <PackageSearch className="w-7 h-7 stroke-[1.8]" />
              </div>
              <h2 className="text-lg font-extrabold uppercase tracking-wide text-neutral-900">
                Catalog Being Refreshed
              </h2>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                We are actively curating new additions for {category.name}. Every piece is quality checked and guaranteed to be under ₨5,000.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#categories"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-[#F47514] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Explore Other Categories
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors border border-neutral-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer showHeroBanner={false} />
    </div>
  );
}

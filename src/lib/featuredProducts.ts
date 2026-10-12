/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Featured Products Data Layer
 *
 *  HOW TO SWITCH FROM MOCK → SUPABASE:
 *  1. Run the SQL migration in src/types/product.ts comments
 *  2. Install: npm install @supabase/supabase-js
 *  3. Add to .env.local:
 *       NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *       NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 *  4. Uncomment the Supabase block below and comment out the mock return.
 * ──────────────────────────────────────────────────────────────
 */

import type { Product } from "@/types/product";

// ──────────────────────────────────────────────────────────────
//  10 Realistic Mock Products (Pakistan e-commerce context)
// ──────────────────────────────────────────────────────────────
export const MOCK_FEATURED_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    title: "Chronograph Obsidian Watch",
    subtitle: "Tech Accents · Steel Bezel",
    slug: "chronograph-obsidian-watch",
    price: 1850,
    compare_at_price: 3200,
    image_url: "/images/watchi.jpg",
    category: "Tech Accents",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.8,
    review_count: 124,
  },
  {
    id: "prod-002",
    title: "Amber Oud Parfum",
    subtitle: "Signature Fragrance",
    slug: "amber-oud-parfum",
    price: 4200,
    compare_at_price: 6500,
    image_url: "/images/perfume1.jpg",
    category: "Apothecary",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.9,
    review_count: 87,
  },
  {
    id: "prod-003",
    title: "Matte Ceramic Pot Set",
    subtitle: "Home Décor · Set of 3",
    slug: "matte-ceramic-pot-set",
    price: 2950,
    image_url: "/images/pot.jpg",
    category: "Home & Living",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.6,
    review_count: 53,
  },
  {
    id: "prod-004",
    title: "Pro Wireless Earbuds",
    subtitle: "Tech Accents · ANC",
    slug: "pro-wireless-earbuds",
    price: 4850,
    compare_at_price: 7200,
    image_url: "/images/earbud.jpg",
    category: "Tech Accents",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.7,
    review_count: 210,
  },
  {
    id: "prod-005",
    title: "Heritage Canvas Tote",
    subtitle: "Womens Fashion",
    slug: "heritage-canvas-tote",
    price: 1650,
    image_url: "/images/hero-handbag.png",
    category: "Fashion",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.5,
    review_count: 66,
  },
  {
    id: "prod-006",
    title: "Minimalist Desk Lamp",
    subtitle: "Home & Living · Adjustable",
    slug: "minimalist-desk-lamp",
    price: 3100,
    compare_at_price: 4800,
    image_url: "/images/hero-lamp.png",
    category: "Home & Living",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.4,
    review_count: 39,
  },
  {
    id: "prod-007",
    title: "Velocity Runner Sneakers",
    subtitle: "Mens Footwear · All-Terrain",
    slug: "velocity-runner-sneakers",
    price: 4999,
    compare_at_price: 8500,
    image_url: "/images/hero-sneakers.png",
    category: "Fashion",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.9,
    review_count: 312,
  },
  {
    id: "prod-008",
    title: "Saffron Rose Serum",
    subtitle: "Skin Care · 30ml",
    slug: "saffron-rose-serum",
    price: 2800,
    image_url: "/images/perfume1.jpg",
    category: "Apothecary",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.8,
    review_count: 91,
  },
  {
    id: "prod-009",
    title: "Chronos Field Watch",
    subtitle: "Tech Accents · Quartz",
    slug: "chronos-field-watch",
    price: 3750,
    compare_at_price: 5500,
    image_url: "/images/hero-watch.png",
    category: "Tech Accents",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.7,
    review_count: 148,
  },
  {
    id: "prod-010",
    title: "Studio Pro ANC Headphones",
    subtitle: "Tech Accents · High-Fidelity",
    slug: "studio-pro-anc-headphones",
    price: 4500,
    image_url: "/images/hero-headphones.png",
    category: "Tech Accents",
    is_featured: true,
    in_stock: true,
    badge: "NEW",
    rating: 4.9,
    review_count: 82,
  },
];

// ──────────────────────────────────────────────────────────────
//  Fetch abstraction — swap comments to enable Supabase
// ──────────────────────────────────────────────────────────────

export type FetchProductsResult = {
  data: Product[] | null;
  error: string | null;
};

/**
 * getFeaturedProducts — manual, single-call fetch (no auto-polling).
 * Returns mock data until Supabase credentials are wired up.
 */
export async function getFeaturedProducts(limit = 10): Promise<FetchProductsResult> {
  // ── MOCK (active) ──────────────────────────────────────────
  return { data: MOCK_FEATURED_PRODUCTS.slice(0, limit), error: null };

  // ── SUPABASE (uncomment when ready) ───────────────────────
  // try {
  //   const { createClient } = await import("@supabase/supabase-js");
  //   const supabase = createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  //   );
  //   const { data, error } = await supabase
  //     .from("products")
  //     .select("*")
  //     .eq("is_featured", true)
  //     .order("created_at", { ascending: false })
  //     .limit(limit);
  //
  //   if (error) return { data: null, error: error.message };
  //   return { data: data as Product[], error: null };
  // } catch (err) {
  //   const message = err instanceof Error ? err.message : "Unknown fetch error";
  //   return { data: null, error: message };
  // }
}

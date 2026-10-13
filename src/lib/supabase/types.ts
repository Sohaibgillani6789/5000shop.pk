/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Supabase Database Types
 *
 *  Canonical TypeScript representations of the `categories` and
 *  `products` tables.  All query functions in `products.ts`
 *  return these types — never raw `any`.
 * ──────────────────────────────────────────────────────────────
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  color: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  image_url: string;
  description: string | null;
  featured: boolean;
  in_stock: boolean;
  display_order: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

/** Product with its related category object (from a joined query). */
export interface ProductWithCategory extends Product {
  category: Category | null;
}

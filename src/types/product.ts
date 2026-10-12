/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Product Type Definitions
 *  Designed for seamless Supabase plug-and-play.
 *
 *  SUPABASE SQL MIGRATION (copy-paste into the SQL editor):
 *  ─────────────────────────────────────────────────────────
 *
 *  -- Enable UUID generation
 *  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
 *
 *  CREATE TABLE public.products (
 *    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *    title       TEXT NOT NULL,
 *    subtitle    TEXT,
 *    slug        TEXT NOT NULL UNIQUE,
 *    price       NUMERIC(10, 2) NOT NULL,
 *    compare_at_price NUMERIC(10, 2),
 *    image_url   TEXT NOT NULL,
 *    category    TEXT NOT NULL,
 *    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
 *    in_stock    BOOLEAN NOT NULL DEFAULT TRUE,
 *    badge       TEXT,          -- e.g. "NEW", "BESTSELLER", "SALE"
 *    rating      NUMERIC(2, 1), -- e.g. 4.5
 *    review_count INT DEFAULT 0,
 *    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 *    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *  );
 *
 *  -- Row Level Security
 *  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
 *  CREATE POLICY "Public read" ON public.products
 *    FOR SELECT USING (TRUE);
 *
 *  -- Index for featured product fetching
 *  CREATE INDEX products_is_featured_idx ON public.products (is_featured);
 *  CREATE INDEX products_category_idx ON public.products (category);
 *
 *  -- Auto-update updated_at trigger
 *  CREATE OR REPLACE FUNCTION update_updated_at_column()
 *  RETURNS TRIGGER AS $$
 *  BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
 *  $$ LANGUAGE plpgsql;
 *
 *  CREATE TRIGGER set_updated_at
 *    BEFORE UPDATE ON public.products
 *    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 *
 * ──────────────────────────────────────────────────────────────
 */

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  price: number;
  compare_at_price?: number;
  image_url: string;
  category: string;
  is_featured: boolean;
  in_stock: boolean;
  badge?: "NEW" | "BESTSELLER" | "SALE" | "LIMITED" | string;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

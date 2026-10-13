-- ============================================================================
-- 5 HAZAAR TAK (5000shop.pk) — Supabase Database Migration
-- Migration: 001_featured_products_migration.sql
-- Description: Creates categories table, updates products table,
--              migrates legacy schema data, configures indexes and RLS.
--
-- Safety:
--   - Strictly non-destructive: NO DROP TABLE, DROP COLUMN, or TRUNCATE.
--   - Idempotent: safe to run multiple times without data loss or duplicate errors.
--   - Zero downtime: preserves all legacy columns for rollback safety.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. PRODUCTS TABLE (CREATE IF NOT EXISTS & SAFE EXTENSIONS)
-- ----------------------------------------------------------------------------
-- If the products table does not exist at all, create it with full target schema:
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If products table already existed, add newly required columns conditionally:
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Safely bind foreign key constraint if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_category_id_fkey'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_category_id_fkey
      FOREIGN KEY (category_id) REFERENCES public.categories(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 4. SEED CORE CATEGORIES (IDEMPOTENT)
-- ----------------------------------------------------------------------------
INSERT INTO public.categories (name, slug, display_order, is_active, description)
VALUES
  ('Mens & Womens Fashion', 'fashion', 1, TRUE, 'Curated fashion and apparel under ₨5,000'),
  ('Apothecary', 'beauty', 2, TRUE, 'Premium skincare, fragrances, and grooming'),
  ('Tech Accents', 'electronics', 3, TRUE, 'Everyday smart electronics and tech accessories'),
  ('Living Space', 'home', 4, TRUE, 'Artisan home accents, ceramics, and decor'),
  ('Accessories', 'accessories', 5, TRUE, 'Timepieces, bags, and luxury accessories')
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 5. DATA MIGRATION: is_featured -> featured
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'is_featured'
  ) THEN
    -- Migrate existing boolean values from legacy is_featured into new featured column
    EXECUTE '
      UPDATE public.products
      SET featured = is_featured
      WHERE is_featured IS NOT NULL
        AND (featured IS FALSE OR featured IS NULL);
    ';
    RAISE NOTICE 'Migrated legacy is_featured column to featured.';
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 6. DATA MIGRATION: legacy text category -> categories table & category_id
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'category'
  ) THEN
    -- 1. Insert any distinct legacy text category into categories if not present
    EXECUTE '
      INSERT INTO public.categories (name, slug, display_order, is_active)
      SELECT DISTINCT
        TRIM(category) AS name,
        LOWER(REGEXP_REPLACE(TRIM(category), ''[^a-zA-Z0-9]+'', ''-'', ''g'')) AS slug,
        99,
        TRUE
      FROM public.products
      WHERE category IS NOT NULL
        AND TRIM(category) <> ''''
        AND NOT EXISTS (
          SELECT 1 FROM public.categories c
          WHERE LOWER(c.name) = LOWER(TRIM(products.category))
             OR c.slug = LOWER(REGEXP_REPLACE(TRIM(products.category), ''[^a-zA-Z0-9]+'', ''-'', ''g''))
             OR c.slug = LOWER(TRIM(products.category))
        )
      ON CONFLICT (slug) DO NOTHING;
    ';

    -- 2. Map products.category_id using category name or slug match
    EXECUTE '
      UPDATE public.products p
      SET category_id = c.id
      FROM public.categories c
      WHERE p.category_id IS NULL
        AND p.category IS NOT NULL
        AND (
          LOWER(TRIM(p.category)) = LOWER(c.name)
          OR LOWER(REGEXP_REPLACE(TRIM(p.category), ''[^a-zA-Z0-9]+'', ''-'', ''g'')) = c.slug
          OR LOWER(TRIM(p.category)) = c.slug
        );
    ';
    RAISE NOTICE 'Migrated legacy category text data to category_id foreign keys.';
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 7. DATA MIGRATION: legacy badge -> tags array
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'badge'
  ) THEN
    -- Populate empty tags with badge if badge exists
    EXECUTE '
      UPDATE public.products
      SET tags = ARRAY[TRIM(badge)]::TEXT[]
      WHERE badge IS NOT NULL
        AND TRIM(badge) <> ''''
        AND (tags IS NULL OR tags = ''{}''::TEXT[]);
    ';

    -- Append badge to tags if not already present
    EXECUTE '
      UPDATE public.products
      SET tags = array_append(tags, TRIM(badge))
      WHERE badge IS NOT NULL
        AND TRIM(badge) <> ''''
        AND tags IS NOT NULL
        AND NOT (tags @> ARRAY[TRIM(badge)]::TEXT[]);
    ';
    RAISE NOTICE 'Migrated legacy badge column values to tags array.';
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 8. PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products (featured);
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON public.products (in_stock);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products (category_id);
CREATE INDEX IF NOT EXISTS products_display_order_idx ON public.products (display_order);

-- Compound index optimizing getFeaturedProducts():
-- SELECT ... WHERE featured = true AND in_stock = true ORDER BY display_order ASC
CREATE INDEX IF NOT EXISTS products_featured_stock_order_idx
  ON public.products (featured, in_stock, display_order);

-- Category indexes
CREATE INDEX IF NOT EXISTS categories_is_active_idx ON public.categories (is_active);
CREATE INDEX IF NOT EXISTS categories_display_order_idx ON public.categories (display_order);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories (slug);

-- ----------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) & PUBLIC SELECT POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Public read policy for categories (only active categories)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'categories'
      AND policyname = 'Allow public read active categories'
  ) THEN
    CREATE POLICY "Allow public read active categories" ON public.categories
      FOR SELECT
      USING (is_active = TRUE);
  END IF;

  -- Public read policy for products (only in-stock products)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'products'
      AND policyname = 'Allow public read in-stock products'
  ) THEN
    CREATE POLICY "Allow public read in-stock products" ON public.products
      FOR SELECT
      USING (in_stock = TRUE);
  END IF;
END $$;

-- NOTE: No public INSERT, UPDATE, or DELETE policies are added.
-- Product and category management requires authenticated administrative access.

-- ----------------------------------------------------------------------------
-- 10. AUTOMATIC updated_at TIMESTAMP TRIGGERS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_categories_updated_at'
  ) THEN
    CREATE TRIGGER set_categories_updated_at
      BEFORE UPDATE ON public.categories
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_products_updated_at'
  ) THEN
    CREATE TRIGGER set_products_updated_at
      BEFORE UPDATE ON public.products
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ============================================================================
-- 5 HAZAAR TAK (5000shop.pk) — Supabase Database Migration
-- Migration: 003_catalog_sku_and_stock_policy.sql
-- Description: Standardizes SKU identifiers across the catalog and documents
--              inventory stock handling architecture for Phase 8.
--
-- Safety:
--   - Strictly non-destructive: ADD COLUMN IF NOT EXISTS, safe constraints.
--   - Idempotent: safe to run multiple times without data loss or duplicate errors.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ADD SKU COLUMN TO PRODUCTS
-- ----------------------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku TEXT;

-- Safely add UNIQUE constraint on sku if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'products_sku_key'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_sku_key UNIQUE (sku);
  END IF;
END $$;

-- Index SKU for fast catalog lookup and administrative barcoding
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);

-- ----------------------------------------------------------------------------
-- 2. STANDARDIZE SKUs FOR EXISTING SEEDED CATALOG
-- Convention: 5HT-{CATEGORY_CODE}-{SLUG_ABBR}-{SEQUENCE}
-- ----------------------------------------------------------------------------
UPDATE public.products SET sku = '5HT-ELEC-OBS-001' WHERE slug = 'chronograph-obsidian-watch' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-ELEC-EAR-002' WHERE slug = 'pro-wireless-earbuds' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-ELEC-HDP-003' WHERE slug = 'studio-pro-anc-headphones' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-BEAU-AMB-001' WHERE slug = 'amber-oud-parfum' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-BEAU-ROSE-002' WHERE slug = 'saffron-rose-serum' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-HOME-POT-001' WHERE slug = 'matte-ceramic-pot-set' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-HOME-LMP-002' WHERE slug = 'minimalist-desk-lamp' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-FASH-TOT-001' WHERE slug = 'heritage-canvas-tote' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-FASH-SNK-002' WHERE slug = 'velocity-runner-sneakers' AND (sku IS NULL OR sku = '');
UPDATE public.products SET sku = '5HT-ACCS-FLD-001' WHERE slug = 'chronos-field-watch' AND (sku IS NULL OR sku = '');

-- Fallback SKU assignment for any user-added products lacking an SKU
UPDATE public.products
SET sku = '5HT-GEN-' || UPPER(SUBSTRING(slug FROM 1 FOR 6)) || '-' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0')
WHERE sku IS NULL;

-- ----------------------------------------------------------------------------
-- 3. STOCK HANDLING ARCHITECTURE & VERIFICATION POLICY
--
-- Documentation for Developers and Warehouse Operators:
--
-- 1. MVP STOCK MODEL (ACTIVE):
--    - In the current launch MVP, stock availability is governed by the
--      `in_stock` BOOLEAN column on `public.products`.
--    - Before creating an order, `create-order.ts` re-fetches product rows
--      and verifies `in_stock === true`. If false, the order is rejected with 400.
--    - When a supplier informs dispatch that an item has sold out, an administrator
--      sets `in_stock = FALSE` via Supabase dashboard or product management.
--
-- 2. V2 INVENTORY DECREMENT ROADMAP:
--    - When transitioning to automated inventory counts in v2:
--      a) Add `stock_quantity INTEGER NOT NULL DEFAULT 0` to `public.products`.
--      b) Update `create_order_with_items` RPC to verify `stock_quantity >= item.quantity`
--         and decrement inside the atomic transaction:
--         `UPDATE public.products SET stock_quantity = stock_quantity - item.quantity WHERE id = item.product_id;`
--      c) If `stock_quantity` reaches 0, trigger sets `in_stock = FALSE`.
-- ----------------------------------------------------------------------------
COMMENT ON COLUMN public.products.sku IS 'Unique Stock Keeping Unit (e.g. 5HT-ELEC-OBS-001) for catalog logistics and inventory tracking';
COMMENT ON COLUMN public.products.in_stock IS 'Boolean stock availability flag checked by create-order.ts and RPC during checkout';

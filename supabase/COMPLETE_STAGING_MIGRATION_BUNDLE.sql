-- ============================================================================
-- 5 HAZAAR TAK (5000shop.pk) — Complete Staging Database Migration Bundle
-- File: supabase/COMPLETE_STAGING_MIGRATION_BUNDLE.sql
--
-- INSTRUCTIONS FOR USER:
--   1. Open your Supabase Dashboard: https://supabase.com/dashboard
--   2. Select your project (xugilynbaexwhwzevphw)
--   3. Navigate to: SQL Editor (left sidebar) → New query
--   4. Paste this entire file and click "Run" (Ctrl+Enter / Cmd+Enter)
--   5. You will see: "Success. No rows returned."
--
-- Contents:
--   - Migration 001: Categories, Products Schema, Indexes, RLS, Triggers
--   - Seed: Curated Sample Catalog Products (10 items under ₨5,000)
--   - Migration 002: Orders & Order Items Tables, Indexes, RLS
--   - Migration 003: SKU Standardization (Unique constraints, indexes, 5HT- SKUs)
--   - Migration 004: Hardened Atomic RPCs, Price Ceilings, Service-Role Permissions
--
-- Safety: Fully idempotent (safe to run on fresh or existing databases).
-- ============================================================================

-- ============================================================================
-- PART 1: MIGRATION 001 — CATEGORIES & PRODUCTS BASELINE
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_fkey'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_category_id_fkey
      FOREIGN KEY (category_id) REFERENCES public.categories(id)
      ON DELETE SET NULL;
  END IF;
END $$;

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

CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products (featured);
CREATE INDEX IF NOT EXISTS products_in_stock_idx ON public.products (in_stock);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products (category_id);
CREATE INDEX IF NOT EXISTS products_display_order_idx ON public.products (display_order);
CREATE INDEX IF NOT EXISTS products_featured_stock_order_idx ON public.products (featured, in_stock, display_order);

CREATE INDEX IF NOT EXISTS categories_is_active_idx ON public.categories (is_active);
CREATE INDEX IF NOT EXISTS categories_display_order_idx ON public.categories (display_order);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories (slug);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'categories' AND policyname = 'Allow public read active categories'
  ) THEN
    CREATE POLICY "Allow public read active categories" ON public.categories
      FOR SELECT USING (is_active = TRUE);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'Allow public read in-stock products'
  ) THEN
    CREATE POLICY "Allow public read in-stock products" ON public.products
      FOR SELECT USING (in_stock = TRUE);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_categories_updated_at') THEN
    CREATE TRIGGER set_categories_updated_at
      BEFORE UPDATE ON public.categories
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_products_updated_at') THEN
    CREATE TRIGGER set_products_updated_at
      BEFORE UPDATE ON public.products
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;


-- ============================================================================
-- PART 2: CATALOG SEEDING (10 CURATED PRODUCTS UNDER ₨5,000)
-- ============================================================================
DO $$
DECLARE
  v_fashion_id UUID;
  v_beauty_id UUID;
  v_electronics_id UUID;
  v_home_id UUID;
  v_accessories_id UUID;
BEGIN
  SELECT id INTO v_fashion_id FROM public.categories WHERE slug = 'fashion' LIMIT 1;
  SELECT id INTO v_beauty_id FROM public.categories WHERE slug = 'beauty' LIMIT 1;
  SELECT id INTO v_electronics_id FROM public.categories WHERE slug = 'electronics' LIMIT 1;
  SELECT id INTO v_home_id FROM public.categories WHERE slug = 'home' LIMIT 1;
  SELECT id INTO v_accessories_id FROM public.categories WHERE slug = 'accessories' LIMIT 1;

  INSERT INTO public.products (
    title, subtitle, slug, price, compare_at_price, category_id,
    image_url, description, featured, in_stock, display_order, tags
  )
  VALUES
    (
      'Chronograph Obsidian Watch', 'Tech Accents · Steel Bezel', 'chronograph-obsidian-watch',
      1850.00, 3200.00, v_electronics_id, '/images/watchi.jpg',
      'Engineered with a high-precision Japanese quartz movement, matte obsidian stainless steel case, and sapphire-coated scratch-resistant crystal.',
      TRUE, TRUE, 1, ARRAY['WATCH', 'NEW', 'STEEL']::TEXT[]
    ),
    (
      'Pro Wireless Earbuds', 'Tech Accents · ANC', 'pro-wireless-earbuds',
      4850.00, 6500.00, v_electronics_id, '/images/earbuds.jpg',
      'True wireless active noise cancelling earbuds with crystal-clear call quality, transparency mode, and IPX5 sweat resistance. Up to 32 hours battery.',
      TRUE, TRUE, 2, ARRAY['AUDIO', 'BESTSELLER', 'ANC']::TEXT[]
    ),
    (
      'Studio Pro ANC Headphones', 'Tech Accents · Hi-Res Audio', 'studio-pro-anc-headphones',
      4950.00, 7500.00, v_electronics_id, '/images/headphone.jpg',
      'Over-ear professional studio monitors with hybrid active noise cancellation, custom 40mm neodymium drivers, and plush memory-foam ear cushions.',
      TRUE, TRUE, 3, ARRAY['HEADPHONES', 'STUDIO', 'WIRELESS']::TEXT[]
    ),
    (
      'Amber & Oud Parfum', 'Apothecary · Extrait de Parfum', 'amber-oud-parfum',
      3200.00, 4800.00, v_beauty_id, '/images/fragrance.jpg',
      'An intoxicating oriental blend of Cambodian oud wood, golden amber, smoky frankincense, and warm Madagascar vanilla. Exceptional 12+ hour longevity.',
      TRUE, TRUE, 4, ARRAY['PERFUME', 'LUXURY', 'OUD']::TEXT[]
    ),
    (
      'Saffron & Rose Radiance Serum', 'Apothecary · Cold-Pressed', 'saffron-rose-serum',
      2400.00, 3600.00, v_beauty_id, '/images/serum.jpg',
      'Formulated with organic Kashmiri saffron, wild Damascus rose extract, and multi-molecular hyaluronic acid to visibly brighten complexion and reduce fine lines.',
      FALSE, TRUE, 5, ARRAY['SKINCARE', 'ORGANIC', 'SERUM']::TEXT[]
    ),
    (
      'Handcrafted Matte Ceramic Pot Set', 'Living Space · Terracotta & Stoneware', 'matte-ceramic-pot-set',
      2900.00, 4200.00, v_home_id, '/images/ceramic-pot.jpg',
      'Set of two hand-thrown stoneware planters finished in a minimalist matte charcoal and bone glaze. Features drainage holes and matching drip saucers.',
      FALSE, TRUE, 6, ARRAY['CERAMICS', 'HOME', 'DECOR']::TEXT[]
    ),
    (
      'Minimalist Sculptural Desk Lamp', 'Living Space · Brass & Cast Metal', 'minimalist-desk-lamp',
      3750.00, 5200.00, v_home_id, '/images/lamp.jpg',
      'Brushed brass and powder-coated cast aluminium LED task light with touch-dimming functionality and 3 selectable color temperatures (warm, natural, cool).',
      TRUE, TRUE, 7, ARRAY['LIGHTING', 'MINIMAL', 'DESK']::TEXT[]
    ),
    (
      'Heritage Waxed Canvas Tote', 'Fashion · Heavy 16oz Duck Canvas', 'heritage-canvas-tote',
      3450.00, 4900.00, v_fashion_id, '/images/tote-bag.jpg',
      'Built from water-resistant 16oz waxed cotton canvas with full-grain vegetable-tanned leather shoulder straps and reinforced copper rivets.',
      TRUE, TRUE, 8, ARRAY['BAGS', 'CANVAS', 'FASHION']::TEXT[]
    ),
    (
      'Velocity Runner Sneakers', 'Fashion · Ultra-Light Cushion', 'velocity-runner-sneakers',
      4200.00, 5800.00, v_fashion_id, '/images/sneakers.jpg',
      'Lightweight athletic trainers crafted with breathable engineered knit uppers, responsive EVA foam midsoles, and high-traction rubber outsoles.',
      TRUE, TRUE, 9, ARRAY['FOOTWEAR', 'RUNNING', 'SNEAKERS']::TEXT[]
    ),
    (
      'Chronos Field Watch', 'Accessories · Tactical Nylon Strap', 'chronos-field-watch',
      2650.00, 3900.00, v_accessories_id, '/images/accessories.jpg',
      'Rugged tactical field watch featuring military-grade luminous hands, 50m water resistance, and an interchangeable olive drab ballistic nylon NATO strap.',
      FALSE, TRUE, 10, ARRAY['WATCH', 'TACTICAL', 'ACCESSORIES']::TEXT[]
    )
  ON CONFLICT (slug) DO UPDATE
  SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    price = EXCLUDED.price,
    compare_at_price = EXCLUDED.compare_at_price,
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description,
    featured = EXCLUDED.featured,
    in_stock = EXCLUDED.in_stock,
    display_order = EXCLUDED.display_order,
    tags = EXCLUDED.tags;
END $$;


-- ============================================================================
-- PART 3: MIGRATION 002 — ORDERS & ORDER ITEMS TABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT          UNIQUE NOT NULL,
  confirmation_token  UUID          NOT NULL DEFAULT gen_random_uuid(),
  idempotency_key     TEXT          UNIQUE,

  customer_name       TEXT          NOT NULL CHECK (char_length(trim(customer_name)) >= 2),
  phone               TEXT          NOT NULL,
  email               TEXT          NULL,

  province            TEXT          NOT NULL,
  city                TEXT          NOT NULL,
  area                TEXT          NOT NULL,
  address             TEXT          NOT NULL CHECK (char_length(trim(address)) >= 5),
  landmark            TEXT          NULL,
  postal_code         TEXT          NULL,
  delivery_notes      TEXT          NULL,

  subtotal            NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee        NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0),
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total               NUMERIC(10,2) NOT NULL CHECK (total >= 0),

  payment_method      TEXT          NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod')),
  payment_status      TEXT          NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status        TEXT          NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),

  courier_name        TEXT          NULL,
  tracking_number     TEXT          NULL,
  admin_notes         TEXT          NULL,

  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      UUID          NULL REFERENCES public.products(id) ON DELETE SET NULL,

  product_title   TEXT          NOT NULL,
  product_slug    TEXT          NOT NULL,
  unit_price      NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0 AND unit_price <= 5000),
  quantity        INTEGER       NOT NULL CHECK (quantity >= 1 AND quantity <= 10),
  line_total      NUMERIC(10,2) NOT NULL CHECK (line_total >= 0),
  image_url       TEXT          NULL,

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_order_number_idx   ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS orders_phone_idx          ON public.orders (phone);
CREATE INDEX IF NOT EXISTS orders_order_status_idx   ON public.orders (order_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx     ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_idempotency_idx    ON public.orders (idempotency_key);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx  ON public.order_items (order_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_orders_updated_at') THEN
    CREATE TRIGGER set_orders_updated_at
      BEFORE UPDATE ON public.orders
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PART 4: MIGRATION 003 — SKU STANDARDIZATION & AUDITING
-- ============================================================================
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_sku_key') THEN
    ALTER TABLE public.products ADD CONSTRAINT products_sku_key UNIQUE (sku);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);

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

UPDATE public.products
SET sku = '5HT-GEN-' || UPPER(SUBSTRING(slug FROM 1 FOR 6)) || '-' || LPAD(FLOOR(RANDOM() * 900 + 100)::TEXT, 3, '0')
WHERE sku IS NULL OR sku = '';


-- ============================================================================
-- PART 5: MIGRATION 004 — RPC HARDENING & ACCESS CONTROL
-- ============================================================================

-- Enforce database-level price boundary ₨1 - ₨5,000
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_price_range_check') THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_price_range_check
      CHECK (price >= 1.00 AND price <= 5000.00);
  END IF;
END $$;

-- Set NOT NULL on SKU
DO $$
BEGIN
  ALTER TABLE public.products ALTER COLUMN sku SET NOT NULL;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Atomic Order Creation Function (Authoritative calculations inside PostgreSQL)
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_order JSONB,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order_id          UUID;
  v_order_number      TEXT;
  v_confirmation_token UUID;
  v_idempotency_key   TEXT;
  v_created_at        TIMESTAMPTZ;

  v_item              JSONB;
  v_product_id        UUID;
  v_requested_qty     INTEGER;

  v_db_product        RECORD;
  v_computed_line     NUMERIC(10,2);
  v_computed_subtotal NUMERIC(10,2) := 0.00;
  v_delivery_fee      NUMERIC(10,2) := 250.00;
  v_computed_total    NUMERIC(10,2);

  v_item_count        INTEGER;
  v_seen_ids          UUID[] := ARRAY[]::UUID[];
BEGIN
  IF p_order IS NULL OR jsonb_typeof(p_order) != 'object' THEN
    RAISE EXCEPTION 'INVALID_ORDER_PAYLOAD: Order data must be a valid JSON object' USING ERRCODE = 'P0001';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) != 'array' THEN
    RAISE EXCEPTION 'INVALID_ITEMS_PAYLOAD: Items must be a JSON array' USING ERRCODE = 'P0001';
  END IF;

  v_item_count := jsonb_array_length(p_items);
  IF v_item_count = 0 THEN
    RAISE EXCEPTION 'EMPTY_CART: Order must contain at least one item' USING ERRCODE = 'P0001';
  END IF;

  IF v_item_count > 20 THEN
    RAISE EXCEPTION 'EXCESSIVE_ITEMS: Maximum 20 distinct items allowed per order' USING ERRCODE = 'P0001';
  END IF;

  v_idempotency_key := NULLIF(TRIM(p_order->>'idempotency_key'), '');

  IF v_idempotency_key IS NOT NULL THEN
    SELECT id, order_number, confirmation_token, total, created_at
    INTO v_order_id, v_order_number, v_confirmation_token, v_computed_total, v_created_at
    FROM public.orders
    WHERE idempotency_key = v_idempotency_key;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'id', v_order_id,
        'order_number', v_order_number,
        'confirmation_token', v_confirmation_token,
        'total', v_computed_total,
        'created_at', v_created_at,
        'idempotent_hit', true
      );
    END IF;
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    BEGIN
      v_product_id := (v_item->>'product_id')::UUID;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'INVALID_PRODUCT_ID: Malformed product UUID in items' USING ERRCODE = 'P0001';
    END;

    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'MISSING_PRODUCT_ID: product_id is required for each item' USING ERRCODE = 'P0001';
    END IF;

    IF v_product_id = ANY(v_seen_ids) THEN
      RAISE EXCEPTION 'DUPLICATE_PRODUCT: Product % included multiple times', v_product_id USING ERRCODE = 'P0001';
    END IF;
    v_seen_ids := array_append(v_seen_ids, v_product_id);

    v_requested_qty := (v_item->>'quantity')::INTEGER;
    IF v_requested_qty IS NULL OR v_requested_qty < 1 OR v_requested_qty > 10 THEN
      RAISE EXCEPTION 'INVALID_QUANTITY: Quantity for product % must be between 1 and 10', v_product_id USING ERRCODE = 'P0001';
    END IF;

    SELECT id, title, slug, price, in_stock, image_url
    INTO v_db_product
    FROM public.products
    WHERE id = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'PRODUCT_NOT_FOUND: Product % does not exist in active catalog', v_product_id USING ERRCODE = 'P0001';
    END IF;

    IF NOT v_db_product.in_stock THEN
      RAISE EXCEPTION 'OUT_OF_STOCK: "%" is currently out of stock', v_db_product.title USING ERRCODE = 'P0001';
    END IF;

    IF v_db_product.price < 1.00 OR v_db_product.price > 5000.00 THEN
      RAISE EXCEPTION 'PRICE_OUT_OF_BOUNDS: Product "%" price violates ₨1 - ₨5,000 policy', v_db_product.title USING ERRCODE = 'P0001';
    END IF;

    v_computed_line := ROUND(v_db_product.price * v_requested_qty, 2);
    v_computed_subtotal := v_computed_subtotal + v_computed_line;
  END LOOP;

  v_computed_total := v_computed_subtotal + v_delivery_fee;

  v_order_number := TRIM(p_order->>'order_number');
  IF v_order_number IS NULL OR char_length(v_order_number) < 8 THEN
    RAISE EXCEPTION 'INVALID_ORDER_NUMBER: order_number is required' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.orders (
    order_number, idempotency_key,
    customer_name, phone, email,
    province, city, area, address, landmark, postal_code, delivery_notes,
    subtotal, delivery_fee, discount, total,
    payment_method, payment_status, order_status
  )
  VALUES (
    v_order_number,
    v_idempotency_key,
    TRIM(p_order->>'customer_name'),
    TRIM(p_order->>'phone'),
    NULLIF(TRIM(p_order->>'email'), ''),
    TRIM(p_order->>'province'),
    TRIM(p_order->>'city'),
    TRIM(p_order->>'area'),
    TRIM(p_order->>'address'),
    NULLIF(TRIM(p_order->>'landmark'), ''),
    NULLIF(TRIM(p_order->>'postal_code'), ''),
    NULLIF(TRIM(p_order->>'delivery_notes'), ''),
    v_computed_subtotal,
    v_delivery_fee,
    0.00,
    v_computed_total,
    'cod',
    'pending',
    'pending'
  )
  RETURNING id, order_number, confirmation_token, total, created_at
  INTO v_order_id, v_order_number, v_confirmation_token, v_computed_total, v_created_at;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_requested_qty := (v_item->>'quantity')::INTEGER;

    SELECT id, title, slug, price, image_url
    INTO v_db_product
    FROM public.products
    WHERE id = v_product_id;

    v_computed_line := ROUND(v_db_product.price * v_requested_qty, 2);

    INSERT INTO public.order_items (
      order_id, product_id,
      product_title, product_slug,
      unit_price, quantity, line_total, image_url
    )
    VALUES (
      v_order_id, v_db_product.id,
      v_db_product.title, v_db_product.slug,
      v_db_product.price, v_requested_qty, v_computed_line, v_db_product.image_url
    );
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'confirmation_token', v_confirmation_token,
    'total', v_computed_total,
    'created_at', v_created_at,
    'idempotent_hit', false
  );
END;
$$;

-- Token-Gated Order Confirmation RPC
CREATE OR REPLACE FUNCTION public.get_order_confirmation(
  p_order_number TEXT,
  p_token UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
BEGIN
  IF p_order_number IS NULL OR p_token IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT
    o.order_number, o.customer_name, o.city, o.province,
    o.subtotal, o.delivery_fee, o.discount, o.total,
    o.payment_method, o.order_status, o.created_at
  INTO v_order
  FROM public.orders o
  WHERE o.order_number = TRIM(p_order_number)
    AND o.confirmation_token = p_token;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'product_title', oi.product_title,
      'product_slug', oi.product_slug,
      'unit_price', oi.unit_price,
      'quantity', oi.quantity,
      'line_total', oi.line_total,
      'image_url', oi.image_url
    )
  ), '[]'::JSONB)
  INTO v_items
  FROM public.order_items oi
  JOIN public.orders o ON oi.order_id = o.id
  WHERE o.order_number = TRIM(p_order_number)
    AND o.confirmation_token = p_token;

  RETURN jsonb_build_object(
    'order_number', v_order.order_number,
    'customer_name', v_order.customer_name,
    'city', v_order.city,
    'province', v_order.province,
    'subtotal', v_order.subtotal,
    'delivery_fee', v_order.delivery_fee,
    'discount', v_order.discount,
    'total', v_order.total,
    'payment_method', v_order.payment_method,
    'order_status', v_order.order_status,
    'created_at', v_order.created_at,
    'items', v_items
  );
END;
$$;

-- CRITICAL PERMISSION LOCKDOWN
REVOKE ALL ON FUNCTION public.create_order_with_items(JSONB, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_order_with_items(JSONB, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.create_order_with_items(JSONB, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO service_role;

REVOKE ALL ON FUNCTION public.get_order_confirmation(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT, UUID) TO service_role;

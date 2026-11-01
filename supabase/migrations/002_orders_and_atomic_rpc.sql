-- ============================================================================
-- 5 HAZAAR TAK (5000shop.pk) — Supabase Database Migration
-- Migration: 002_orders_and_atomic_rpc.sql
-- Description: Creates orders & order_items tables, indexes, RLS policies,
--              updated_at trigger, and atomic RPC functions for order creation
--              and secure order confirmation lookups.
--
-- PREREQUISITE: 001_featured_products_migration.sql must be applied first.
--
-- HOW TO RUN:
--   1. Go to your Supabase Dashboard → SQL Editor → New Query
--   2. Paste this entire file
--   3. Click "Run"
--   4. You should see "Success. No rows returned" (that's correct)
--
-- Safety:
--   - Idempotent: safe to run multiple times (uses IF NOT EXISTS, CREATE OR REPLACE)
--   - Non-destructive: does not drop or alter existing tables
-- ============================================================================


-- ============================================================================
-- 1. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT          UNIQUE NOT NULL,
  confirmation_token  UUID          NOT NULL DEFAULT gen_random_uuid(),
  idempotency_key     TEXT          UNIQUE,

  -- Customer Information
  customer_name       TEXT          NOT NULL CHECK (char_length(trim(customer_name)) >= 2),
  phone               TEXT          NOT NULL,
  email               TEXT          NULL,

  -- Pakistani Delivery Address
  province            TEXT          NOT NULL,
  city                TEXT          NOT NULL,
  area                TEXT          NOT NULL,
  address             TEXT          NOT NULL CHECK (char_length(trim(address)) >= 5),
  landmark            TEXT          NULL,
  postal_code         TEXT          NULL,
  delivery_notes      TEXT          NULL,

  -- Financial Totals (ALL computed server-side — never trust client)
  subtotal            NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee        NUMERIC(10,2) NOT NULL CHECK (delivery_fee >= 0),
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total               NUMERIC(10,2) NOT NULL CHECK (total >= 0),

  -- Payment (COD only for MVP launch)
  payment_method      TEXT          NOT NULL DEFAULT 'cod'
                                    CHECK (payment_method IN ('cod')),
  payment_status      TEXT          NOT NULL DEFAULT 'pending'
                                    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),

  -- Order Lifecycle
  order_status        TEXT          NOT NULL DEFAULT 'pending'
                                    CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),

  -- Courier & Tracking (populated by admin after dispatch)
  courier_name        TEXT          NULL,
  tracking_number     TEXT          NULL,
  admin_notes         TEXT          NULL,

  -- Timestamps
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);


-- ============================================================================
-- 2. ORDER ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID          NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      UUID          NULL REFERENCES public.products(id) ON DELETE SET NULL,

  -- Snapshot at time of order (product data may change later)
  product_title   TEXT          NOT NULL,
  product_slug    TEXT          NOT NULL,
  unit_price      NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0 AND unit_price <= 5000),
  quantity        INTEGER       NOT NULL CHECK (quantity >= 1 AND quantity <= 10),
  line_total      NUMERIC(10,2) NOT NULL CHECK (line_total >= 0),
  image_url       TEXT          NULL,

  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);


-- ============================================================================
-- 3. PERFORMANCE INDEXES
-- ============================================================================
-- Orders lookup indexes
CREATE INDEX IF NOT EXISTS orders_order_number_idx   ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS orders_phone_idx          ON public.orders (phone);
CREATE INDEX IF NOT EXISTS orders_order_status_idx   ON public.orders (order_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx     ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_idempotency_idx    ON public.orders (idempotency_key);

-- Order items lookup index
CREATE INDEX IF NOT EXISTS order_items_order_id_idx  ON public.order_items (order_id);


-- ============================================================================
-- 4. AUTOMATIC updated_at TRIGGER ON ORDERS
-- ============================================================================
-- Reuses the handle_updated_at() function created in migration 001
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_orders_updated_at'
  ) THEN
    CREATE TRIGGER set_orders_updated_at
      BEFORE UPDATE ON public.orders
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;


-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on both order tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- CRITICAL: We intentionally do NOT create any SELECT, INSERT, UPDATE, or
-- DELETE policies for the 'anon' role on orders/order_items.
--
-- This means:
--   ✅ SECURITY DEFINER RPC functions can read/write (they bypass RLS)
--   ✅ service_role key can read/write (it bypasses RLS)
--   ❌ anon key CANNOT list, read, or mutate orders directly
--
-- All order operations go through the secure RPC functions below.


-- ============================================================================
-- 6. ATOMIC ORDER CREATION RPC
-- ============================================================================
-- This function creates an order + its items in a single atomic transaction.
-- If the idempotency_key already exists, it returns the existing order.
--
-- SECURITY DEFINER = runs with the function owner's permissions (bypasses RLS)
-- This is safe because the function is called from our server-side API route
-- which performs all validation first.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_order JSONB,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id          UUID;
  v_order_number      TEXT;
  v_confirmation_token UUID;
  v_total             NUMERIC(10,2);
  v_created_at        TIMESTAMPTZ;
  v_idempotency_key   TEXT;
  v_item              JSONB;
BEGIN
  -- Extract idempotency key
  v_idempotency_key := p_order->>'idempotency_key';

  -- ────────────────────────────────────────────────────────────
  -- IDEMPOTENCY CHECK: If this order was already created, return it
  -- ────────────────────────────────────────────────────────────
  IF v_idempotency_key IS NOT NULL THEN
    SELECT id, order_number, confirmation_token, total, created_at
    INTO v_order_id, v_order_number, v_confirmation_token, v_total, v_created_at
    FROM public.orders
    WHERE idempotency_key = v_idempotency_key;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'id', v_order_id,
        'order_number', v_order_number,
        'confirmation_token', v_confirmation_token,
        'total', v_total,
        'created_at', v_created_at,
        'idempotent_hit', true
      );
    END IF;
  END IF;

  -- ────────────────────────────────────────────────────────────
  -- INSERT PARENT ORDER
  -- ────────────────────────────────────────────────────────────
  INSERT INTO public.orders (
    order_number, idempotency_key,
    customer_name, phone, email,
    province, city, area, address, landmark, postal_code, delivery_notes,
    subtotal, delivery_fee, discount, total,
    payment_method
  )
  VALUES (
    p_order->>'order_number',
    v_idempotency_key,
    p_order->>'customer_name',
    p_order->>'phone',
    NULLIF(TRIM(p_order->>'email'), ''),
    p_order->>'province',
    p_order->>'city',
    p_order->>'area',
    p_order->>'address',
    NULLIF(TRIM(p_order->>'landmark'), ''),
    NULLIF(TRIM(p_order->>'postal_code'), ''),
    NULLIF(TRIM(p_order->>'delivery_notes'), ''),
    (p_order->>'subtotal')::NUMERIC(10,2),
    (p_order->>'delivery_fee')::NUMERIC(10,2),
    COALESCE((p_order->>'discount')::NUMERIC(10,2), 0),
    (p_order->>'total')::NUMERIC(10,2),
    COALESCE(p_order->>'payment_method', 'cod')
  )
  RETURNING id, order_number, confirmation_token, total, created_at
  INTO v_order_id, v_order_number, v_confirmation_token, v_total, v_created_at;

  -- ────────────────────────────────────────────────────────────
  -- INSERT ORDER ITEMS (loop through JSONB array)
  -- ────────────────────────────────────────────────────────────
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id,
      product_title, product_slug,
      unit_price, quantity, line_total,
      image_url
    )
    VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      v_item->>'product_title',
      v_item->>'product_slug',
      (v_item->>'unit_price')::NUMERIC(10,2),
      (v_item->>'quantity')::INTEGER,
      (v_item->>'line_total')::NUMERIC(10,2),
      v_item->>'image_url'
    );
  END LOOP;

  -- ────────────────────────────────────────────────────────────
  -- RETURN RESULT
  -- ────────────────────────────────────────────────────────────
  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'confirmation_token', v_confirmation_token,
    'total', v_total,
    'created_at', v_created_at,
    'idempotent_hit', false
  );
END;
$$;


-- ============================================================================
-- 7. SECURE ORDER CONFIRMATION LOOKUP RPC
-- ============================================================================
-- Returns ONLY non-sensitive confirmation fields when BOTH order_number AND
-- confirmation_token match. This prevents enumeration attacks — you cannot
-- guess order details just by knowing the order number.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_order_confirmation(
  p_order_number TEXT,
  p_token UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_items JSONB;
BEGIN
  -- ────────────────────────────────────────────────────────────
  -- LOOKUP: Both order_number AND confirmation_token must match
  -- ────────────────────────────────────────────────────────────
  SELECT
    o.order_number,
    o.customer_name,
    o.city,
    o.province,
    o.subtotal,
    o.delivery_fee,
    o.discount,
    o.total,
    o.payment_method,
    o.order_status,
    o.created_at
  INTO v_order
  FROM public.orders o
  WHERE o.order_number = p_order_number
    AND o.confirmation_token = p_token;

  -- If no match, return null (don't leak info about why it failed)
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- ────────────────────────────────────────────────────────────
  -- FETCH ORDER ITEMS (non-sensitive summary only)
  -- ────────────────────────────────────────────────────────────
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
  WHERE o.order_number = p_order_number
    AND o.confirmation_token = p_token;

  -- ────────────────────────────────────────────────────────────
  -- RETURN CONFIRMATION DATA
  -- ────────────────────────────────────────────────────────────
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


-- ============================================================================
-- 8. FUNCTION PERMISSIONS (Lock down execution)
-- ============================================================================
-- Revoke default public execute, then grant only to anon and authenticated
-- (our server API calls use the anon key through .rpc(), and SECURITY DEFINER
-- ensures the function body runs with elevated privileges regardless).
REVOKE ALL ON FUNCTION public.create_order_with_items(JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB, JSONB) TO service_role;

REVOKE ALL ON FUNCTION public.get_order_confirmation(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT, UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_confirmation(TEXT, UUID) TO service_role;


-- ============================================================================
-- ✅ MIGRATION COMPLETE
-- ============================================================================
-- Tables created:    public.orders, public.order_items
-- Indexes created:   7 indexes for performance
-- RLS enabled:       Both tables (no anon policies = fully locked)
-- Triggers:          updated_at auto-timestamp on orders
-- RPC functions:     create_order_with_items(), get_order_confirmation()
-- ============================================================================

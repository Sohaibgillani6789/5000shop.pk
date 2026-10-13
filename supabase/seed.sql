-- ============================================================================
-- 5 HAZAAR TAK (5000shop.pk) — Supabase Sample Products Seeding
-- File: supabase/seed.sql
--
-- Description: Inserts curated sample products mapping to the 5 core categories
--              using local images and prices strictly under ₨5,000.
-- Safety: Idempotent with ON CONFLICT (slug) DO UPDATE.
-- ============================================================================

DO $$
DECLARE
  v_fashion_id UUID;
  v_beauty_id UUID;
  v_electronics_id UUID;
  v_home_id UUID;
  v_accessories_id UUID;
BEGIN
  -- 1. Retrieve Core Category IDs
  SELECT id INTO v_fashion_id FROM public.categories WHERE slug = 'fashion' LIMIT 1;
  SELECT id INTO v_beauty_id FROM public.categories WHERE slug = 'beauty' LIMIT 1;
  SELECT id INTO v_electronics_id FROM public.categories WHERE slug = 'electronics' LIMIT 1;
  SELECT id INTO v_home_id FROM public.categories WHERE slug = 'home' LIMIT 1;
  SELECT id INTO v_accessories_id FROM public.categories WHERE slug = 'accessories' LIMIT 1;

  -- 2. Insert / Update In-Stock Products
  INSERT INTO public.products (
    title,
    subtitle,
    slug,
    price,
    compare_at_price,
    category_id,
    image_url,
    description,
    featured,
    in_stock,
    display_order,
    tags
  )
  VALUES
    -- Tech Accents (Electronics)
    (
      'Chronograph Obsidian Watch',
      'Tech Accents · Steel Bezel',
      'chronograph-obsidian-watch',
      1850.00,
      3200.00,
      v_electronics_id,
      '/images/watchi.jpg',
      'Engineered with a high-precision Japanese quartz movement, matte obsidian stainless steel case, and sapphire-coated scratch-resistant crystal. Perfect for both formal wear and casual daily use.',
      TRUE,
      TRUE,
      1,
      ARRAY['WATCH', 'NEW', 'STEEL']::TEXT[]
    ),
    (
      'Pro Wireless Earbuds',
      'Tech Accents · ANC',
      'pro-wireless-earbuds',
      4850.00,
      4999.00,
      v_electronics_id,
      '/images/earbud.jpg',
      'Active noise cancellation with 36-hour total battery life. Features dual beam-forming microphones for crystal-clear calls in busy Pakistani urban transit.',
      TRUE,
      TRUE,
      2,
      ARRAY['AUDIO', 'BESTSELLER', 'BLUETOOTH']::TEXT[]
    ),
    (
      'Studio Pro ANC Headphones',
      'Tech Accents · High-Fidelity',
      'studio-pro-anc-headphones',
      4500.00,
      4999.00,
      v_electronics_id,
      '/images/hero-headphones.png',
      'Plush memory foam ear cups with dynamic 40mm acoustic drivers. Offers rich sub-bass response and 40 hours of continuous playback on a single charge.',
      TRUE,
      TRUE,
      3,
      ARRAY['AUDIO', 'OVEREAR', 'PREMIUM']::TEXT[]
    ),

    -- Apothecary (Beauty)
    (
      'Amber Oud Parfum',
      'Signature Fragrance',
      'amber-oud-parfum',
      4200.00,
      4950.00,
      v_beauty_id,
      '/images/perfume1.jpg',
      'An intoxicating oriental blend of dark cambodian oud, warm amber resin, smoked cedar, and damascus rose. 8+ hours sillage tailored for the Pakistani climate.',
      TRUE,
      TRUE,
      1,
      ARRAY['FRAGRANCE', 'LUXURY', 'OUD']::TEXT[]
    ),
    (
      'Saffron Rose Radiant Serum',
      'Skin Care · 30ml',
      'saffron-rose-serum',
      2800.00,
      3900.00,
      v_beauty_id,
      '/images/perfume1.jpg',
      'Enriched with Kashmiri saffron extract and steam-distilled organic rose water. Helps reduce hyperpigmentation while promoting deep skin hydration.',
      TRUE,
      TRUE,
      2,
      ARRAY['SKINCARE', 'ORGANIC', 'SERUM']::TEXT[]
    ),

    -- Living Space (Home)
    (
      'Matte Ceramic Pot Set',
      'Home Décor · Set of 3',
      'matte-ceramic-pot-set',
      2950.00,
      3800.00,
      v_home_id,
      '/images/pot.jpg',
      'Artisan handcrafted ceramic planters finished with a textured charcoal matte glaze. Includes drainage plates, ideal for succulents and indoor plants.',
      TRUE,
      TRUE,
      1,
      ARRAY['CERAMIC', 'HANDMADE', 'HOME']::TEXT[]
    ),
    (
      'Minimalist Desk Lamp',
      'Home & Living · Adjustable',
      'minimalist-desk-lamp',
      3100.00,
      4500.00,
      v_home_id,
      '/images/hero-lamp.png',
      'Powder-coated aluminum desk luminaire with capacitive touch dimming and three color temperature modes (Warm, Natural, Cool Daylight).',
      TRUE,
      TRUE,
      2,
      ARRAY['LIGHTING', 'MINIMAL', 'DESK']::TEXT[]
    ),

    -- Fashion
    (
      'Heritage Canvas Tote',
      'Womens Fashion',
      'heritage-canvas-tote',
      1650.00,
      2400.00,
      v_fashion_id,
      '/images/hero-handbag.png',
      'Heavyweight 16oz cotton canvas with reinforced vegetable-tanned leather shoulder straps and magnetic brass closure. Roomy enough for a 15-inch laptop.',
      TRUE,
      TRUE,
      1,
      ARRAY['TOTE', 'CANVAS', 'FASHION']::TEXT[]
    ),
    (
      'Velocity Runner Sneakers',
      'Mens Footwear · All-Terrain',
      'velocity-runner-sneakers',
      4999.00,
      5000.00,
      v_fashion_id,
      '/images/hero-sneakers.png',
      'Breathable engineered mesh upper paired with an ultra-responsive EVA midsole. High-traction rubber tread designed for everyday Pakistani streets.',
      TRUE,
      TRUE,
      2,
      ARRAY['FOOTWEAR', 'RUNNING', 'COMFORT']::TEXT[]
    ),

    -- Accessories
    (
      'Chronos Field Watch',
      'Tech Accents · Quartz',
      'chronos-field-watch',
      3750.00,
      4800.00,
      v_accessories_id,
      '/images/hero-watch.png',
      'Military-inspired field timepiece featuring luminous indices, brushed alloy bezel, and a durable olive green ballistic nylon strap.',
      TRUE,
      TRUE,
      1,
      ARRAY['WATCH', 'FIELD', 'ACCESSORIES']::TEXT[]
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
    tags = EXCLUDED.tags,
    updated_at = NOW();

  RAISE NOTICE 'Successfully seeded sample products for 5 Hazaar Tak marketplace.';
END $$;

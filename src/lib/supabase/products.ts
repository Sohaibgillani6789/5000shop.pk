/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Product & Category Data Fetching (Supabase)
 *
 *  All functions query Supabase with fallback to local example
 *  products mapped to public images until the database is populated.
 * ──────────────────────────────────────────────────────────────
 */

import { createClient } from './server'
import type { Product, ProductWithCategory, Category } from './types'

// ── Explicit column lists (never select("*")) ─────────────────

const PRODUCT_COLUMNS =
  'id,title,slug,price,compare_at_price,category_id,image_url,description,featured,in_stock,display_order,tags,created_at,updated_at'

const CATEGORY_COLUMNS =
  'id,name,slug,description,image_url,display_order,color,is_active,created_at,updated_at'

// ── Canonical Fallback Categories ─────────────────────────────

const FALLBACK_CATEGORIES: Record<string, Category> = {
  fashion: {
    id: 'b3178728-acf3-4709-9ee8-3b88501cf492',
    name: 'Mens & Womens Fashion',
    slug: 'fashion',
    description: 'Curated fashion and apparel under ₨5,000',
    image_url: null,
    display_order: 1,
    color: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  beauty: {
    id: '77be0721-a350-4ec6-8fb2-e677cabce7e0',
    name: 'Apothecary',
    slug: 'beauty',
    description: 'Premium skincare, fragrances, and grooming',
    image_url: null,
    display_order: 2,
    color: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  electronics: {
    id: 'd5aec676-5e23-4788-bd17-64919109aece',
    name: 'Tech Accents',
    slug: 'electronics',
    description: 'Everyday smart electronics and tech accessories',
    image_url: null,
    display_order: 3,
    color: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  home: {
    id: '0036856a-ca0f-4bd6-92b0-4859a5195f8a',
    name: 'Living Space',
    slug: 'home',
    description: 'Artisan home accents, ceramics, and decor',
    image_url: null,
    display_order: 4,
    color: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  accessories: {
    id: 'fbc7c768-fac7-4125-b85b-b9830a9107a7',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Timepieces, bags, and luxury accessories',
    image_url: null,
    display_order: 5,
    color: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

// ── Curated Example Products using /images/* ──────────────────

export const FALLBACK_PRODUCTS: ProductWithCategory[] = [
  // ── Fashion ──
  {
    id: 'prod-fashion-1',
    title: 'Velocity Runner Sneakers',
    slug: 'velocity-runner-sneakers',
    price: 4999,
    compare_at_price: 5000,
    category_id: 'b3178728-acf3-4709-9ee8-3b88501cf492',
    image_url: '/images/hero-sneakers.png',
    description:
      'Breathable engineered mesh upper paired with an ultra-responsive EVA midsole. High-traction rubber tread designed for everyday Pakistani streets.',
    featured: true,
    in_stock: true,
    display_order: 1,
    tags: ['FOOTWEAR', 'RUNNING', 'NEW'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.fashion,
  },
  {
    id: 'prod-fashion-2',
    title: 'Heritage Canvas Tote',
    slug: 'heritage-canvas-tote',
    price: 1650,
    compare_at_price: 2400,
    category_id: 'b3178728-acf3-4709-9ee8-3b88501cf492',
    image_url: '/images/hero-handbag.png',
    description:
      'Heavyweight 16oz cotton canvas with reinforced vegetable-tanned leather shoulder straps and magnetic brass closure. Roomy enough for a 15-inch laptop.',
    featured: true,
    in_stock: true,
    display_order: 2,
    tags: ['TOTE', 'CANVAS', 'FASHION'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.fashion,
  },

  // ── Beauty / Apothecary ──
  {
    id: 'prod-beauty-1',
    title: 'Amber Oud Parfum',
    slug: 'amber-oud-parfum',
    price: 4200,
    compare_at_price: 4950,
    category_id: '77be0721-a350-4ec6-8fb2-e677cabce7e0',
    image_url: '/images/perfume1.jpg',
    description:
      'An intoxicating oriental blend of dark cambodian oud, warm amber resin, smoked cedar, and damascus rose. 8+ hours sillage tailored for the Pakistani climate.',
    featured: true,
    in_stock: true,
    display_order: 1,
    tags: ['FRAGRANCE', 'LUXURY', 'OUD'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.beauty,
  },
  {
    id: 'prod-beauty-2',
    title: 'Saffron Rose Radiant Serum',
    slug: 'saffron-rose-serum',
    price: 2800,
    compare_at_price: 3900,
    category_id: '77be0721-a350-4ec6-8fb2-e677cabce7e0',
    image_url: '/images/perfume1.jpg',
    description:
      'Enriched with Kashmiri saffron extract and steam-distilled organic rose water. Helps reduce hyperpigmentation while promoting deep skin hydration.',
    featured: true,
    in_stock: true,
    display_order: 2,
    tags: ['SKINCARE', 'ORGANIC', 'SERUM'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.beauty,
  },

  // ── Electronics / Tech Accents ──
  {
    id: 'prod-elec-1',
    title: 'Chronograph Obsidian Watch',
    slug: 'chronograph-obsidian-watch',
    price: 1850,
    compare_at_price: 3200,
    category_id: 'd5aec676-5e23-4788-bd17-64919109aece',
    image_url: '/images/watchi.jpg',
    description:
      'Engineered with a high-precision Japanese quartz movement, matte obsidian stainless steel case, and sapphire-coated scratch-resistant crystal. Perfect for both formal wear and casual daily use.',
    featured: true,
    in_stock: true,
    display_order: 1,
    tags: ['WATCH', 'NEW', 'STEEL'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.electronics,
  },
  {
    id: 'prod-elec-2',
    title: 'Pro Wireless Earbuds',
    slug: 'pro-wireless-earbuds',
    price: 4850,
    compare_at_price: 4999,
    category_id: 'd5aec676-5e23-4788-bd17-64919109aece',
    image_url: '/images/earbud.jpg',
    description:
      'Active noise cancellation with 36-hour total battery life. Features dual beam-forming microphones for crystal-clear calls in busy transit.',
    featured: true,
    in_stock: true,
    display_order: 2,
    tags: ['AUDIO', 'BESTSELLER', 'BLUETOOTH'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.electronics,
  },
  {
    id: 'prod-elec-3',
    title: 'Studio Pro ANC Headphones',
    slug: 'studio-pro-anc-headphones',
    price: 4500,
    compare_at_price: 4999,
    category_id: 'd5aec676-5e23-4788-bd17-64919109aece',
    image_url: '/images/hero-headphones.png',
    description:
      'Plush memory foam ear cups with dynamic 40mm acoustic drivers. Offers rich sub-bass response and 40 hours of continuous playback on a single charge.',
    featured: true,
    in_stock: true,
    display_order: 3,
    tags: ['AUDIO', 'OVEREAR', 'PREMIUM'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.electronics,
  },

  // ── Living Space / Home ──
  {
    id: 'prod-home-1',
    title: 'Matte Ceramic Pot Set',
    slug: 'matte-ceramic-pot-set',
    price: 2950,
    compare_at_price: 3800,
    category_id: '0036856a-ca0f-4bd6-92b0-4859a5195f8a',
    image_url: '/images/pot.jpg',
    description:
      'Artisan handcrafted ceramic planters finished with a textured charcoal matte glaze. Includes drainage plates, ideal for succulents and indoor plants.',
    featured: true,
    in_stock: true,
    display_order: 1,
    tags: ['CERAMIC', 'HANDMADE', 'HOME'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.home,
  },
  {
    id: 'prod-home-2',
    title: 'Minimalist Desk Lamp',
    slug: 'minimalist-desk-lamp',
    price: 3100,
    compare_at_price: 4500,
    category_id: '0036856a-ca0f-4bd6-92b0-4859a5195f8a',
    image_url: '/images/hero-lamp.png',
    description:
      'Powder-coated aluminum desk luminaire with capacitive touch dimming and three color temperature modes (Warm, Natural, Cool Daylight).',
    featured: true,
    in_stock: true,
    display_order: 2,
    tags: ['LIGHTING', 'MINIMAL', 'DESK'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.home,
  },

  // ── Accessories ──
  {
    id: 'prod-acc-1',
    title: 'Chronos Field Watch',
    slug: 'chronos-field-watch',
    price: 3750,
    compare_at_price: 4800,
    category_id: 'fbc7c768-fac7-4125-b85b-b9830a9107a7',
    image_url: '/images/hero-watch.png',
    description:
      'Military-inspired field timepiece featuring luminous indices, brushed alloy bezel, and a durable olive green ballistic nylon strap.',
    featured: true,
    in_stock: true,
    display_order: 1,
    tags: ['WATCH', 'FIELD', 'ACCESSORIES'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.accessories,
  },
  {
    id: 'prod-acc-2',
    title: 'Classic Leather Daypack',
    slug: 'classic-leather-daypack',
    price: 3400,
    compare_at_price: 4600,
    category_id: 'fbc7c768-fac7-4125-b85b-b9830a9107a7',
    image_url: '/images/hero-handbag.png',
    description:
      'Hand-stitched vintage tan leather daypack with antique brass hardware and cushioned shoulder straps. Built to last a lifetime.',
    featured: true,
    in_stock: true,
    display_order: 2,
    tags: ['BAGS', 'LEATHER', 'ACCESSORIES'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: FALLBACK_CATEGORIES.accessories,
  },
]

// ── getFeaturedProducts ───────────────────────────────────────

/**
 * Fetch featured, in-stock products ordered by `display_order` ASC.
 * Falls back to example products if Supabase returns 0 rows.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('featured', true)
      .eq('in_stock', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.warn('[getFeaturedProducts] Supabase notice:', error.message)
    }

    if (data && data.length > 0) {
      return data as unknown as Product[]
    }
  } catch (err) {
    console.warn('[getFeaturedProducts] Falling back to example products:', err)
  }

  // Fallback to example featured products
  return FALLBACK_PRODUCTS.filter((p) => p.featured)
}

// ── getProductsByCategory ─────────────────────────────────────

/**
 * Fetch in-stock products for a given category slug.
 * Joins with `categories` — only returns products in active categories.
 * Ordered by `display_order` ASC. Falls back to example products if database is empty.
 */
export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductWithCategory[]> {
  try {
    const supabase = await createClient()

    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .eq('slug', categorySlug)
      .eq('is_active', true)
      .maybeSingle()

    if (catError) {
      console.warn('[getProductsByCategory] Category lookup error:', catError.message)
    }

    const category = (catData as unknown as Category) || FALLBACK_CATEGORIES[categorySlug]

    if (category) {
      const { data } = await supabase
        .from('products')
        .select(PRODUCT_COLUMNS)
        .eq('category_id', category.id)
        .eq('in_stock', true)
        .order('display_order', { ascending: true })

      if (data && data.length > 0) {
        return (data as unknown as Product[]).map((product) => ({
          ...product,
          category,
        }))
      }
    }
  } catch (err) {
    console.warn('[getProductsByCategory] Using fallback products:', err)
  }

  // Fallback to example products for this category slug
  const fallback = FALLBACK_PRODUCTS.filter(
    (p) => p.category?.slug === categorySlug,
  )
  return fallback
}

// ── getCategories ─────────────────────────────────────────────

/**
 * Fetch active categories ordered by `display_order` ASC.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (data && data.length > 0) {
      return data as unknown as Category[]
    }
  } catch (err) {
    console.warn('[getCategories] Using fallback categories:', err)
  }

  return Object.values(FALLBACK_CATEGORIES)
}

// ── getCategoryBySlug ─────────────────────────────────────────

/**
 * Fetch one active category by slug.
 * Returns `null` on error or not found — logs the error server-side.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (data) {
      return data as unknown as Category
    }
  } catch (err) {
    console.warn('[getCategoryBySlug] Falling back to canonical category:', err)
  }

  return FALLBACK_CATEGORIES[slug] ?? null
}

// ── getProductBySlug ──────────────────────────────────────────

/**
 * Fetch one in-stock product by slug with category details attached.
 * Returns `null` on error or not found — logs the error server-side.
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductWithCategory | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('slug', slug)
      .eq('in_stock', true)
      .maybeSingle()

    if (data) {
      const product = data as unknown as Product

      // Resolve category if category_id exists
      let category: Category | null = null
      if (product.category_id) {
        const { data: catData } = await supabase
          .from('categories')
          .select(CATEGORY_COLUMNS)
          .eq('id', product.category_id)
          .eq('is_active', true)
          .maybeSingle()

        if (catData) {
          category = catData as unknown as Category
        }
      }

      return {
        ...product,
        category,
      }
    }
  } catch (err) {
    console.warn('[getProductBySlug] Using fallback product:', err)
  }

  // Fallback to example product if database doesn't have it yet
  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug)
  return fallback ?? null
}

// ── getCategorySlugs ──────────────────────────────────────────

/**
 * Fetch active category slugs for `generateStaticParams()`.
 * Returns `[]` on error — logs the error server-side.
 */
export async function getCategorySlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('categories')
      .select('slug')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (data && data.length > 0) {
      return (data as { slug: string }[]).map((row) => row.slug)
    }
  } catch {
    // Ignore and fallback
  }

  return Object.keys(FALLBACK_CATEGORIES)
}

// ── getRelatedProducts ────────────────────────────────────────

/**
 * Fetch related in-stock products within the same category.
 * Excludes the specified current product.
 */
export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit = 4,
): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('category_id', categoryId)
      .eq('in_stock', true)
      .neq('id', currentProductId)
      .order('display_order', { ascending: true })
      .limit(limit)

    if (data && data.length > 0) {
      return data as unknown as Product[]
    }
  } catch {
    // Ignore and fallback
  }

  // Fallback related products from example products
  const related = FALLBACK_PRODUCTS.filter(
    (p) =>
      (p.category_id === categoryId || p.category?.id === categoryId) &&
      p.id !== currentProductId &&
      p.slug !== currentProductId,
  ).slice(0, limit)

  if (related.length > 0) return related

  // General fallback if none in same category
  return FALLBACK_PRODUCTS.filter((p) => p.id !== currentProductId && p.slug !== currentProductId).slice(
    0,
    limit,
  )
}

/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Product & Category Data Fetching (Supabase)
 *
 *  All functions use the *server* Supabase client and are
 *  intended to be called from Server Components or Route
 *  Handlers.  They return a safe empty array on error and log
 *  the failure on the server side.
 * ──────────────────────────────────────────────────────────────
 */

import { createClient } from './server'
import type { Product, ProductWithCategory, Category } from './types'

// ── Explicit column lists (never select("*")) ─────────────────

const PRODUCT_COLUMNS =
  'id,title,slug,price,compare_at_price,category_id,image_url,description,featured,in_stock,display_order,tags,created_at,updated_at'

const CATEGORY_COLUMNS =
  'id,name,slug,description,image_url,display_order,color,is_active,created_at,updated_at'

// ── getFeaturedProducts ───────────────────────────────────────

/**
 * Fetch featured, in-stock products ordered by `display_order` ASC.
 * Returns `[]` on error — logs the error server-side.
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
      console.error('[getFeaturedProducts] Supabase error:', error.message)
      return []
    }
    return (data as unknown as Product[]) ?? []
  } catch (err) {
    console.error('[getFeaturedProducts] Unexpected error:', err)
    return []
  }
}

// ── getProductsByCategory ─────────────────────────────────────

/**
 * Fetch in-stock products for a given category slug.
 * Joins with `categories` — only returns products in active categories.
 * Ordered by `display_order` ASC.
 */
export async function getProductsByCategory(
  categorySlug: string,
): Promise<ProductWithCategory[]> {
  try {
    const supabase = await createClient()

    // Two-step approach: first resolve the category, then fetch its products.
    // This avoids PostgREST embedded-filter edge cases and keeps types clean.
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .eq('slug', categorySlug)
      .eq('is_active', true)
      .single()

    if (catError || !catData) {
      console.error('[getProductsByCategory] Category lookup error:', catError?.message ?? 'not found')
      return []
    }

    const category = catData as unknown as Category

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_COLUMNS)
      .eq('category_id', category.id)
      .eq('in_stock', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[getProductsByCategory] Products query error:', error.message)
      return []
    }

    // Attach the resolved category to each product
    return ((data as unknown as Product[]) ?? []).map((product) => ({
      ...product,
      category,
    }))
  } catch (err) {
    console.error('[getProductsByCategory] Unexpected error:', err)
    return []
  }
}

// ── getCategories ─────────────────────────────────────────────

/**
 * Fetch active categories ordered by `display_order` ASC.
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select(CATEGORY_COLUMNS)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[getCategories] Supabase error:', error.message)
      return []
    }
    return (data as unknown as Category[]) ?? []
  } catch (err) {
    console.error('[getCategories] Unexpected error:', err)
    return []
  }
}

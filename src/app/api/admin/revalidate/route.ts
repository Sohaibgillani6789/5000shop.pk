/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin On-Demand CDN & ISR Cache Revalidation
 *
 *  POST /api/admin/revalidate
 *
 *  Invalidates Vercel CDN / ISR cache tags using Next.js 16's
 *  stale-while-revalidate (`revalidateTag(tag, 'max')`) so that
 *  storefront pages continue serving in <50ms from edge cache while
 *  regenerating in the background when an admin updates catalog data.
 *
 *  Security:
 *    - Verifies admin session + ADMIN_EMAILS allowlist via verifyAdminUser()
 *    - Validates payload with Zod
 * ──────────────────────────────────────────────────────────────
 */

import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { verifyAdminUser, AdminAuthError } from '@/lib/supabase/admin'
import { CACHE_TAGS } from '@/lib/supabase/products'

const revalidateSchema = z
  .object({
    productSlug: z.string().trim().min(1).max(120).optional(),
    categorySlug: z.string().trim().min(1).max(60).optional(),
    allCatalog: z.boolean().optional(),
  })
  .strict()

export async function POST(request: NextRequest) {
  // ── 1. Verify Admin Authentication & Allowlist ────────────
  try {
    await verifyAdminUser()
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 401 }
    )
  }

  // ── 2. Parse optional JSON body (defaults to full catalog) ─
  let rawBody: unknown = {}
  try {
    const text = await request.text()
    if (text.trim().length > 0) {
      rawBody = JSON.parse(text)
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  const parsed = revalidateSchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const { productSlug, categorySlug, allCatalog } = parsed.data
  const invalidatedTags: string[] = []

  // ── 3. Granular Tag Invalidation (Stale-While-Revalidate) ─
  if (productSlug) {
    const tag = CACHE_TAGS.product(productSlug)
    revalidateTag(tag, 'max')
    revalidateTag(CACHE_TAGS.FEATURED_PRODUCTS, 'max')
    invalidatedTags.push(tag, CACHE_TAGS.FEATURED_PRODUCTS)
  }

  if (categorySlug) {
    const tag = CACHE_TAGS.category(categorySlug)
    revalidateTag(tag, 'max')
    invalidatedTags.push(tag)
  }

  if (allCatalog || (!productSlug && !categorySlug)) {
    revalidateTag(CACHE_TAGS.PRODUCTS, 'max')
    revalidateTag(CACHE_TAGS.FEATURED_PRODUCTS, 'max')
    revalidateTag(CACHE_TAGS.CATEGORIES, 'max')
    invalidatedTags.push(
      CACHE_TAGS.PRODUCTS,
      CACHE_TAGS.FEATURED_PRODUCTS,
      CACHE_TAGS.CATEGORIES
    )
  }

  return NextResponse.json(
    {
      revalidated: true,
      tags: Array.from(new Set(invalidatedTags)),
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}


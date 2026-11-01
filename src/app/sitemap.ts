import type { MetadataRoute } from 'next'
import { getCategorySlugs, getAllProductsForSitemap } from '@/lib/supabase/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://5000shop.pk'

  const [categorySlugs, products] = await Promise.all([
    getCategorySlugs(),
    getAllProductsForSitemap(),
  ])

  // Static high-value routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  // Product routes
  const productRoutes: MetadataRoute.Sitemap = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}

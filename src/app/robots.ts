import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/env/public'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout',
          '/order-confirmation/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

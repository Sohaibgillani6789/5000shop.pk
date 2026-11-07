import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabasePublicConfig } from '@/lib/env/public'

/**
 * If using Fluid compute: Don't put this client in a global variable. Always create a new client within each
 * function when using it.
 */
export async function createClient() {
  let cookieStore: Awaited<ReturnType<typeof cookies>> | null = null
  try {
    cookieStore = await cookies()
  } catch {
    // Graceful fallback during static generation / generateStaticParams
    cookieStore = null
  }

  const { url, anonKey } = getSupabasePublicConfig()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : []
        },
        setAll(cookiesToSet) {
          try {
            if (cookieStore) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored because src/proxy.ts refreshes
            // user sessions.
          }
        },
      },
    }
  )
}

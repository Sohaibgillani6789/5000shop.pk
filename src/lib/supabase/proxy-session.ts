import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { readSupabasePublicConfig } from '@/lib/env/public'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const config = readSupabasePublicConfig()

  // If Supabase environment variables are missing (e.g. during minimal build or initial setup),
  // allow the request to proceed without interruption.
  if (!config) {
    return supabaseResponse
  }

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  // IMPORTANT: Calling getUser() refreshes the auth token via cookies if expired.
  // Never remove getUser() or getClaims() when using @supabase/ssr in the proxy.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect Admin routes only (excluding the login page itself). All customer-facing storefront routes
  // (/, /category/*, /product/*, /cart, /checkout, /order-confirmation/*)
  // MUST remain accessible to guest shoppers without authentication.
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    request.nextUrl.pathname !== '/admin/login' &&
    !user
  ) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Server-Only Supabase Admin Client
 *
 *  SECURITY: This module uses SUPABASE_SERVICE_ROLE_KEY which
 *  bypasses Row Level Security. It MUST only be imported inside:
 *    - Route Handlers (src/app/api/)
 *    - Server Actions
 *    - Server Components that verify admin identity first
 *
 *  The `import 'server-only'` directive causes a hard build
 *  error if this module is accidentally imported in a Client
 *  Component, preventing key leakage.
 * ──────────────────────────────────────────────────────────────
 */

import 'server-only'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// ── Typed Admin Auth Error ─────────────────────────────────────

export class AdminAuthError extends Error {
  readonly status: 401 | 403

  constructor(message: string, status: 401 | 403 = 401) {
    super(message)
    this.name = 'AdminAuthError'
    this.status = status
  }
}

// ── Service-Role Client (bypasses RLS) ─────────────────────────

/**
 * Creates a Supabase client authenticated with the service-role key.
 * Use ONLY for admin operations where RLS must be bypassed.
 * Never expose this client to browser bundles.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      '[admin] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.'
    )
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      // Service role clients should not persist sessions
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// ── Admin Email Allowlist Verification ────────────────────────

/**
 * Returns the verified admin user if the session is valid AND
 * the user's email is in the ADMIN_EMAILS environment variable.
 *
 * Throws AdminAuthError (401) if no session exists.
 * Throws AdminAuthError (403) if session exists but email is not in allowlist.
 */
export async function verifyAdminUser(): Promise<{ id: string; email: string }> {
  // Use the cookie-based server client to verify the active session
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user || !user.email) {
    throw new AdminAuthError('Authentication required. Please sign in.', 401)
  }

  // Parse ADMIN_EMAILS: comma-separated list of authorized admin emails
  const rawAdminEmails = process.env.ADMIN_EMAILS ?? ''
  const allowlist = rawAdminEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (allowlist.length === 0) {
    throw new AdminAuthError(
      'Admin access is not configured. Set ADMIN_EMAILS in your environment.',
      403
    )
  }

  if (!allowlist.includes(user.email.toLowerCase())) {
    throw new AdminAuthError(
      'Access denied. Your account is not authorized for admin access.',
      403
    )
  }

  return { id: user.id, email: user.email }
}

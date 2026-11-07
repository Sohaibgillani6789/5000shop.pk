/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Server-only environment contract
 *
 * `import 'server-only'` makes the bundler fail the build if any
 * Client Component imports this module, so these secrets can never
 * reach a browser bundle.
 * ──────────────────────────────────────────────────────────────
 */
import 'server-only'
import { EnvConfigError } from './public'

/** Supabase service-role key (bypasses RLS). Throws a descriptive error if unset. */
export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!key) {
    throw new EnvConfigError('SUPABASE_SERVICE_ROLE_KEY', 'is not configured')
  }
  return key
}

/**
 * Parses ADMIN_EMAILS (comma-separated) into a trimmed, lowercased set.
 * Empty / whitespace entries are dropped.
 */
export function parseAdminEmails(raw: string | undefined): ReadonlySet<string> {
  return new Set(
    (raw ?? '')
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => entry.length > 0)
  )
}

export function getAdminEmails(): ReadonlySet<string> {
  return parseAdminEmails(process.env.ADMIN_EMAILS)
}

/**
 * AUTHORIZATION ONLY. Must be called with the email of a user already
 * authenticated via `supabase.auth.getUser()` — it is never a standalone
 * authentication mechanism.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().has(email.trim().toLowerCase())
}

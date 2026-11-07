/**
 * ──────────────────────────────────────────────────────────────
 * 5 HAZAAR TAK — Public (browser-safe) environment contract
 *
 * Every `process.env.NEXT_PUBLIC_*` reference below is written
 * literally so Next.js can inline it into client bundles at build
 * time. Do NOT refactor into dynamic `process.env[name]` lookups.
 *
 * Getters are lazy (evaluated on call, never at import time) so that
 * `next build` in CI can complete with placeholder values.
 * ──────────────────────────────────────────────────────────────
 */

/** Canonical production origin, used when NEXT_PUBLIC_SITE_URL is unset in production. */
export const DEFAULT_PRODUCTION_SITE_URL = 'https://5000shop.pk'
const DEFAULT_DEVELOPMENT_SITE_URL = 'http://localhost:3000'
/** Placeholder support line shown only when NEXT_PUBLIC_WHATSAPP_NUMBER is unset. */
export const DEFAULT_WHATSAPP_NUMBER = '923000000000'

export class EnvConfigError extends Error {
  constructor(variable: string, problem: string) {
    // Never include the variable's value in the message.
    super(`[env] ${variable} ${problem}. See .env.local.example for the required format.`)
    this.name = 'EnvConfigError'
  }
}

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export interface SupabasePublicConfig {
  url: string
  anonKey: string
}

/**
 * Returns Supabase public config, or `null` if either value is absent.
 * Key precedence: NEXT_PUBLIC_SUPABASE_ANON_KEY → NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 * (empty strings are treated as unset, so the fallback still applies).
 * Throws only when a value is present but malformed.
 */
export function readSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const anonKey =
    clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

  if (!url || !anonKey) return null
  if (!isHttpUrl(url)) {
    throw new EnvConfigError('NEXT_PUBLIC_SUPABASE_URL', 'is not a valid http(s) URL')
  }
  return { url, anonKey }
}

/** Same as {@link readSupabasePublicConfig} but throws a descriptive error when unset. */
export function getSupabasePublicConfig(): SupabasePublicConfig {
  const config = readSupabasePublicConfig()
  if (!config) {
    throw new EnvConfigError(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)',
      'is not configured'
    )
  }
  return config
}

/**
 * Absolute site origin (no trailing slash) powering canonical URLs, OpenGraph,
 * sitemap, robots and order-confirmation links.
 * Unset → canonical production domain in production, localhost in development.
 * Malformed → throws.
 */
export function getSiteUrl(): string {
  const raw = clean(process.env.NEXT_PUBLIC_SITE_URL)
  if (!raw) {
    return process.env.NODE_ENV === 'production'
      ? DEFAULT_PRODUCTION_SITE_URL
      : DEFAULT_DEVELOPMENT_SITE_URL
  }
  if (!isHttpUrl(raw)) {
    throw new EnvConfigError('NEXT_PUBLIC_SITE_URL', 'is not a valid absolute http(s) URL')
  }
  return raw.replace(/\/+$/, '')
}

/** WhatsApp number in international format without "+" (e.g. 923001234567). */
export function getWhatsAppNumber(): string {
  const raw = clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
  if (!raw) return DEFAULT_WHATSAPP_NUMBER
  const digits = raw.replace(/[\s+\-()]/g, '')
  if (!/^\d{10,15}$/.test(digits)) {
    throw new EnvConfigError(
      'NEXT_PUBLIC_WHATSAPP_NUMBER',
      'must be 10–15 digits in international format without "+" (e.g. 923001234567)'
    )
  }
  return digits
}

/** Builds a wa.me deep link with an optional pre-filled message. */
export function getWhatsAppLink(message?: string): string {
  const base = `https://wa.me/${getWhatsAppNumber()}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

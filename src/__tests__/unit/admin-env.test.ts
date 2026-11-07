import { describe, it, expect, beforeEach, vi } from 'vitest'
import { parseAdminEmails, isAdminEmail } from '@/lib/env/server'

describe('Admin Authorization & Email Allowlist', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('parses comma-separated emails with surrounding whitespace and case differences', () => {
    const parsed = parseAdminEmails(' Admin@5000shop.pk,  OWNER@5000SHOP.PK , staff@5000shop.pk ')

    expect(Array.from(parsed)).toEqual([
      'admin@5000shop.pk',
      'owner@5000shop.pk',
      'staff@5000shop.pk',
    ])
  })

  it('returns empty set when raw input or ADMIN_EMAILS is unset or empty', () => {
    expect(Array.from(parseAdminEmails(''))).toEqual([])
    expect(Array.from(parseAdminEmails(undefined))).toEqual([])
  })

  it('correctly validates authorized admin emails case-insensitively', () => {
    vi.stubEnv('ADMIN_EMAILS', 'sohaibgillani6789@gmail.com, admin@5000shop.pk')

    expect(isAdminEmail('sohaibgillani6789@gmail.com')).toBe(true)
    expect(isAdminEmail('SOHAIBGILLANI6789@GMAIL.COM')).toBe(true)
    expect(isAdminEmail('admin@5000shop.pk')).toBe(true)
    expect(isAdminEmail('ADMIN@5000SHOP.PK')).toBe(true)
  })

  it('rejects unauthorized emails, empty strings, and null/undefined', () => {
    vi.stubEnv('ADMIN_EMAILS', 'admin@5000shop.pk')

    expect(isAdminEmail('attacker@evil.com')).toBe(false)
    expect(isAdminEmail('admin@5000shop.pk.attacker.com')).toBe(false)
    expect(isAdminEmail('')).toBe(false)
    expect(isAdminEmail(null)).toBe(false)
    expect(isAdminEmail(undefined)).toBe(false)
  })
})

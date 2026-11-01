/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Layout
 *
 *  Server Component that verifies admin authentication before
 *  rendering any admin child route. Redirects to /admin/login
 *  if session is absent or email is not in ADMIN_EMAILS.
 *
 *  Renders a persistent admin shell with sidebar navigation
 *  and a top header bar.
 * ──────────────────────────────────────────────────────────────
 */

import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/app/admin/_components/AdminShell'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 5 Hazaar Tak Admin',
    default: '5 Hazaar Tak Admin',
  },
  robots: { index: false, follow: false },
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Step 1: Authentication check ──────────────────────────
  if (!user || !user.email) {
    redirect('/admin/login')
  }

  // ── Step 2: Authorization check (ADMIN_EMAILS allowlist) ──
  const rawAdminEmails = process.env.ADMIN_EMAILS ?? ''
  const allowlist = rawAdminEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (!allowlist.includes(user.email.toLowerCase())) {
    // Sign out the unauthorized user and redirect to login
    await supabase.auth.signOut()
    redirect('/admin/login?error=unauthorized')
  }

  return <AdminShell adminEmail={user.email}>{children}</AdminShell>
}

'use client'

/**
 * Admin Shell — Persistent sidebar + header navigation wrapper.
 * Receives adminEmail from the Server Component layout.
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Package,
} from 'lucide-react'

interface AdminShellProps {
  adminEmail: string
  children: React.ReactNode
}

const NAV_LINKS = [
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
] as const

// ── AdminSidebar — defined at module scope to avoid react-hooks/static-components ──

interface AdminSidebarProps {
  mobile: boolean
  pathname: string
  adminEmail: string
  signingOut: boolean
  onClose: () => void
  onSignOut: () => void
}

function AdminSidebar({
  mobile,
  pathname,
  adminEmail,
  signingOut,
  onClose,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <aside
      className={mobile ? 'admin-sidebar-mobile' : 'admin-sidebar'}
      aria-label="Admin navigation"
    >
      {/* Brand */}
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <Package size={20} />
        </div>
        <div>
          <div className="admin-sidebar-brand-name">5 Hazaar Tak</div>
          <div className="admin-sidebar-brand-sub">Admin Portal</div>
        </div>
        {mobile && (
          <button
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        <Link
          href="/admin"
          className={`admin-nav-link ${pathname === '/admin' ? 'admin-nav-link--active' : ''}`}
          onClick={onClose}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        {NAV_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`admin-nav-link ${pathname.startsWith(href) ? 'admin-nav-link--active' : ''}`}
            onClick={onClose}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User Footer */}
      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-avatar">
            {adminEmail[0].toUpperCase()}
          </div>
          <div className="admin-sidebar-user-info">
            <div className="admin-sidebar-user-email" title={adminEmail}>
              {adminEmail}
            </div>
            <div className="admin-sidebar-user-role">Administrator</div>
          </div>
        </div>
        <button
          className="admin-signout-btn"
          onClick={onSignOut}
          disabled={signingOut}
          aria-label="Sign out"
        >
          <LogOut size={16} />
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}

// ── Main Shell ────────────────────────────────────────────────

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  async function handleSignOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  function handleClose() {
    setSidebarOpen(false)
  }

  return (
    <div className="admin-shell">
      {/* Desktop Sidebar */}
      <AdminSidebar
        mobile={false}
        pathname={pathname}
        adminEmail={adminEmail}
        signingOut={signingOut}
        onClose={handleClose}
        onSignOut={handleSignOut}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="admin-overlay"
            onClick={handleClose}
            aria-hidden="true"
          />
          <AdminSidebar
            mobile={true}
            pathname={pathname}
            adminEmail={adminEmail}
            signingOut={signingOut}
            onClose={handleClose}
            onSignOut={handleSignOut}
          />
        </>
      )}

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Bar (mobile only) */}
        <header className="admin-topbar">
          <button
            className="admin-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <span className="admin-topbar-title">5 Hazaar Tak Admin</span>
        </header>

        <main className="admin-content">{children}</main>
      </div>

      <style>{`
        * { box-sizing: border-box; }

        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #0f172a;
          color: #e2e8f0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* ── Sidebar ─────────────────────────────── */
        .admin-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: #1e293b;
          border-right: 1px solid rgba(99,102,241,0.12);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }

        .admin-sidebar-mobile {
          width: 260px;
          background: #1e293b;
          border-right: 1px solid rgba(99,102,241,0.15);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          overflow-y: auto;
          animation: slideInLeft 0.2s ease;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .admin-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 40;
          backdrop-filter: blur(2px);
        }

        .admin-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(99,102,241,0.12);
        }

        .admin-sidebar-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .admin-sidebar-brand-name {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.2;
        }

        .admin-sidebar-brand-sub {
          font-size: 0.6875rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-sidebar-close {
          margin-left: auto;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.25rem;
        }

        .admin-sidebar-nav {
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .admin-nav-link {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }

        .admin-nav-link:hover {
          background: rgba(99,102,241,0.08);
          color: #e2e8f0;
        }

        .admin-nav-link--active {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
        }

        .admin-sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(99,102,241,0.12);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .admin-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .admin-sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .admin-sidebar-user-info { overflow: hidden; }

        .admin-sidebar-user-email {
          font-size: 0.75rem;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-sidebar-user-role {
          font-size: 0.6875rem;
          color: #64748b;
        }

        .admin-signout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 0.375rem;
          color: #fca5a5;
          font-size: 0.8125rem;
          cursor: pointer;
          transition: background 0.15s;
          width: 100%;
        }

        .admin-signout-btn:hover:not(:disabled) {
          background: rgba(239,68,68,0.15);
        }

        .admin-signout-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Main Area ──────────────────────────── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow-x: hidden;
        }

        .admin-topbar {
          display: none;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #1e293b;
          border-bottom: 1px solid rgba(99,102,241,0.12);
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .admin-menu-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
        }

        .admin-topbar-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-topbar { display: flex; }
          .admin-content { padding: 1rem; }
        }
      `}</style>
    </div>
  )
}

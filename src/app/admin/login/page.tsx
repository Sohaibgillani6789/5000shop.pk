'use client'

/**
 * ──────────────────────────────────────────────────────────────
 *  5 HAZAAR TAK — Admin Login Page
 *
 *  Supabase email/password authentication for admin users.
 *  On success, redirects to /admin/orders.
 *  Middleware protects /admin/* routes — if this page redirects
 *  back here after login it means email is not in ADMIN_EMAILS.
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useId, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin/orders'

  const emailId = useId()
  const passwordId = useId()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError('Invalid email or password. Please try again.')
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-brand">
          <div className="admin-login-icon">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="admin-login-title">5 Hazaar Tak</h1>
          <p className="admin-login-subtitle">Admin Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          {error && (
            <div role="alert" className="admin-login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="admin-field">
            <label htmlFor={emailId} className="admin-field-label">
              Email Address
            </label>
            <div className="admin-field-input-wrap">
              <Mail size={16} className="admin-field-icon" />
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@5000shop.pk"
                className="admin-field-input"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-field">
            <label htmlFor={passwordId} className="admin-field-label">
              Password
            </label>
            <div className="admin-field-input-wrap">
              <Lock size={16} className="admin-field-icon" />
              <input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="admin-field-input admin-field-input--password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="admin-field-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="admin-login-submit"
          >
            {isLoading ? (
              <>
                <span className="admin-login-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In to Admin Portal'
            )}
          </button>
        </form>

        <p className="admin-login-note">
          Access is restricted to authorized administrators only.
        </p>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 1.5rem;
        }
        .admin-login-card {
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 1rem;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
        }
        .admin-login-brand {
          text-align: center;
          margin-bottom: 2rem;
        }
        .admin-login-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 1rem;
          color: white;
          margin-bottom: 1rem;
        }
        .admin-login-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 0.25rem;
        }
        .admin-login-subtitle {
          font-size: 0.875rem;
          color: #94a3b8;
          margin: 0;
        }
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 0.5rem;
          color: #fca5a5;
          font-size: 0.875rem;
        }
        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .admin-field-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #cbd5e1;
        }
        .admin-field-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .admin-field-icon {
          position: absolute;
          left: 0.875rem;
          color: #64748b;
          pointer-events: none;
          flex-shrink: 0;
        }
        .admin-field-input {
          width: 100%;
          padding: 0.75rem 0.875rem 0.75rem 2.75rem;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(71, 85, 105, 0.5);
          border-radius: 0.5rem;
          color: #f8fafc;
          font-size: 0.9375rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .admin-field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .admin-field-input--password {
          padding-right: 3rem;
        }
        .admin-field-input::placeholder {
          color: #475569;
        }
        .admin-field-toggle {
          position: absolute;
          right: 0.875rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .admin-field-toggle:hover { color: #94a3b8; }
        .admin-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 0.25rem;
        }
        .admin-login-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .admin-login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .admin-login-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-login-note {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: #475569;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050708] flex items-center justify-center text-amber-500 font-mono text-sm font-bold uppercase tracking-widest">
          Loading Security Gate...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}


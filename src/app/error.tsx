'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log unexpected runtime errors server-side / analytics
    console.error('[5000shop.pk Runtime Error]:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#050708] text-white flex flex-col justify-center items-center px-4 py-16 selection:bg-[#F47514] selection:text-white font-['Outfit',var(--font-outfit),sans-serif]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5B84C]">
            Temporary Interruption
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-[#D5C9B8] leading-relaxed">
            We encountered a temporary connection issue while loading the marketplace. Your cart and stored preferences remain safe.
          </p>
        </div>

        {error.digest && (
          <p className="font-mono text-[11px] text-[#A8988B] bg-[#120D08] px-3 py-1.5 rounded-lg border border-[rgba(255,220,180,0.12)] inline-block">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#F47514] hover:bg-[#DF5E03] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A120B] hover:bg-[#2A1D12] text-[#E5B84C] border border-[rgba(255,220,180,0.25)] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

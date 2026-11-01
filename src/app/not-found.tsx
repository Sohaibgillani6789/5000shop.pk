import Link from 'next/link'
import { Sparkles, Home, HelpCircle } from 'lucide-react'

export default function NotFound() {
  const categories = [
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Home', slug: 'home' },
    { name: 'Accessories', slug: 'accessories' },
  ]

  return (
    <div className="min-h-screen bg-[#050708] text-white flex flex-col justify-between selection:bg-[#F47514] selection:text-white font-['Outfit',var(--font-outfit),sans-serif]">
      {/* Top Bar */}
      <header className="border-b border-[rgba(255,220,180,0.15)] bg-[#0A0704]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-wider text-white hover:text-[#E5B84C] transition-colors"
          >
            5 Hazaar Tak
          </Link>
          <span className="text-xs font-semibold text-[#E5B84C] uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
            Everything Under ₨5,000
          </span>
        </div>
      </header>

      {/* Center 404 Hero */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-bold uppercase tracking-widest text-[#E5B84C] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Error 404 — Page Not Found</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight text-white mb-4">
          Lost In The <span className="bg-linear-to-r from-[#DF5E03] via-[#F47514] to-[#E5B84C] bg-clip-text text-transparent">Marketplace?</span>
        </h1>

        <p className="text-sm sm:text-base text-[#D5C9B8] max-w-xl mx-auto mb-8 leading-relaxed">
          The product, category, or order link you are trying to reach does not exist or may have been updated. Everything on 5 Hazaar Tak remains strictly capped under ₨5,000.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F47514] hover:bg-[#DF5E03] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1A120B] hover:bg-[#2A1D12] text-[#E5B84C] border border-[rgba(255,220,180,0.25)] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <span>View Shopping Cart</span>
          </Link>
        </div>

        {/* Popular Categories Shortcut */}
        <div className="pt-8 border-t border-[rgba(255,220,180,0.15)]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A8988B] mb-4">
            Explore Curated Verticals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-xl bg-[#120D08] hover:bg-[#20150D] border border-[rgba(255,220,180,0.15)] text-xs font-semibold text-[#D5C9B8] hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Support Strip */}
      <footer className="border-t border-[rgba(255,220,180,0.15)] bg-[#0A0704]/90 py-4 px-4 text-center">
        <p className="text-xs text-[#A8988B] flex items-center justify-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Need help with an order? Contact WhatsApp dispatch at</span>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-white font-mono font-bold underline"
          >
            +{process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000'}
          </a>
        </p>
      </footer>
    </div>
  )
}

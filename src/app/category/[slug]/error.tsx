"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error message on the client for debugging
    console.error("[CategoryError]:", error.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] bg-[#050708] text-white flex items-center justify-center px-4 py-24 font-['Outfit',var(--font-outfit),sans-serif]">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#F47514] mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
          Unable to Load Category
        </h2>
        <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
          We experienced an issue retrieving the products for this vertical. Please try again or return to the marketplace.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F47514] hover:bg-[#DF5E03] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

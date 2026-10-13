import Link from "next/link";
import { PackageX, Home, ShoppingBag } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-[75vh] bg-[#050708] text-white flex items-center justify-center px-4 py-24 font-['Outfit',var(--font-outfit),sans-serif]">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#200E02] border border-[#F47514]/30 flex items-center justify-center text-[#F47514] mb-4">
          <PackageX className="w-8 h-8 stroke-[1.8]" />
        </div>

        <span className="text-[11px] font-bold text-[#F47514] uppercase tracking-widest block mb-1">
          404 — Not Found
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          Product Not Found
        </h2>
        <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
          The item you are searching for might have been sold out, unlisted, or moved to another curated collection.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#categories"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F47514] hover:bg-[#DF5E03] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop Categories</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

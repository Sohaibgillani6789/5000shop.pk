export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#050708] text-white font-['Outfit',var(--font-outfit),sans-serif] animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="border-b border-[rgba(255,220,180,0.15)] bg-[#0A0704] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-4 w-36 bg-amber-500/20 rounded-md" />
        </div>
      </div>

      {/* Main Details Skeleton */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Image Skeleton */}
          <div className="lg:col-span-6 space-y-4">
            <div className="w-full aspect-square rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] bg-white/5" />
            <div className="h-10 w-full bg-[#120D08] rounded-2xl" />
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-amber-500/20 rounded-full" />
              <div className="h-8 w-3/4 bg-white/10 rounded-xl" />
              <div className="h-4 w-1/2 bg-white/5 rounded-md" />
            </div>

            <div className="h-12 w-40 bg-amber-500/20 rounded-xl" />

            <div className="space-y-2 pt-4">
              <div className="h-4 w-full bg-white/5 rounded-md" />
              <div className="h-4 w-5/6 bg-white/5 rounded-md" />
              <div className="h-4 w-4/6 bg-white/5 rounded-md" />
            </div>

            <div className="h-14 w-full bg-[#1A120B] rounded-2xl border border-[rgba(255,220,180,0.15)]" />

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="h-12 bg-[#120D08] rounded-xl border border-[rgba(255,220,180,0.1)]" />
              <div className="h-12 bg-[#120D08] rounded-xl border border-[rgba(255,220,180,0.1)]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

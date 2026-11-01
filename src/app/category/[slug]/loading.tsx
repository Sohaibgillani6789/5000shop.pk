export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#050708] text-white font-['Outfit',var(--font-outfit),sans-serif] animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="border-b border-[rgba(255,220,180,0.15)] bg-[#0A0704] py-14 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-5 w-32 bg-amber-500/20 rounded-full mx-auto" />
          <div className="h-10 w-64 bg-white/10 rounded-xl mx-auto" />
          <div className="h-4 w-96 max-w-full bg-white/5 rounded-md mx-auto" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[280px] rounded-3xl bg-[#120D08] border border-[rgba(255,220,180,0.12)] p-4 space-y-4"
            >
              <div className="w-full aspect-square rounded-2xl bg-white/5" />
              <div className="h-4 w-3/4 bg-white/10 rounded-md" />
              <div className="h-3 w-1/2 bg-white/5 rounded-md" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-20 bg-amber-500/20 rounded-md" />
                <div className="h-8 w-8 bg-white/10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

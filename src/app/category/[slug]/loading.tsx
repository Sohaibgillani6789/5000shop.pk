export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-white font-['Outfit',var(--font-outfit),sans-serif]">
      <main style={{ paddingTop: "var(--site-header-height, 89px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
          {/* Header Skeleton: accent lines + title */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="flex-1 h-[1.5px] bg-[#F47514]/30" />
            <div className="h-7 w-40 bg-neutral-200 rounded" />
            <span className="flex-1 h-[1.5px] bg-[#F47514]/30" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-white border border-neutral-200/90 rounded-xl p-4"
              >
                <div className="h-5 w-12 bg-neutral-200 rounded" />
                <div className="w-full aspect-[4/3] my-4 bg-neutral-100 rounded" />
                <div className="h-3 w-16 bg-neutral-100 rounded mb-2" />
                <div className="h-4 w-3/4 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-1/2 bg-neutral-200 rounded mb-3" />
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 bg-orange-100 rounded" />
                  <div className="h-4 w-12 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

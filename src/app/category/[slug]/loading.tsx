export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#050708] text-white">
      {/* Skeleton Hero Header */}
      <div className="pt-28 pb-14 sm:pt-36 sm:pb-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-36 bg-neutral-800 rounded animate-pulse mb-6" />
          <div className="h-6 w-44 bg-neutral-800 rounded-full animate-pulse mb-4" />
          <div className="h-12 w-80 bg-neutral-800 rounded-lg animate-pulse mb-4" />
          <div className="h-4 w-96 max-w-full bg-neutral-800/60 rounded animate-pulse" />
        </div>
      </div>

      {/* Skeleton Product Grid (Warm Cream) */}
      <div
        className="py-12 sm:py-16"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pb-6 border-b border-[rgba(180,150,120,0.2)] mb-8">
            <div className="h-7 w-48 bg-[#EAE3D5] rounded animate-pulse" />
            <div className="h-6 w-24 bg-[#EAE3D5] rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full max-w-[280px] sm:max-w-none flex flex-col">
                <div className="w-full h-[260px] bg-white rounded-md border border-neutral-200/60 animate-pulse mb-3" />
                <div className="h-3 w-1/3 bg-[#EAE3D5] rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-[#E2D9C8] rounded animate-pulse mb-2" />
                <div className="h-4 w-1/4 bg-[#EAE3D5] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

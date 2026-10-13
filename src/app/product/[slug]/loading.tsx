export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#050708] text-white">
      {/* Breadcrumb Skeleton */}
      <div className="pt-28 sm:pt-36 pb-6 bg-[#080503] border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Product Detail Skeleton Stage */}
      <div
        className="py-10 sm:py-16"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Image Skeleton */}
            <div className="lg:col-span-6">
              <div className="w-full aspect-square max-h-[560px] bg-white rounded-3xl border border-neutral-200 animate-pulse p-8 shadow-sm" />
            </div>

            {/* Right: Info Skeleton */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="h-4 w-28 bg-[#EAE3D5] rounded animate-pulse" />
              <div className="h-9 w-3/4 bg-[#E2D9C8] rounded animate-pulse" />
              <div className="h-8 w-44 bg-[#EAE3D5] rounded animate-pulse" />
              <div className="h-6 w-60 bg-[#EAE3D5]/80 rounded-full animate-pulse" />
              <div className="h-20 w-full bg-[#EAE3D5]/60 rounded-xl animate-pulse mt-4" />
              <div className="h-12 w-full bg-[#E2D9C8] rounded-full animate-pulse mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

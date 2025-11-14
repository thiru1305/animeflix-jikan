export default function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-[#141414]">
      <div className="w-full bg-[#222] animate-pulse" style={{ aspectRatio: '2 / 3' }} />
      <div className="p-2 space-y-2">
        <div className="h-4 w-4/5 bg-[#222] animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-[#222] animate-pulse rounded" />
      </div>
    </div>
  )
}

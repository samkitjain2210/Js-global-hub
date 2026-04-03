export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-square animate-shimmer rounded-none" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-14 animate-shimmer rounded" />
        <div className="h-4 w-full animate-shimmer rounded" />
        <div className="h-3 w-24 animate-shimmer rounded" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 animate-shimmer rounded" />
          <div className="h-3 w-10 animate-shimmer rounded" />
        </div>
        <div className="h-10 w-full animate-shimmer rounded-xl" />
      </div>
    </div>
  );
}

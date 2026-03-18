// VendoX Frontend — components/feed/PostCardSkeleton.tsx

export function PostCardSkeleton() {
  return (
    <div className="vendox-card overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="skeleton w-11 h-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
        <div className="skeleton h-7 w-16 rounded-full" />
      </div>
      {/* Image */}
      <div className="skeleton aspect-square" />
      {/* Actions */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex gap-3">
          <div className="skeleton h-8 w-16 rounded-xl" />
          <div className="skeleton h-8 w-16 rounded-xl" />
          <div className="skeleton h-8 w-8 rounded-xl ml-auto" />
        </div>
        <div className="skeleton h-3.5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

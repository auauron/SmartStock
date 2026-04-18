function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{ minHeight: "1rem" }}
    />
  );
}

function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-8 w-20" />
          <SkeletonPulse className="h-3 w-32" />
        </div>
        <SkeletonPulse className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-28" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
      <div className="text-right space-y-2">
        <SkeletonPulse className="h-4 w-16 ml-auto" />
        <SkeletonPulse className="h-3 w-12 ml-auto" />
      </div>
    </div>
  );
}

function ActivityItemSkeleton() {
  return (
    <div className="flex justify-between items-center border-b pb-2 last:border-0">
      <div className="space-y-2">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-5 w-20 rounded" />
      </div>
      <div className="text-right space-y-2">
        <SkeletonPulse className="h-4 w-16 ml-auto" />
        <SkeletonPulse className="h-3 w-20 ml-auto" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <SkeletonPulse className="h-7 w-56 mb-2" />
        <SkeletonPulse className="h-5 w-80" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 space-y-1.5">
            <SkeletonPulse className="h-5 w-32" />
            <SkeletonPulse className="h-3 w-48" />
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 space-y-1.5">
            <SkeletonPulse className="h-5 w-36" />
            <SkeletonPulse className="h-3 w-52" />
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

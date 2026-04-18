function SkeletonPulse({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{ minHeight: "1rem" }}
    />
  );
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <SkeletonPulse className="h-4 w-32" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SkeletonPulse className="h-4 w-24" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SkeletonPulse className="h-4 w-16" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SkeletonPulse className="h-4 w-12" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SkeletonPulse className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <SkeletonPulse className="h-7 w-7 rounded" />
          <SkeletonPulse className="h-7 w-7 rounded" />
        </div>
      </td>
    </tr>
  );
}

export function InventorySkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}

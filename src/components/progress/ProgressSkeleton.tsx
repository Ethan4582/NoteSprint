import { Skeleton } from "@/src/components/ui/skeleton";

export default function ProgressSkeleton() {
  return (
    <div className="space-y-6">
      {/* 4 Stat Overview Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-[12px] bg-white border border-[var(--border)] shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="p-5 rounded-[12px] bg-white border border-[var(--border)] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>

      {/* Topics Grid Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-4 rounded-[11px] bg-white border border-[var(--border)] shadow-xs space-y-3"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

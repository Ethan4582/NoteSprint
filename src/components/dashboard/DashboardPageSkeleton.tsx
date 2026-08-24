import { Skeleton } from "@/src/components/ui/skeleton";

export default function DashboardPageSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans">
      {/* Desktop Left Sidebar Skeleton */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[var(--border)] bg-white p-5 space-y-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="space-y-2 pt-4">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-28">
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-4 w-60" />
            </div>
            <Skeleton className="h-10 w-full sm:w-72 rounded-lg" />
          </div>

          {/* Shelf Skeleton */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>

            {/* Topic Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-[12px] bg-white border border-[var(--border)] shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import { Skeleton } from "@/src/components/ui/skeleton";

export default function PreviewSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-md" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Card Skeleton */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-lg border border-[var(--border)] p-6 sm:p-10 shadow-sm space-y-12">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-4 pb-10 border-b border-[var(--border)] last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-28 w-full rounded-md mt-4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

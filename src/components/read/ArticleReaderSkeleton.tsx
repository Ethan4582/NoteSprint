import { Skeleton } from "@/src/components/ui/skeleton";

export default function ArticleReaderSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-[10px]" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-48 sm:w-64" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
      </header>

      {/* Reader Layout Skeleton */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-12 pb-32">
        <div className="relative flex justify-center">
          {/* Table of contents aside skeleton */}
          <aside className="hidden xl:block absolute right-[calc(50%+24rem+2rem)] w-[220px] top-0 h-full">
            <div className="sticky top-24 space-y-3">
              <Skeleton className="h-3.5 w-24" />
              <div className="space-y-2 border-l border-[var(--border-outer)] pl-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </aside>

          {/* Article Content Card Skeleton */}
          <div className="w-full max-w-3xl bg-white p-6 sm:p-12 rounded-[12px] border border-[var(--border)] shadow-sm space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-44 w-full rounded-lg" />

            <div className="space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

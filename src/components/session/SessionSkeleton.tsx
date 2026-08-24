import { Skeleton } from "@/src/components/ui/skeleton";

export default function SessionSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-between select-none">
      {/* Header Skeleton */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-md" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </header>

      {/* Main Flashcard Skeleton */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto w-full">
        <div className="w-full h-80 rounded-2xl bg-white border border-[var(--border)] p-8 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>

          <div className="space-y-3 my-auto">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5 mx-auto" />
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        </div>
      </main>

      {/* Footer Controls Skeleton */}
      <footer className="w-full max-w-xl mx-auto px-4 pb-10 flex items-center justify-center gap-3">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </footer>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton"

export default function CandidateLoading() {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(260px,30%)_1fr]">
      {/* Sidebar skeleton */}
      <aside className="overflow-hidden rounded-lg border border-border bg-card md:self-start">
        <Skeleton className="aspect-[3/4] rounded-none" />
        <div className="space-y-3 p-5">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-4 h-9 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="min-w-0 space-y-4">
        {/* Section nav skeleton */}
        <div className="rounded-full border border-border bg-background p-1">
          <div className="flex w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 px-2 py-1">
                <Skeleton className="h-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Section cards skeleton */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

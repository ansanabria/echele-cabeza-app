export default function CandidateLoading() {
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(260px,30%)_1fr]">
      {/* Sidebar skeleton */}
      <aside className="overflow-hidden rounded-lg border border-border bg-card md:self-start">
        <div className="aspect-[3/4] animate-pulse bg-muted" />
        <div className="space-y-3 p-5">
          <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-9 w-full animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
        </div>
      </aside>

      {/* Main content skeleton */}
      <div className="min-w-0 space-y-4">
        {/* Section nav skeleton */}
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-28 animate-pulse rounded-md bg-muted" />
          ))}
        </div>

        {/* Section cards skeleton */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

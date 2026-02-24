export default function HomeLoading() {
  return (
    <section className="flex flex-col gap-8 lg:gap-12">
      {/* IntroPanel skeleton */}
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="mb-3 h-10 w-2/3 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Candidate card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] min-h-[280px] animate-pulse rounded-lg border border-border bg-muted"
          />
        ))}
      </div>
    </section>
  )
}

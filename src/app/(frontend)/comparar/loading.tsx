import { Skeleton } from "@/components/ui/skeleton"

export default function CompareLoading() {
  const TOPIC_COUNT = 6

  return (
    <section>
      {/* Page header */}
      <Skeleton className="mb-1 h-9 w-56" />
      <Skeleton className="mb-6 h-4 w-3/4" />

      {/* CandidatePicker skeleton — two select boxes */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>

      {/* Comparison table skeleton */}
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Header row */}
        <div className="hidden grid-cols-[180px_1fr_1fr] bg-secondary md:grid">
          <div className="border-b border-r border-border p-4">
            <Skeleton className="h-4 w-12" />
          </div>
          {[0, 1].map((col) => (
            <div
              key={col}
              className={`border-b border-border p-4 ${col === 0 ? "border-r" : ""}`}
            >
              <Skeleton className="mb-2 aspect-[3/4] w-[110px] rounded-lg" />
              <Skeleton className="mb-1 h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>

        {/* Topic rows — desktop */}
        <div className="hidden md:block">
          {Array.from({ length: TOPIC_COUNT }).map((_, i) => (
            <div key={i} className="grid grid-cols-[180px_1fr_1fr]">
              <div className="border-b border-r border-border p-4">
                <Skeleton className="h-4 w-24" />
              </div>
              {[0, 1].map((col) => (
                <div
                  key={col}
                  className={`border-b border-border p-4 ${col === 0 ? "border-r" : ""}`}
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Topic rows — mobile (stacked cards) */}
        <div className="grid gap-3 p-3 md:hidden">
          {Array.from({ length: TOPIC_COUNT }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <div className="border-b border-border bg-secondary p-3">
                <Skeleton className="h-4 w-24" />
              </div>
              {[0, 1].map((col) => (
                <div
                  key={col}
                  className={`p-3 ${col === 0 ? "border-b border-border" : ""}`}
                >
                  <Skeleton className="mb-1 h-3 w-32" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Skeleton } from '@/components/ui/skeleton'

export default function ControversiasLoading() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Header */}
      <header className="mb-10 border-b border-border pb-8">
        <Skeleton className="mb-2 h-3 w-44" />
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="mb-6 h-4 w-40" />
        {/* Status pills row */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </header>

      {/* Controversy cards — single column, left-bordered */}
      <div className="flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg border border-border border-l-4 border-l-muted-foreground/20 bg-card p-5"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
            <Skeleton className="mb-2 h-3 w-12" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="mt-10 border-t border-border pt-6">
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}

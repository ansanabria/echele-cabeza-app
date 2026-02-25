import { Skeleton } from '@/components/ui/skeleton'

export default function PropuestasLoading() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Header */}
      <header className="mb-10 border-b border-border pb-8">
        <Skeleton className="mb-2 h-3 w-40" />
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="h-4 w-40" />
      </header>

      {/* Proposal cards grid — 3 columns on large, 2 on small */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-lg border border-border bg-card p-5">
            <Skeleton className="mb-2 h-3 w-16" />
            <Skeleton className="mb-2 h-5 w-3/4" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <Skeleton className="h-4 w-36" />
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

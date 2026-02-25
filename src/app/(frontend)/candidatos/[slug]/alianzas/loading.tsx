import { Skeleton } from '@/components/ui/skeleton'

export default function AlianzasLoading() {
  return (
    <div>
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-32" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="h-4 w-36" />
      </div>

      <header className="mb-10 border-b border-border pb-8">
        <Skeleton className="mb-2 h-3 w-32" />
        <Skeleton className="mb-2 h-9 w-64" />
        <Skeleton className="h-4 w-40" />
      </header>

      <div className="mb-10">
        <Skeleton className="mb-4 h-3 w-48" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5"
            >
              <Skeleton className="h-16 w-16 rounded-lg" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="mb-4 h-3 w-40" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5"
            >
              <Skeleton className="aspect-square w-20 rounded-lg" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

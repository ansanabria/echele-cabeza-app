type TrajectoryItem = {
  id?: string | null
  role: string
  organization: string
  startYear: string
  endYear?: string | null
  location?: string | null
  description?: string | null
}

type TrajectoryTimelineProps = {
  items: TrajectoryItem[]
  emptyMessage?: string
}

export function TrajectoryTimeline({ items, emptyMessage }: TrajectoryTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="leading-relaxed text-muted-foreground">
        {emptyMessage ?? 'No hay entradas registradas.'}
      </p>
    )
  }

  return (
    <ol className="relative ml-3 border-l border-border">
      {items.map((item, index) => {
        const period = item.endYear
          ? `${item.startYear} – ${item.endYear}`
          : `${item.startYear} – Presente`

        return (
          <li key={item.id ?? `${item.role}-${index}`} className="relative mb-8 pl-8 last:mb-0">
            {/* Timeline dot */}
            <span
              className="absolute -left-[9px] top-[5px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-2 border-border bg-card"
              aria-hidden
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>

            {/* Entry content */}
            <div>
              <h3 className="text-base font-bold font-sans text-foreground leading-snug">
                {item.role}
              </h3>
              <p className="mt-0.5 text-sm text-foreground">{item.organization}</p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {period}
                {item.location ? ` · ${item.location}` : ''}
              </p>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

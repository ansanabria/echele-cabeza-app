'use client'

import { useState } from 'react'

const INITIAL_VISIBLE = 3

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
  const [expanded, setExpanded] = useState(false)

  if (items.length === 0) {
    return (
      <p className="leading-relaxed text-muted-foreground">
        {emptyMessage ?? 'No hay entradas registradas.'}
      </p>
    )
  }

  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE)
  const hasMore = items.length > INITIAL_VISIBLE

  return (
    <div>
      <ol className="relative ml-3 border-l border-border">
        {visibleItems.map((item, index) => {
          const period = item.endYear
            ? `${item.startYear} – ${item.endYear}`
            : `${item.startYear} – Presente`

          const isLast = index === visibleItems.length - 1
          const terminateLine = isLast && (expanded || !hasMore)

          return (
            <li
              key={item.id ?? `${item.role}-${index}`}
              className={`relative mb-8 pl-8 ${terminateLine ? 'last:mb-0 last:before:absolute last:before:-left-px last:before:top-[13px] last:before:bottom-0 last:before:w-px last:before:bg-background' : ''}`}
            >
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

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {expanded
              ? `Ver menos`
              : `Ver ${items.length - INITIAL_VISIBLE} entrada${items.length - INITIAL_VISIBLE === 1 ? '' : 's'} más`}
          </button>
        </div>
      )}
    </div>
  )
}

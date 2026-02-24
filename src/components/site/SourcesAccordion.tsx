import { formatDate } from '@/lib/candidates'

type SourceItem = {
  id?: string | null
  title?: string | null
  url?: string | null
  tier?: string | null
  publishedAt?: string | null
}

type SourcesAccordionProps = {
  sources: SourceItem[]
}

export function SourcesAccordion({ sources }: SourcesAccordionProps) {
  if (!sources.length) return null

  return (
    <details className="mt-3 rounded-lg border border-border bg-secondary px-4 py-3">
      <summary className="cursor-pointer text-sm font-medium text-foreground">
        Fuentes
      </summary>
      <ul className="mt-3 space-y-2.5 pl-4">
        {sources.map((source, index) => {
          const href = source.url ?? undefined
          return (
            <li key={source.id ?? `${source.title}-${index}`}>
              <a href={href} target="_blank" rel="noreferrer noopener" className="text-primary">
                {source.title ?? 'Fuente'}
              </a>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDate(source.publishedAt)} · {source.tier ?? 'sin nivel'}
              </p>
            </li>
          )
        })}
      </ul>
    </details>
  )
}

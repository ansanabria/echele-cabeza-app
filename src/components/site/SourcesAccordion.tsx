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
    <details className="sources-accordion">
      <summary>Fuentes</summary>
      <ul>
        {sources.map((source, index) => {
          const href = source.url ?? undefined
          return (
            <li key={source.id ?? `${source.title}-${index}`}>
              <a href={href} target="_blank" rel="noreferrer noopener">
                {source.title ?? 'Fuente'}
              </a>
              <p>
                {formatDate(source.publishedAt)} · {source.tier ?? 'sin nivel'}
              </p>
            </li>
          )
        })}
      </ul>
    </details>
  )
}

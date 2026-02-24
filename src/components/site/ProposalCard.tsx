type ProposalItem = {
  id?: string | null
  title: string
  description: string
  topic?: string | null
  sourceTitle: string
  sourceUrl: string
  sourceTier: 'oficial' | 'prensa' | 'ong' | 'redes'
}

const tierLabels: Record<ProposalItem['sourceTier'], string> = {
  oficial: 'Fuente oficial',
  prensa: 'Prensa',
  ong: 'ONG',
  redes: 'Redes sociales',
}

type ProposalCardProps = {
  item: ProposalItem
}

export function ProposalCard({ item }: ProposalCardProps) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-5">
      {item.topic && (
        <span className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {item.topic}
        </span>
      )}
      <h3 className="mb-2 text-base font-bold text-card-foreground leading-snug">{item.title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

      <div className="mt-4 border-t border-border pt-3">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-medium text-primary hover:underline"
        >
          {item.sourceTitle}
        </a>
        <span className="ml-2 text-xs text-muted-foreground">· {tierLabels[item.sourceTier]}</span>
      </div>
    </article>
  )
}

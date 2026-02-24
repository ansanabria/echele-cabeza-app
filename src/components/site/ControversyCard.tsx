type ControversyStatus = 'suspicion' | 'under_investigation' | 'indicted' | 'cleared' | 'convicted'

type ControversyItem = {
  id?: string | null
  title: string
  description: string
  status: ControversyStatus
  year?: string | null
  sourceTitle: string
  sourceUrl: string
  sourceTier: 'oficial' | 'prensa' | 'ong' | 'redes'
}

const statusConfig: Record<
  ControversyStatus,
  { label: string; leftBorderClass: string; badgeClass: string; dotClass: string }
> = {
  suspicion: {
    label: 'Sospecha / sin investigacion activa',
    leftBorderClass: 'border-l-muted-foreground/40',
    badgeClass: 'bg-muted text-muted-foreground',
    dotClass: 'bg-muted-foreground/60',
  },
  under_investigation: {
    label: 'Investigacion en curso',
    leftBorderClass: 'border-l-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  indicted: {
    label: 'Imputado formalmente',
    leftBorderClass: 'border-l-destructive',
    badgeClass: 'bg-destructive/10 text-destructive',
    dotClass: 'bg-destructive',
  },
  cleared: {
    label: 'Absuelto / caso cerrado',
    leftBorderClass: 'border-l-muted-foreground/40',
    badgeClass: 'bg-muted text-muted-foreground',
    dotClass: 'bg-muted-foreground/60',
  },
  convicted: {
    label: 'Condenado',
    leftBorderClass: 'border-l-destructive',
    badgeClass: 'bg-destructive/10 text-destructive',
    dotClass: 'bg-destructive',
  },
}

const tierLabels: Record<ControversyItem['sourceTier'], string> = {
  oficial: 'Fuente oficial',
  prensa: 'Prensa',
  ong: 'ONG',
  redes: 'Redes sociales',
}

type ControversyCardProps = {
  item: ControversyItem
}

export function ControversyCard({ item }: ControversyCardProps) {
  const config = statusConfig[item.status]

  return (
    <article
      className={`flex flex-col rounded-lg border border-border bg-card p-5 border-l-4 ${config.leftBorderClass}`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-bold text-card-foreground leading-snug">{item.title}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={`inline-block h-2 w-2 rounded-full ${config.dotClass}`} aria-hidden />
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badgeClass}`}>
            {config.label}
          </span>
        </div>
      </div>

      {item.year && (
        <span className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {item.year}
        </span>
      )}

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

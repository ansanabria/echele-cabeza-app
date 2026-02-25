import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ControversyCard } from '@/components/site/ControversyCard'
import { SourcesAccordion } from '@/components/site/SourcesAccordion'
import { Button } from '@/components/ui/button'
import { getCandidateBySlug, getSourcesForSection } from '@/lib/candidates'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function AllControversiesPage({ params }: Props) {
  const { slug } = await params
  const candidate = await getCandidateBySlug(slug)

  if (!candidate) {
    notFound()
  }

  const controversies = candidate.controversyItems ?? []
  const sources = getSourcesForSection(candidate, 'controversies')

  const counts = controversies.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div>
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/candidatos" className="transition-colors hover:text-foreground">
          Candidatos
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/candidatos/${candidate.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {candidate.name}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">Escándalos y controversias</span>
      </nav>

      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Escándalos y controversias
        </p>
        <h1 className="text-3xl leading-tight">{candidate.name}</h1>
        <p className="mt-1 text-muted-foreground">{candidate.party}</p>

        {controversies.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            <StatusPill label="Total" count={controversies.length} />
            {counts['under_investigation'] ? (
              <StatusPill label="En investigación" count={counts['under_investigation']} variant="warning" />
            ) : null}
            {counts['indicted'] ? (
              <StatusPill label="Imputado" count={counts['indicted']} variant="danger" />
            ) : null}
            {counts['convicted'] ? (
              <StatusPill label="Condenado" count={counts['convicted']} variant="danger" />
            ) : null}
            {counts['cleared'] ? (
              <StatusPill label="Absuelto" count={counts['cleared']} />
            ) : null}
          </div>
        )}
      </header>

      {controversies.length > 0 ? (
        <div className="flex flex-col gap-5">
          {controversies.map((item) => (
            <ControversyCard key={item.id ?? item.title} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No hay controversias registradas para este candidato aún.
        </p>
      )}

      {sources.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <SourcesAccordion sources={sources} />
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <Button asChild variant="link" className="px-0">
          <Link href={`/candidatos/${candidate.slug}#controversies`}>
            ← Volver al perfil de {candidate.name}
          </Link>
        </Button>
      </div>
    </div>
  )
}

type StatusPillProps = {
  label: string
  count: number
  variant?: 'warning' | 'danger' | 'default'
}

function StatusPill({ label, count, variant = 'default' }: StatusPillProps) {
  const base = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium'
  const styles = {
    default: 'bg-muted text-muted-foreground',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    danger: 'bg-destructive/10 text-destructive',
  }

  return (
    <span className={`${base} ${styles[variant]}`}>
      <span className="tabular-nums font-bold">{count}</span>
      {label}
    </span>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AlliancePartyCard } from '@/components/site/AlliancePartyCard'
import { EndorserCard } from '@/components/site/EndorserCard'
import { SourcesAccordion } from '@/components/site/SourcesAccordion'
import { Button } from '@/components/ui/button'
import { getCandidateBySlug, getSourcesForSection, lexicalToPlainText } from '@/lib/candidates'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function AlliancesPage({ params }: Props) {
  const { slug } = await params
  const candidate = await getCandidateBySlug(slug)

  if (!candidate) {
    notFound()
  }

  const content = lexicalToPlainText(candidate.alliances)
  const allianceParties = candidate.allianceParties ?? []
  const endorsers = candidate.endorsers ?? []
  const sources = getSourcesForSection(candidate, 'alliances')

  return (
    <div>
      <div className="mb-8">
        <Button asChild variant="link" className="px-0">
          <Link href={`/candidatos/${candidate.slug}#alliances`}>
            ← Volver al perfil de {candidate.name}
          </Link>
        </Button>
      </div>

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
        <span className="text-foreground">Alianzas y avales</span>
      </nav>

      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Alianzas y avales
        </p>
        <h1 className="text-3xl leading-tight">{candidate.name}</h1>
        <p className="mt-1 text-muted-foreground">{candidate.party}</p>
      </header>

      {content && <p className="mb-10 text-sm leading-relaxed text-muted-foreground">{content}</p>}

      {allianceParties.length > 0 && (
        <div className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Partidos y coaliciones
            </p>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allianceParties.map((item) => (
              <AlliancePartyCard key={item.id ?? item.name} item={item} />
            ))}
          </div>
        </div>
      )}

      {endorsers.length > 0 && (
        <div>
          <div className="mb-5 flex items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Personas que apoyan
            </p>
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {endorsers.map((item) => (
              <EndorserCard key={item.id ?? item.name} item={item} />
            ))}
          </div>
        </div>
      )}

      {!content && allianceParties.length === 0 && endorsers.length === 0 && (
        <p className="text-muted-foreground">
          No hay alianzas ni apoyos registrados para este candidato aún.
        </p>
      )}

      {sources.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <SourcesAccordion sources={sources} />
        </div>
      )}
    </div>
  )
}

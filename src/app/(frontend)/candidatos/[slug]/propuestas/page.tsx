import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProposalCard } from '@/components/site/ProposalCard'
import { SourcesAccordion } from '@/components/site/SourcesAccordion'
import { Button } from '@/components/ui/button'
import { getCandidateBySlug, getSourcesForSection } from '@/lib/candidates'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function AllProposalsPage({ params }: Props) {
  const { slug } = await params
  const candidate = await getCandidateBySlug(slug)

  if (!candidate) {
    notFound()
  }

  const proposals = candidate.proposalItems ?? []
  const sources = getSourcesForSection(candidate, 'proposals')

  return (
    <div>
      <div className="mb-4">
        <Button asChild variant="link" className="px-0">
          <Link href={`/candidatos/${candidate.slug}#proposals`}>
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
        <span className="text-foreground">Plan de gobierno</span>
      </nav>

      <header className="mb-10 border-b border-border pb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Plan de gobierno y propuestas
        </p>
        <h1 className="text-3xl leading-tight">{candidate.name}</h1>
        <p className="mt-1 text-muted-foreground">{candidate.party}</p>
      </header>

      {proposals.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {proposals.map((item) => (
            <ProposalCard key={item.id ?? item.title} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No hay propuestas registradas para este candidato aún.
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

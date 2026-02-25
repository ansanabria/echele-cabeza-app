import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ControversyCard } from '@/components/site/ControversyCard'
import { CorrectionHistory } from '@/components/site/CorrectionHistory'
import { ProposalCard } from '@/components/site/ProposalCard'
import { SectionNav } from '@/components/site/SectionNav'
import { SourcesAccordion } from '@/components/site/SourcesAccordion'
import { Button } from '@/components/ui/button'
import {
  formatDate,
  getCandidateBySlug,
  getCandidateImageUrl,
  getCorrectionsForCandidate,
  getSourcesForSection,
  lexicalToPlainText,
  SECTION_CONFIG,
} from '@/lib/candidates'

type CandidatePageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function CandidatePage({ params }: CandidatePageProps) {
  const { slug } = await params
  const candidate = await getCandidateBySlug(slug)

  if (!candidate) {
    notFound()
  }

  const corrections = await getCorrectionsForCandidate(candidate.id)
  const imageUrl = getCandidateImageUrl(candidate)

  return (
    <section className="grid gap-8 md:grid-cols-[minmax(260px,30%)_1fr]">
      <aside className="sticky top-6 h-max overflow-hidden rounded-lg border border-border bg-card md:self-start">
        <div className="aspect-[3/4] bg-secondary">
          {imageUrl ? (
            <img alt={`Foto de ${candidate.name}`} src={imageUrl} className="block h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-secondary" aria-hidden />
          )}
        </div>

        <div className="p-5">
          <h1 className="mb-1 text-2xl leading-tight">{candidate.name}</h1>
          <p className="mb-1 text-muted-foreground">{candidate.party}</p>
          <p className="mb-1 text-muted-foreground">{candidate.currentOffice ?? 'Cargo no disponible'}</p>

          <Button asChild variant="outline" className="my-3 w-full">
            <Link href={`/comparar?a=${candidate.slug}`}>
              Comparar con otro candidato
            </Link>
          </Button>

          <p className="text-sm text-muted-foreground">
            Última actualización: {formatDate(candidate.lastUpdated)}
          </p>
          <a href="#historial-correcciones" className="text-sm text-primary">
            Ver historial de correcciones
          </a>
        </div>
      </aside>

      <div className="min-w-0">
        <SectionNav sections={SECTION_CONFIG} />

        {SECTION_CONFIG.map((section) => {
          const content = lexicalToPlainText(candidate[section.field])
          const sources = getSourcesForSection(candidate, section.id)

          if (section.id === 'proposals') {
            const allProposals = candidate.proposalItems ?? []
            const preview = allProposals.slice(0, 4)
            const hasMore = allProposals.length > 4

            return (
              <article key={section.id} id={section.id} className="mb-4 scroll-mt-20 rounded-lg border border-border bg-card p-5">
                <h2 className="mb-3 text-xl leading-snug">{section.heading}</h2>

                {content && (
                  <p className="mb-6 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {content}
                  </p>
                )}

                {preview.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {preview.map((item) => (
                      <ProposalCard key={item.id ?? item.title} item={item} />
                    ))}
                  </div>
                ) : (
                  !content && (
                    <p className="leading-relaxed text-muted-foreground">
                      Contenido pendiente de publicación.
                    </p>
                  )
                )}

                {hasMore && (
                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href={`/candidatos/${candidate.slug}/propuestas`}>
                      Ver todas las propuestas ({allProposals.length}) →
                    </Link>
                  </Button>
                )}

                <SourcesAccordion sources={sources} />
              </article>
            )
          }

          if (section.id === 'controversies') {
            const allControversies = candidate.controversyItems ?? []
            const preview = allControversies.slice(0, 2)
            const hasMore = allControversies.length > 2

            return (
              <article key={section.id} id={section.id} className="mb-4 scroll-mt-20 rounded-lg border border-border bg-card p-5">
                <h2 className="mb-3 text-xl leading-snug">{section.heading}</h2>

                {content && (
                  <p className="mb-6 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {content}
                  </p>
                )}

                {preview.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {preview.map((item) => (
                      <ControversyCard key={item.id ?? item.title} item={item} />
                    ))}
                  </div>
                ) : (
                  !content && (
                    <p className="leading-relaxed text-muted-foreground">
                      Contenido pendiente de publicación.
                    </p>
                  )
                )}

                {hasMore && (
                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href={`/candidatos/${candidate.slug}/controversias`}>
                      Ver todas las controversias ({allControversies.length}) →
                    </Link>
                  </Button>
                )}
              </article>
            )
          }

          return (
            <article key={section.id} id={section.id} className="mb-4 scroll-mt-20 rounded-lg border border-border bg-card p-5">
              <h2 className="mb-3 text-xl leading-snug">{section.heading}</h2>

              {content ? (
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {content}
                </p>
              ) : (
                <p className="leading-relaxed text-muted-foreground">
                  Contenido pendiente de publicación.
                </p>
              )}

              <SourcesAccordion sources={sources} />
            </article>
          )
        })}

        <CorrectionHistory
          corrections={corrections.map((correction) => ({
            id: String(correction.id),
            note: correction.note,
            correctedAt: correction.correctedAt,
          }))}
        />
      </div>
    </section>
  )
}

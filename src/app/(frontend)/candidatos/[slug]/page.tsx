import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CorrectionHistory } from '@/components/site/CorrectionHistory'
import { SectionNav } from '@/components/site/SectionNav'
import { SourcesAccordion } from '@/components/site/SourcesAccordion'
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

          <Link
            className="my-3 inline-block rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground no-underline transition-colors hover:bg-secondary"
            href={`/comparar?a=${candidate.slug}`}
          >
            Comparar con otro candidato
          </Link>

          <p className="text-sm text-muted-foreground">
            Ultima actualizacion: {formatDate(candidate.lastUpdated)}
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

          return (
            <article key={section.id} id={section.id} className="mb-4 rounded-lg border border-border bg-card p-5">
              <h2 className="mb-3 text-xl leading-snug">{section.heading}</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {content || 'Contenido pendiente de publicacion.'}
              </p>
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

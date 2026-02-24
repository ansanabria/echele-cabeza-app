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
    <section className="candidate-page">
      <aside className="candidate-sidebar">
        <div className="candidate-sidebar__media">
          {imageUrl ? (
            <img alt={`Foto de ${candidate.name}`} src={imageUrl} />
          ) : (
            <div className="candidate-sidebar__placeholder" aria-hidden />
          )}
        </div>

        <div className="candidate-sidebar__content">
          <h1>{candidate.name}</h1>
          <p>{candidate.party}</p>
          <p>{candidate.currentOffice ?? 'Cargo no disponible'}</p>

          <Link className="button-link" href={`/comparar?a=${candidate.slug}`}>
            Comparar con otro candidato
          </Link>

          <p className="candidate-sidebar__meta">
            Ultima actualizacion: {formatDate(candidate.lastUpdated)}
          </p>
          <a href="#historial-correcciones">Ver historial de correcciones</a>
        </div>
      </aside>

      <div className="candidate-content">
        <SectionNav sections={SECTION_CONFIG} />

        {SECTION_CONFIG.map((section) => {
          const content = lexicalToPlainText(candidate[section.field])
          const sources = getSourcesForSection(candidate, section.id)

          return (
            <article key={section.id} id={section.id} className="section-block">
              <h2>{section.heading}</h2>
              <p>{content || 'Contenido pendiente de publicacion.'}</p>
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

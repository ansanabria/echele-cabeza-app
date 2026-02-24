import Link from 'next/link'

import { CandidatePicker } from '@/components/site/CandidatePicker'
import type { Candidate } from '@/payload-types'
import {
  type CandidateSummaryField,
  getCandidateImageUrl,
  getCandidatesBySlugs,
  getCandidatesForDirectory,
} from '@/lib/candidates'

type ComparePageProps = {
  searchParams?: Promise<{
    a?: string
    b?: string
  }>
}

type TopicRow = {
  label: string
  field: CandidateSummaryField
}

const TOPIC_ROWS: TopicRow[] = [
  { label: 'Trayectoria', field: 'summaryTrajectory' },
  { label: 'Propuestas clave', field: 'summaryProposals' },
  { label: 'Controversias', field: 'summaryControversies' },
  { label: 'Alianzas', field: 'summaryAlliances' },
  { label: 'Registro', field: 'summaryRecord' },
  { label: 'Patrimonio', field: 'summaryFunding' },
]

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = (await searchParams) ?? {}
  const selectedA = params.a
  const selectedB = params.b

  const candidates = await getCandidatesForDirectory()
  const selectedSlugs = [selectedA, selectedB].filter(Boolean) as string[]
  const selectedCandidates = await getCandidatesBySlugs(selectedSlugs)

  const candidateA = selectedCandidates.find(
    (candidate) => candidate.slug === selectedA,
  )
  const candidateB = selectedCandidates.find(
    (candidate) => candidate.slug === selectedB,
  )

  return (
    <section className="compare-page">
      <h1>Comparar candidatos</h1>
      <p>
        Selecciona dos perfiles para revisar su informacion en paralelo, con el mismo
        formato y sin puntuaciones.
      </p>

      <CandidatePicker
        candidates={candidates.map((candidate) => ({
          slug: candidate.slug,
          name: candidate.name,
          party: candidate.party,
          imageUrl: getCandidateImageUrl(candidate),
        }))}
        selectedA={selectedA}
        selectedB={selectedB}
      />

      {candidateA && candidateB ? (
        <div className="comparison-table" role="table" aria-label="Tabla de comparacion">
          <div className="comparison-header" role="row">
            <div role="columnheader">Tema</div>
            <div role="columnheader" className="comparison-header__candidate">
              <CandidateHeader candidate={candidateA} />
            </div>
            <div role="columnheader" className="comparison-header__candidate">
              <CandidateHeader candidate={candidateB} />
            </div>
          </div>

          {TOPIC_ROWS.map((topic) => (
            <div key={topic.field} className="comparison-row" role="row">
              <div className="comparison-topic" role="cell">
                {topic.label}
              </div>
              <ComparisonCell candidate={candidateA} field={topic.field} />
              <ComparisonCell candidate={candidateB} field={topic.field} />
            </div>
          ))}
        </div>
      ) : (
        <div className="comparison-empty">
          <p>Selecciona ambos candidatos para ver la comparacion por temas.</p>
        </div>
      )}
    </section>
  )
}

function CandidateHeader({ candidate }: { candidate: Candidate }) {
  const name = candidate.name
  const party = candidate.party
  const image = getCandidateImageUrl(candidate)

  return (
    <div className="candidate-header-card">
      {image ? <img alt={`Foto de ${name}`} src={image} /> : <div aria-hidden />}
      <h2>{name}</h2>
      <p>{party}</p>
    </div>
  )
}

function ComparisonCell({
  candidate,
  field,
}: {
  candidate: Candidate
  field: CandidateSummaryField
}) {
  const summary = candidate[field] ?? 'Sin resumen disponible.'
  const slug = candidate.slug

  return (
    <div className="comparison-cell" role="cell">
      <p>{summary}</p>
      <Link href={`/candidatos/${slug}`}>Ver perfil completo →</Link>
    </div>
  )
}

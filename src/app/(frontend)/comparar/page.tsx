import Link from 'next/link'

import { CompareInteractiveShell } from '@/components/site/CompareInteractiveShell'
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
    <section>
      <h1 className="mb-1 text-3xl">Comparar candidatos</h1>
      <p className="mb-6 text-muted-foreground">
        Selecciona dos perfiles para revisar su informacion en paralelo, con el mismo
        formato y sin puntuaciones.
      </p>

      <CompareInteractiveShell
        candidates={candidates.map((candidate) => ({
          slug: candidate.slug,
          name: candidate.name,
          party: candidate.party,
          imageUrl: getCandidateImageUrl(candidate),
        }))}
        selectedA={selectedA}
        selectedB={selectedB}
        showTable={Boolean(candidateA && candidateB)}
      >
        {candidateA && candidateB ? (
          <div className="overflow-hidden rounded-lg border border-border" role="table" aria-label="Tabla de comparacion">
            {/* Header */}
            <div className="hidden grid-cols-[180px_1fr_1fr] bg-secondary md:grid" role="row">
              <div className="border-b border-r border-border p-4" role="columnheader">
                Tema
              </div>
              <div className="border-b border-r border-border p-4" role="columnheader">
                <CandidateHeader candidate={candidateA} />
              </div>
              <div className="border-b border-border p-4" role="columnheader">
                <CandidateHeader candidate={candidateB} />
              </div>
            </div>

            {/* Rows — desktop */}
            <div className="hidden md:block">
              {TOPIC_ROWS.map((topic) => (
                <div key={topic.field} className="grid grid-cols-[180px_1fr_1fr]" role="row">
                  <div className="border-b border-r border-border p-4 text-sm font-bold" role="cell">
                    {topic.label}
                  </div>
                  <ComparisonCell candidate={candidateA} field={topic.field} borderRight />
                  <ComparisonCell candidate={candidateB} field={topic.field} />
                </div>
              ))}
            </div>

            {/* Rows — mobile (stacked cards) */}
            <div className="grid gap-3 p-3 md:hidden">
              {TOPIC_ROWS.map((topic) => (
                <div key={topic.field} className="overflow-hidden rounded-lg border border-border">
                  <div className="border-b border-border bg-secondary p-3 text-sm font-bold">
                    {topic.label}
                  </div>
                  <div className="border-b border-border p-3">
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {candidateA.name}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {candidateA[topic.field] ?? 'Sin resumen disponible.'}
                    </p>
                    <Link href={`/candidatos/${candidateA.slug}`} className="mt-2 inline-block text-sm font-medium text-primary">
                      Ver perfil completo →
                    </Link>
                  </div>
                  <div className="p-3">
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {candidateB.name}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {candidateB[topic.field] ?? 'Sin resumen disponible.'}
                    </p>
                    <Link href={`/candidatos/${candidateB.slug}`} className="mt-2 inline-block text-sm font-medium text-primary">
                      Ver perfil completo →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-5 text-muted-foreground">
            <p>Selecciona ambos candidatos para ver la comparacion por temas.</p>
          </div>
        )}
      </CompareInteractiveShell>
    </section>
  )
}

function CandidateHeader({ candidate }: { candidate: Candidate }) {
  const name = candidate.name
  const party = candidate.party
  const image = getCandidateImageUrl(candidate)

  return (
    <div>
      {image ? (
        <img
          alt={`Foto de ${name}`}
          src={image}
          className="mb-2 aspect-[3/4] w-full max-w-[110px] rounded-lg object-cover"
        />
      ) : (
        <div className="mb-2 aspect-[3/4] w-full max-w-[110px] rounded-lg bg-secondary" aria-hidden />
      )}
      <h2 className="font-sans text-sm font-bold">{name}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{party}</p>
    </div>
  )
}

function ComparisonCell({
  candidate,
  field,
  borderRight,
}: {
  candidate: Candidate
  field: CandidateSummaryField
  borderRight?: boolean
}) {
  const summary = candidate[field] ?? 'Sin resumen disponible.'
  const slug = candidate.slug

  return (
    <div className={`border-b border-border p-4 ${borderRight ? 'border-r' : ''}`} role="cell">
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      <Link href={`/candidatos/${slug}`} className="mt-2 inline-block text-sm font-medium text-primary">
        Ver perfil completo →
      </Link>
    </div>
  )
}

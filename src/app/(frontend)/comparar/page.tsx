import Image from 'next/image'
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
    c?: string
  }>
}

type TopicRow = {
  label: string
  field: CandidateSummaryField
  /** Matches the `id` prop on the corresponding <article> in the candidate page */
  sectionId: string
}

const TOPIC_ROWS: TopicRow[] = [
  { label: 'Trayectoria', field: 'summaryTrajectory', sectionId: 'biography' },
  { label: 'Propuestas clave', field: 'summaryProposals', sectionId: 'proposals' },
  { label: 'Controversias', field: 'summaryControversies', sectionId: 'controversies' },
  { label: 'Alianzas', field: 'summaryAlliances', sectionId: 'alliances' },
  { label: 'Registro', field: 'summaryRecord', sectionId: 'record' },
  { label: 'Patrimonio', field: 'summaryFunding', sectionId: 'funding' },
]

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = (await searchParams) ?? {}
  const selectedA = params.a
  const selectedB = params.b
  const selectedC = params.c

  const candidates = await getCandidatesForDirectory()
  const selectedSlugs = [selectedA, selectedB, selectedC].filter(Boolean) as string[]
  const selectedCandidates = await getCandidatesBySlugs(selectedSlugs)

  const candidateA = selectedCandidates.find((c) => c.slug === selectedA)
  const candidateB = selectedCandidates.find((c) => c.slug === selectedB)
  const candidateC = selectedCandidates.find((c) => c.slug === selectedC)

  const activeCandidates = [candidateA, candidateB, candidateC].filter(Boolean) as Candidate[]
  const hasTable = Boolean(candidateA && candidateB)

  // Tailwind grid templates are statically analyzed; we pre-define both variants.
  const desktopGrid =
    activeCandidates.length === 3 ? 'grid-cols-[180px_1fr_1fr_1fr]' : 'grid-cols-[180px_1fr_1fr]'

  return (
    <section>
      <h1 className="mb-1 text-3xl">Comparar candidatos</h1>
      <p className="mb-6 text-muted-foreground">
        Selecciona dos a tres perfiles para revisar su información en paralelo, con el mismo formato
        y sin puntuaciones.
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
        selectedC={selectedC}
        showTable={hasTable}
      >
        {hasTable ? (
          <div
            className="overflow-hidden rounded-lg border border-border"
            role="table"
            aria-label="Tabla de comparación"
          >
            {/* Header — desktop */}
            <div className={`hidden bg-secondary md:grid ${desktopGrid}`} role="row">
              <div className="border-b border-r border-border p-4" role="columnheader">
                Tema
              </div>
              {activeCandidates.map((candidate, i) => (
                <div
                  key={candidate.slug}
                  className={`border-b border-border p-4 ${i < activeCandidates.length - 1 ? 'border-r' : ''}`}
                  role="columnheader"
                >
                  <CandidateHeader candidate={candidate} />
                </div>
              ))}
            </div>

            {/* Rows — desktop */}
            <div className="hidden md:block">
              {TOPIC_ROWS.map((topic) => (
                <div key={topic.field} className={`grid ${desktopGrid}`} role="row">
                  <div
                    className="border-b border-r border-border p-4 text-sm font-bold"
                    role="cell"
                  >
                    {topic.label}
                  </div>
                  {activeCandidates.map((candidate, i) => (
                    <ComparisonCell
                      key={candidate.slug}
                      candidate={candidate}
                      field={topic.field}
                      sectionId={topic.sectionId}
                      borderRight={i < activeCandidates.length - 1}
                    />
                  ))}
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
                  {activeCandidates.map((candidate, i) => (
                    <div
                      key={candidate.slug}
                      className={`p-3 ${i < activeCandidates.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {candidate.name}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {candidate[topic.field] ?? 'Sin resumen disponible.'}
                      </p>
                      <Link
                        href={`/candidatos/${candidate.slug}#${topic.sectionId}`}
                        className="mt-2 inline-block text-sm font-medium text-primary"
                      >
                        Ver sección →
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-5 text-muted-foreground">
            <p>Selecciona ambos candidatos para ver la comparación por temas.</p>
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
        <div className="relative mb-2 aspect-[3/4] w-full max-w-[110px] overflow-hidden rounded-lg">
          <Image alt={`Foto de ${name}`} src={image} fill sizes="110px" className="object-cover" />
        </div>
      ) : (
        <div
          className="mb-2 aspect-[3/4] w-full max-w-[110px] rounded-lg bg-secondary"
          aria-hidden
        />
      )}
      <h2 className="font-sans text-sm font-bold">{name}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{party}</p>
      <Link
        href={`/candidatos/${candidate.slug}`}
        className="mt-2 inline-block text-sm font-medium text-primary"
      >
        Ver perfil completo →
      </Link>
    </div>
  )
}

function ComparisonCell({
  candidate,
  field,
  sectionId,
  borderRight,
}: {
  candidate: Candidate
  field: CandidateSummaryField
  sectionId: string
  borderRight?: boolean
}) {
  const summary = candidate[field] ?? 'Sin resumen disponible.'
  const slug = candidate.slug

  return (
    <div className={`border-b border-border p-4 ${borderRight ? 'border-r' : ''}`} role="cell">
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      <Link
        href={`/candidatos/${slug}#${sectionId}`}
        className="mt-2 inline-block text-sm font-medium text-primary"
      >
        Ver sección →
      </Link>
    </div>
  )
}

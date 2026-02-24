'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

type CandidateOption = {
  slug: string
  name: string
  party: string
  imageUrl: string | null
}

type CandidatePickerProps = {
  candidates: CandidateOption[]
  selectedA?: string
  selectedB?: string
}

export function CandidatePicker({ candidates, selectedA, selectedB }: CandidatePickerProps) {
  const router = useRouter()

  const sortedCandidates = useMemo(
    () => [...candidates].sort((a, b) => a.name.localeCompare(b.name, 'es-CO')),
    [candidates],
  )

  function handleSelect(nextA: string, nextB: string) {
    const params = new URLSearchParams()
    if (nextA) params.set('a', nextA)
    if (nextB) params.set('b', nextB)

    const query = params.toString()
    router.push(query ? `/comparar?${query}` : '/comparar')
  }

  return (
    <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <CandidateSelect
        candidates={sortedCandidates}
        label="Candidato A"
        selectedSlug={selectedA}
        onSelect={(slug) => handleSelect(slug, selectedB ?? '')}
      />

      <CandidateSelect
        candidates={sortedCandidates}
        label="Candidato B"
        selectedSlug={selectedB}
        onSelect={(slug) => handleSelect(selectedA ?? '', slug)}
      />
    </section>
  )
}

type CandidateSelectProps = {
  label: string
  candidates: CandidateOption[]
  selectedSlug?: string
  onSelect: (slug: string) => void
}

function CandidateSelect({
  label,
  candidates,
  selectedSlug,
  onSelect,
}: CandidateSelectProps) {
  const selected = candidates.find((candidate) => candidate.slug === selectedSlug) ?? null

  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <details className="relative">
        <summary className="flex w-full min-h-[2.9rem] cursor-pointer list-none items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-foreground transition-colors hover:border-ring [&::-webkit-details-marker]:hidden">
          {selected ? (
            <>
              {selected.imageUrl ? (
                <img
                  alt={`Foto de ${selected.name}`}
                  src={selected.imageUrl}
                  className="size-[30px] shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="size-[30px] shrink-0 rounded-full bg-secondary" aria-hidden />
              )}
              <span className="text-sm">
                {selected.name} · {selected.party}
              </span>
            </>
          ) : (
            <span className="text-sm">Selecciona un candidato</span>
          )}
        </summary>
        <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-10 m-0 max-h-60 list-none overflow-auto rounded-md border border-border bg-card p-1 shadow-md">
          {candidates.map((candidate) => (
            <li key={`${label}-${candidate.slug}`}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2 py-1.5 text-left text-foreground transition-colors hover:bg-secondary"
                onClick={(event) => {
                  onSelect(candidate.slug)
                  const details = event.currentTarget.closest('details')
                  details?.removeAttribute('open')
                }}
              >
                {candidate.imageUrl ? (
                  <img
                    alt={`Foto de ${candidate.name}`}
                    src={candidate.imageUrl}
                    className="size-[30px] shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-[30px] shrink-0 rounded-full bg-secondary" aria-hidden />
                )}
                <span className="text-sm">
                  {candidate.name} · {candidate.party}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

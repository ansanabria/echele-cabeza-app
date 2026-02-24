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
    <section className="candidate-picker">
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
    <div className="candidate-select">
      <p>{label}</p>
      <details>
        <summary>
          {selected ? (
            <>
              {selected.imageUrl ? (
                <img alt={`Foto de ${selected.name}`} src={selected.imageUrl} />
              ) : (
                <div aria-hidden />
              )}
              <span>
                {selected.name} · {selected.party}
              </span>
            </>
          ) : (
            <span>Selecciona un candidato</span>
          )}
        </summary>
        <ul>
          {candidates.map((candidate) => (
            <li key={`${label}-${candidate.slug}`}>
              <button
                type="button"
                onClick={(event) => {
                  onSelect(candidate.slug)
                  const details = event.currentTarget.closest('details')
                  details?.removeAttribute('open')
                }}
              >
                {candidate.imageUrl ? (
                  <img alt={`Foto de ${candidate.name}`} src={candidate.imageUrl} />
                ) : (
                  <div aria-hidden />
                )}
                <span>
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

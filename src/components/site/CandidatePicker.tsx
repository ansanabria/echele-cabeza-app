'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  onPendingChange?: (isPending: boolean) => void
  onSelectionChange?: (nextA: string, nextB: string) => void
}

export function CandidatePicker({
  candidates,
  selectedA,
  selectedB,
  onPendingChange,
  onSelectionChange,
}: CandidatePickerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [localSelectedA, setLocalSelectedA] = useState(selectedA ?? '')
  const [localSelectedB, setLocalSelectedB] = useState(selectedB ?? '')

  const sortedCandidates = useMemo(
    () => [...candidates].sort((a, b) => a.name.localeCompare(b.name, 'es-CO')),
    [candidates],
  )

  useEffect(() => {
    onPendingChange?.(isPending)
  }, [isPending, onPendingChange])

  useEffect(() => {
    setLocalSelectedA(selectedA ?? '')
  }, [selectedA])

  useEffect(() => {
    setLocalSelectedB(selectedB ?? '')
  }, [selectedB])

  function handleSelect(nextA: string, nextB: string) {
    setLocalSelectedA(nextA)
    setLocalSelectedB(nextB)
    onSelectionChange?.(nextA, nextB)

    const params = new URLSearchParams()
    if (nextA) params.set('a', nextA)
    if (nextB) params.set('b', nextB)

    const query = params.toString()
    startTransition(() => {
      router.push(query ? `/comparar?${query}` : '/comparar')
    })
  }

  return (
    <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <CandidateSelect
        candidates={sortedCandidates}
        label="Candidato A"
        selectedSlug={localSelectedA || undefined}
        onSelect={(slug) => handleSelect(slug, localSelectedB)}
      />

      <CandidateSelect
        candidates={sortedCandidates}
        label="Candidato B"
        selectedSlug={localSelectedB || undefined}
        onSelect={(slug) => handleSelect(localSelectedA, slug)}
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex min-h-[2.9rem] w-full items-center rounded-md border border-border bg-card px-2.5 py-1.5 text-left text-foreground transition-colors hover:border-ring"
          >
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.imageUrl ? (
                <img
                  alt={`Foto de ${selected.name}`}
                  src={selected.imageUrl}
                  className="size-[30px] shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="size-[30px] shrink-0 rounded-full bg-secondary" aria-hidden />
              )}
              <span className="text-sm">
                {selected.name} · {selected.party}
              </span>
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Selecciona un candidato
            </span>
          )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-[18rem]">
          <DropdownMenuLabel className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedSlug ?? ''} onValueChange={onSelect}>
          {candidates.map((candidate) => (
            <DropdownMenuRadioItem key={`${label}-${candidate.slug}`} value={candidate.slug}>
              <span className="flex items-center gap-2">
                {candidate.imageUrl ? (
                  <img
                    alt={`Foto de ${candidate.name}`}
                    src={candidate.imageUrl}
                    className="size-[30px] shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="size-[30px] shrink-0 rounded-full bg-secondary" aria-hidden />
                )}
                <span className="text-sm">
                  {candidate.name} · {candidate.party}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

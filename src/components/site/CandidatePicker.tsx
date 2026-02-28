'use client'

import Image from 'next/image'
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
  selectedC?: string
  onPendingChange?: (isPending: boolean) => void
  onSelectionChange?: (nextA: string, nextB: string, nextC: string) => void
}

export function CandidatePicker({
  candidates,
  selectedA,
  selectedB,
  selectedC,
  onPendingChange,
  onSelectionChange,
}: CandidatePickerProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [localSelectedA, setLocalSelectedA] = useState(selectedA ?? '')
  const [localSelectedB, setLocalSelectedB] = useState(selectedB ?? '')
  const [localSelectedC, setLocalSelectedC] = useState(selectedC ?? '')
  const [showThird, setShowThird] = useState(Boolean(selectedC))

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

  useEffect(() => {
    setLocalSelectedC(selectedC ?? '')
    if (selectedC) setShowThird(true)
  }, [selectedC])

  function navigate(nextA: string, nextB: string, nextC: string) {
    const params = new URLSearchParams()
    if (nextA) params.set('a', nextA)
    if (nextB) params.set('b', nextB)
    if (nextC) params.set('c', nextC)

    const query = params.toString()
    startTransition(() => {
      router.push(query ? `/comparar?${query}` : '/comparar')
    })
  }

  function handleSelect(nextA: string, nextB: string, nextC: string) {
    setLocalSelectedA(nextA)
    setLocalSelectedB(nextB)
    setLocalSelectedC(nextC)
    onSelectionChange?.(nextA, nextB, nextC)
    navigate(nextA, nextB, nextC)
  }

  function handleAddThird() {
    setShowThird(true)
  }

  function handleRemoveThird() {
    setShowThird(false)
    const clearedC = ''
    setLocalSelectedC(clearedC)
    onSelectionChange?.(localSelectedA, localSelectedB, clearedC)
    navigate(localSelectedA, localSelectedB, clearedC)
  }

  return (
    <section className="mb-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <CandidateSelect
            candidates={sortedCandidates.filter(
              (c) => c.slug !== localSelectedB && c.slug !== localSelectedC,
            )}
            label="Candidato A"
            selectedSlug={localSelectedA || undefined}
            onSelect={(slug) => handleSelect(slug, localSelectedB, localSelectedC)}
          />
        </div>

        <div className="flex flex-1 items-end gap-2">
          <div className="flex-1">
            <CandidateSelect
              candidates={sortedCandidates.filter(
                (c) => c.slug !== localSelectedA && c.slug !== localSelectedC,
              )}
              label="Candidato B"
              selectedSlug={localSelectedB || undefined}
              onSelect={(slug) => handleSelect(localSelectedA, slug, localSelectedC)}
            />
          </div>

          {!showThird && (
            <button
              type="button"
              aria-label="Agregar tercer candidato"
              onClick={handleAddThird}
              className="flex size-[2.9rem] shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>

        {showThird && (
          <div className="flex flex-1 items-end gap-2">
            <div className="flex-1">
              <CandidateSelect
                candidates={sortedCandidates.filter(
                  (c) => c.slug !== localSelectedA && c.slug !== localSelectedB,
                )}
                label="Candidato C"
                selectedSlug={localSelectedC || undefined}
                onSelect={(slug) => handleSelect(localSelectedA, localSelectedB, slug)}
              />
            </div>

            <button
              type="button"
              aria-label="Quitar tercer candidato"
              onClick={handleRemoveThird}
              className="flex size-[2.9rem] shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

type CandidateSelectProps = {
  label: string
  candidates: CandidateOption[]
  selectedSlug?: string
  onSelect: (slug: string) => void
}

function CandidateSelect({ label, candidates, selectedSlug, onSelect }: CandidateSelectProps) {
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
            className="flex h-[2.9rem] w-full items-center overflow-hidden rounded-md border border-border bg-card px-2.5 text-left text-foreground transition-colors hover:border-ring"
          >
            {selected ? (
              <span className="flex min-w-0 items-center gap-2">
                {selected.imageUrl ? (
                  <Image
                    alt={`Foto de ${selected.name}`}
                    src={selected.imageUrl}
                    width={30}
                    height={30}
                    className="size-[30px] shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="size-[30px] shrink-0 rounded-full bg-secondary" aria-hidden />
                )}
                <span className="truncate text-sm">
                  {selected.name} · {selected.party}
                </span>
              </span>
            ) : (
              <span className="truncate text-sm text-muted-foreground">
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
                    <Image
                      alt={`Foto de ${candidate.name}`}
                      src={candidate.imageUrl}
                      width={30}
                      height={30}
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

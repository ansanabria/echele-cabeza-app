'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { CandidatePicker } from '@/components/site/CandidatePicker'

type CandidateOption = {
  slug: string
  name: string
  party: string
  imageUrl: string | null
}

type CompareInteractiveShellProps = {
  candidates: CandidateOption[]
  selectedA?: string
  selectedB?: string
  selectedC?: string
  showTable: boolean
  children: ReactNode
}

export function CompareInteractiveShell({
  candidates,
  selectedA,
  selectedB,
  selectedC,
  showTable,
  children,
}: CompareInteractiveShellProps) {
  const [isPending, setIsPending] = useState(false)
  const [optimisticSelectedA, setOptimisticSelectedA] = useState(selectedA ?? '')
  const [optimisticSelectedB, setOptimisticSelectedB] = useState(selectedB ?? '')
  const [optimisticSelectedC, setOptimisticSelectedC] = useState(selectedC ?? '')

  useEffect(() => {
    setOptimisticSelectedA(selectedA ?? '')
  }, [selectedA])

  useEffect(() => {
    setOptimisticSelectedB(selectedB ?? '')
  }, [selectedB])

  useEffect(() => {
    setOptimisticSelectedC(selectedC ?? '')
  }, [selectedC])

  const handlePendingChange = useCallback((nextPending: boolean) => {
    setIsPending(nextPending)
  }, [])

  const handleSelectionChange = useCallback((nextA: string, nextB: string, nextC: string) => {
    setOptimisticSelectedA(nextA)
    setOptimisticSelectedB(nextB)
    setOptimisticSelectedC(nextC)
  }, [])

  const shouldShowLoading =
    isPending && (showTable || Boolean(optimisticSelectedA && optimisticSelectedB))

  return (
    <>
      <CandidatePicker
        candidates={candidates}
        selectedA={selectedA}
        selectedB={selectedB}
        selectedC={selectedC}
        onPendingChange={handlePendingChange}
        onSelectionChange={handleSelectionChange}
      />

      <div className="relative">
        {children}

        {shouldShowLoading ? (
          <div
            aria-live="polite"
            aria-label="Actualizando comparación"
            className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-[1px]"
          >
            <div className="rounded-md border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              Actualizando comparación...
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

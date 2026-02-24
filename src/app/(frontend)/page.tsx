import React from 'react'

import { CandidateCard } from '@/components/site/CandidateCard'
import { IntroPanel } from '@/components/site/IntroPanel'
import { getCandidateImageUrl, getCandidatesForDirectory } from '@/lib/candidates'

export default async function HomePage() {
  const candidates = await getCandidatesForDirectory()

  return (
    <section className="flex flex-col gap-8 lg:gap-12">
      <IntroPanel />

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Directorio de candidatos"
      >
        {candidates.map((candidate) => {
          const slug = candidate.slug
          const name = candidate.name
          const party = candidate.party
          const imageUrl = getCandidateImageUrl(candidate)

          return (
            <CandidateCard
              key={String(candidate.id)}
              href={`/candidatos/${slug}`}
              imageUrl={imageUrl}
              name={name}
              party={party}
            />
          )
        })}
      </div>
    </section>
  )
}

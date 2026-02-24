import React from 'react'

import { CandidateCard } from '@/components/site/CandidateCard'
import { IntroPanel } from '@/components/site/IntroPanel'
import { getCandidateImageUrl, getCandidatesForDirectory } from '@/lib/candidates'

export default async function HomePage() {
  const candidates = await getCandidatesForDirectory()

  return (
    <section className="directory-page">
      <IntroPanel />

      <div className="candidate-grid" aria-label="Directorio de candidatos">
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

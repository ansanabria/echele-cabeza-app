import Link from 'next/link'

type CandidateCardProps = {
  href: string
  imageUrl: string | null
  name: string
  party: string
}

export function CandidateCard({ href, imageUrl, name, party }: CandidateCardProps) {
  return (
    <Link className="candidate-card" href={href}>
      {imageUrl ? (
        <img alt={`Foto de ${name}`} src={imageUrl} />
      ) : (
        <div className="candidate-card__placeholder" aria-hidden />
      )}

      <div className="candidate-card__overlay">
        <h3>{name}</h3>
        <p>{party}</p>
      </div>
    </Link>
  )
}

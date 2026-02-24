import Link from 'next/link'

type CandidateCardProps = {
  href: string
  imageUrl: string | null
  name: string
  party: string
}

export function CandidateCard({ href, imageUrl, name, party }: CandidateCardProps) {
  return (
    <Link
      className="group relative block aspect-[3/4] min-h-[280px] overflow-hidden rounded-lg border border-border bg-secondary no-underline transition-shadow hover:shadow-md"
      href={href}
    >
      {imageUrl ? (
        <img alt={`Foto de ${name}`} src={imageUrl} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-secondary" aria-hidden />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 to-foreground/10" />

      <div className="absolute inset-0 grid content-end p-5 opacity-0 translate-y-1.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
        <h3 className="m-0 font-sans text-lg font-bold text-white">{name}</h3>
        <p className="mt-1 text-sm text-white/70">{party}</p>
      </div>
    </Link>
  )
}

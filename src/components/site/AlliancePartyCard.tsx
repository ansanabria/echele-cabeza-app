import { getMediaUrl } from '@/lib/candidates'
import type { Media } from '@/payload-types'

type AlliancePartyItem = {
  id?: string | null
  logo: number | Media
  name: string
}

type AlliancePartyCardProps = {
  item: AlliancePartyItem
}

export function AlliancePartyCard({ item }: AlliancePartyCardProps) {
  const logoUrl = getMediaUrl(item.logo)

  return (
    <article className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        {logoUrl ? (
          <img
            alt={`Logo de ${item.name}`}
            src={logoUrl}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <div className="h-full w-full bg-muted" aria-hidden />
        )}
      </div>
      <h3 className="text-center text-sm font-medium text-card-foreground leading-snug">
        {item.name}
      </h3>
    </article>
  )
}

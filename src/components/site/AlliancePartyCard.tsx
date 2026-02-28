import Image from 'next/image'

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
    <article className="group relative flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-6 py-7 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      {/* Accent line that reveals on hover */}
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-lg bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      />

      {/* Logo frame */}
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-secondary/60 p-2 transition-colors duration-200 group-hover:bg-secondary">
        {logoUrl ? (
          <Image
            alt={`Logo de ${item.name}`}
            src={logoUrl}
            fill
            sizes="80px"
            className="object-contain"
          />
        ) : (
          <div className="h-full w-full rounded bg-muted" aria-hidden />
        )}
      </div>

      {/* Name */}
      <h3 className="text-center text-sm font-semibold leading-snug text-card-foreground">
        {item.name}
      </h3>
    </article>
  )
}

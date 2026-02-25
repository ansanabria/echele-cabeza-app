import { getMediaUrl } from '@/lib/candidates'
import type { Media } from '@/payload-types'

type EndorserItem = {
  id?: string | null
  photo: number | Media
  name: string
}

type EndorserCardProps = {
  item: EndorserItem
}

export function EndorserCard({ item }: EndorserCardProps) {
  const photoUrl = getMediaUrl(item.photo)

  return (
    <article className="group relative flex flex-col items-center gap-4 rounded-lg border border-border bg-card px-5 py-6 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      {/* Accent line that reveals on hover */}
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] rounded-b-lg bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden
      />

      {/* Photo */}
      <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-lg border border-border/50 bg-secondary transition-colors duration-200 group-hover:bg-secondary/80">
        {photoUrl ? (
          <img alt={`Foto de ${item.name}`} src={photoUrl} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-muted" aria-hidden />
        )}
      </div>

      {/* Name */}
      <h3 className="text-center text-sm font-semibold leading-snug text-card-foreground">
        {item.name}
      </h3>
    </article>
  )
}

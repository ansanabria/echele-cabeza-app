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
    <article className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-5">
      <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
        {photoUrl ? (
          <img
            alt={`Foto de ${item.name}`}
            src={photoUrl}
            className="h-full w-full object-cover"
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

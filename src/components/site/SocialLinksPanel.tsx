import { siX, siInstagram, siFacebook, siYoutube } from 'simple-icons'

type SocialLink = {
  platform: 'x' | 'instagram' | 'facebook' | 'youtube'
  label: string
  url: string
}

const PLATFORM_META: Record<
  SocialLink['platform'],
  { icon: { path: string }; brandColor: string }
> = {
  x: { icon: siX, brandColor: '#000000' },
  instagram: { icon: siInstagram, brandColor: '#E1306C' },
  facebook: { icon: siFacebook, brandColor: '#1877F2' },
  youtube: { icon: siYoutube, brandColor: '#FF0000' },
}

function PlatformIcon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d={path} />
    </svg>
  )
}

export function SocialLinksPanel({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {links.map(({ platform, label, url }) => {
        const meta = PLATFORM_META[platform]
        return (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--brand': meta.brandColor } as React.CSSProperties}
            className="group flex items-center gap-3 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-150 hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            <PlatformIcon path={meta.icon.path} />
            <span className="flex-1">{label}</span>
            <span className="text-muted-foreground transition-colors duration-150 group-hover:text-[var(--brand)]">
              →
            </span>
          </a>
        )
      })}
    </div>
  )
}

export type { SocialLink }


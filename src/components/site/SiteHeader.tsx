import Image from 'next/image'
import Link from 'next/link'
import logoHorizontal from '@/assets/logo-horizontal.svg'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/acerca', label: 'Acerca de' },
]

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border pb-4 mb-8">
      <Link className="inline-flex items-center no-underline" href="/">
        <Image src={logoHorizontal} alt="Elecciones Colombia" height={50} priority />
      </Link>

      <nav aria-label="Navegación principal" className="flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm text-foreground no-underline transition-colors hover:bg-secondary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

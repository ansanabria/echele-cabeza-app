import Link from 'next/link'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/acerca', label: 'Acerca de' },
]

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border pb-4 mb-8">
      <Link
        className="inline-flex items-center gap-2 text-foreground no-underline font-bold text-sm tracking-wide"
        href="/"
      >
        <span aria-hidden>🇨🇴</span>
        <span>Elecciones Colombia</span>
      </Link>

      <details className="relative">
        <summary
          aria-label="Abrir navegacion principal"
          className="flex size-[42px] cursor-pointer list-none items-center justify-center gap-1 rounded-full border border-border bg-card transition-colors hover:bg-secondary [&::-webkit-details-marker]:hidden"
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="block h-0.5 w-4 bg-foreground" />
            <span className="block h-0.5 w-4 bg-foreground" />
          </span>
        </summary>
        <nav
          aria-label="Navegacion principal"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-10 grid min-w-[160px] rounded-lg border border-border bg-card p-1 shadow-md"
        >
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
      </details>
    </header>
  )
}

import Link from 'next/link'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/comparar', label: 'Comparar' },
  { href: '/acerca', label: 'Acerca de' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-brand" href="/">
        <span aria-hidden>🇨🇴</span>
        <span>Elecciones Colombia</span>
      </Link>

      <details className="site-menu">
        <summary aria-label="Abrir navegacion principal">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Navegacion principal">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  )
}

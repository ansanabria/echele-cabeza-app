import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Este proyecto mantiene una linea editorial neutral y descriptiva. La informacion se
        publica con verificaciones y puede actualizarse cuando aparezcan nuevos datos
        confirmados.
      </p>
      <nav aria-label="Enlaces secundarios">
        <Link href="/acerca">Acerca de</Link>
        <span aria-hidden>·</span>
        <Link href="/metodologia">Metodologia</Link>
        <span aria-hidden>·</span>
        <Link href="/correcciones">Correcciones</Link>
      </nav>
    </footer>
  )
}

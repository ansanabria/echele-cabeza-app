import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
      <p className="mb-2 leading-relaxed">
        Este proyecto mantiene una linea editorial neutral y descriptiva. La informacion se
        publica con verificaciones y puede actualizarse cuando aparezcan nuevos datos
        confirmados.
      </p>
      <nav aria-label="Enlaces secundarios" className="flex items-center gap-2">
        <Link href="/acerca" className="text-muted-foreground no-underline transition-colors hover:text-foreground">
          Acerca de
        </Link>
        <span aria-hidden>·</span>
        <Link href="/metodologia" className="text-muted-foreground no-underline transition-colors hover:text-foreground">
          Metodologia
        </Link>
        <span aria-hidden>·</span>
        <Link href="/correcciones" className="text-muted-foreground no-underline transition-colors hover:text-foreground">
          Correcciones
        </Link>
      </nav>
    </footer>
  )
}

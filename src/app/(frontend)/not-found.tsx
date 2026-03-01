import Link from 'next/link'

// Static JSX hoisted outside the component — content never changes (rendering-hoist-jsx)
const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/comparar', label: 'Comparar candidatos' },
  { href: '/acerca', label: 'Acerca de' },
]

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      {/* Large editorial number */}
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Error</p>

      <h1 className="mt-3 text-[clamp(6rem,20vw,12rem)] leading-none text-border select-none">
        404
      </h1>

      <div className="mt-6 max-w-sm space-y-2">
        <h2 className="text-2xl leading-snug">Página no encontrada</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          La dirección que buscas no existe o fue movida. Puedes regresar al inicio o explorar el
          directorio de candidatos.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Ir al inicio
        </Link>

        {NAV_LINKS.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md border border-border px-5 py-2.5 text-sm text-foreground no-underline transition-colors hover:bg-secondary"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>
          ¿Buscabas un candidato?{' '}
          <Link href="/" className="text-primary">
            Ver todos los candidatos →
          </Link>
        </p>
      </div>
    </div>
  )
}

import { formatDate } from '@/lib/candidates'

type Correction = {
  id: string
  note?: string
  correctedAt?: string
}

type CorrectionHistoryProps = {
  corrections: Correction[]
}

export function CorrectionHistory({ corrections }: CorrectionHistoryProps) {
  return (
    <details className="mt-3 rounded-lg border border-border bg-secondary px-4 py-3" id="historial-correcciones">
      <summary className="cursor-pointer text-sm font-medium text-foreground">
        Historial de correcciones
      </summary>
      {corrections.length ? (
        <ul className="mt-3 space-y-2.5 pl-4">
          {corrections.map((correction) => (
            <li key={correction.id}>
              <time dateTime={correction.correctedAt} className="text-sm text-muted-foreground">
                {formatDate(correction.correctedAt)}
              </time>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {correction.note ?? 'Sin detalle registrado.'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No hay correcciones registradas para este perfil.
        </p>
      )}
    </details>
  )
}

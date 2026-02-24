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
    <details className="correction-history" id="historial-correcciones">
      <summary>Historial de correcciones</summary>
      {corrections.length ? (
        <ul>
          {corrections.map((correction) => (
            <li key={correction.id}>
              <time dateTime={correction.correctedAt}>
                {formatDate(correction.correctedAt)}
              </time>
              <p>{correction.note ?? 'Sin detalle registrado.'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay correcciones registradas para este perfil.</p>
      )}
    </details>
  )
}

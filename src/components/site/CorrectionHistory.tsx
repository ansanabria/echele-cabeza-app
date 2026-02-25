import { formatDate } from '@/lib/candidates'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
    <Accordion type="single" collapsible className="mt-3 scroll-mt-20" id="historial-correcciones">
      <AccordionItem value="historial-correcciones" className="rounded-lg border border-border bg-secondary px-4">
        <AccordionTrigger className="py-3 text-sm font-medium text-foreground hover:no-underline">
          Historial de correcciones
        </AccordionTrigger>
        <AccordionContent>
          {corrections.length ? (
            <ul className="mt-1 space-y-2.5 pl-4">
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
            <p className="mt-1 text-sm text-muted-foreground">
              No hay correcciones registradas para este perfil.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

'use client'

import type { SectionConfig } from '@/lib/candidates'

type SectionNavProps = {
  sections: SectionConfig[]
}

export function SectionNav({ sections }: SectionNavProps) {
  return (
    <div className="sticky top-0 z-5 mb-5 rounded-full border border-border bg-background p-1">
      <nav aria-label="Secciones del perfil" className="hidden flex-wrap gap-1 md:flex">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full px-3 py-1.5 text-sm text-muted-foreground no-underline transition-colors hover:bg-secondary hover:text-foreground"
          >
            {section.navLabel}
          </a>
        ))}
      </nav>

      <label className="grid gap-1 md:hidden">
        <span className="text-sm font-medium text-muted-foreground">Ir a seccion</span>
        <select
          defaultValue=""
          className="min-h-[2.4rem] rounded-full border border-border bg-card px-3 text-sm text-foreground"
          onChange={(event) => {
            const targetId = event.target.value
            if (!targetId) return
            window.location.hash = targetId
          }}
        >
          <option value="" disabled>
            Seleccionar seccion
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.heading}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

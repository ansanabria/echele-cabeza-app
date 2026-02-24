'use client'

import type { SectionConfig } from '@/lib/candidates'

type SectionNavProps = {
  sections: SectionConfig[]
}

export function SectionNav({ sections }: SectionNavProps) {
  return (
    <div className="section-nav">
      <nav aria-label="Secciones del perfil">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.navLabel}
          </a>
        ))}
      </nav>

      <label className="section-nav__mobile">
        <span>Ir a seccion</span>
        <select
          defaultValue=""
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

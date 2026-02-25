import type { CollectionConfig, Field } from 'payload'

const sourceTierOptions = [
  { label: 'Oficial', value: 'oficial' },
  { label: 'Prensa', value: 'prensa' },
  { label: 'ONG', value: 'ong' },
  { label: 'Redes', value: 'redes' },
]

const inlineSourceFields: Field[] = [
  {
    name: 'sourceTitle',
    type: 'text',
    required: true,
    label: 'Nombre de la fuente',
  },
  {
    name: 'sourceUrl',
    type: 'text',
    required: true,
    label: 'URL de la fuente',
  },
  {
    name: 'sourceTier',
    type: 'select',
    required: true,
    options: sourceTierOptions,
    label: 'Nivel de la fuente',
  },
]

const proposalItemsField: Field = {
  name: 'proposalItems',
  type: 'array',
  label: 'Propuestas (tarjetas)',
  admin: {
    description:
      'Cada entrada aparece como una tarjeta individual en el perfil del candidato. Las primeras 4 propuestas (en el orden de esta lista) se muestran en el perfil principal. Arrastra las filas para reordenar y elegir cuales 4 se destacan.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titulo de la propuesta',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descripcion',
    },
    {
      name: 'topic',
      type: 'text',
      label: 'Tema (ej: Seguridad, Salud, Economia)',
    },
    ...inlineSourceFields,
  ],
}

const controversyItemsField: Field = {
  name: 'controversyItems',
  type: 'array',
  label: 'Escandalos y controversias (tarjetas)',
  admin: {
    description:
      'Cada entrada aparece como una tarjeta individual con codigo de color segun el estado. Las primeras 2 controversias se muestran en el perfil principal. Arrastra las filas para reordenar y elegir cuales se destacan.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titulo del escandalo o controversia',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Descripcion (que se alega, estado actual, resultado si lo hay)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Estado',
      options: [
        { label: 'Sospecha / sin investigacion activa', value: 'suspicion' },
        { label: 'Investigacion en curso', value: 'under_investigation' },
        { label: 'Imputado formalmente', value: 'indicted' },
        { label: 'Absuelto / caso cerrado', value: 'cleared' },
        { label: 'Condenado', value: 'convicted' },
      ],
    },
    {
      name: 'year',
      type: 'text',
      label: 'Ano (ej: 2022, 2019–2021)',
    },
    ...inlineSourceFields,
  ],
}

const sourcesField: Field = {
  name: 'sources',
  type: 'array',
  label: 'Fuentes',
  fields: [
    {
      name: 'section',
      type: 'select',
      required: true,
      options: [
        { label: 'Biografia y trayectoria', value: 'biography' },
        { label: 'Plan de gobierno y propuestas', value: 'proposals' },
        { label: 'Escandalos y controversias', value: 'controversies' },
        { label: 'Alianzas y avales', value: 'alliances' },
        { label: 'Registro legislativo y de gobierno', value: 'record' },
        { label: 'Patrimonio, financiacion y campana', value: 'funding' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nombre de la fuente',
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      label: 'Fecha de publicacion',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL',
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: sourceTierOptions,
      label: 'Nivel',
    },
  ],
}

export const Candidates: CollectionConfig = {
  slug: 'candidates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'directoryOrder', 'party', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'party',
      type: 'text',
      required: true,
    },
    {
      name: 'directoryOrder',
      type: 'number',
      label: 'Orden en directorio (opcional)',
      admin: {
        description:
          'Asigna un numero para mostrar primero a los candidatos mas relevantes. Si se deja vacio, se ordena alfabeticamente.',
        step: 1,
      },
      min: 1,
      index: true,
    },
    {
      name: 'currentOffice',
      type: 'text',
      label: 'Cargo actual o mas reciente',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'lastUpdated',
      type: 'date',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido completo',
          fields: [
            {
              name: 'biography',
              type: 'richText',
              required: true,
              label: 'Biografia y trayectoria',
            },
            {
              name: 'proposals',
              type: 'richText',
              required: true,
              label: 'Plan de gobierno y propuestas',
            },
            proposalItemsField,
            {
              name: 'controversies',
              type: 'richText',
              required: true,
              label: 'Escandalos y controversias',
            },
            controversyItemsField,
            {
              name: 'alliances',
              type: 'richText',
              required: true,
              label: 'Alianzas y avales',
            },
            {
              name: 'allianceParties',
              type: 'array',
              label: 'Partidos y coaliciones',
              admin: {
                description:
                  'Partidos y coaliciones que apoyan al candidato. Cada entrada muestra logo y nombre en una tarjeta.',
              },
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Logo del partido o coalición',
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nombre del partido o coalición',
                },
              ],
            },
            {
              name: 'endorsers',
              type: 'array',
              label: 'Personas que apoyan',
              admin: {
                description:
                  'Personas relevantes que apoyan al candidato. Las primeras 4 se muestran en el perfil; si hay más, aparece el botón "Ver todos los apoyos".',
              },
              fields: [
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Foto de la persona',
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nombre',
                },
              ],
            },
            {
              name: 'record',
              type: 'richText',
              required: true,
              label: 'Registro legislativo y de gobierno',
            },
            {
              name: 'funding',
              type: 'richText',
              required: true,
              label: 'Patrimonio, financiacion y campana',
            },
            sourcesField,
          ],
        },
        {
          label: 'Resumen para comparar',
          fields: [
            {
              name: 'summaryTrajectory',
              type: 'textarea',
              required: true,
              label: 'Trayectoria',
            },
            {
              name: 'summaryProposals',
              type: 'textarea',
              required: true,
              label: 'Propuestas clave',
            },
            {
              name: 'summaryControversies',
              type: 'textarea',
              required: true,
              label: 'Controversias',
            },
            {
              name: 'summaryAlliances',
              type: 'textarea',
              required: true,
              label: 'Alianzas',
            },
            {
              name: 'summaryRecord',
              type: 'textarea',
              required: true,
              label: 'Registro',
            },
            {
              name: 'summaryFunding',
              type: 'textarea',
              required: true,
              label: 'Patrimonio',
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}

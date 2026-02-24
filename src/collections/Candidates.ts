import type { CollectionConfig, Field } from 'payload'

const sourceTierOptions = [
  { label: 'Oficial', value: 'oficial' },
  { label: 'Prensa', value: 'prensa' },
  { label: 'ONG', value: 'ong' },
  { label: 'Redes', value: 'redes' },
]

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
    defaultColumns: ['name', 'party', 'slug', 'updatedAt'],
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
            {
              name: 'controversies',
              type: 'richText',
              required: true,
              label: 'Escandalos y controversias',
            },
            {
              name: 'alliances',
              type: 'richText',
              required: true,
              label: 'Alianzas y avales',
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

import type { CollectionConfig } from 'payload'

export const Corrections: CollectionConfig = {
  slug: 'corrections',
  admin: {
    useAsTitle: 'note',
    defaultColumns: ['candidate', 'correctedAt', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'candidate',
      type: 'relationship',
      relationTo: 'candidates',
      required: true,
      index: true,
    },
    {
      name: 'note',
      type: 'textarea',
      required: true,
      label: 'Nota de correccion',
    },
    {
      name: 'correctedAt',
      type: 'date',
      required: true,
      label: 'Fecha de correccion',
    },
  ],
  timestamps: true,
}

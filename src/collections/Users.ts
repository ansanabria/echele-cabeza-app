import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    create: async ({ req }) => {
      if (req.user?.roles?.includes('admin')) return true

      const { totalDocs } = await req.payload.count({
        collection: 'users',
      })

      // Allow the first user to bootstrap the instance.
      return totalDocs === 0
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor'],
      defaultValue: ['editor'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req }) => req.user?.roles?.includes('admin') || false,
      },
    },
  ],
}

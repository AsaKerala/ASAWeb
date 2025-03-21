import { CollectionConfig } from 'payload/types';

const EventCategories: CollectionConfig = {
  slug: 'event-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'createdAt'],
  },
  access: {
    read: () => true, // Anyone can read event categories
    update: ({ req }) => {
      const { user } = req;
      if (user && user.role === 'admin') return true;
      return false;
    },
    create: ({ req }) => {
      const { user } = req;
      if (user && user.role === 'admin') return true;
      return false;
    },
    delete: ({ req }) => {
      const { user } = req;
      if (user && user.role === 'admin') return true;
      return false;
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex code for category color (e.g. #FF5733)',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional icon for this category',
      },
    },
  ],
  timestamps: true,
};

export default EventCategories; 
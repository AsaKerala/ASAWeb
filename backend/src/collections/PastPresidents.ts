import { CollectionConfig } from 'payload/types';

const PastPresidents: CollectionConfig = {
  slug: 'past-presidents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'term', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'term',
      type: 'text',
      required: true,
      label: 'Term Period',
      admin: {
        description: 'e.g., "2020-2022"',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
    },
    {
      name: 'achievements',
      type: 'textarea',
      label: 'Major Achievements',
      admin: {
        description: 'Notable accomplishments during their presidency',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 1,
      admin: {
        description: 'Lower numbers will be displayed first (most recent presidents should have lower numbers)',
      },
    },
  ],
  timestamps: true,
};

export default PastPresidents; 
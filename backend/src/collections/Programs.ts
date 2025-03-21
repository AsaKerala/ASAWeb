import { CollectionConfig } from 'payload/types';

const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'category'],
  },
  access: {
    read: () => true, // Anyone can read programs
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title) {
              return data.title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]+/g, '');
            }
            return '';
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Coming Soon',
          value: 'coming-soon',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Education',
          value: 'education',
        },
        {
          label: 'Community Service',
          value: 'community-service',
        },
        {
          label: 'Professional Development',
          value: 'professional-development',
        },
        {
          label: 'Youth Program',
          value: 'youth-program',
        },
        {
          label: 'Senior Program',
          value: 'senior-program',
        },
        {
          label: 'Health & Wellness',
          value: 'health-wellness',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'duration',
      type: 'group',
      fields: [
        {
          name: 'startDate',
          type: 'date',
        },
        {
          name: 'endDate',
          type: 'date',
        },
        {
          name: 'isOngoing',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'coordinator',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name: 'eligibility',
      type: 'richText',
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [
        {
          name: 'requirement',
          type: 'text',
        },
      ],
    },
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'memberOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, only members can view details of this program',
      },
    },
  ],
};

export default Programs; 
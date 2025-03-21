import { CollectionConfig } from 'payload/types';

const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedDate', 'status', 'category'],
  },
  access: {
    read: () => true, // Anyone can read news
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
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Archived',
          value: 'archived',
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
          label: 'Announcement',
          value: 'announcement',
        },
        {
          label: 'Event Report',
          value: 'event-report',
        },
        {
          label: 'Newsletter',
          value: 'newsletter',
        },
        {
          label: 'Press Release',
          value: 'press-release',
        },
        {
          label: 'Member Spotlight',
          value: 'member-spotlight',
        },
        {
          label: 'Organization Update',
          value: 'organization-update',
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
      name: 'publishedDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If unchecked, only members can view this news item',
      },
    },
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
};

export default News; 
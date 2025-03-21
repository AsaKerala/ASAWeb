import { CollectionConfig } from 'payload/types';

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'endDate', 'status'],
  },
  access: {
    read: () => true, // Anyone can read events
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
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
        {
          name: 'isVirtual',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'virtualLink',
          type: 'text',
          admin: {
            condition: (data) => data?.location?.isVirtual,
          },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'capacity',
      type: 'number',
      min: 0,
    },
    {
      name: 'ticketPrice',
      type: 'number',
      min: 0,
    },
    {
      name: 'isFree',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'registrationRequired',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'registrationDeadline',
      type: 'date',
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'event-categories',
      hasMany: true,
    },
    {
      name: 'relatedFiles',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
};

export default Events; 
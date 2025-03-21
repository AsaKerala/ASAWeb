import { CollectionConfig } from 'payload/types';

const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Anyone can read media
    update: ({ req }) => {
      const { user } = req;
      if (user && user.role === 'admin') return true;
      return false;
    },
    create: ({ req }) => {
      const { user } = req;
      if (user) return true; // Any authenticated user can upload media
      return false;
    },
    delete: ({ req }) => {
      const { user } = req;
      if (user && user.role === 'admin') return true;
      return false;
    },
  },
  upload: {
    staticURL: '/assets',
    staticDir: '../uploads',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        condition: (data) => {
          const mimeType = data?.mimeType || '';
          return mimeType.includes('image');
        },
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Event',
          value: 'event',
        },
        {
          label: 'Profile',
          value: 'profile',
        },
        {
          label: 'Facility',
          value: 'facility',
        },
        {
          label: 'News',
          value: 'news',
        },
        {
          label: 'Program',
          value: 'program',
        },
        {
          label: 'Document',
          value: 'document',
        },
        {
          label: 'Certificate',
          value: 'certificate',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, data }) => {
            if (req.user) {
              return req.user.id;
            }
            return data?.uploadedBy;
          },
        ],
      },
    },
  ],
};

export default Media; 
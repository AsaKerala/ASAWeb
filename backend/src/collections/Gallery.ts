import { CollectionConfig } from 'payload/types';

const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['image', 'title', 'category', 'featured'],
    listSearchableFields: ['title', 'description', 'category'],
  },
  access: {
    read: () => true, // Anyone can read gallery items
    update: ({ req }) => {
      const { user } = req;
      return user?.role === 'admin';
    },
    create: ({ req }) => {
      const { user } = req;
      return user?.role === 'admin';
    },
    delete: ({ req }) => {
      const { user } = req;
      return user?.role === 'admin';
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload an image for the gallery',
      },
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Exterior', value: 'exterior' },
        { label: 'Accommodation', value: 'rooms' },
        { label: 'Training Halls', value: 'training' },
        { label: 'Japanese Elements', value: 'japanese' },
        { label: 'Facilities', value: 'facilities' },
        { label: 'Sustainability', value: 'sustainability' },
      ],
      required: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this image in carousels and highlight sections',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: {
        description: 'Order to display images (lower numbers first)',
      },
    },
  ],
};

export default Gallery; 
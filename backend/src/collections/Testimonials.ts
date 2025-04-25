import { CollectionConfig } from 'payload/types';

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'status', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: () => true, // Everyone can read testimonials
    create: ({ req }) => {
      // Only admins can create testimonials directly in the CMS
      return req.user?.role === 'admin';
    },
    update: ({ req }) => {
      // Only admins can update testimonials
      return req.user?.role === 'admin';
    },
    delete: ({ req }) => {
      // Only admins can delete testimonials
      return req.user?.role === 'admin';
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the person giving the testimonial',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title or role of the person',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'The testimonial text',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Profile photo of the person',
      },
    },
    {
      name: 'memberType',
      type: 'select',
      options: [
        { label: 'Student Member', value: 'student' },
        { label: 'Professional Member', value: 'professional' },
        { label: 'Corporate Member', value: 'corporate' },
        { label: 'Honorary Member', value: 'honorary' },
      ],
      admin: {
        description: 'Type of membership this person holds',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Featured', value: 'featured' },
      ],
      admin: {
        description: 'Status of this testimonial',
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Display order (lower numbers appear first)',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};

export default Testimonials; 
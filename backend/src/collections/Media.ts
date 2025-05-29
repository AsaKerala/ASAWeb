import { CollectionConfig } from 'payload/types';

// Create a separate collection for YouTube videos
const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'mediaType', 'inGallery'],
    group: 'Media',
  },
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
    // Cloudinary will handle storage instead of local filesystem
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
      name: 'title',
      type: 'text',
      label: 'Media Title',
      required: true,
      admin: {
        description: 'Enter a descriptive title for this media'
      }
    },
    {
      name: 'mediaType',
      type: 'radio',
      options: [
        {
          label: 'Uploaded File',
          value: 'file',
        },
        {
          label: 'YouTube Video',
          value: 'youtube',
        },
      ],
      defaultValue: 'file',
      admin: {
        layout: 'horizontal',
        description: 'Select media type before proceeding'
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        condition: (data) => {
          const mimeType = data?.mimeType || '';
          return data.mediaType === 'file' && mimeType.includes('image');
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
        { label: 'Exterior', value: 'exterior' },
        { label: 'Accommodation', value: 'rooms' },
        { label: 'Training Halls', value: 'training' },
        { label: 'Japanese Elements', value: 'japanese' },
        { label: 'Facilities', value: 'facilities' },
        { label: 'Sustainability', value: 'sustainability' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'inGallery',
      type: 'checkbox',
      label: 'Show in Gallery',
      defaultValue: false,
      admin: {
        description: 'Include this image in the gallery section of the website',
        position: 'sidebar',
      },
    },
    {
      name: 'inHeroCarousel',
      type: 'checkbox',
      label: 'Show in Hero Carousel',
      defaultValue: false,
      admin: {
        description: 'Include this image in the hero carousel on the homepage',
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Media',
      defaultValue: false,
      admin: {
        description: 'Feature this image in highlighted sections',
        position: 'sidebar',
      },
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
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Display Order',
      admin: {
        description: 'Lower numbers will be displayed first',
        position: 'sidebar',
      },
      defaultValue: 999,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data;
        
        // For YouTube videos, handle upload requirements differently
        if (data.mediaType === 'youtube') {
          // Set a special flag to handle the file upload requirement
          if (req) {
            // Instead of using a non-standard property, use a custom property
            (req as any).skipMediaValidation = true;
          }
        }
        
        // Set category to media-coverage for YouTube videos if not already set
        if (data.mediaType === 'youtube' && (!data.category || data.category === 'other')) {
          data.category = 'media-coverage';
        }
        return data;
      },
    ]
  }
};

export default Media; 
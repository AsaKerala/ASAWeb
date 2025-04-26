import { CollectionConfig } from 'payload/types';

// Create a separate collection for YouTube videos
const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'mediaType'],
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
          label: 'Media Coverage',
          value: 'media-coverage',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'youtubeID',
      type: 'text',
      label: 'YouTube Video ID',
      admin: {
        description: 'Enter just the video ID (e.g., "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
        condition: (data) => data?.mediaType === 'youtube',
      },
      validate: (value, { data }) => {
        if (data.mediaType === 'youtube' && !value && !data.youtubeURL) {
          return 'Either YouTube ID or URL is required for YouTube videos';
        }
        return true;
      },
    },
    {
      name: 'youtubeURL',
      type: 'text',
      label: 'YouTube Video URL',
      admin: {
        description: 'Full YouTube URL (https://www.youtube.com/watch?v=VIDEO_ID)',
        condition: (data) => data?.mediaType === 'youtube',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.mediaType !== 'youtube' || !value) return value;
            
            // Extract YouTube ID from URL if provided
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = value.match(regExp);
            const videoId = (match && match[2].length === 11) ? match[2] : null;
            
            if (videoId && !data.youtubeID) {
              // Also update the youtubeID field
              data.youtubeID = videoId;
            }
            
            return value;
          },
        ],
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
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Media',
      defaultValue: false,
    },
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Display Order',
      admin: {
        description: 'Lower numbers will be displayed first',
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
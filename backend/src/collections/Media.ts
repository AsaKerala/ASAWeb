import { CollectionConfig } from 'payload/types';
import { cloudinary, uploadBuffer } from '../services/cloudinary';
import { File } from 'payload/dist/uploads/types';
import { PayloadRequest } from 'payload/dist/express/types';
import path from 'path';

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
    // Set up in-memory storage first, as we'll handle the Cloudinary upload in hooks
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
    // Fix handlers format - each handler should be a function, not an object
    handlers: [
      ({ req, data }) => {
        // Return data as-is for now, we'll use the afterChange hook for Cloudinary
        return data;
      }
    ],
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
      name: 'cloudinaryId',
      type: 'text',
      label: 'Cloudinary Public ID',
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.mediaType === 'file'
      },
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      label: 'Cloudinary URL',
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data?.mediaType === 'file'
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
    ],
    afterChange: [
      async ({ req, doc }: { req: PayloadRequest; doc: any }) => {
        // Only process file uploads, not YouTube videos
        if (doc.mediaType !== 'file' || !doc.filename) return doc;
        
        try {
          // If already uploaded to Cloudinary (has cloudinaryId), skip
          if (doc.cloudinaryId) return doc;
          
          // Get the file path from the doc
          const filePath = path.resolve(__dirname, '../../uploads', doc.filename);
          
          // Upload to Cloudinary
          const result = await new Promise<any>((resolve) => {
            // We need file buffer instead of path for Cloudinary upload
            // In the meantime, let's use a simulated upload with filepath
            cloudinary.uploader.upload(filePath, {
              resource_type: 'auto',
              folder: `asa-kerala/${doc.category || 'general'}`,
              public_id: doc.id,
            }, (error, uploadResult) => {
              if (error) {
                console.error('Cloudinary upload failed:', error);
                resolve(null);
              } else {
                resolve(uploadResult);
              }
            });
          });
          
          if (result) {
            // Update the document with Cloudinary information
            const updatedDoc = await req.payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                cloudinaryId: result.public_id,
                cloudinaryUrl: result.secure_url,
                // Update the URL to use Cloudinary URL instead of local
                url: result.secure_url,
              },
              // Skip hooks to avoid infinite loop
              depth: 0,
            });
            
            return updatedDoc;
          }
        } catch (error) {
          console.error('Error in Cloudinary upload:', error);
        }
        
        return doc;
      },
    ],
    beforeDelete: [
      async ({ req, id }: { req: PayloadRequest; id: string }) => {
        try {
          // Fetch the document to get its cloudinaryId
          const doc = await req.payload.findByID({
            collection: 'media',
            id,
          });
          
          // If it has a cloudinary ID, delete from Cloudinary
          if (doc.cloudinaryId) {
            await cloudinary.uploader.destroy(doc.cloudinaryId);
            console.log(`Deleted file ${doc.cloudinaryId} from Cloudinary`);
          }
        } catch (error) {
          console.error('Error deleting from Cloudinary:', error);
        }
      },
    ],
  }
};

export default Media; 
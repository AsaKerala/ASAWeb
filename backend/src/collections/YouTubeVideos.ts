import { CollectionConfig } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

const YouTubeVideos: CollectionConfig = {
  slug: 'youtube-videos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'youtubeID', 'category', 'featured'],
    group: 'Media Content',
  },
  access: {
    read: () => true,
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
      name: 'youtubeID',
      type: 'text',
      required: true,
      admin: {
        description: 'The ID of the YouTube video (e.g., dQw4w9WgXcQ)',
      },
    },
    {
      name: 'youtubeURL',
      type: 'text',
      admin: {
        description: 'Optional full YouTube URL',
      },
    },
    {
      name: 'thumbnailURL',
      type: 'text',
      admin: {
        description: 'URL to the video thumbnail image',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Media Coverage',
          value: 'media-coverage',
        },
        {
          label: 'Tutorials',
          value: 'tutorials',
        },
        {
          label: 'Interviews',
          value: 'interviews',
        },
        {
          label: 'Events',
          value: 'events',
        },
        {
          label: 'Presentations',
          value: 'presentations',
        },
        {
          label: 'Demo',
          value: 'demo',
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Should this video be featured on the homepage or section pages?',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: {
        description: 'Order for featured videos (lower numbers appear first)',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (!req.payload) return doc;
        
        try {
          // Log activity for YouTube video operations
          await logActivity(req.payload, {
            action: operation,
            entityType: 'youtube-video',
            entityId: String(doc.id),
            userId: req.user?.id,
            req,
            details: {
              message: `${operation === 'create' ? 'Added' : 'Updated'} YouTube video: ${doc.title}`,
              videoInfo: {
                title: doc.title,
                youtubeID: doc.youtubeID,
                category: doc.category,
              }
            }
          });
        } catch (error) {
          console.error('Error logging YouTube video activity:', error);
        }
        
        return doc;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        if (req.payload) {
          try {
            // Get the video before it's deleted
            const video = await req.payload.findByID({
              collection: 'youtube-videos',
              id: id as string,
            });
            
            // Log the video deletion
            await logActivity(req.payload, {
              action: 'delete',
              entityType: 'youtube-video',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Deleted YouTube video: ${video?.title || 'Unknown video'}`,
              }
            });
          } catch (error) {
            console.error('Error logging YouTube video deletion:', error);
          }
        }
        
        return id;
      }
    ],
  }
};

export default YouTubeVideos; 
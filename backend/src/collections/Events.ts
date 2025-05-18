import { CollectionConfig } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['featuredImage', 'title', 'status', 'eventType', 'isFeatured'],
    listSearchableFields: ['title', 'summary', 'eventType'],
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
  hooks: {
    afterRead: [
      async ({ req, doc }) => {
        return doc;
      }
    ],
    beforeChange: [
      async ({ req, data }) => {
        return data;
      }
    ],
    afterChange: [
      async ({ req, doc, previousDoc }) => {
        if (!req.payload) return doc;
        
        try {
          // Determine what significant changes were made
          const changes: string[] = [];
          
          if (doc.status !== previousDoc.status) {
            changes.push(`Status changed from ${previousDoc.status} to ${doc.status}`);
          }
          
          if (doc.title !== previousDoc.title) {
            changes.push(`Title changed from "${previousDoc.title}" to "${doc.title}"`);
          }
          
          if (doc.isFeatured !== previousDoc.isFeatured) {
            changes.push(`Featured status changed to ${doc.isFeatured ? 'featured' : 'not featured'}`);
          }
          
          // Log the event update
          await logActivity(req.payload, {
            action: 'update',
            entityType: 'event',
            entityId: String(doc.id),
            userId: req.user?.id,
            req,
            details: {
              message: `Event updated: ${doc.title}`,
              changes: changes.length > 0 ? changes : ['General updates made'],
              eventInfo: {
                title: doc.title,
                status: doc.status,
                category: doc.eventType,
              }
            }
          });
          
          // If this is a create operation (no previous doc status)
          if (!previousDoc.status && doc.status) {
            // Log the event creation
            await logActivity(req.payload, {
              action: 'create',
              entityType: 'event',
              entityId: String(doc.id),
              userId: req.user?.id,
              req,
              details: {
                message: `New event created: ${doc.title}`,
                eventInfo: {
                  title: doc.title,
                  status: doc.status,
                  category: doc.eventType,
                  isFeatured: doc.isFeatured,
                }
              }
            });
          }
        } catch (error) {
          console.error('Error logging event activity:', error);
        }
        
        return doc;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        if (req.payload) {
          try {
            // Get the event before it's deleted
            const event = await req.payload.findByID({
              collection: 'events',
              id: id as string,
            });
            
            // Log the event deletion
            await logActivity(req.payload, {
              action: 'delete',
              entityType: 'event',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Event deleted: ${event?.title || 'Unknown event'}`,
              }
            });
          } catch (error) {
            console.error('Error logging event deletion:', error);
          }
        }
        
        return id;
      }
    ],
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
      name: 'eventType',
      label: 'Event Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Conference', value: 'conference' },
        { label: 'Seminar', value: 'seminar' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Networking', value: 'networking' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'General Meeting', value: 'meeting' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of event',
        position: 'sidebar',
      },
      validate: (value) => {
        if (!value) return 'Please select an event type';
        return true;
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Event',
      defaultValue: false,
      admin: {
        description: 'Display this event in featured sections',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main image for this event',
      },
    },
    // Overview section
    {
      name: 'summary',
      label: 'Summary/Brief Description',
      type: 'textarea',
      admin: {
        description: 'A brief description of the event'
      }
    },
    {
      name: 'content',
      label: 'Detailed Content',
      type: 'richText',
    },
    // Key Features section
    {
      name: 'keyFeatures',
      type: 'group',
      label: 'Event Details',
      admin: {
        description: 'Essential information about the event'
      },
      fields: [
        {
          name: 'mode',
          type: 'select',
          options: [
            { label: 'Online', value: 'online' },
            { label: 'Offline', value: 'offline' },
            { label: 'Hybrid', value: 'hybrid' },
          ]
        },
        {
          name: 'customLocation',
          label: 'Location',
          type: 'text',
          admin: {
            description: 'e.g., NKC, Hotel Name, etc.'
          }
        },
        {
          name: 'address',
          type: 'textarea',
          admin: {
            condition: (data) => data?.keyFeatures?.mode !== 'online',
            description: 'Full address of the venue'
          }
        },
        {
          name: 'mapLink',
          type: 'text',
          admin: {
            condition: (data) => data?.keyFeatures?.mode !== 'online',
            description: 'Google Maps link to the venue'
          }
        },
        {
          name: 'isVirtual',
          type: 'checkbox',
          label: 'Virtual/Online Event',
          defaultValue: false,
        },
        {
          name: 'virtualLink',
          type: 'text',
          label: 'Virtual Event Link',
          admin: {
            condition: (data) => data?.keyFeatures?.isVirtual || data?.keyFeatures?.mode === 'online',
            description: 'Link for virtual events (Zoom, Teams, etc.)'
          }
        },
        {
          name: 'eventDate',
          label: 'Event Date (for single-day events)',
          type: 'date',
          admin: {
            description: 'Use this for one-day events',
            date: {
              pickerAppearance: 'dayAndTime',
            }
          }
        },
        {
          name: 'startDate',
          label: 'Start Date (for multi-day events)',
          type: 'date',
          admin: {
            description: 'Start date for multi-day events',
            date: {
              pickerAppearance: 'dayAndTime',
            }
          }
        },
        {
          name: 'endDate',
          label: 'End Date (for multi-day events)',
          type: 'date',
          admin: {
            description: 'End date for multi-day events',
            date: {
              pickerAppearance: 'dayAndTime',
            }
          }
        }
      ]
    },
    // Event Schedule
    {
      name: 'schedule',
      type: 'array',
      label: 'Event Schedule',
      admin: {
        description: 'Add agenda items and timings'
      },
      fields: [
        {
          name: 'time',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., 9:00 AM - 10:30 AM'
          }
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'speaker',
          type: 'text',
          admin: {
            description: 'Optional speaker or presenter for this session'
          }
        }
      ]
    },
    // Speakers/Presenters
    {
      name: 'speakers',
      type: 'array',
      label: 'Speakers/Presenters',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
        },
        {
          name: 'bio',
          type: 'textarea',
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        }
      ]
    },
    // Event Fees
    {
      name: 'eventFees',
      type: 'group',
      label: 'Event Fees',
      fields: [
        {
          name: 'isFree',
          type: 'checkbox',
          label: 'Free Event',
          defaultValue: false,
        },
        {
          name: 'memberPrice',
          label: 'Price for Members',
          type: 'number',
          admin: {
            description: 'Price in ₹ for ASA Kerala members',
            condition: (data) => !data?.eventFees?.isFree,
          }
        },
        {
          name: 'nonMemberPrice',
          label: 'Price for Non-Members',
          type: 'number',
          admin: {
            description: 'Regular price in ₹',
            condition: (data) => !data?.eventFees?.isFree,
          }
        }
      ]
    },
    // Related Events
    {
      name: 'relatedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Other events related to this one'
      }
    },
    // Related Programs
    {
      name: 'relatedPrograms',
      type: 'relationship',
      relationTo: 'programs',
      hasMany: true,
      admin: {
        description: 'Programs related to this event'
      }
    },
    // Event Resources
    {
      name: 'resources',
      type: 'array',
      label: 'Event Resources',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        }
      ]
    },
    // Gallery
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
        }
      ]
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'event-categories',
      hasMany: true,
      admin: {
        description: 'Categories this event belongs to',
      },
    },
    {
      name: 'memberOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, only members can view details of this event',
        position: 'sidebar'
      },
    },
  ],
};

export default Events; 
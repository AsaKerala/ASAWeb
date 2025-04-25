import { CollectionConfig } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['featuredImage', 'title', 'status', 'programCategory', 'isFeatured'],
    listSearchableFields: ['title', 'summary', 'programCategory'],
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
                category: doc.programCategory,
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
                  category: doc.programCategory,
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
      name: 'programCategory',
      label: 'Program Category',
      type: 'select',
      required: true,
      options: [
        { label: 'Training Programs', value: 'training-programs' },
        { label: 'Language Training', value: 'language-training' },
        { label: 'Internships', value: 'internships' },
        { label: 'Skill Development', value: 'skill-development' },
        { label: 'Cultural Activities', value: 'cultural-activities' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Primary category for this program/event',
        position: 'sidebar',
      },
      validate: (value) => {
        if (!value) return 'Please select a program category';
        return true;
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Program/Event',
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
      label: 'Summary/Brief Introduction',
      type: 'textarea',
      admin: {
        description: 'A brief introduction explaining the purpose, target audience, and key benefits'
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
      label: 'Key Features',
      admin: {
        description: 'Essential information about the program'
      },
      fields: [
        {
          name: 'duration',
          type: 'text',
          admin: {
            description: 'e.g., 2 weeks, 1 month'
          }
        },
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
            description: 'e.g., Japan, India, NKC'
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
            condition: (data) => data?.keyFeatures?.isVirtual,
            description: 'Link for virtual events (Zoom, Teams, etc.)'
          }
        },
        {
          name: 'eventDate',
          label: 'Event Date (for single-day events)',
          type: 'date',
          admin: {
            description: 'Use this for one-day events that do not have batches',
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
        },
        {
          name: 'certification',
          type: 'select',
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]
        },
        {
          name: 'eligibility',
          type: 'text',
          admin: {
            description: 'Who can apply?'
          }
        }
      ]
    },
    // Program Curriculum
    {
      name: 'curriculum',
      type: 'array',
      label: 'Program Curriculum',
      admin: {
        description: 'Add program modules and their descriptions'
      },
      fields: [
        {
          name: 'module',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        }
      ]
    },
    // Learning Outcomes
    {
      name: 'learningOutcomes',
      type: 'array',
      label: 'Learning Outcomes',
      admin: {
        description: 'What participants will gain from the program'
      },
      fields: [
        {
          name: 'outcome',
          type: 'text',
          required: true,
        }
      ]
    },
    // Program Fees
    {
      name: 'programFees',
      type: 'group',
      label: 'Program Fees',
      fields: [
        {
          name: 'memberPrice',
          label: 'Price for Members',
          type: 'number',
          admin: {
            description: 'Price in ₹ for ASA Kerala members'
          }
        },
        {
          name: 'nonMemberPrice',
          label: 'Price for Non-Members',
          type: 'number',
          admin: {
            description: 'Regular price in ₹'
          }
        },
        {
          name: 'hasScholarships',
          label: 'Scholarships Available',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'scholarshipDetails',
          label: 'Scholarship Details',
          type: 'textarea',
          admin: {
            condition: (data) => data?.programFees?.hasScholarships,
          }
        }
      ]
    },
    // Upcoming Batches
    {
      name: 'upcomingBatches',
      type: 'array',
      label: 'Upcoming Batches',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            }
          }
        },
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
          name: 'applicationDeadline',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            }
          }
        }
      ]
    },
    // Application Process
    {
      name: 'applicationProcess',
      type: 'array',
      label: 'Application Process',
      admin: {
        description: 'Steps to apply for the program'
      },
      fields: [
        {
          name: 'step',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        }
      ]
    },
    // Testimonials
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
        }
      ]
    },
    // FAQs
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQs',
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        }
      ]
    },
    // Contact Information
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'brochureFile',
          label: 'Program Brochure',
          type: 'upload',
          relationTo: 'media',
        }
      ]
    },
    // Legacy relationship fields that may still be needed
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
      admin: {
        description: 'Additional categories/tags for this event',
      },
    },
  ],
};

export default Events; 
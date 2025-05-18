import { CollectionConfig } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'category', 'isFeatured'],
    listSearchableFields: ['title', 'summary', 'category'],
  },
  access: {
    read: () => true, // Anyone can read programs
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
    afterChange: [
      async ({ req, doc, previousDoc }) => {
        if (!req.payload) return doc;
        
        try {
          // Determine what significant changes were made
          const changes: string[] = [];
          
          if (previousDoc && doc.status !== previousDoc.status) {
            changes.push(`Status changed from ${previousDoc.status} to ${doc.status}`);
          }
          
          if (previousDoc && doc.title !== previousDoc.title) {
            changes.push(`Title changed from "${previousDoc.title}" to "${doc.title}"`);
          }
          
          if (previousDoc && doc.isFeatured !== previousDoc.isFeatured) {
            changes.push(`Featured status changed to ${doc.isFeatured ? 'featured' : 'not featured'}`);
          }
          
          // Log the program update
          await logActivity(req.payload, {
            action: 'update',
            entityType: 'program',
            entityId: String(doc.id),
            userId: req.user?.id,
            req,
            details: {
              message: `Program updated: ${doc.title}`,
              changes: changes.length > 0 ? changes : ['General updates made'],
              programInfo: {
                title: doc.title,
                status: doc.status,
                category: doc.category,
              }
            }
          });
          
          // If this is a create operation (no previous doc)
          if (!previousDoc) {
            // Log the program creation
            await logActivity(req.payload, {
              action: 'create',
              entityType: 'program',
              entityId: String(doc.id),
              userId: req.user?.id,
              req,
              details: {
                message: `New program created: ${doc.title}`,
                programInfo: {
                  title: doc.title,
                  status: doc.status,
                  category: doc.category,
                  isFeatured: doc.isFeatured,
                }
              }
            });
          }
        } catch (error) {
          console.error('Error logging program activity:', error);
        }
        
        return doc;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        if (req.payload) {
          try {
            // Get the program before it's deleted
            const program = await req.payload.findByID({
              collection: 'programs',
              id: id as string,
            });
            
            // Log the program deletion
            await logActivity(req.payload, {
              action: 'delete',
              entityType: 'program',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Program deleted: ${program?.title || 'Unknown program'}`,
              }
            });
          } catch (error) {
            console.error('Error logging program deletion:', error);
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Training Programs in Japan', value: 'training-japan' },
        { label: 'Training Programs in India', value: 'training-india' },
        { label: 'Language Training', value: 'language-training' },
        { label: 'Internships', value: 'internships' },
        { label: 'Skill Development', value: 'skill-development' },
        { label: 'WNF Programs', value: 'wnf-programs' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Primary category for this program',
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Program',
      defaultValue: false,
      admin: {
        description: 'Display this program in featured sections',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main image for this program',
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
      type: 'richText',
      label: 'Detailed Content',
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
          name: 'location',
          type: 'text',
          admin: {
            description: 'e.g., Japan, India, NKC'
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
          name: 'batchName',
          type: 'text',
          required: true,
          admin: {
            description: 'Name or number of the batch'
          }
        },
        {
          name: 'startDate',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'When this batch begins'
          }
        },
        {
          name: 'endDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'When this batch concludes'
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
          name: 'capacity',
          type: 'number',
          admin: {
            description: 'Maximum number of participants'
          }
        },
        {
          name: 'applicationDeadline',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            description: 'Last date to apply for this batch'
          }
        },
        {
          name: 'isFull',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as full if no more registrations can be accepted'
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
    // Related Programs
    {
      name: 'relatedPrograms',
      type: 'relationship',
      relationTo: 'programs',
      hasMany: true,
      admin: {
        description: 'Other programs related to this one'
      }
    },
    // Attachments/Resources
    {
      name: 'resources',
      type: 'array',
      label: 'Resources & Downloads',
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
    // Program Coordinator
    {
      name: 'coordinator',
      type: 'group',
      label: 'Program Coordinator',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
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
      name: 'memberOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, only members can view details of this program',
        position: 'sidebar'
      },
    },
  ],
};

export default Programs; 
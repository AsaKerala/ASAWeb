import { CollectionConfig } from 'payload/types';
import { isAdmin, isActiveMember } from '../access/isAdmin';

const MemberEvents: CollectionConfig = {
  slug: 'member-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'location', 'status', 'registrationCount'],
  },
  access: {
    read: isActiveMember,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description for event listings',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this event prominently',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'format',
          type: 'select',
          options: [
            { label: 'In-Person', value: 'in-person' },
            { label: 'Virtual', value: 'virtual' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
          required: true,
          defaultValue: 'in-person',
        },
        {
          name: 'address',
          type: 'text',
          admin: {
            condition: (data, siblingData) => 
              siblingData?.format === 'in-person' || siblingData?.format === 'hybrid',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            condition: (data, siblingData) => 
              siblingData?.format === 'in-person' || siblingData?.format === 'hybrid',
          },
        },
        {
          name: 'virtualLink',
          type: 'text',
          admin: {
            condition: (data, siblingData) => 
              siblingData?.format === 'virtual' || siblingData?.format === 'hybrid',
            description: 'Zoom/Teams/Meet link (shown only to registered attendees)',
          },
        },
      ],
    },
    {
      name: 'registrationLimit',
      type: 'number',
      admin: {
        description: 'Maximum registrants (leave blank for unlimited)',
      },
    },
    {
      name: 'registrationCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Current number of registrations',
      },
    },
    {
      name: 'registrationDeadline',
      type: 'date',
      admin: {
        description: 'Last day to register (leave blank for no deadline)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'eventType',
      type: 'select',
      options: [
        { label: 'Conference', value: 'conference' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Networking', value: 'networking' },
        { label: 'Annual Meeting', value: 'annual-meeting' },
        { label: 'Training', value: 'training' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'speakers',
      type: 'array',
      admin: {
        description: 'Event speakers or presenters',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'organization',
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
        },
      ],
    },
    {
      name: 'agenda',
      type: 'array',
      admin: {
        description: 'Event schedule/agenda',
      },
      fields: [
        {
          name: 'time',
          type: 'text',
          required: true,
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
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'attendees',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Users registered for this event',
        readOnly: true,
      },
    },
    {
      name: 'certificationOffered',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Attendees can receive a certificate for this event',
      },
    },
    {
      name: 'certificationRequirements',
      type: 'richText',
      admin: {
        condition: (data) => data.certificationOffered,
        description: 'Requirements to earn certificate',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update registration count when attendees are added/removed
        if (doc.attendees && Array.isArray(doc.attendees)) {
          if (doc.registrationCount !== doc.attendees.length) {
            await req.payload.update({
              collection: 'member-events',
              id: doc.id,
              data: {
                registrationCount: doc.attendees.length,
              },
              depth: 0,
            });
          }
        }
        return doc;
      },
    ],
  },
};

export default MemberEvents; 
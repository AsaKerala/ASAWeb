import { CollectionConfig } from 'payload/types';

const ContactForm: CollectionConfig = {
  slug: 'contact-form-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
    group: 'Content',
  },
  access: {
    read: ({ req }) => {
      // Only admins can read contact form submissions
      return req.user?.role === 'admin';
    },
    create: () => true, // Anyone can create contact form submissions
    update: () => false, // Submissions should not be updated
    delete: ({ req }) => {
      // Only admins can delete submissions
      return req.user?.role === 'admin';
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the person submitting the form',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the submitter',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      admin: {
        description: 'Phone number (optional)',
      },
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
      options: [
        { label: 'Membership Inquiry', value: 'membership' },
        { label: 'Program/Training Inquiry', value: 'program' },
        { label: 'Facility Booking', value: 'facility' },
        { label: 'Event Information', value: 'event' },
        { label: 'Collaboration/Partnership', value: 'collaboration' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Subject of the inquiry',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Message content',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: {
        description: 'Status of this contact submission',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this submission',
        position: 'sidebar',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the submitter',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser/device information',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};

export default ContactForm; 
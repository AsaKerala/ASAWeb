import { CollectionConfig } from 'payload/types';

const CommitteeMembers: CollectionConfig = {
  slug: 'committee-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'term', 'active'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      options: [
        { label: 'President', value: 'president' },
        { label: 'Vice President', value: 'vice-president' },
        { label: 'Secretary', value: 'secretary' },
        { label: 'Joint Secretary', value: 'joint-secretary' },
        { label: 'Treasurer', value: 'treasurer' },
        { label: 'Committee Member', value: 'committee-member' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Photo',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Short Biography',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      admin: {
        description: 'This email will not be publicly displayed',
      },
    },
    {
      name: 'linkedIn',
      type: 'text',
      label: 'LinkedIn Profile URL',
      admin: {
        description: 'Optional LinkedIn profile URL',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 99,
      admin: {
        description: 'Lower numbers will be displayed first (e.g., 1 for President, 2 for Vice President, etc.)',
      },
    },
    {
      name: 'term',
      type: 'text',
      label: 'Term Period',
      admin: {
        description: 'e.g., "2023-2025"',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Currently Active?',
      defaultValue: true,
    },
  ],
  timestamps: true,
};

export default CommitteeMembers; 
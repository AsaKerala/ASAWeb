import { CollectionConfig } from 'payload/types';

const CommitteeMembers: CollectionConfig = {
  slug: 'committee-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'committeeType', 'term', 'active'],
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
      name: 'committeeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Managing Committee', value: 'managing-committee' },
        { label: 'Governing Council', value: 'governing-council' },
        { label: 'Subcommittee', value: 'subcommittee' },
      ],
      defaultValue: 'governing-council',
      admin: {
        description: 'Select the type of committee this member belongs to',
      },
    },
    {
      name: 'subcommitteeType',
      type: 'select',
      options: [
        { label: 'Infrastructure Management Committee', value: 'infrastructure-committee' },
        { label: 'Saturday Meet Committee', value: 'saturday-meet-committee' },
        { label: 'Business Circle', value: 'business-circle' },
        { label: 'Training Committee', value: 'training-committee' },
      ],
      admin: {
        condition: (data) => data.committeeType === 'subcommittee',
        description: 'Select the specific subcommittee (only applicable for subcommittee members)',
      },
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      admin: {
        description: 'Enter the position (e.g., President, Vice President, Secretary, Joint Secretary, Treasurer). Standard positions should follow this exact naming for proper ordering.',
      },
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
        description: 'Standard order for managing committee: 1 for President, 2 for Vice President, 3 for Secretary, 4 for Joint Secretary, 5 for Treasurer. Lower numbers will be displayed first.',
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
import { CollectionConfig } from 'payload/types';
import { isAdmin, isActiveMember } from '../access/isAdmin';

const MemberResources: CollectionConfig = {
  slug: 'member-resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'resourceType', 'accessLevel', 'publishedDate'],
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
      type: 'textarea',
    },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Industry Report', value: 'industry-report' },
        { label: 'Training Material', value: 'training-material' },
        { label: 'Webinar Recording', value: 'webinar-recording' },
        { label: 'Research Paper', value: 'research-paper' },
        { label: 'Presentation', value: 'presentation' },
        { label: 'Template', value: 'template' },
        { label: 'Guide', value: 'guide' },
        { label: 'Case Study', value: 'case-study' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'accessLevel',
      type: 'select',
      required: true,
      defaultValue: 'all-members',
      options: [
        { label: 'All Members', value: 'all-members' },
        { label: 'Premium Members Only', value: 'premium' },
        { label: 'Lifetime Members Only', value: 'lifetime' },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'resource-categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expiryDate',
      type: 'date',
      admin: {
        description: 'Optional: When this resource will no longer be available (leave blank for no expiry)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'relatedResources',
      type: 'relationship',
      relationTo: 'member-resources',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'downloadCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Number of times this resource has been downloaded',
      },
    },
  ],
  hooks: {
    beforeRead: [
      async ({ req, doc }) => {
        // Check if user has access to this resource based on their membership type
        if (!req.user) return null;
        
        const { user } = req;
        
        // Admins can access everything
        if (user.role === 'admin') return doc;
        
        // Check resource access level against user membership
        const { accessLevel } = doc;
        const membershipType = user.membership?.membershipType || 'regular';
        
        // Resource accessible to all members
        if (accessLevel === 'all-members') return doc;
        
        // Premium-only resources
        if (accessLevel === 'premium' && 
            (membershipType === 'premium' || membershipType === 'lifetime')) {
          return doc;
        }
        
        // Lifetime-only resources
        if (accessLevel === 'lifetime' && membershipType === 'lifetime') {
          return doc;
        }
        
        // User doesn't have access, return null
        return null;
      },
    ],
  },
};

export default MemberResources; 
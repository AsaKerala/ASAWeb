import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
  },
  access: {
    // Only admins can create users
    create: ({ req }) => {
      const { user } = req || {};
      if (user && user.role === 'admin') return true;
      return false;
    },
    // Only admins or the user themselves can update a user
    update: ({ req }) => {
      const { user } = req || {};
      const id = req?.params?.id;
      if (user && (user.role === 'admin' || user.id === id)) return true;
      return false;
    },
    // Only admins can delete users
    delete: ({ req }) => {
      const { user } = req || {};
      if (user && user.role === 'admin') return true;
      return false;
    },
    // Only admins can read all users
    read: ({ req }) => {
      const { user } = req || {};
      if (user && user.role === 'admin') return true;
      return {
        id: {
          equals: user?.id,
        },
      };
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'member',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Member',
          value: 'member',
        },
      ],
      admin: {
        condition: ({ req }) => {
          // Safely handle cases where req might be undefined
          if (!req) return false;
          
          // Check if user exists before accessing properties
          const { user } = req;
          return Boolean(user && user.role === 'admin');
        },
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'state',
          type: 'text',
        },
        {
          name: 'zipCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
          defaultValue: 'United States',
        },
      ],
    },
    {
      name: 'membershipDetails',
      type: 'group',
      fields: [
        {
          name: 'memberSince',
          type: 'date',
          defaultValue: () => new Date(),
        },
        {
          name: 'membershipType',
          type: 'select',
          options: [
            {
              label: 'Standard',
              value: 'standard',
            },
            {
              label: 'Premium',
              value: 'premium',
            },
            {
              label: 'Lifetime',
              value: 'lifetime',
            },
          ],
          defaultValue: 'standard',
        },
        {
          name: 'renewalDate',
          type: 'date',
          admin: {
            description: 'When the membership needs to be renewed',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'eventsAttended',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
    },
  ],
};

export default Users; 
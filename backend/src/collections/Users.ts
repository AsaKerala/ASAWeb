import { CollectionConfig } from 'payload/types';
import { isAdmin, isAdminOrSelf } from '../access/isAdmin';
import { authHooks } from '../auth/hooks';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'membershipStatus'],
  },
  access: {
    read: isAdminOrSelf,
    create: () => true, // Anyone can register
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => {
      // Only allow admin users to access the admin panel
      return req?.user?.role === 'admin';
    },
  },
  hooks: {
    afterChange: [authHooks.afterUserUpdate],
    afterCreate: [authHooks.afterUserCreate],
    afterLogin: [authHooks.afterLogin],
    afterLogout: [authHooks.afterLogout],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Member', value: 'member' },
      ],
      defaultValue: 'member',
      required: true,
      access: {
        update: isAdmin, // Only admins can change roles
      },
    },
    {
      name: 'membership',
      type: 'group',
      fields: [
        {
          name: 'membershipType',
          type: 'select',
          options: [
            { label: 'Regular Member', value: 'regular' },
            { label: 'Premium Member', value: 'premium' },
            { label: 'Lifetime Member', value: 'lifetime' },
            { label: 'Student Member', value: 'student' },
            { label: 'Honorary Member', value: 'honorary' },
          ],
          defaultValue: 'regular',
          required: true,
        },
        {
          name: 'membershipStatus',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Pending', value: 'pending' },
            { label: 'Expired', value: 'expired' },
            { label: 'Suspended', value: 'suspended' },
          ],
          defaultValue: 'pending',
          required: true,
        },
        {
          name: 'joinDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'renewalDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'memberID',
          type: 'text',
          admin: {
            description: 'Unique membership ID (generated automatically)',
          },
        },
      ],
    },
    {
      name: 'profile',
      type: 'group',
      fields: [
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
          name: 'japanExperience',
          type: 'textarea',
          admin: {
            description: 'Brief description of your experience in Japan (education, work, etc.)',
          },
        },
        {
          name: 'japaneseLanguage',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Basic (N5)', value: 'n5' },
            { label: 'Elementary (N4)', value: 'n4' },
            { label: 'Intermediate (N3)', value: 'n3' },
            { label: 'Advanced (N2)', value: 'n2' },
            { label: 'Proficient (N1)', value: 'n1' },
          ],
          defaultValue: 'none',
        },
        {
          name: 'currentOrganization',
          type: 'text',
        },
        {
          name: 'position',
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
              defaultValue: 'India',
            },
          ],
        },
        {
          name: 'bio',
          type: 'textarea',
        },
        {
          name: 'socialLinks',
          type: 'array',
          fields: [
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Website', value: 'website' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'url',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'emailNotifications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Receive Email Notifications',
        },
        {
          name: 'newsletterSubscription',
          type: 'checkbox',
          defaultValue: true,
          label: 'Subscribe to Newsletter',
        },
        {
          name: 'eventReminders',
          type: 'checkbox',
          defaultValue: true,
          label: 'Receive Event Reminders',
        },
        {
          name: 'showProfileInDirectory',
          type: 'checkbox',
          defaultValue: true,
          label: 'Display Profile in Member Directory',
        },
        {
          name: 'directMessagePermission',
          type: 'select',
          options: [
            { label: 'Allow from all members', value: 'all' },
            { label: 'Allow from connections only', value: 'connections' },
            { label: 'Disable direct messages', value: 'none' },
          ],
          defaultValue: 'all',
        },
      ],
    },
    {
      name: 'connections',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Member connections (similar to LinkedIn connections)',
      },
    },
    {
      name: 'attendedEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Events this member has attended',
      },
    },
    {
      name: 'registeredEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      admin: {
        description: 'Events this member is registered for',
      },
    }
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate a unique member ID for new users
        if (operation === 'create' && data.role === 'member') {
          // Format: ASA-YYYY-XXXX where YYYY is current year and XXXX is random alphanumeric
          const year = new Date().getFullYear();
          const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
          
          // Set the member ID if it doesn't already exist
          if (!data.membership || !data.membership.memberID) {
            if (!data.membership) data.membership = {};
            data.membership.memberID = `ASA-${year}-${randomPart}`;
          }
          
          // Set default join date if not provided
          if (!data.membership || !data.membership.joinDate) {
            if (!data.membership) data.membership = {};
            data.membership.joinDate = new Date().toISOString();
          }
          
          // Set default renewal date to 1 year from join date
          if (!data.membership || !data.membership.renewalDate) {
            const joinDate = new Date(data.membership.joinDate || new Date());
            const renewalDate = new Date(joinDate);
            renewalDate.setFullYear(renewalDate.getFullYear() + 1);
            data.membership.renewalDate = renewalDate.toISOString();
          }
        }
        
        return data;
      },
    ],
  },
};

export default Users; 
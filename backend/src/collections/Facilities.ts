import { CollectionConfig } from 'payload/types';

const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status'],
  },
  access: {
    read: () => true, // Anyone can read facilities
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
  fields: [
    {
      name: 'name',
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
            if (data?.name) {
              return data.name
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
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Under Maintenance',
          value: 'maintenance',
        },
        {
          label: 'Coming Soon',
          value: 'coming-soon',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Meeting Room',
          value: 'meeting-room',
        },
        {
          label: 'Conference Hall',
          value: 'conference-hall',
        },
        {
          label: 'Recreation Space',
          value: 'recreation',
        },
        {
          label: 'Training Center',
          value: 'training-center',
        },
        {
          label: 'Outdoor Space',
          value: 'outdoor',
        },
        {
          label: 'Library',
          value: 'library',
        },
        {
          label: 'Computer Lab',
          value: 'computer-lab',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
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
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'floor',
          type: 'text',
        },
        {
          name: 'buildingName',
          type: 'text',
        },
        {
          name: 'mapLink',
          type: 'text',
        },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
    },
    {
      name: 'amenities',
      type: 'array',
      fields: [
        {
          name: 'amenity',
          type: 'text',
        },
      ],
    },
    {
      name: 'availabilityHours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'select',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'openTime',
          type: 'text',
        },
        {
          name: 'closeTime',
          type: 'text',
        },
        {
          name: 'isClosed',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'reservationInfo',
      type: 'richText',
    },
    {
      name: 'memberOnly',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, only members can reserve this facility',
      },
    },
  ],
};

export default Facilities; 
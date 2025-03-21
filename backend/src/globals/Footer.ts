import { GlobalConfig } from 'payload/types';

const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: ({ req }) => {
      const { user } = req;
      if (user && user.role === 'admin') return true;
      return false;
    },
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
            },
            {
              name: 'type',
              type: 'select',
              defaultValue: 'internal',
              options: [
                {
                  label: 'Internal',
                  value: 'internal',
                },
                {
                  label: 'External',
                  value: 'external',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'bottomSection',
      type: 'group',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          defaultValue: '© 2025 Organization. All rights reserved.',
        },
        {
          name: 'showSocialIcons',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'legalLinks',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Subscribe to our newsletter',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Stay updated with the latest news and events from our organization.',
        },
      ],
    },
    {
      name: 'additionalContent',
      type: 'richText',
    },
    {
      name: 'logo',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'showLogo',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'logoPosition',
          type: 'select',
          defaultValue: 'left',
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
        },
      ],
    },
  ],
};

export default Footer; 
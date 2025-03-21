import { GlobalConfig } from 'payload/types';

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
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
      name: 'organization',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
        {
          name: 'mapLink',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'membership',
      type: 'group',
      fields: [
        {
          name: 'membershipTypes',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'price',
              type: 'number',
            },
            {
              name: 'duration',
              type: 'select',
              options: [
                { label: 'Monthly', value: 'monthly' },
                { label: 'Quarterly', value: 'quarterly' },
                { label: 'Annually', value: 'annually' },
                { label: 'Lifetime', value: 'lifetime' },
              ],
            },
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'membershipInfo',
          type: 'richText',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'siteTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsID',
          type: 'text',
        },
        {
          name: 'facebookPixelID',
          type: 'text',
        },
      ],
    },
  ],
};

export default SiteSettings; 
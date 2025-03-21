import { GlobalConfig } from 'payload/types';

const MainMenu: GlobalConfig = {
  slug: 'main-menu',
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
      name: 'menuItems',
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
        {
          name: 'isButton',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'accessLevel',
          type: 'select',
          defaultValue: 'public',
          options: [
            {
              label: 'Public',
              value: 'public',
            },
            {
              label: 'Members Only',
              value: 'members',
            },
            {
              label: 'Admin Only',
              value: 'admin',
            },
          ],
        },
        {
          name: 'subMenuItems',
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
            {
              name: 'accessLevel',
              type: 'select',
              defaultValue: 'public',
              options: [
                {
                  label: 'Public',
                  value: 'public',
                },
                {
                  label: 'Members Only',
                  value: 'members',
                },
                {
                  label: 'Admin Only',
                  value: 'admin',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'mobileMenuSettings',
      type: 'group',
      fields: [
        {
          name: 'breakpoint',
          type: 'select',
          defaultValue: 'md',
          options: [
            {
              label: 'Small (sm)',
              value: 'sm',
            },
            {
              label: 'Medium (md)',
              value: 'md',
            },
            {
              label: 'Large (lg)',
              value: 'lg',
            },
          ],
        },
        {
          name: 'showSocialIcons',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
};

export default MainMenu; 
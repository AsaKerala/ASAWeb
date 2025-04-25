import { CollectionConfig } from 'payload/types';
import { isAdmin, isActiveMember } from '../access/isAdmin';

const ResourceCategories: CollectionConfig = {
  slug: 'resource-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'resourceCount'],
  },
  access: {
    read: isActiveMember,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'resourceCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Automatically calculated number of resources in this category',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Icon to represent this category',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Color code (hex) for category styling, e.g. #FF5500',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'resource-categories',
      admin: {
        description: 'Parent category (if this is a subcategory)',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order to display categories (lower numbers display first)',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // When a category is created or updated, update the resourceCount
        const payload = req.payload;
        
        try {
          // Count resources in this category
          const resourcesInCategory = await payload.find({
            collection: 'member-resources',
            where: {
              categories: {
                contains: doc.id,
              },
              status: {
                equals: 'published',
              },
            },
          });
          
          // Update the category with the correct count
          if (resourcesInCategory.totalDocs !== doc.resourceCount) {
            await payload.update({
              collection: 'resource-categories',
              id: doc.id,
              data: {
                resourceCount: resourcesInCategory.totalDocs,
              },
              // Important: set this to avoid infinite recursion
              depth: 0,
            });
          }
          
          return doc;
        } catch (error) {
          console.error('Error updating resource count:', error);
          return doc;
        }
      },
    ],
  },
};

export default ResourceCategories; 
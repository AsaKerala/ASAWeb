import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { logActivity } from '../utilities/activityLogger';

const ProgramRegistrations: CollectionConfig = {
  slug: 'program-registrations',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'program', 'registrationDate', 'status', 'batchName'],
  },
  access: {
    // Admin can access all registrations
    // Users can only read their own registrations
    read: async ({ req }) => {
      const { user } = req;
      
      // If no user, deny access
      if (!user) return false;
      
      // If admin, allow access to all registrations
      if (user.role === 'admin') return true;
      
      // Otherwise, only allow user to see their own registrations
      return {
        user: {
          equals: user.id,
        },
      };
    },
    // Only logged-in users can create registrations for themselves
    create: async ({ req }) => {
      return !!req.user;
    },
    // Users can only update their own registrations, admins can update any
    update: async ({ req }) => {
      const { user } = req;
      
      // If no user, deny access
      if (!user) return false;
      
      // If admin, allow access to all registrations
      if (user.role === 'admin') return true;
      
      // Otherwise, only allow user to update their own registrations
      return {
        user: {
          equals: user.id,
        },
      };
    },
    // Only admins can delete registrations
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        // Set the user to the current user if not specified (for create operations)
        if (operation === 'create' && req.user && !data.user) {
          data.user = req.user.id;
        }
        
        return data;
      },
    ],
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        if (!req.payload) return doc;
        
        try {
          // If this is a create operation
          if (operation === 'create') {
            // Get the program details for the log message
            let programTitle = 'a program';
            if (doc.program) {
              try {
                const program = await req.payload.findByID({
                  collection: 'programs',
                  id: typeof doc.program === 'object' ? doc.program.id : doc.program,
                });
                if (program && program.title) {
                  programTitle = program.title as string;
                }
              } catch (err) {
                console.error('Error fetching program details for activity log:', err);
              }
            }
            
            // Log the registration
            await logActivity(req.payload, {
              action: 'register',
              entityType: 'program-registration',
              entityId: String(doc.id),
              userId: req.user?.id,
              req,
              details: {
                message: `Registered for program: ${programTitle}`,
                registrationInfo: {
                  registrationId: doc.id,
                  programId: typeof doc.program === 'object' ? doc.program.id : doc.program,
                  status: doc.status,
                  batchName: doc.batchName,
                  registrationDate: doc.registrationDate,
                }
              }
            });
          } else if (operation === 'update' && previousDoc) {
            // Check if status changed
            if (doc.status !== previousDoc.status) {
              let action = 'update';
              let message = `Registration status changed from ${previousDoc.status} to ${doc.status}`;
              
              // Determine specific action based on status change
              if (doc.status === 'cancelled') {
                action = 'cancel';
                message = 'Program registration cancelled';
              } else if (doc.status === 'completed') {
                message = 'Marked as completed the program';
              }
              
              // Get the program details for the log message
              let programTitle = 'a program';
              if (doc.program) {
                try {
                  const program = await req.payload.findByID({
                    collection: 'programs',
                    id: typeof doc.program === 'object' ? doc.program.id : doc.program,
                  });
                  if (program && program.title) {
                    programTitle = program.title as string;
                  }
                } catch (err) {
                  console.error('Error fetching program details for activity log:', err);
                }
              }
              
              // Log the status change
              await logActivity(req.payload, {
                action: action as 'update' | 'cancel',
                entityType: 'program-registration',
                entityId: String(doc.id),
                userId: req.user?.id,
                req,
                details: {
                  message: `${message} for program: ${programTitle}`,
                  statusChange: {
                    from: previousDoc.status,
                    to: doc.status
                  },
                  registrationInfo: {
                    registrationId: doc.id,
                    programId: typeof doc.program === 'object' ? doc.program.id : doc.program,
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error('Error logging program registration activity:', error);
        }
        
        return doc;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        if (req.payload) {
          try {
            // Log the registration deletion
            await logActivity(req.payload, {
              action: 'delete',
              entityType: 'program-registration',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Program registration deleted`,
              }
            });
          } catch (error) {
            console.error('Error logging program registration deletion:', error);
          }
        }
        
        return id;
      }
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      required: true,
      hasMany: false,
    },
    {
      name: 'registrationDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Waitlisted', value: 'waitlisted' },
      ],
      defaultValue: 'confirmed',
      required: true,
    },
    {
      name: 'batchName',
      type: 'text',
      admin: {
        description: 'Name or number of the program batch',
      },
    },
    {
      name: 'batchId',
      type: 'text',
      admin: {
        description: 'Identifier for the batch in the program\'s upcomingBatches array',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this registration',
      },
    },
    {
      name: 'paymentInfo',
      type: 'group',
      fields: [
        {
          name: 'amount',
          type: 'number',
        },
        {
          name: 'currency',
          type: 'select',
          options: [
            { label: 'INR (₹)', value: 'inr' },
            { label: 'USD ($)', value: 'usd' },
            { label: 'JPY (¥)', value: 'jpy' },
          ],
          defaultValue: 'inr',
        },
        {
          name: 'paymentMethod',
          type: 'select',
          options: [
            { label: 'Bank Transfer', value: 'bank-transfer' },
            { label: 'Cash', value: 'cash' },
            { label: 'Online Payment', value: 'online' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'receiptNumber',
          type: 'text',
        },
        {
          name: 'paymentDate',
          type: 'date',
        },
        {
          name: 'paymentStatus',
          type: 'select',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Refunded', value: 'refunded' },
          ],
          defaultValue: 'pending',
        },
      ],
    },
    {
      name: 'applicationDetails',
      type: 'group',
      fields: [
        {
          name: 'resume',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'motivationLetter',
          type: 'textarea',
        },
        {
          name: 'additionalDocuments',
          type: 'array',
          fields: [
            {
              name: 'documentName',
              type: 'text',
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'certificates',
      type: 'array',
      fields: [
        {
          name: 'certificateType',
          type: 'select',
          options: [
            { label: 'Participation', value: 'participation' },
            { label: 'Completion', value: 'completion' },
            { label: 'Achievement', value: 'achievement' },
          ],
        },
        {
          name: 'issueDate',
          type: 'date',
        },
        {
          name: 'certificateNumber',
          type: 'text',
        },
        {
          name: 'certificateFile',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
};

export default ProgramRegistrations; 
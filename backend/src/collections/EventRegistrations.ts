import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { logActivity } from '../utilities/activityLogger';

const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'event', 'registrationDate', 'status'],
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
            // Get the event details for the log message
            let eventTitle = 'an event';
            if (doc.event) {
              try {
                const event = await req.payload.findByID({
                  collection: 'events',
                  id: typeof doc.event === 'object' ? doc.event.id : doc.event,
                });
                if (event && event.title) {
                  eventTitle = event.title;
                }
              } catch (err) {
                console.error('Error fetching event details for activity log:', err);
              }
            }
            
            // Log the registration
            await logActivity(req.payload, {
              action: 'register',
              entityType: 'event-registration',
              entityId: String(doc.id),
              userId: req.user?.id,
              req,
              details: {
                message: `Registered for event: ${eventTitle}`,
                registrationInfo: {
                  registrationId: doc.id,
                  eventId: typeof doc.event === 'object' ? doc.event.id : doc.event,
                  status: doc.status,
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
                message = 'Event registration cancelled';
              } else if (doc.status === 'attended') {
                message = 'Marked as attended the event';
              }
              
              // Get the event details for the log message
              let eventTitle = 'an event';
              if (doc.event) {
                try {
                  const event = await req.payload.findByID({
                    collection: 'events',
                    id: typeof doc.event === 'object' ? doc.event.id : doc.event,
                  });
                  if (event && event.title) {
                    eventTitle = event.title;
                  }
                } catch (err) {
                  console.error('Error fetching event details for activity log:', err);
                }
              }
              
              // Log the status change
              await logActivity(req.payload, {
                action,
                entityType: 'event-registration',
                entityId: String(doc.id),
                userId: req.user?.id,
                req,
                details: {
                  message: `${message} for event: ${eventTitle}`,
                  statusChange: {
                    from: previousDoc.status,
                    to: doc.status
                  },
                  registrationInfo: {
                    registrationId: doc.id,
                    eventId: typeof doc.event === 'object' ? doc.event.id : doc.event,
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error('Error logging event registration activity:', error);
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
              entityType: 'event-registration',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Event registration deleted`,
              }
            });
          } catch (error) {
            console.error('Error logging event registration deletion:', error);
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
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
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
        { label: 'Attended', value: 'attended' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Waitlisted', value: 'waitlisted' },
      ],
      defaultValue: 'confirmed', // Since we're doing one-click registration, default to confirmed
      required: true,
    },
    {
      name: 'batchIndex',
      type: 'number',
      admin: {
        description: 'Index of the batch for programs with multiple batches',
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
      name: 'checkInTime',
      type: 'date',
      admin: {
        description: 'Time when the attendee checked in to the event',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'attendeeType',
      type: 'select',
      options: [
        { label: 'Regular', value: 'regular' },
        { label: 'Speaker', value: 'speaker' },
        { label: 'VIP', value: 'vip' },
        { label: 'Volunteer', value: 'volunteer' },
        { label: 'Organizer', value: 'organizer' },
      ],
      defaultValue: 'regular',
    },
  ],
};

export default EventRegistrations; 
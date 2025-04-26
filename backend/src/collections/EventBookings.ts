import { CollectionConfig } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

const EventBookings: CollectionConfig = {
  slug: 'event-bookings',
  admin: {
    useAsTitle: 'eventName',
    defaultColumns: ['eventName', 'organizerName', 'email', 'venueSpace', 'startDate', 'endDate', 'status', 'createdAt'],
    group: 'Facilities',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user && user.role === 'admin') return true;
      return false;
    },
    update: ({ req: { user } }) => {
      if (user && user.role === 'admin') return true;
      return false;
    },
    delete: ({ req: { user } }) => {
      if (user && user.role === 'admin') return true;
      return false;
    },
    create: () => true, // Anyone can create a booking
  },
  hooks: {
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        if (!req.payload) return doc;
        
        try {
          // If this is a create operation
          if (operation === 'create') {
            // Log the booking creation
            await logActivity(req.payload, {
              action: 'book',
              entityType: 'event-booking',
              entityId: String(doc.id),
              userId: req.user?.id,
              req,
              details: {
                message: `New event venue booking created: ${doc.eventName}`,
                bookingInfo: {
                  eventName: doc.eventName,
                  organizerName: doc.organizerName,
                  venue: doc.venueSpace,
                  startDate: doc.startDate,
                  endDate: doc.endDate,
                }
              }
            });
          } else if (operation === 'update') {
            // Check if status changed
            if (doc.status !== previousDoc.status) {
              let action = 'update';
              
              // Determine the specific action based on status change
              if (doc.status === 'confirmed') {
                action = 'approve';
              } else if (doc.status === 'cancelled') {
                action = 'cancel';
              }
              
              // Log the status change
              await logActivity(req.payload, {
                action: action as 'update' | 'approve' | 'cancel',
                entityType: 'event-booking',
                entityId: String(doc.id),
                userId: req.user?.id,
                req,
                details: {
                  message: `Event booking status changed from ${previousDoc.status} to ${doc.status}: ${doc.eventName}`,
                  statusChange: {
                    from: previousDoc.status,
                    to: doc.status
                  },
                  bookingInfo: {
                    eventName: doc.eventName,
                    organizerName: doc.organizerName,
                    venue: doc.venueSpace,
                  }
                }
              });
            } else {
              // Log general updates
              await logActivity(req.payload, {
                action: 'update',
                entityType: 'event-booking',
                entityId: String(doc.id),
                userId: req.user?.id,
                req,
                details: {
                  message: `Event booking updated: ${doc.eventName}`,
                  bookingInfo: {
                    eventName: doc.eventName,
                    organizerName: doc.organizerName,
                    venue: doc.venueSpace,
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error('Error logging event booking activity:', error);
        }
        
        return doc;
      }
    ],
    beforeDelete: [
      async ({ req, id }) => {
        if (req.payload) {
          try {
            // Log the booking deletion
            await logActivity(req.payload, {
              action: 'delete',
              entityType: 'event-booking',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Event booking deleted`,
              }
            });
          } catch (error) {
            console.error('Error logging event booking deletion:', error);
          }
        }
        
        return id;
      }
    ],
  },
  fields: [
    {
      name: 'eventName',
      type: 'text',
      required: true,
      label: 'Event Name',
    },
    {
      name: 'organizerName',
      type: 'text',
      required: true,
      label: 'Organizer Name',
    },
    {
      name: 'organization',
      type: 'text',
      required: true,
      label: 'Organization',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email Address',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Phone Number',
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Conference',
          value: 'conference',
        },
        {
          label: 'Training Program',
          value: 'training',
        },
        {
          label: 'Workshop',
          value: 'workshop',
        },
        {
          label: 'Corporate Meeting',
          value: 'meeting',
        },
        {
          label: 'Cultural Event',
          value: 'cultural',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'attendees',
      type: 'select',
      required: true,
      options: [
        {
          label: '10-50 people',
          value: '10-50',
        },
        {
          label: '51-100 people',
          value: '51-100',
        },
        {
          label: '101-200 people',
          value: '101-200',
        },
        {
          label: 'More than 200 people',
          value: '200+',
        },
      ],
    },
    {
      name: 'venueSpace',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Golden Jubilee Hall (Auditorium - capacity 200)',
          value: 'auditorium',
        },
        {
          label: 'Nishimura Hall (Seminar Hall - capacity 80)',
          value: 'nishimura',
        },
        {
          label: 'Yamamoto Hall (Seminar Hall - capacity 60)',
          value: 'yamamoto',
        },
        {
          label: 'Classroom (capacity 30)',
          value: 'classroom',
        },
        {
          label: 'Boardroom (capacity 15)',
          value: 'boardroom',
        },
        {
          label: 'Multiple Spaces',
          value: 'multiple',
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      label: 'End Date',
    },
    {
      name: 'requirements',
      type: 'textarea',
      label: 'Specific Requirements',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      },
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'needsAccommodation',
      type: 'checkbox',
      label: 'Needs Accommodation',
    },
    {
      name: 'needsCatering',
      type: 'checkbox',
      label: 'Needs Catering Services',
    },
    {
      name: 'estimatedCost',
      type: 'number',
      label: 'Estimated Cost (₹)',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
};

export default EventBookings; 
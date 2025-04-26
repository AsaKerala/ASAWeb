import { CollectionConfig } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

const RoomBookings: CollectionConfig = {
  slug: 'room-bookings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roomType', 'checkIn', 'checkOut', 'status', 'createdAt'],
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
              entityType: 'room-booking',
              entityId: String(doc.id),
              userId: req.user?.id,
              req,
              details: {
                message: `New room booking created by ${doc.name}`,
                bookingInfo: {
                  name: doc.name,
                  roomType: doc.roomType,
                  checkIn: doc.checkIn,
                  checkOut: doc.checkOut,
                  guests: doc.guests,
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
                entityType: 'room-booking',
                entityId: String(doc.id),
                userId: req.user?.id,
                req,
                details: {
                  message: `Room booking status changed from ${previousDoc.status} to ${doc.status} for ${doc.name}`,
                  statusChange: {
                    from: previousDoc.status,
                    to: doc.status
                  },
                  bookingInfo: {
                    name: doc.name,
                    roomType: doc.roomType,
                  }
                }
              });
            } else {
              // Log general updates
              await logActivity(req.payload, {
                action: 'update',
                entityType: 'room-booking',
                entityId: String(doc.id),
                userId: req.user?.id,
                req,
                details: {
                  message: `Room booking updated for ${doc.name}`,
                  bookingInfo: {
                    name: doc.name,
                    roomType: doc.roomType,
                    checkIn: doc.checkIn,
                    checkOut: doc.checkOut,
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error('Error logging room booking activity:', error);
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
              entityType: 'room-booking',
              entityId: String(id),
              userId: req.user?.id,
              req,
              details: {
                message: `Room booking deleted`,
              }
            });
          } catch (error) {
            console.error('Error logging room booking deletion:', error);
          }
        }
        
        return id;
      }
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
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
      name: 'organization',
      type: 'text',
      label: 'Organization',
    },
    {
      name: 'roomType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Twin Room (2 single beds)',
          value: 'twin',
        },
        {
          label: 'Suite Room (premium)',
          value: 'suite',
        },
      ],
    },
    {
      name: 'guests',
      type: 'select',
      required: true,
      options: [
        {
          label: '1 Guest',
          value: '1',
        },
        {
          label: '2 Guests',
          value: '2',
        },
      ],
    },
    {
      name: 'checkIn',
      type: 'date',
      required: true,
      label: 'Check-in Date',
    },
    {
      name: 'checkOut',
      type: 'date',
      required: true,
      label: 'Check-out Date',
    },
    {
      name: 'specialRequirements',
      type: 'textarea',
      label: 'Special Requirements',
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
  ],
  timestamps: true,
};

export default RoomBookings; 
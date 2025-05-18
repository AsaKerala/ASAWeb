import { CollectionConfig } from 'payload/types';
import { isAdminOrHasAccessToActivity } from '../access/isAdminOrHasAccess';

export const ActivityLogs: CollectionConfig = {
  slug: 'activity-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'entityType', 'entityId', 'user', 'createdAt'],
    group: 'System',
  },
  access: {
    read: isAdminOrHasAccessToActivity,
    create: () => true, // All users can create logs, but we'll control this programmatically
    update: () => false, // Logs should not be updated
    delete: () => false, // Logs should not be deleted
  },
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
        { label: 'Register', value: 'register' },
        { label: 'Book', value: 'book' },
        { label: 'Cancel', value: 'cancel' },
        { label: 'Approve', value: 'approve' },
        { label: 'Reject', value: 'reject' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'entityType',
      type: 'select',
      required: true,
      options: [
        { label: 'User', value: 'user' },
        { label: 'Event', value: 'event' },
        { label: 'Room Booking', value: 'room-booking' },
        { label: 'Event Booking', value: 'event-booking' },
        { label: 'Event Registration', value: 'event-registration' },
        { label: 'Program', value: 'program' },
        { label: 'Program Registration', value: 'program-registration' },
        { label: 'News', value: 'news' },
        { label: 'Facility', value: 'facility' },
        { label: 'Resource', value: 'resource' },
        { label: 'Contact Form', value: 'contact-form' },
        { label: 'Membership Application', value: 'membership-application' },
        { label: 'System', value: 'system' },
      ],
    },
    {
      name: 'entityId',
      type: 'text',
      required: false,
      admin: {
        description: 'ID of the entity this activity relates to',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        description: 'User who performed this action',
      },
    },
    {
      name: 'ip',
      type: 'text',
      required: false,
      admin: {
        description: 'IP address of the user',
        position: 'sidebar',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      required: false,
      admin: {
        description: 'User agent string',
        position: 'sidebar',
      },
    },
    {
      name: 'details',
      type: 'json',
      required: false,
      admin: {
        description: 'Additional details about the activity',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'success',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending', value: 'pending' },
      ],
    },
  ],
  timestamps: true,
}; 
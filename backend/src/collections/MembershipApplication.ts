import { CollectionConfig } from 'payload/types';

const MembershipApplication: CollectionConfig = {
  slug: 'membership-applications',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'membershipType', 'status', 'createdAt'],
    group: 'Membership',
  },
  access: {
    read: ({ req }) => {
      // Only admins can read membership applications
      return req.user?.role === 'admin';
    },
    create: () => true, // Anyone can submit a membership application
    update: ({ req }) => {
      // Only admins can update applications (to change status, add notes, etc.)
      return req.user?.role === 'admin';
    },
    delete: ({ req }) => {
      // Only admins can delete applications
      return req.user?.role === 'admin';
    },
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the applicant',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address of the applicant',
      },
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number of the applicant',
      },
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        description: 'Date of birth of the applicant',
      },
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'line1',
          type: 'text',
          required: true,
          admin: {
            description: 'Address line 1',
          },
        },
        {
          name: 'line2',
          type: 'text',
          admin: {
            description: 'Address line 2 (optional)',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'pincode',
          type: 'text',
          required: true,
          admin: {
            description: 'PIN code / ZIP code',
          },
        }
      ]
    },
    {
      name: 'membershipType',
      type: 'select',
      required: true,
      options: [
        { label: 'Student Membership', value: 'student' },
        { label: 'Professional Membership', value: 'professional' },
        { label: 'Corporate Membership', value: 'corporate' },
      ],
      admin: {
        description: 'Type of membership applied for',
      },
    },
    {
      name: 'occupation',
      type: 'text',
      admin: {
        description: 'Current occupation/profession',
      },
    },
    {
      name: 'organization',
      type: 'text',
      admin: {
        description: 'Current organization/institution',
      },
    },
    {
      name: 'educationalQualification',
      type: 'textarea',
      admin: {
        description: 'Educational qualifications',
      },
    },
    {
      name: 'reasonForJoining',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Reason for joining ASA Kerala',
      },
    },
    {
      name: 'interests',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Japanese Language', value: 'language' },
        { label: 'Training Programs', value: 'training' },
        { label: 'Business Networking', value: 'networking' },
        { label: 'Cultural Exchange', value: 'cultural' },
        { label: 'Technology Transfer', value: 'technology' },
        { label: 'Academic Collaboration', value: 'academic' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Areas of interest',
      },
    },
    {
      name: 'otherInterests',
      type: 'textarea',
      admin: {
        description: 'Other interests (if selected "Other" above)',
        condition: (data) => {
          return data?.interests?.includes('other');
        },
      },
    },
    {
      name: 'resumeCV',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Resume/CV (for Professional/Student membership)',
      },
    },
    {
      name: 'companyProfile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Company profile (for Corporate membership)',
      },
    },
    {
      name: 'referredBy',
      type: 'text',
      admin: {
        description: 'Name of the person who referred (if any)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Payment Pending', value: 'payment-pending' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        description: 'Status of this application',
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this application',
        position: 'sidebar',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the applicant',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'Browser/device information',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};

export default MembershipApplication; 
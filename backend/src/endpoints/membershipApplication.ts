import { Endpoint } from 'payload/config';
import payload from 'payload';

export const membershipApplicationEndpoint: Endpoint = {
  path: '/membership-application',
  method: 'post',
  handler: async (req, res) => {
    try {
      console.log('Received membership application:', JSON.stringify(req.body, null, 2));
      
      const { 
        fullName, 
        email, 
        phone, 
        dateOfBirth,
        address,
        membershipType, 
        occupation,
        organization,
        educationalQualification,
        reasonForJoining,
        interests,
        otherInterests,
        referredBy
      } = req.body;

      // Validate required fields
      if (!fullName || !email || !phone || !membershipType || !reasonForJoining) {
        console.log('Missing required fields');
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }

      // Prepare data with properly formatted dateOfBirth
      const submissionData = {
        fullName,
        email,
        phone,
        // Format date properly or use null if not provided
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        address,
        membershipType,
        occupation,
        organization,
        educationalQualification,
        reasonForJoining,
        interests,
        otherInterests,
        referredBy,
        status: 'pending',
        ipAddress: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      };

      console.log('Preparing to create submission with data:', JSON.stringify(submissionData, null, 2));

      // Create membership application submission
      const submission = await payload.create({
        collection: 'membership-applications',
        data: submissionData,
      });

      console.log('Membership application created successfully:', submission.id);

      // Also create activity log for this membership application
      await payload.create({
        collection: 'activity-logs',
        data: {
          action: 'create',
          entityType: 'membership-application',
          entityId: submission.id,
          status: 'success',
          details: {
            fullName,
            email,
            membershipType,
            submittedAt: new Date().toISOString(),
          },
        },
      });

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Membership application received successfully',
        id: submission.id,
      });
    } catch (error) {
      console.error('Error processing membership application:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing your application',
      });
    }
  },
}; 
import { PayloadRequest } from 'payload/types';
import { Endpoint } from 'payload/config';
import crypto from 'crypto';

export const generateCertificateEndpoint: Endpoint = {
  path: '/api/generate-certificate',
  method: 'post',
  handler: async (req: PayloadRequest, res) => {
    const { user, payload } = req;
    const { registrationId } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to generate a certificate',
      });
    }

    if (!registrationId) {
      return res.status(400).json({
        success: false,
        message: 'Registration ID is required',
      });
    }

    try {
      // Check if the user is an admin
      const isAdmin = user.role === 'admin';

      // Get the registration
      const registration = await payload.findByID({
        collection: 'event-registrations',
        id: registrationId,
      });

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found',
        });
      }

      // Check if user is authorized (admin or registration belongs to user)
      if (!isAdmin && registration.user !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to generate this certificate',
        });
      }

      // Check if user has attended the event
      if (registration.status !== 'attended') {
        return res.status(400).json({
          success: false,
          message: 'Certificate can only be generated for attended events',
        });
      }

      // Check if certificate already exists
      if (registration.certificateIssued) {
        return res.status(200).json({
          success: true,
          message: 'Certificate has already been generated',
          certificateDetails: registration.certificateDetails,
        });
      }

      // Get the event details
      const event = await payload.findByID({
        collection: 'events',
        id: registration.event,
      });

      // Get the user details
      const attendee = await payload.findByID({
        collection: 'users',
        id: registration.user,
      });

      // Generate a unique certificate ID
      const certificateId = `CERT-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${new Date().getFullYear()}`;

      // Generate certificate URL (in a real implementation, this would create a PDF)
      // For now, we'll just create a unique URL
      const certificateUrl = `/certificates/${certificateId}`;

      // Update the registration with certificate details
      const updatedRegistration = await payload.update({
        collection: 'event-registrations',
        id: registrationId,
        data: {
          certificateIssued: true,
          certificateDetails: {
            certificateId,
            issueDate: new Date(),
            certificateUrl,
          },
        },
      });

      // TODO: In a production environment, you would generate a PDF certificate here
      // For this implementation, we'll just return the certificate details

      return res.status(200).json({
        success: true,
        message: 'Certificate generated successfully',
        certificateDetails: updatedRegistration.certificateDetails,
        event: {
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        },
        attendee: {
          name: attendee.name,
        },
      });
    } catch (error) {
      console.error('Error generating certificate:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while generating the certificate',
      });
    }
  },
}; 
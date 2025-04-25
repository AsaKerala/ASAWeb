import { Endpoint } from 'payload/config';
import payload from 'payload';

export const contactFormEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }

      // Create contact form submission
      const submission = await payload.create({
        collection: 'contact-form-submissions',
        data: {
          name,
          email,
          phone,
          subject,
          message,
          status: 'new',
          ipAddress: req.ip || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
        },
      });

      // Also create activity log for this contact form submission
      await payload.create({
        collection: 'activity-logs',
        data: {
          action: 'create',
          entityType: 'contact-form',
          entityId: submission.id,
          status: 'success',
          details: {
            name,
            email,
            phone,
            subject,
            message,
            submittedAt: new Date().toISOString(),
          },
        },
      });

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Contact form submission received',
        id: submission.id,
      });
    } catch (error) {
      console.error('Error processing contact form submission:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while processing your submission',
      });
    }
  },
}; 
import { PayloadRequest } from 'payload/types';
import { Endpoint } from 'payload/config';

export const registerForEventEndpoint: Endpoint = {
  path: '/api/register-for-event',
  method: 'post',
  handler: async (req: PayloadRequest, res) => {
    const { user, payload } = req;
    const { eventId } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to register for an event',
      });
    }

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    try {
      // Check if the event exists
      const event = await payload.findByID({
        collection: 'events',
        id: eventId,
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      // Check if registration is required for this event
      if (!event.registrationRequired) {
        return res.status(400).json({
          success: false,
          message: 'Registration is not required for this event',
        });
      }

      // Check if event registration is closed (if there's a deadline)
      if (event.registrationDeadline) {
        const deadline = new Date(event.registrationDeadline);
        const now = new Date();
        if (now > deadline) {
          return res.status(400).json({
            success: false,
            message: 'Registration deadline has passed for this event',
          });
        }
      }

      // Check if the event is at capacity
      if (event.capacity > 0) {
        const registrations = await payload.find({
          collection: 'event-registrations',
          where: {
            and: [
              { event: { equals: eventId } },
              {
                or: [
                  { status: { equals: 'confirmed' } },
                  { status: { equals: 'pending' } },
                ],
              },
            ],
          },
        });

        if (registrations.docs.length >= event.capacity) {
          // If at capacity, waitlist the registration
          const registration = await payload.create({
            collection: 'event-registrations',
            data: {
              user: user.id,
              event: eventId,
              status: 'waitlisted',
              paymentStatus: event.ticketPrice > 0 && !event.isFree ? 'pending' : 'not-required',
              registrationDate: new Date(),
            },
          });

          return res.status(200).json({
            success: true,
            waitlisted: true,
            message: 'Event is at capacity. You have been added to the waitlist',
            registration,
          });
        }
      }

      // Check if user is already registered
      const existingRegistration = await payload.find({
        collection: 'event-registrations',
        where: {
          and: [
            { user: { equals: user.id } },
            { event: { equals: eventId } },
          ],
        },
      });

      if (existingRegistration.docs.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You are already registered for this event',
          registration: existingRegistration.docs[0],
        });
      }

      // Create the registration
      const isPaid = event.ticketPrice > 0 && !event.isFree;
      const registration = await payload.create({
        collection: 'event-registrations',
        data: {
          user: user.id,
          event: eventId,
          status: isPaid ? 'pending' : 'confirmed',
          paymentStatus: isPaid ? 'pending' : 'not-required',
          registrationDate: new Date(),
          paymentDetails: isPaid ? {
            amount: event.ticketPrice,
          } : undefined,
        },
      });

      // If this is a free event, update attendees list
      if (!isPaid) {
        const attendees = event.attendees || [];
        if (!attendees.includes(user.id)) {
          attendees.push(user.id);
          
          await payload.update({
            collection: 'events',
            id: eventId,
            data: {
              attendees,
            },
          });
        }
      }

      // Send confirmation email (placeholder for now)
      // TODO: Implement email functionality

      return res.status(200).json({
        success: true,
        message: 'Successfully registered for event',
        registration,
        requiresPayment: isPaid,
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while registering for the event',
      });
    }
  },
}; 
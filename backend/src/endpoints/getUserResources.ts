import { PayloadRequest } from 'payload/types';
import { Endpoint } from 'payload/config';

export const getUserResourcesEndpoint: Endpoint = {
  path: '/api/user-resources',
  method: 'get',
  handler: async (req: PayloadRequest, res) => {
    const { user, payload } = req;
    const { eventId } = req.query;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to access resources',
      });
    }

    try {
      // Check if the user is an admin
      const isAdmin = user.role === 'admin';

      let query: any = {
        user: {
          equals: user.id,
        },
        status: {
          in: ['confirmed', 'attended'],
        },
      };

      // If eventId is provided, filter by that event
      if (eventId) {
        query.event = {
          equals: eventId,
        };
      }

      // Get all events user has registered for with confirmed or attended status
      const registrations = await payload.find({
        collection: 'event-registrations',
        where: query,
        depth: 0, // Don't populate relationships for this query
      });

      if (registrations.docs.length === 0) {
        return res.status(200).json({
          success: true,
          resources: [],
          message: eventId 
            ? 'You have not registered for this event or your registration is not confirmed' 
            : 'You have no confirmed event registrations',
        });
      }

      // Extract event IDs from registrations
      const eventIds = registrations.docs.map(reg => reg.event);

      // Find resources associated with these events
      const resources = await payload.find({
        collection: 'media',
        where: {
          'event': {
            in: eventIds,
          },
        },
        depth: 1, // Populate one level of relationships
      });

      // Get details of the events for context
      const events = await payload.find({
        collection: 'events',
        where: {
          id: {
            in: eventIds,
          },
        },
        depth: 0,
      });

      // Organize resources by event for easier frontend presentation
      const resourcesByEvent = events.docs.map(event => {
        const eventResources = resources.docs.filter(
          resource => resource.event && resource.event.toString() === event.id
        );

        return {
          event: {
            id: event.id,
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate,
          },
          resources: eventResources.map(resource => ({
            id: resource.id,
            filename: resource.filename,
            mimeType: resource.mimeType,
            filesize: resource.filesize,
            url: resource.url,
            alt: resource.alt,
            createdAt: resource.createdAt,
          })),
        };
      });

      return res.status(200).json({
        success: true,
        resourcesByEvent,
        totalResources: resources.docs.length,
      });
    } catch (error) {
      console.error('Error fetching user resources:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching resources',
      });
    }
  },
}; 
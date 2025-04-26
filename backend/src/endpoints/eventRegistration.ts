import { Endpoint } from 'payload/config';
import { PayloadRequest } from 'payload/types';
import { Response, NextFunction } from 'express';

// Register for an event
export const registerForEvent: Endpoint = {
  path: '/events/:id/register',
  method: 'post',
  handler: async (req: PayloadRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { batchIndex } = req.body;
    
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: 'You must be logged in to register for events',
      });
    }
    
    try {
      // First check if event exists
      const event = await req.payload.findByID({
        collection: 'events',
        id,
      });
      
      if (!event) {
        return res.status(404).json({
          message: 'Event not found',
        });
      }
      
      // Check if user is already registered
      const existingRegistrations = await req.payload.find({
        collection: 'event-registrations',
        where: {
          and: [
            { user: { equals: req.user.id } },
            { event: { equals: id } },
            { status: { not_equals: 'cancelled' } },
          ],
        },
      });
      
      if (existingRegistrations.docs.length > 0) {
        return res.status(400).json({
          message: 'You are already registered for this event',
          registration: existingRegistrations.docs[0],
        });
      }
      
      // Create a new registration
      const registration = await req.payload.create({
        collection: 'event-registrations',
        data: {
          user: req.user.id,
          event: id,
          registrationDate: new Date().toISOString(),
          status: 'confirmed',
          batchIndex: typeof batchIndex === 'number' ? batchIndex : undefined,
        },
      });
      
      // Update event attendees (for backward compatibility)
      if (event.attendees) {
        const updatedAttendees = Array.isArray(event.attendees) 
          ? [...event.attendees, req.user.id] 
          : [req.user.id];
        await req.payload.update({
          collection: 'events',
          id,
          data: {
            attendees: updatedAttendees,
          },
        });
      }
      
      // Return the registration
      return res.status(201).json({
        message: 'Registration successful',
        registration,
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      return res.status(500).json({
        message: 'An error occurred while registering for the event',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

// Cancel event registration
export const cancelEventRegistration: Endpoint = {
  path: '/events/:id/register',
  method: 'delete',
  handler: async (req: PayloadRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: 'You must be logged in to cancel a registration',
      });
    }
    
    try {
      // Find the user's registration for this event
      const existingRegistrations = await req.payload.find({
        collection: 'event-registrations',
        where: {
          and: [
            { user: { equals: req.user.id } },
            { event: { equals: id } },
            { status: { not_equals: 'cancelled' } },
          ],
        },
      });
      
      if (existingRegistrations.docs.length === 0) {
        return res.status(404).json({
          message: 'No active registration found for this event',
        });
      }
      
      const registration = existingRegistrations.docs[0];
      
      // Update the registration to cancelled
      const updatedRegistration = await req.payload.update({
        collection: 'event-registrations',
        id: registration.id,
        data: {
          status: 'cancelled',
        },
      });
      
      // Remove from event attendees (for backward compatibility)
      try {
        const event = await req.payload.findByID({
          collection: 'events',
          id,
        });
        
        if (event.attendees && Array.isArray(event.attendees)) {
          const updatedAttendees = event.attendees.filter(
            (attendeeId) => attendeeId !== req.user.id
          );
          
          await req.payload.update({
            collection: 'events',
            id,
            data: {
              attendees: updatedAttendees,
            },
          });
        }
      } catch (error) {
        console.error('Error updating event attendees:', error);
      }
      
      // Return the updated registration
      return res.json({
        message: 'Registration cancelled successfully',
        registration: updatedRegistration,
      });
    } catch (error) {
      console.error('Error cancelling registration:', error);
      return res.status(500).json({
        message: 'An error occurred while cancelling the registration',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

// Get user's registrations
export const getUserRegistrations: Endpoint = {
  path: '/users/me/registrations',
  method: 'get',
  handler: async (req: PayloadRequest, res: Response, next: NextFunction) => {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: 'You must be logged in to view your registrations',
      });
    }
    
    try {
      // Find all user's registrations and populate full event data
      console.log(`Fetching registrations for user: ${req.user.id}`);
      
      const registrations = await req.payload.find({
        collection: 'event-registrations',
        where: {
          user: {
            equals: req.user.id,
          },
        },
        depth: 2, // Populate event details with greater depth
        limit: 100, // Get more registrations at once
      });
      
      console.log(`Found ${registrations.docs.length} registrations for user`);
      
      // Add debugging info about the first registration if available
      if (registrations.docs.length > 0) {
        const firstReg = registrations.docs[0];
        console.log('First registration:', {
          id: firstReg.id,
          event: typeof firstReg.event === 'string' ? 'ID Only: ' + firstReg.event : 'Full Object',
          eventId: typeof firstReg.event === 'string' 
            ? firstReg.event 
            : (firstReg.event && typeof firstReg.event === 'object' && 'id' in firstReg.event 
              ? firstReg.event.id 
              : 'Unknown'),
        });
      }
      
      return res.json(registrations);
    } catch (error) {
      console.error('Error getting user registrations:', error);
      return res.status(500).json({
        message: 'An error occurred while getting your registrations',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};

// Get event registrations (admin only)
export const getEventRegistrations: Endpoint = {
  path: '/events/:id/registrations',
  method: 'get',
  handler: async (req: PayloadRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only administrators can view all event registrations',
      });
    }
    
    try {
      // Find all registrations for this event
      const registrations = await req.payload.find({
        collection: 'event-registrations',
        where: {
          event: {
            equals: id,
          },
        },
        depth: 2, // Populate user details
      });
      
      return res.json(registrations);
    } catch (error) {
      console.error('Error getting event registrations:', error);
      return res.status(500).json({
        message: 'An error occurred while getting event registrations',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
}; 
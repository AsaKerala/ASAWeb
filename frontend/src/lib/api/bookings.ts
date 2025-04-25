import { api } from './index';

/**
 * Interface for Room Booking data
 */
export interface RoomBookingData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  roomType: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  specialRequirements?: string;
  agreeToTerms: boolean;
}

/**
 * Interface for Event Booking data
 */
export interface EventBookingData {
  eventName: string;
  organizerName: string;
  organization: string;
  email: string;
  phone: string;
  eventType: string;
  attendees: string;
  venueSpace: string;
  startDate: string;
  endDate: string;
  requirements?: string;
  agreeToTerms: boolean;
}

/**
 * API handlers for bookings
 */
export const bookingsApi = {
  /**
   * Submit a room booking
   */
  submitRoomBooking: async (data: RoomBookingData) => {
    try {
      const response = await api.post('/api/room-bookings', data);
      return response;
    } catch (error) {
      console.error('Error submitting room booking:', error);
      throw error;
    }
  },

  /**
   * Submit an event booking
   */
  submitEventBooking: async (data: EventBookingData) => {
    try {
      const response = await api.post('/api/event-bookings', data);
      return response;
    } catch (error) {
      console.error('Error submitting event booking:', error);
      throw error;
    }
  },

  /**
   * Get all room bookings (admin only)
   */
  getRoomBookings: async (params?: any) => {
    try {
      const response = await api.get('/api/room-bookings', { params });
      return response;
    } catch (error) {
      console.error('Error fetching room bookings:', error);
      throw error;
    }
  },

  /**
   * Get all event bookings (admin only)
   */
  getEventBookings: async (params?: any) => {
    try {
      const response = await api.get('/api/event-bookings', { params });
      return response;
    } catch (error) {
      console.error('Error fetching event bookings:', error);
      throw error;
    }
  },

  /**
   * Get a single room booking by ID (admin only)
   */
  getRoomBooking: async (id: string) => {
    try {
      const response = await api.get(`/api/room-bookings/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching room booking with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get a single event booking by ID (admin only)
   */
  getEventBooking: async (id: string) => {
    try {
      const response = await api.get(`/api/event-bookings/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching event booking with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update a room booking status (admin only)
   */
  updateRoomBookingStatus: async (id: string, status: string, adminNotes?: string) => {
    try {
      const response = await api.patch(`/api/room-bookings/${id}`, { 
        status,
        ...(adminNotes && { adminNotes })
      });
      return response;
    } catch (error) {
      console.error(`Error updating room booking status with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an event booking status (admin only)
   */
  updateEventBookingStatus: async (id: string, status: string, adminNotes?: string, estimatedCost?: number) => {
    try {
      const response = await api.patch(`/api/event-bookings/${id}`, { 
        status,
        ...(adminNotes && { adminNotes }),
        ...(estimatedCost && { estimatedCost })
      });
      return response;
    } catch (error) {
      console.error(`Error updating event booking status with ID ${id}:`, error);
      throw error;
    }
  }
}; 
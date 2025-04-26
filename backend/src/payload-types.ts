/* 
* This file contains type definitions for the Payload collections 
* These types can be automatically generated with 'payload generate:types'
*/

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'user';
  [key: string]: any;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  location?: string;
  capacity?: number;
  registrationDeadline?: string | Date;
  ticketPrice?: number;
  isFree?: boolean;
  attendees?: string[];
  categories?: string[];
  [key: string]: any;
}

export interface Media {
  id: string;
  alt?: string;
  url?: string;
  mediaType?: 'image' | 'video' | 'document' | 'youtube';
  category?: string;
  event?: string | Event;
  [key: string]: any;
}

export interface EventRegistration {
  id: string;
  user: string | User;
  event: string | Event;
  status: 'pending' | 'confirmed' | 'cancelled' | 'attended';
  paymentStatus?: 'pending' | 'paid' | 'not-required';
  [key: string]: any;
}

export interface RoomBooking {
  id: string;
  user: string | User;
  room: string;
  startTime: string | Date;
  endTime: string | Date;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  [key: string]: any;
}

export interface EventBooking {
  id: string;
  user: string | User;
  event: string | Event;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  [key: string]: any;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
  [key: string]: any;
}

export interface ActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'register' | 'book' | 'cancel' | 'approve' | 'reject' | 'other';
  entityType: 'user' | 'event' | 'room-booking' | 'event-booking' | 'event-registration' | 'program' | 'news' | 'facility' | 'resource' | 'system' | 'youtube-video';
  entityId?: string;
  user?: string | User;
  details?: any;
  status: 'success' | 'failed' | 'pending';
  [key: string]: any;
} 
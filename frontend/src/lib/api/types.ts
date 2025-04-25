export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'website' | 'other';
  url: string;
}

export interface UserProfile {
  profileImage?: Media;
  phone?: string;
  japanExperience?: string;
  japaneseLanguage?: 'none' | 'n5' | 'n4' | 'n3' | 'n2' | 'n1';
  currentOrganization?: string;
  position?: string;
  address?: Address;
  bio?: string;
  socialLinks?: SocialLink[];
}

export interface UserMembership {
  membershipType: 'regular' | 'premium' | 'lifetime' | 'student' | 'honorary';
  membershipStatus: 'active' | 'pending' | 'expired' | 'suspended';
  joinDate?: string;
  renewalDate?: string;
  memberID?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  newsletterSubscription: boolean;
  eventReminders: boolean;
  showProfileInDirectory: boolean;
  directMessagePermission: 'all' | 'connections' | 'none';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  profile?: UserProfile;
  membership?: UserMembership;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  programCategory?: string;
  featuredImage?: Media;
  summary?: string;
  content?: any; // Rich text content
  capacity?: number;
  ticketPrice?: number;
  isFree?: boolean;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  attendees?: string[] | User[];
  categories?: string[] | { id: string; name: string }[];
  relatedFiles?: string[] | Media[];
  createdAt: string;
  updatedAt: string;
  
  // Fields for program structure
  keyFeatures?: {
    duration?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    customLocation?: string;
    isVirtual?: boolean;
    virtualLink?: string;
    eventDate?: string;  // For single-day events
    startDate?: string;  // For multi-day events
    endDate?: string;    // For multi-day events
    certification?: 'yes' | 'no';
    eligibility?: string;
  };
  curriculum?: Array<{
    module: string;
    description?: string;
  }>;
  learningOutcomes?: Array<{
    outcome: string;
  }>;
  programFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    hasScholarships?: boolean;
    scholarshipDetails?: string;
  };
  upcomingBatches?: Array<{
    startDate: string;
    mode?: 'online' | 'offline' | 'hybrid';
    applicationDeadline?: string;
  }>;
  applicationProcess?: Array<{
    step: string;
    description?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    title?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  contactInfo?: {
    email?: string;
    phone?: string;
    brochureFile?: Media;
  };
  
  // Legacy fields for backward compatibility - these will be phased out
  startDate?: string;
  endDate?: string;
  location?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    isVirtual?: boolean;
    virtualLink?: string;
  };
}

export interface EventRegistration {
  id: string;
  user: string | User;
  event: string | Event;
  registrationDate: string;
  status: 'pending' | 'confirmed' | 'attended' | 'cancelled' | 'waitlisted';
  paymentStatus: 'not-required' | 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDetails?: {
    amount?: number;
    paymentDate?: string;
    paymentMethod?: string;
    transactionId?: string;
    notes?: string;
  };
  certificateIssued?: boolean;
  certificateDetails?: {
    certificateId?: string;
    issueDate?: string;
    certificateUrl?: string;
  };
  notes?: string;
  checkInTime?: string;
  feedback?: string;
  attendeeType?: 'regular' | 'speaker' | 'vip' | 'volunteer' | 'organizer';
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  file: Media;
  event?: string | Event;
  isPublic: boolean;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: Media;
  summary?: string;
  content?: any; // Rich text content
  publishedDate?: string;
  author?: string | User;
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: Media;
  summary?: string;
  content?: any; // Rich text content
  startDate?: string;
  endDate?: string;
  location?: string;
  cost?: number;
  isFree?: boolean;
  registrationRequired?: boolean;
  registrationLink?: string;
  categories?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: Media;
  summary?: string;
  content?: any; // Rich text content
  location?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  amenities?: string[];
  bookingInformation?: string;
  images?: Media[];
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  position: 'president' | 'vice-president' | 'secretary' | 'joint-secretary' | 'treasurer' | 'committee-member';
  photo?: Media;
  bio?: string;
  email?: string;
  linkedIn?: string;
  order: number;
  term?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: Media;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Activity Log
export interface ActivityLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'register' | 'book' | 'cancel' | 'approve' | 'reject' | 'other';
  entityType: 'user' | 'event' | 'room-booking' | 'event-booking' | 'event-registration' | 'program' | 'news' | 'facility' | 'resource' | 'system';
  entityId?: string;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  details?: any;
} 
// Program interface
export interface Program {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string | any;
  status?: string;
  category?: string;
  isFeatured?: boolean;
  featuredImage?: {
    id?: string;
    url: string;
    alt?: string;
    sizes?: {
      thumbnail?: { url: string };
      card?: { url: string };
      tablet?: { url: string };
    };
  } | string;
  keyFeatures?: Array<{feature: string} | string>;
  eligibility?: string;
  certification?: string;
  curriculum?: string | Array<{module: string; description: string} | string>;
  learningOutcomes?: string | Array<{outcome: string} | string>;
  programFees?: {
    memberFee?: number;
    nonMemberFee?: number;
    scholarshipInfo?: string;
    memberPrice?: number;
    nonMemberPrice?: number;
    currency?: string;
    hasScholarship?: boolean;
    scholarshipDetails?: string;
  };
  upcomingBatches?: Array<{
    name: string;
    batchName?: string;
    startDate: string;
    endDate?: string;
    mode?: 'online' | 'offline' | 'hybrid';
    capacity?: number;
    application?: string;
    applicationDeadline?: string;
    isFull?: boolean;
    registrationsOpen?: boolean;
  } | string>;
  applicationProcess?: Array<{
    step: string;
    description?: string;
  } | string>;
  testimonials?: Array<{
    quote?: string;
    text?: string;
    name: string;
    title?: string;
    position?: string;
    avatar?: {
      url: string;
    };
    image?: {
      url: string;
    } | string;
  } | string>;
  faqs?: Array<{
    question: string;
    answer: string;
  } | string>;
}

// Event interface
export interface Event {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string | any;
  status?: string;
  eventType?: string;
  isFeatured?: boolean;
  mode?: string;
  featuredImage?: {
    id?: string;
    url: string;
    alt?: string;
    sizes?: {
      thumbnail?: { url: string };
      card?: { url: string };
      tablet?: { url: string };
    };
  } | string;
  keyFeatures?: Array<{
    feature: string;
  } | string>;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  customLocation?: string;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  locationDetails?: string;
  eligibility?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  isRegistrationRequired?: boolean;
  isPublic?: boolean;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  eventFees?: {
    memberPrice?: number;
    nonMemberPrice?: number;
    currency?: string;
    hasDiscount?: boolean;
    discountDetails?: string;
    isFree?: boolean;
    price?: number;
  };
  schedule?: Array<{
    time?: string;
    activity?: string;
    speaker?: string;
    date?: string;
    duration?: string;
    description?: string;
  } | string>;
  speakers?: Array<{
    name: string;
    title?: string;
    bio?: string;
    company?: string;
    expertise?: string;
    image?: {
      url: string;
    } | string;
  } | string>;
  sponsors?: Array<{
    name: string;
    logo?: {
      url: string;
    } | string;
    website?: string;
    level?: string;
  } | string>;
  faqs?: Array<{
    question: string;
    answer: string;
  } | string>;
  gallery?: Array<{
    url: string;
    alt?: string;
  } | string>;
  relatedEvents?: Array<{
    id?: string;
    title?: string;
    slug?: string;
  } | string>;
  tags?: string[];
  categories?: string[];
  seoDescription?: string;
  seoKeywords?: string[];
} 
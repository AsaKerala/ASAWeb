// Program interface
export interface Program {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  status?: string;
  category?: string;
  isFeatured?: boolean;
  featuredImage?: {
    id: string;
    url: string;
    alt?: string;
    sizes?: {
      thumbnail?: { url: string };
      card?: { url: string };
      tablet?: { url: string };
    };
  };
  keyFeatures?: string[];
  eligibility?: string;
  certification?: string;
  curriculum?: string;
  learningOutcomes?: string;
  programFees?: {
    memberFee?: number;
    nonMemberFee?: number;
    scholarshipInfo?: string;
  };
  upcomingBatches?: Array<{
    name: string;
    startDate: string;
    endDate: string;
    mode?: 'online' | 'offline' | 'hybrid';
    capacity?: number;
    application?: string;
    isFull?: boolean;
  }>;
  applicationProcess?: Array<{
    step: string;
    description?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    name: string;
    title?: string;
    avatar?: {
      url: string;
    };
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

// Event interface
export interface Event {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  status?: string;
  eventType?: string;
  isFeatured?: boolean;
  featuredImage?: {
    id: string;
    url: string;
    alt?: string;
    sizes?: {
      thumbnail?: { url: string };
      card?: { url: string };
      tablet?: { url: string };
    };
  };
  keyFeatures?: string[];
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  customLocation?: string;
  eligibility?: string;
  eventFees?: {
    memberFee?: number;
    nonMemberFee?: number;
  };
  schedule?: Array<{
    title: string;
    startTime: string;
    endTime: string;
    description?: string;
    speaker?: string;
  }>;
  speakers?: Array<{
    name: string;
    title?: string;
    bio?: string;
    photo?: {
      url: string;
    };
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
} 
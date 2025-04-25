import path from 'path';
import payload from 'payload';

// Media data needs to be populated first as other collections reference it
const mediaData = [
  {
    filename: 'sample-event-image-1.jpg',
    alt: 'Sample Event Image 1',
    caption: 'Japanese cultural exchange workshop'
  },
  {
    filename: 'sample-event-image-2.jpg',
    alt: 'Sample Event Image 2',
    caption: 'Business delegation meeting'
  },
  {
    filename: 'sample-program-image-1.jpg',
    alt: 'Sample Program Image 1',
    caption: 'Training program in Tokyo'
  },
  {
    filename: 'sample-program-image-2.jpg',
    alt: 'Sample Program Image 2',
    caption: 'Language training workshop'
  },
  {
    filename: 'sample-news-image-1.jpg',
    alt: 'Sample News Image 1',
    caption: 'New partnership announcement'
  },
  {
    filename: 'sample-facility-image-1.jpg',
    alt: 'Sample Facility Image 1',
    caption: 'ASA Kerala headquarters'
  }
];

// Event Categories data
const eventCategoriesData = [
  {
    name: 'Training Programs',
    description: 'Programs focused on management and technical training in Japan and India',
    color: '#BC002D',
  },
  {
    name: 'Language Training',
    description: 'Japanese language courses and cultural language training',
    color: '#4B9CD3',
  },
  {
    name: 'Internships',
    description: 'Professional internship opportunities in Japan and India',
    color: '#F26C4F',
  },
  {
    name: 'Skill Development',
    description: 'Technical skill enhancement and professional development programs',
    color: '#78A22F',
  },
  {
    name: 'Cultural Activities',
    description: 'Cultural exchange events and activities promoting Japanese culture',
    color: '#8E3179',
  },
  {
    name: 'Networking',
    description: 'Business networking and community building events',
    color: '#2D3047',
  },
  {
    name: 'Annual Events',
    description: 'Yearly recurring events and celebrations',
    color: '#FFB400',
  },
  {
    name: 'Webinar',
    description: 'Online learning sessions and virtual meetings',
    color: '#38A3A5',
  }
];

// Resource Categories data
const resourceCategoriesData = [
  {
    name: 'Industry Reports',
    description: 'Reports and analysis on various industries'
  },
  {
    name: 'Training Materials',
    description: 'Learning resources and training guides'
  },
  {
    name: 'Cultural Resources',
    description: 'Information about Japanese culture and customs'
  },
  {
    name: 'Language Resources',
    description: 'Japanese language learning materials'
  }
];

// User data with different roles
const userData = [
  {
    email: 'admin@asakerala.org',
    password: 'Admin@123',
    name: 'Admin User',
    role: 'admin',
    membershipDetails: {
      membershipType: 'lifetime',
      isActive: true,
      renewalDate: new Date(2099, 11, 31)
    }
  },
  {
    email: 'member1@example.com',
    password: 'Member@123',
    name: 'John Doe',
    role: 'member',
    membershipDetails: {
      membershipType: 'annual',
      isActive: true,
      renewalDate: new Date(2024, 11, 31)
    }
  },
  {
    email: 'member2@example.com',
    password: 'Member@123',
    name: 'Jane Smith',
    role: 'member',
    membershipDetails: {
      membershipType: 'annual',
      isActive: true,
      renewalDate: new Date(2024, 10, 15)
    }
  },
  {
    email: 'expired@example.com',
    password: 'Member@123',
    name: 'Expired Member',
    role: 'member',
    membershipDetails: {
      membershipType: 'annual',
      isActive: false,
      renewalDate: new Date(2023, 5, 30)
    }
  }
];

// Events data
const eventsData = [
  {
    title: 'Webinar on Lean Management',
    slug: 'webinar-on-lean-management',
    status: 'published',
    startDate: new Date(2024, 5, 15, 14, 0), // June 15, 2024, 2:00 PM
    endDate: new Date(2024, 5, 15, 16, 0),   // June 15, 2024, 4:00 PM
    location: {
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/samplelink',
    },
    summary: 'A discussion on best practices in Japanese industry.',
    content: '<p>Join us for an informative webinar on Lean Management practices from Japanese industry leaders. Learn how to implement these strategies in your own organization for improved efficiency and productivity.</p><p>Our speakers include experienced professionals who have worked with top Japanese companies.</p>',
    capacity: 100,
    isFree: true,
    registrationRequired: true,
    registrationDeadline: new Date(2024, 5, 14) // June 14, 2024
  },
  {
    title: 'Cultural Exchange Meetup',
    slug: 'cultural-exchange-meetup',
    status: 'published',
    startDate: new Date(2024, 5, 22, 18, 0), // June 22, 2024, 6:00 PM
    endDate: new Date(2024, 5, 22, 20, 0),   // June 22, 2024, 8:00 PM
    location: {
      name: 'ASA Kerala Office',
      address: '123 Main Street',
      city: 'Kochi',
      state: 'Kerala',
      zipCode: '682001',
      isVirtual: false
    },
    summary: 'An opportunity to connect with Japanese professionals and students.',
    content: '<p>Join us for an evening of cultural exchange with Japanese professionals and students. Practice your language skills, learn about Japanese customs, and make valuable connections.</p><p>Light refreshments will be served, featuring Japanese cuisine.</p>',
    capacity: 50,
    isFree: true,
    registrationRequired: true,
    registrationDeadline: new Date(2024, 5, 20) // June 20, 2024
  },
  {
    title: 'Business Delegation to Japan',
    slug: 'business-delegation-japan',
    status: 'published',
    startDate: new Date(2024, 6, 10, 9, 0),  // July 10, 2024, 9:00 AM
    endDate: new Date(2024, 6, 15, 17, 0),   // July 15, 2024, 5:00 PM
    location: {
      name: 'Various Locations',
      city: 'Tokyo',
      state: 'Japan',
      isVirtual: false
    },
    summary: 'Facilitating partnerships between Indian and Japanese businesses.',
    content: '<p>This 5-day business delegation to Tokyo will provide opportunities to meet with Japanese business leaders, visit major companies, and explore partnership opportunities.</p><p>The program includes guided tours, business meetings, and networking events designed to foster Indo-Japanese business relationships.</p>',
    capacity: 20,
    ticketPrice: 150000,
    isFree: false,
    registrationRequired: true,
    registrationDeadline: new Date(2024, 5, 30) // June 30, 2024
  },
  {
    title: 'Japanese Language Workshop - Beginners',
    slug: 'japanese-language-workshop-beginners',
    status: 'published',
    startDate: new Date(2024, 7, 5, 10, 0),  // August 5, 2024, 10:00 AM
    endDate: new Date(2024, 7, 5, 13, 0),    // August 5, 2024, 1:00 PM
    location: {
      name: 'Community Center',
      address: '456 Park Avenue',
      city: 'Trivandrum',
      state: 'Kerala',
      zipCode: '695001',
      isVirtual: false
    },
    summary: 'Introduction to Japanese language for beginners.',
    content: '<p>This workshop is designed for complete beginners who want to learn the basics of Japanese language. You will learn basic greetings, introductions, and simple conversation skills.</p><p>Materials will be provided, and no prior knowledge of Japanese is required.</p>',
    capacity: 30,
    ticketPrice: 500,
    isFree: false,
    registrationRequired: true,
    registrationDeadline: new Date(2024, 7, 3) // August 3, 2024
  }
];

// Programs data
const programsData = [
  {
    title: 'Training Programs in Japan',
    slug: 'training-japan',
    status: 'active',
    category: 'professional-development',
    summary: 'Learn about the latest industrial and management techniques from top Japanese experts.',
    description: '<p>Our flagship training programs in Japan provide opportunities to learn directly from Japanese industry experts. Programs typically range from 2 weeks to 3 months and cover various aspects of Japanese management, manufacturing excellence, and innovation practices.</p><p>Participants will visit leading Japanese companies, attend workshops, and engage in hands-on training sessions.</p>',
    duration: {
      isOngoing: true
    },
    eligibility: '<p>Open to working professionals with at least 3 years of experience. Basic understanding of Japanese language is helpful but not required as translators will be available.</p>',
    requirements: [
      { requirement: 'Valid passport with at least 1 year validity' },
      { requirement: 'Professional experience in relevant field' },
      { requirement: 'Letter of recommendation from current employer' }
    ],
    memberOnly: false
  },
  {
    title: 'Internships & Job Opportunities',
    slug: 'internships',
    status: 'active',
    category: 'professional-development',
    summary: 'Gain exposure to the Japanese work environment through structured internship programs.',
    description: '<p>Our internship programs provide young professionals and students with opportunities to work in Japanese companies. These internships typically last 3-6 months and offer valuable international work experience.</p><p>We partner with Japanese companies looking to hire Indian talent and help facilitate the application and visa process.</p>',
    duration: {
      isOngoing: true
    },
    eligibility: '<p>Open to final year students and recent graduates. Japanese language proficiency (JLPT N3 or higher) is required for most positions.</p>',
    requirements: [
      { requirement: 'University degree or final year student status' },
      { requirement: 'Japanese language proficiency (JLPT N3 or higher)' },
      { requirement: 'Valid passport' }
    ],
    memberOnly: true
  },
  {
    title: 'Language Training',
    slug: 'language-training',
    status: 'active',
    category: 'education',
    summary: 'Enroll in Japanese language courses to enhance career prospects and communication.',
    description: '<p>Our Japanese language courses are designed for various proficiency levels, from complete beginners to advanced learners. We offer both in-person and online classes with certified language instructors.</p><p>Courses include speaking, reading, writing, and listening components, with a focus on practical communication skills.</p>',
    duration: {
      startDate: new Date(2024, 5, 1),
      endDate: new Date(2024, 8, 30),
      isOngoing: false
    },
    eligibility: '<p>Open to all members and non-members. No prior knowledge of Japanese is required for beginner courses.</p>',
    requirements: [
      { requirement: 'Commitment to attend at least 80% of classes' },
      { requirement: 'Purchase of required textbooks' }
    ],
    memberOnly: false
  },
  {
    title: 'Business Networking & Start-up Support',
    slug: 'business-networking',
    status: 'active',
    category: 'professional-development',
    summary: 'Leverage our community to explore new business opportunities.',
    description: '<p>Our networking program connects Indian entrepreneurs and business owners with potential Japanese partners and investors. We organize regular networking events, business matchmaking sessions, and provide mentorship from experienced professionals.</p><p>For startups, we offer guidance on accessing Japanese markets and attracting Japanese investment.</p>',
    duration: {
      isOngoing: true
    },
    eligibility: '<p>Open to business owners, entrepreneurs, and startup founders who are members of ASA Kerala.</p>',
    requirements: [
      { requirement: 'Active membership in ASA Kerala' },
      { requirement: 'Business registration documents' }
    ],
    memberOnly: true
  },
  {
    title: 'Training Programs in India',
    slug: 'training-india',
    status: 'active',
    category: 'education',
    summary: 'Learn from a wide array of ASAK hosted programs for industries and professionals.',
    description: '<p>Our India-based training programs bring Japanese expertise to Kerala. These programs feature visiting Japanese experts who conduct workshops and training sessions on various aspects of Japanese management, quality control, and operational excellence.</p><p>Programs are designed to be accessible without requiring travel to Japan while still providing authentic Japanese knowledge transfer.</p>',
    duration: {
      isOngoing: true
    },
    eligibility: '<p>Open to professionals, students, and organizations interested in Japanese management practices.</p>',
    requirements: [
      { requirement: 'Registration at least one week before the program date' }
    ],
    memberOnly: false
  }
];

// News articles data - Updated to match the News collection schema
const newsData = [
  {
    title: 'ASA Kerala Hosts Business Delegation from Tokyo',
    slug: 'business-delegation-tokyo',
    status: 'published',
    category: 'event-report',
    summary: 'A successful business delegation from Tokyo visited Kerala to explore partnership opportunities.',
    content: '<p>ASA Kerala recently hosted a delegation of business leaders from Tokyo, facilitating meetings with local businesses and government officials. The delegation explored partnership opportunities in IT, manufacturing, and tourism sectors.</p><p>The event was marked by the signing of two MoUs between Japanese and Kerala-based companies.</p>',
    publishedDate: new Date(2024, 3, 15),
    isPublic: true,
    tags: [
      { tag: 'business' },
      { tag: 'delegation' },
      { tag: 'partnerships' }
    ]
  },
  {
    title: 'New Japanese Language Course Announced',
    slug: 'new-japanese-course',
    status: 'published',
    category: 'announcement',
    summary: 'ASA Kerala is launching a new intensive Japanese language course for beginners.',
    content: '<p>ASA Kerala is pleased to announce a new intensive Japanese language course for beginners, starting next month. The course will be conducted by certified instructors and will cover speaking, reading, and writing skills.</p><p>The course is designed for those planning to work or study in Japan, or those interested in Japanese culture and language.</p>',
    publishedDate: new Date(2024, 4, 20),
    isPublic: true,
    tags: [
      { tag: 'language' },
      { tag: 'course' },
      { tag: 'education' }
    ]
  }
];

// Facilities data - Updated to match the Facilities collection schema
const facilitiesData = [
  {
    name: 'Conference Hall',
    slug: 'conference-hall',
    status: 'active',
    type: 'conference-hall',
    description: '<p>A spacious conference hall equipped with modern audiovisual facilities, suitable for large gatherings, conferences, and workshops.</p><p>The hall can be arranged in various seating configurations to accommodate different types of events.</p>',
    location: {
      address: '123 Main Street, Floor 2',
      floor: '2nd Floor',
      buildingName: 'ASA Kerala Building',
      mapLink: 'https://maps.google.com/?q=123+Main+Street+Kochi'
    },
    capacity: 100,
    amenities: [
      { amenity: 'Projector and screen' },
      { amenity: 'Sound system' },
      { amenity: 'Air conditioning' },
      { amenity: 'High-speed internet' },
      { amenity: 'Adjustable lighting' }
    ],
    availabilityHours: [
      { day: 'monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { day: 'saturday', openTime: '10:00', closeTime: '15:00', isClosed: false },
      { day: 'sunday', openTime: '00:00', closeTime: '00:00', isClosed: true }
    ],
    reservationInfo: '<p>To reserve the conference hall, please contact us at least 3 days in advance. Members receive priority booking and discounted rates.</p>',
    memberOnly: false
  },
  {
    name: 'Japanese Library',
    slug: 'japanese-library',
    status: 'active',
    type: 'library',
    description: '<p>Our Japanese library contains a collection of books, magazines, and multimedia resources related to Japan. Resources cover language learning, culture, business, and more.</p><p>The library provides a quiet space for reading and study.</p>',
    location: {
      address: '123 Main Street, Floor 1',
      floor: '1st Floor',
      buildingName: 'ASA Kerala Building',
      mapLink: 'https://maps.google.com/?q=123+Main+Street+Kochi'
    },
    capacity: 30,
    amenities: [
      { amenity: 'Books and magazines in Japanese and English' },
      { amenity: 'Study tables and chairs' },
      { amenity: 'Reference materials' },
      { amenity: 'Wi-Fi' }
    ],
    availabilityHours: [
      { day: 'monday', openTime: '10:00', closeTime: '17:00', isClosed: false },
      { day: 'tuesday', openTime: '10:00', closeTime: '17:00', isClosed: false },
      { day: 'wednesday', openTime: '10:00', closeTime: '17:00', isClosed: false },
      { day: 'thursday', openTime: '10:00', closeTime: '17:00', isClosed: false },
      { day: 'friday', openTime: '10:00', closeTime: '17:00', isClosed: false },
      { day: 'saturday', openTime: '10:00', closeTime: '13:00', isClosed: false },
      { day: 'sunday', openTime: '00:00', closeTime: '00:00', isClosed: true }
    ],
    reservationInfo: '<p>Library resources can be used on-site by all visitors. Members can borrow books for up to 2 weeks.</p>',
    memberOnly: false
  }
];

// Member resources data - Updated to match the MemberResources collection schema
const resourcesData = [
  {
    title: 'Japanese Business Etiquette Guide',
    description: 'Comprehensive guide to Japanese business customs and etiquette.',
    resourceType: 'guide',
    accessLevel: 'all-members',
    publishedDate: new Date(2024, 2, 15),
    status: 'published',
    tags: [
      { tag: 'business' },
      { tag: 'etiquette' },
      { tag: 'guide' }
    ]
  },
  {
    title: 'JLPT N5 Study Materials',
    description: 'Study materials for the Japanese Language Proficiency Test Level N5.',
    resourceType: 'training-material',
    accessLevel: 'all-members',
    publishedDate: new Date(2024, 3, 10),
    status: 'published',
    tags: [
      { tag: 'language' },
      { tag: 'JLPT' },
      { tag: 'study' }
    ]
  },
  {
    title: 'Japanese Investment in Kerala: Opportunities and Challenges',
    description: 'Analysis of current and potential Japanese investment in Kerala.',
    resourceType: 'industry-report',
    accessLevel: 'premium',
    publishedDate: new Date(2024, 4, 5),
    status: 'published',
    tags: [
      { tag: 'investment' },
      { tag: 'report' },
      { tag: 'business' }
    ]
  }
];

// Seed function to populate the database
const seedDatabase = async (): Promise<void> => {
  try {
    // Payload should already be initialized from the server
    console.log('🌱 Starting database seeding...');

    // Create users
    console.log('Creating users...');
    for (const user of userData) {
      try {
        await payload.create({
          collection: 'users',
          data: user
        });
        console.log(`Created user: ${user.email}`);
      } catch (error: any) {
        console.error(`Error creating user ${user.email}:`, error.message);
      }
    }

    // Create media entries
    console.log('Creating media entries...');
    const createdMedia: any[] = [];
    for (const media of mediaData) {
      try {
        const createdMediaItem = await payload.create({
          collection: 'media',
          data: media
        });
        createdMedia.push(createdMediaItem);
        console.log(`Created media: ${media.filename}`);
      } catch (error: any) {
        console.error(`Error creating media ${media.filename}:`, error.message);
      }
    }

    // Create event categories
    console.log('Creating event categories...');
    for (const category of eventCategoriesData) {
      try {
        await payload.create({
          collection: 'event-categories',
          data: category
        });
        console.log(`Created event category: ${category.name}`);
      } catch (error: any) {
        console.error(`Error creating event category ${category.name}:`, error.message);
      }
    }

    // Create resource categories
    console.log('Creating resource categories...');
    const createdResourceCategories: any[] = [];
    for (const category of resourceCategoriesData) {
      try {
        const createdCategory = await payload.create({
          collection: 'resource-categories',
          data: category
        });
        createdResourceCategories.push(createdCategory);
        console.log(`Created resource category: ${category.name}`);
      } catch (error: any) {
        console.error(`Error creating resource category ${category.name}:`, error.message);
      }
    }

    // Create events and link to categories
    console.log('Creating events...');
    for (const event of eventsData) {
      try {
        // Link to a random event category
        const randomCategoryIndex = Math.floor(Math.random() * createdEventCategories.length);
        
        await payload.create({
          collection: 'events',
          data: {
            ...event,
            categories: createdEventCategories.length > 0 ? [createdEventCategories[randomCategoryIndex].id] : undefined,
            featuredImage: createdMedia.length > 0 ? createdMedia[0].id : undefined
          }
        });
        console.log(`Created event: ${event.title}`);
      } catch (error: any) {
        console.error(`Error creating event ${event.title}:`, error.message);
      }
    }

    // Create programs
    console.log('Creating programs...');
    for (const program of programsData) {
      try {
        await payload.create({
          collection: 'programs',
          data: {
            ...program,
            featuredImage: createdMedia.length > 0 ? createdMedia[2].id : undefined
          }
        });
        console.log(`Created program: ${program.title}`);
      } catch (error: any) {
        console.error(`Error creating program ${program.title}:`, error.message);
      }
    }

    // Create news articles
    console.log('Creating news articles...');
    for (const article of newsData) {
      try {
        await payload.create({
          collection: 'news',
          data: {
            ...article,
            featuredImage: createdMedia.length > 0 ? createdMedia[4].id : undefined
          }
        });
        console.log(`Created news article: ${article.title}`);
      } catch (error: any) {
        console.error(`Error creating news article ${article.title}:`, error.message);
      }
    }

    // Create facilities
    console.log('Creating facilities...');
    for (const facility of facilitiesData) {
      try {
        await payload.create({
          collection: 'facilities',
          data: {
            ...facility,
            featuredImage: createdMedia.length > 0 ? createdMedia[5].id : undefined
          }
        });
        console.log(`Created facility: ${facility.name}`);
      } catch (error: any) {
        console.error(`Error creating facility ${facility.name}:`, error.message);
      }
    }

    // Create member resources
    console.log('Creating member resources...');
    for (const resource of resourcesData) {
      try {
        // Link to a random resource category
        const randomCategoryIndex = Math.floor(Math.random() * createdResourceCategories.length);
        
        await payload.create({
          collection: 'member-resources',
          data: {
            ...resource,
            file: createdMedia.length > 0 ? createdMedia[3].id : undefined, // Adding required file field
            categories: createdResourceCategories.length > 0 ? [createdResourceCategories[randomCategoryIndex].id] : undefined
          }
        });
        console.log(`Created resource: ${resource.title}`);
      } catch (error: any) {
        console.error(`Error creating resource ${resource.title}:`, error.message);
      }
    }

    console.log('🌱 Database seeding completed successfully!');
  } catch (error: any) {
    console.error('Error seeding database:', error.message);
  }
};

export default seedDatabase; 
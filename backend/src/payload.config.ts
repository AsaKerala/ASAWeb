import { buildConfig } from 'payload/config';
import path from 'path';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';

// Import collections
import Users from './collections/Users';
import Media from './collections/Media';
import Events from './collections/Events';
import News from './collections/News';
import Programs from './collections/Programs';
import Facilities from './collections/Facilities';
import EventCategories from './collections/EventCategories';
import EventRegistrations from './collections/EventRegistrations';
import CommitteeMembers from './collections/CommitteeMembers';
import Gallery from './collections/Gallery';
import RoomBookings from './collections/RoomBookings';
import EventBookings from './collections/EventBookings';
import { ActivityLogs } from './collections/ActivityLogs';
import ContactForm from './collections/ContactForm';
import Testimonials from './collections/Testimonials';
import MembershipApplication from './collections/MembershipApplication';
import YouTubeVideos from './collections/YouTubeVideos';

// Import globals
import SiteSettings from './globals/SiteSettings';
import MainMenu from './globals/MainMenu';
import Footer from './globals/Footer';

// Import custom endpoints
import { registerForEvent, cancelEventRegistration, getUserRegistrations, getEventRegistrations } from './endpoints/eventRegistration';
import checkAdminEndpoint from './endpoints/checkAdmin';
import { getActivityLogs } from './endpoints/activityLogs';
import { contactFormEndpoint } from './endpoints/contactForm';
import { membershipApplicationEndpoint } from './endpoints/membershipApplication';
import { getMembersEndpoint } from './endpoints/members/getMembers';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:8000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/organization',
  }),
  collections: [
    Users,
    Media,
    Events,
    News,
    Programs,
    Facilities,
    EventCategories,
    EventRegistrations,
    CommitteeMembers,
    Gallery,
    RoomBookings,
    EventBookings,
    ActivityLogs,
    ContactForm,
    Testimonials,
    MembershipApplication,
    YouTubeVideos,
  ],
  globals: [
    SiteSettings,
    MainMenu,
    Footer,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
  ],
  upload: {
    limits: {
      fileSize: 10000000, // 10MB, in bytes
    },
  },
  endpoints: [
    registerForEvent,
    cancelEventRegistration,
    getUserRegistrations,
    getEventRegistrations,
    checkAdminEndpoint,
    getActivityLogs,
    contactFormEndpoint,
    membershipApplicationEndpoint,
    getMembersEndpoint,
  ],
}); 
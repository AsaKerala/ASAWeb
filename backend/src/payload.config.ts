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

// Import globals
import SiteSettings from './globals/SiteSettings';
import MainMenu from './globals/MainMenu';
import Footer from './globals/Footer';

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:8000',
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
}); 
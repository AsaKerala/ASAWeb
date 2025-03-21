# Organization Website Backend

This is the backend for the organization website built with Payload CMS, Express, and MongoDB.

## Features

- Complete CMS for managing website content
- Role-based access control
- Media management system
- Member registration and management
- Event management with RSVP tracking
- Certificate generation
- REST API endpoints

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The server will start at [http://localhost:8000](http://localhost:8000) with the Payload CMS admin panel available at [http://localhost:8000/admin](http://localhost:8000/admin).

## Project Structure

- `src/collections/*` - Database collections/models
- `src/blocks/*` - Reusable content blocks
- `src/globals/*` - Global data settings
- `src/endpoints/*` - Custom API endpoints
- `src/utilities/*` - Helper functions
- `src/access/*` - Access control functions
- `src/auth/*` - Authentication logic
- `src/config/*` - Configuration files
- `uploads/*` - Uploaded media files

## Available Scripts

- `npm run dev` - Runs the server in development mode
- `npm run build` - Builds the app for production
- `npm start` - Runs the built app in production mode
- `npm run seed` - Seeds the database with initial data

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/organization
PAYLOAD_SECRET=your-secret-here
PORT=8000
```

## Database Setup

The backend requires MongoDB. You can run it locally or use a cloud service like MongoDB Atlas.

## Admin User

On first start, Payload will prompt you to create an admin user through the admin panel interface.

## Learn More

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/) 
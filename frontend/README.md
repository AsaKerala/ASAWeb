# Organization Website Frontend

This is the frontend for the organization website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Modern UI with responsive design
- Role-based access for Anonymous, Members, and Admins
- Member dashboard and profiles
- Event registration and management
- Dynamic content rendering from Payload CMS
- Authentication with NextAuth.js

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/*` - All the pages using Next.js App Router
- `src/components/*` - Reusable React components
  - `src/components/ui/*` - UI elements
  - `src/components/layout/*` - Layout components
  - `src/components/forms/*` - Form components
- `src/lib/*` - Utility libraries
  - `src/lib/api/*` - API client
  - `src/lib/auth/*` - Authentication utilities
- `src/utils/*` - Helper functions

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm start` - Runs the built app in production mode
- `npm run lint` - Lints the codebase

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

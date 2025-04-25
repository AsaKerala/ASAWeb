# Organizational Website Project

## Project Overview
A comprehensive organization website with three user roles (Admin, Member, Anonymous), featuring content management, member-specific features, and event management capabilities.

## Technical Architecture

### Frontend
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: React Query + Context API
- UI Components: Headless UI + Radix UI

### Backend/CMS
- CMS Platform: Payload CMS
- Database: MongoDB
- Server: Node.js with Express (integrated with Payload)
- Authentication: JWT + NextAuth.js with email provider

### Deployment
- Docker + Docker Compose for containerization
- Parallel builds for faster container creation
- Optimized health checks and dependency management
- MongoDB container for database
- Mongo Express for database management UI

## User Roles & Access Rights

### Anonymous Users
- View public pages
- View limited course information
- Register for membership
- View public event information

### Members
- All anonymous user privileges
- Personal dashboard access
- Personalized content feed
- RSVP for events
- Download participation certificates
- Renew membership
- Update personal profile

### Admin
- Complete CMS access
- Member management (add/edit/delete)
- Event management (create/edit/delete)
- Gallery management (upload/organize/delete)
- Certificate generation and distribution
- RSVP tracking and management
- Content publishing and editing

## Getting Started

### Method 1: Docker Setup (Recommended)
The easiest way to run the project is using Docker with the provided npm scripts:

```bash
# Setup environment files
npm run setup:env

# Start all services in production mode
npm run docker:up

# For development with hot-reloading
npm run docker:dev:up

# View logs
npm run docker:logs  # or docker:dev:logs for dev mode

# Stop containers
npm run docker:down  # or docker:dev:down for dev mode

# Rebuild containers
npm run docker:build  # or docker:dev:build for dev mode
```

Access the application at:
- Frontend: http://localhost:3000
- Backend Admin: http://localhost:8000/admin
- MongoDB Admin: http://localhost:8081

### Seeding Database with Sample Data
To populate the database with sample data for testing and development:

```bash
# In production mode
docker-compose exec backend npm run seed

# In development mode
docker-compose -f docker-compose.dev.yml exec backend npm run seed
```

This will create sample users, events, programs, news articles, and other content in the database. Default admin user:
- Email: admin@asakerala.org
- Password: Admin@123

For detailed Docker setup instructions, see [DOCKER_README.md](DOCKER_README.md)

### Method 2: Traditional Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Seeding Database (Traditional Setup)
```bash
cd backend
npm run seed
```

## Project Structure
The project is organized as a monorepo with separate frontend and backend directories:

- `/frontend` - Next.js 14 application
- `/backend` - Payload CMS with Express
- `docker-compose.yml` - Docker composition for all services

## License
[MIT](LICENSE) 
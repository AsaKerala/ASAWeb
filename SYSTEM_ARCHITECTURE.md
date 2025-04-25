# ASA Kerala Website - System Architecture

## Overview

The ASA Kerala Website is a modern web application built using a microservices architecture with Docker containerization. The system is designed to serve as the digital platform for the ASA Kerala organization, providing information about training programs, events, facilities, and membership opportunities while facilitating community engagement.

## Architecture Diagram

```
                                 +---------------------+
                                 |      Frontend       |
                                 |    (Next.js App)    |
                                 |    Port: 3000       |
                                 +----------+----------+
                                            |
                                            | HTTP/API Requests
                                            |
                                 +----------v----------+
                                 |      Backend        |
                                 |   (Payload CMS)     |
                                 |    Port: 8000       |
                                 +----------+----------+
                                            |
                                            | Database Queries
                                            |
                 +------------------------+--+------------------------+
                 |                                                   |
      +----------v----------+                        +--------------v--------------+
      |      MongoDB        |                        |      MongoDB Express       |
      |    Database         |                        |   (Database Admin UI)      |
      |   Port: 27017       |                        |        Port: 8081          |
      +---------------------+                        +-----------------------------+
```

## Tech Stack

### Frontend
- **Framework**: Next.js 14.0.3
- **UI Library**: React 18
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Development Environment**: TypeScript, ESLint
- **Date Handling**: date-fns

### Backend
- **CMS Framework**: Payload CMS 2.4.0
- **Server Framework**: Express.js
- **Database Adapter**: MongoDB via @payloadcms/db-mongodb
- **Content Editor**: Slate (@payloadcms/richtext-slate)
- **Authentication**: Built-in Payload authentication with bcrypt
- **Development Environment**: TypeScript, Nodemon

### Database
- **Database System**: MongoDB 5.0
- **Admin Interface**: Mongo Express

### Infrastructure & Deployment
- **Containerization**: Docker with Docker Compose
- **Environment Management**: dotenv for configuration
- **Volume Persistence**: Docker volumes for database and uploads
- **Temporary Frontend Hosting**: Render.com

## Component Details

### 1. Frontend (Next.js Application)

The frontend is a modern, server-side rendered React application built with Next.js. It serves as the user-facing interface of the ASA Kerala website.

**Key Features:**
- Server-side rendering for improved SEO and performance
- Responsive design using TailwindCSS
- API integration with the Payload CMS backend
- Static generation for content-heavy pages
- Dynamic routes for program, event, and news pages
- User dashboard for personalized content access
- Event registration system
- Certificate generation and download

**Directory Structure:**
- `/src/app`: App router implementation with page components
- `/src/components`: Reusable UI components
- `/src/lib`: Shared utilities and API client
- `/src/utils`: Helper functions and utilities

### 2. Backend (Payload CMS)

The backend is powered by Payload CMS, a headless content management system built on Express.js and MongoDB, providing a robust API and admin interface for content management.

**Key Features:**
- RESTful API and GraphQL endpoints
- Admin dashboard for content management
- Authentication and access control
- Media library for asset management
- Content versioning and drafts
- User management with role-based permissions
- Event registration handling
- Resource access control based on user registrations

**Directory Structure:**
- `/src/collections`: Data models and schemas (Users, Events, Programs, etc.)
- `/src/globals`: Global site configurations
- `/src/access`: Access control policies
- `/src/endpoints`: Custom API endpoints
- `/src/blocks`: Reusable content blocks
- `/src/utilities`: Helper functions
- `/src/seed`: Data seeding scripts

**Collections:**
- Users: Member accounts and admin users
- Media: Images and files
- Events: Upcoming and past events
- News: Organization news and updates
- Programs: Training programs and courses
- Facilities: Information about physical facilities
- EventCategories: Categories for events
- EventRegistrations: Tracks user registrations for events
- Resources: Downloadable resources with access control
- Certificates: Generated certificates for event participants

**Globals:**
- SiteSettings: General website configuration
- MainMenu: Navigation structure
- Footer: Footer content and links

### 3. Database (MongoDB)

MongoDB serves as the primary data store for the application, storing all content, user data, and configuration.

**Key Features:**
- Document-oriented NoSQL database
- Flexible schema for content modeling
- Optimized for JSON-like data structures
- High performance and scalability
- Relationship modeling for user-event-resource access

### 4. MongoDB Express

A web-based administrative interface for MongoDB, allowing direct database management and visualization.

## User Dashboard System

The user dashboard is a key feature of the ASA Kerala website, providing personalized access to content based on user registrations and roles.

### Dashboard Architecture

```
+-------------------+      +---------------------+      +----------------------+
|                   |      |                     |      |                      |
| User Registration |----->| Event Registration  |----->| Resource Access      |
|                   |      |                     |      | & Certificate System |
+-------------------+      +---------------------+      +----------------------+
```

### Access Control Flow

1. **User Authentication**:
   - Users register and create accounts
   - JWT-based authentication system for secure access
   - Role-based permissions (admin, member, participant)

2. **Event Registration**:
   - Users register for events through the frontend
   - Registration data stored in EventRegistrations collection
   - Relationships created between User and Event documents

3. **Conditional Resource Access**:
   - Backend API checks user's registration status for requested resources
   - Resources associated with events through relationship fields
   - Access granted only if user has registered for the related event

4. **Certificate Generation**:
   - Certificates generated for users who have completed events
   - PDF generation with user and event details
   - Certificates made available through the user dashboard

### User Dashboard Components

- **Profile Management**: Update personal information
- **My Events**: List of registered events
- **Event Resources**: Access to resources for registered events
- **Certificates**: Download certificates for completed events
- **Notifications**: System updates and event reminders

## Data Flow

1. **Content Creation**:
   - Administrators log in to the Payload CMS admin panel
   - Content is created, edited, or deleted via the admin interface
   - Changes are stored in MongoDB

2. **Content Delivery**:
   - The Next.js frontend requests data from the Payload CMS API
   - Payload CMS processes the request, applies access controls, and retrieves data from MongoDB
   - The API returns JSON data to the frontend
   - Next.js renders the data as HTML content for the user

3. **User Interactions**:
   - Users browse the website, view content, and interact with forms
   - Form submissions and other interactive elements make API calls to the backend
   - The backend processes these requests and updates the database as needed

4. **Event Registration Flow**:
   - User logs in and selects an event to register
   - Frontend sends registration request to backend API
   - Backend creates EventRegistration record with user and event IDs
   - Confirmation sent to user via email and dashboard notification

5. **Resource Access Flow**:
   - User requests resource from dashboard
   - Backend checks if user has registered for the associated event
   - If authorized, resource URL/data is provided to frontend
   - If unauthorized, access denied message is returned

6. **Certificate Generation Flow**:
   - Admin marks event as completed for specific users
   - System generates certificates with user and event details
   - Certificate records created and linked to users
   - Users can download certificates from their dashboard

## Development Environment

The development environment leverages Docker Compose to create a consistent, isolated development setup.

**Development Features:**
- Hot-reloading for both frontend and backend
- Volume mounting for real-time code changes
- Debug mode for the backend with detailed logging
- Development-specific environment variables
- Seeding scripts for populating test data

## Production Environment

The production setup uses optimized Docker containers with production builds of both the frontend and backend.

**Production Features:**
- Optimized builds for performance
- Reduced container sizes
- Health checks to ensure service availability
- Persistence through Docker volumes
- Environment-specific configuration

## Deployment Workflow

1. Configure environment variables for production
2. Build Docker images for all services
3. Start services using Docker Compose
4. Initialize database with seed data if needed
5. Monitor service health and logs

## Temporary Deployment Solution

For the current phase where the client needs to quickly put up event posters and start registration:

1. **Frontend**: Deployed to Render.com for immediate availability
2. **Backend**: To be configured with essential features:
   - Event creation and management
   - User registration system
   - Basic dashboard functionality
3. **Prioritized Features**:
   - Event listing and details
   - Registration form
   - User authentication
   - Admin panel for event management

## Payload CMS Configuration Priorities

To properly configure Payload CMS for the current needs:

1. **User Collection**:
   - Authentication fields (email, password)
   - Profile fields (name, contact info)
   - Role field for permission management

2. **Event Collection**:
   - Title, description, dates, location
   - Registration information
   - Associated resources field
   - Capacity and registration status

3. **EventRegistration Collection**:
   - Relationship to User and Event
   - Registration date
   - Status (pending, confirmed, attended)
   - Payment information if applicable

4. **Resource Collection**:
   - Files or links
   - Relationship to Event
   - Access control fields

5. **Custom Endpoints**:
   - Registration processing
   - Access control verification
   - Certificate generation

## Security Considerations

- CORS configuration to restrict API access
- Environment-based secrets management
- Authentication for admin access
- File upload limits to prevent abuse
- MongoDB authentication with username/password
- Role-based access control for resources
- JWT token validation and expiration

## Scaling Considerations

- Stateless application design allows for horizontal scaling
- Separate MongoDB instance for production environments
- CDN integration for static assets
- Database indexing for performance optimization
- Certificate generation as background tasks

## Monitoring and Maintenance

- Docker health checks for service monitoring
- Container logs for debugging and monitoring
- Database backup through volume management
- Update and upgrade path through Docker image rebuilds

## Integration Points

- API endpoints for headless CMS integration
- Authentication for member access
- Form submissions for user interaction
- Media upload and management
- Third-party services (if applicable)
- Email notification system
- PDF generation for certificates

## Implementation Roadmap

### Phase 1 (Current/Immediate)
- Set up basic frontend with event information
- Configure core Payload CMS collections
- Implement user authentication
- Create event registration functionality

### Phase 2 (Short-term)
- Complete user dashboard implementation
- Set up resource access control
- Implement email notifications
- Add certificate generation

### Phase 3 (Medium-term)
- Enhance UI/UX with refined design
- Implement advanced search and filtering
- Add payment integration if needed
- Set up analytics tracking

### Phase 4 (Long-term)
- Implement all remaining features
- Performance optimization
- Comprehensive testing
- Documentation completion

## Future Architecture Considerations

- Implementing a dedicated search service
- Content caching layer for improved performance
- Microservices for specific functionality
- CI/CD pipeline integration
- Containerized testing framework 
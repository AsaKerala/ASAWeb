# Docker Setup for ASA Website

This document explains how to run the ASA Website project using Docker and Docker Compose.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) (with Docker Compose)
- Git

## Services

The project consists of four Docker services:

1. **Frontend** - Next.js application running on port 3000
2. **Backend** - Payload CMS with Express running on port 8000
3. **MongoDB** - Database running on port 27017
4. **Mongo Express** - MongoDB admin interface running on port 8081

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ASAWeb.git
cd ASAWeb
```

### 2. Environment Setup

Create `.env` files for both frontend and backend using the provided script (works on all platforms):

```bash
npm run setup:env
```

This will copy the example environment files to their proper locations. You can then modify these files to change settings as needed.

### 3. Build and Run with Docker Compose

#### Production Mode

```bash
# Build all images in parallel (faster)
npm run docker:build

# Start all services
npm run docker:up
```

This will build the images (if needed) and start all the services in detached mode.

#### Development Mode

For development with hot-reloading and code mounted from the host:

```bash
# Build all development images in parallel
npm run docker:dev:build

# Start all services in development mode
npm run docker:dev:up
```

Development mode mounts your local code into the containers, allowing you to see changes in real-time without rebuilding.

#### View Logs

To see the logs:

```bash
npm run docker:logs

# or for development mode
npm run docker:dev:logs

# To view logs for a specific service
docker-compose logs -f backend
# or
docker-compose -f docker-compose.dev.yml logs -f backend
```

### 4. Access the services

- Frontend: http://localhost:3000
- Backend (Payload CMS Admin): http://localhost:8000/admin
- MongoDB: mongodb://localhost:27017
- Mongo Express (DB Admin): http://localhost:8081

### 5. Seeding the Database

To populate the database with sample data for development and testing:

```bash
# For production environment
docker-compose exec backend npm run seed

# For development environment
docker-compose -f docker-compose.dev.yml exec backend npm run seed
```

This will create:
- Sample users (including an admin user for CMS access)
- Events with various dates and locations
- Programs in different categories
- News articles
- Facilities and resources

Default admin credentials:
- Email: admin@asakerala.org
- Password: Admin@123

### 6. Stop the services

```bash
npm run docker:down

# or for development mode
npm run docker:dev:down
```

To completely remove all containers, networks, and volumes (this will delete all data):

```bash
npm run docker:clean

# or for development mode
npm run docker:dev:clean
```

## Development Workflow

When developing with Docker:

1. Start services in development mode:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Seed the database (if needed):
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend npm run seed
   ```

3. Make changes to your code locally - the changes will be reflected in real-time thanks to volume mounting and hot-reloading.

4. To install new npm packages:
   ```bash
   # For backend
   docker-compose -f docker-compose.dev.yml exec backend npm install <package_name>
   
   # For frontend
   docker-compose -f docker-compose.dev.yml exec frontend npm install <package_name>
   ```

5. If you need to rebuild containers (e.g., after changing package.json):
   ```bash
   npm run docker:dev:build
   ```

## Performance Optimizations

The Docker setup includes several performance optimizations:

1. **Parallel Building**: The `--parallel` flag is used with Docker Compose build to construct multiple images simultaneously, reducing total build time.
2. **Health Checks**: Each service includes health checks to ensure proper startup sequence.
3. **Dependency Condition Checks**: Services wait for their dependencies to be fully healthy before starting.
4. **Volume Mounts**: In development mode, selective volume mounting prevents unnecessary rebuilds.
5. **Anonymous Volumes**: Node modules are stored in anonymous volumes to improve performance.

## Production Deployment

When deploying to production:

1. Ensure all environment variables are properly set in the `.env` files or directly in `docker-compose.yml`.
2. Use the production Docker Compose file:
   ```bash
   docker-compose up -d
   ```

## Notes

- Data is persisted in Docker volumes (`mongodb_data` and `backend_uploads`)
- The MongoDB admin credentials are defined in the `docker-compose.yml` file
- To change ports or environment variables, edit the `docker-compose.yml` file

## Troubleshooting

- If the frontend can't connect to the backend, make sure the `NEXT_PUBLIC_API_URL` environment variable is set correctly.
- If the backend can't connect to MongoDB, check the `MONGODB_URI` environment variable and ensure MongoDB container is running.
- To inspect a specific container: `docker-compose logs [service_name]` (e.g., `docker-compose logs backend`)
- If you need to reset a service completely:
  ```bash
  docker-compose rm -sf <service_name>
  docker-compose up -d <service_name>
  ``` 
# Hot Reloading Improvements for Docker Development

This document outlines the changes made to improve hot reloading in the Docker development environment for the ASA Kerala website.

## Changes Made

1. **Updated Next.js Configuration** (`frontend/next.config.js`)
   - Added webpack watchOptions with polling enabled
   - Configured onDemandEntries for better page buffer management
   - Set output to 'standalone' for optimized Docker builds

2. **Enhanced Development Script** (`frontend/package.json`)
   - Modified the dev script to listen on all interfaces (0.0.0.0)
   - Explicitly set the port to 3000

3. **Improved Docker Compose Configuration** (`docker-compose.dev.yml`)
   - Added environment variables for file watching: CHOKIDAR_USEPOLLING and WATCHPACK_POLLING
   - Updated volume mounts with the 'delegated' flag for better performance
   - Added stdin_open and tty settings for interactive terminal support

4. **Updated Docker Development File** (`frontend/Dockerfile.dev`)
   - Added necessary development tools
   - Set environment variables to support hot reloading
   - Ensured proper file permissions and directory structure

## Using the Restart Script

To restart your development environment with these new hot reloading improvements:

### Windows
```
.\restart-dev.bat
```

### Linux/Mac
```
./restart-dev.sh
```

This script will:
1. Stop any running Docker containers
2. Rebuild the frontend container with the new hot reloading settings
3. Start the Docker containers in development mode
4. Wait for services to start

## Accessing the Development Environment

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- MongoDB Admin: http://localhost:8081

## Troubleshooting

If hot reloading is still not working correctly:

1. Ensure Docker has sufficient resources allocated (CPU, memory)
2. Check that no file locks or antivirus software is blocking file watching
3. Verify that your editor is saving files properly (some editors may use temporary files)
4. Restart Docker Desktop completely if needed 
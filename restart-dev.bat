@echo off
echo Stopping existing Docker containers...
call npm run docker:dev:down

echo Rebuilding frontend container with hot reloading support...
docker-compose -f docker-compose.dev.yml build frontend

echo Starting Docker containers in development mode...
call npm run docker:dev:up

echo Waiting for services to start...
timeout /t 5 /nobreak > nul

echo Development environment is now running with hot reloading support!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo MongoDB Admin: http://localhost:8081 
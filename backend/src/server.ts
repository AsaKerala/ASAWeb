import express, { Request, Response, NextFunction } from 'express';
import payload from 'payload';
import { config } from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load environment variables
config();

// Determine MongoDB URI - help debug connection issues
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/organization';
// Hide credentials in logs but show host for debugging
const sanitizedMongoURI = mongoURI.replace(/\/\/([^:]+):[^@]+@/, '//***:***@');

console.log('Starting backend server...');
console.log(`MongoDB URI: ${sanitizedMongoURI}`);
console.log(`Payload Secret: ${process.env.PAYLOAD_SECRET ? 'Set (hidden for security)' : 'Not set!'}`);
console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
console.log(`Node Environment: ${process.env.NODE_ENV || 'development'}`);

// Check if we're likely running in Docker (env variable set in docker-compose)
const isDockerEnvironment = process.env.MONGODB_URI?.includes('@mongodb:');
console.log(`Running in Docker: ${isDockerEnvironment ? 'Yes' : 'No'}`);

// Initialize express
const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Add middleware to log API requests
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  next();
});

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Health check endpoint - add early for container health check
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Payload
const start = async () => {
  try {
    console.log('Initializing Payload CMS...');
    
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'your-payload-secret',
      express: app,
      onInit: async () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
    });
    
    console.log('Payload CMS initialized successfully.');

    // Add your own express endpoints
    // Serve static files from uploads directory
    app.use('/assets', express.static(path.resolve(__dirname, '../uploads')));

    // Add a middleware to handle redirects to Cloudinary for media files
    app.get('/api/media/:id/file', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const mediaId = req.params.id;
        
        if (!mediaId) {
          return next();
        }
        
        // Lookup the media file by ID
        const media: any = await payload.findByID({
          collection: 'media',
          id: mediaId,
        });
        
        // If it has a Cloudinary URL, redirect to it
        if (media && typeof media.cloudinaryUrl === 'string') {
          return res.redirect(media.cloudinaryUrl);
        } else if (media && typeof media.url === 'string') {
          // Otherwise use the original URL
          return res.redirect(media.url);
        }
        
        // If not found, continue to next handler
        next();
      } catch (error) {
        console.error('Error retrieving media file:', error);
        next();
      }
    });

    console.log('Static asset route configured at /assets with Cloudinary support.');

    // Error handling
    app.use((err, req, res, next) => {
      console.error('Server error:', err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    // Start the server
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`✅ Server started successfully on port ${PORT}`);
      console.log(`🚀 Admin UI available at http://localhost:${PORT}/admin`);
      console.log(`🔧 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

start(); 
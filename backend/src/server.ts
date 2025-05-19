import express from 'express';
import payload from 'payload';
import { config } from 'dotenv';
import cors from 'cors';
import path from 'path';
import { mediaManagement } from 'payload-cloudinary-plugin';

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

//THE BELOW IS FOR TESTING
const allowedOrigins = ['http://localhost:3000', 'https://asakerala.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you're using cookies/auth headers
}));

// Enable CORS
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   credentials: true,
// }));

// Add middleware to log API requests
app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  next();
});

// Initialize Cloudinary middleware - MUST be before payload.init
app.use(mediaManagement());

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
    app.use('/assets', express.static(path.resolve(__dirname, '../uploads')));
    console.log('Static asset route configured at /assets.');

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
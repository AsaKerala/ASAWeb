import seedDatabase from './seed-data';
import dotenv from 'dotenv';
import payload from 'payload';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// This path should point to your Payload config
const configPath = path.resolve(__dirname, '../payload.config.ts');

const runSeed = async () => {
  try {
    console.log('🌱 Starting the database seeding process...');
    console.log('Using MongoDB URI:', process.env.MONGODB_URI);
    
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'default-secret-key',
      mongoURL: process.env.MONGODB_URI || 'mongodb://localhost/payload-local',
      local: true,
      express: null,
      configPath,
      onInit: async () => {
        // Run the seeder after Payload initializes
        await seedDatabase();
        console.log('✅ Database seeding completed successfully!');
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('❌ Error running seed script:', error);
    process.exit(1);
  }
};

runSeed(); 
import dotenv from 'dotenv';
dotenv.config();

import payload from 'payload';
import path from 'path';
import { cloudinary } from '../services/cloudinary';
import fs from 'fs';

// Define a proper interface for the Media document
interface MediaDoc {
  id: string;
  filename?: string;
  cloudinaryId?: string;
  category?: string;
  [key: string]: any;
}

const migrateToCloudinary = async (): Promise<void> => {
  try {
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'default-secret',
      local: true, // Run in local mode
      onInit: () => {
        console.log('Payload initialized');
      },
    });

    console.log('Migration started...');

    // Get all media files
    const { docs } = await payload.find({
      collection: 'media',
      where: {
        and: [
          {
            mediaType: {
              equals: 'file',
            },
          },
          {
            cloudinaryId: {
              exists: false,
            },
          },
        ],
      },
      limit: 999,
    });

    // Cast docs to our MediaDoc interface
    const mediaFiles = docs as MediaDoc[];
    console.log(`Found ${mediaFiles.length} media files to migrate`);

    // Process files in sequence
    for (const doc of mediaFiles) {
      try {
        // Skip if already has cloudinaryId
        if (doc.cloudinaryId) {
          console.log(`Skipping ${doc.id} - already on Cloudinary`);
          continue;
        }

        // Skip if no filename
        if (!doc.filename) {
          console.log(`Skipping ${doc.id} - no filename`);
          continue;
        }

        // Get file path
        const filePath = path.resolve(__dirname, '../../uploads', doc.filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.log(`File not found for ${doc.id}: ${filePath}`);
          continue;
        }

        console.log(`Uploading ${doc.filename} to Cloudinary...`);

        // Upload to Cloudinary
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
            folder: `asa-kerala/${doc.category || 'general'}`,
            public_id: String(doc.id), // Convert id to string to ensure compatibility
          }, (error, uploadResult) => {
            if (error) {
              console.error('Cloudinary upload failed:', error);
              reject(error);
            } else {
              resolve(uploadResult);
            }
          });
        });

        // Update the document
        if (result) {
          await payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              cloudinaryId: result.public_id,
              cloudinaryUrl: result.secure_url,
              url: result.secure_url,
            },
          });
          console.log(`✅ Migrated ${doc.filename} to Cloudinary`);
        }
      } catch (error) {
        console.error(`Error processing file ${doc.id}:`, error);
      }
    }

    console.log('Migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateToCloudinary(); 
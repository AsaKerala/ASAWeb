const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Get configuration
let config;
try {
  const configPath = path.resolve(__dirname, './bulk-upload-config.js');
  if (fs.existsSync(configPath)) {
    config = require('./bulk-upload-config.js');
  } else {
    console.warn('Configuration file not found. Using example configuration.');
    config = require('./bulk-upload-config.example.js');
  }
} catch (error) {
  console.error('Error loading configuration:', error.message);
  process.exit(1);
}

// Configuration values
const PAYLOAD_URL = config.PAYLOAD_URL;
const API_URL = `${PAYLOAD_URL}/api`;
const EMAIL = config.ADMIN_EMAIL;
const PASSWORD = config.ADMIN_PASSWORD;
const IMAGES_FOLDER = path.resolve(__dirname, config.IMAGES_FOLDER);
const DEFAULT_CATEGORY = config.DEFAULT_CATEGORY;
const USE_CUSTOM_TITLES = config.USE_CUSTOM_TITLES || false;
const CUSTOM_TITLES = config.CUSTOM_TITLES || {};
const ADD_TO_HERO = config.ADD_TO_HERO || false;
const FEATURED_IMAGES = config.FEATURED_IMAGES || [];
const BATCH_SIZE = config.BATCH_SIZE || 5;
const BATCH_DELAY = config.BATCH_DELAY || 1000;

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get authentication token
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: EMAIL,
      password: PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Payload CMS');
  }
}

// Function to upload a single image to Media collection with gallery flag
async function uploadToMedia(filePath, fileName, token) {
  try {
    // Generate a title from the filename or use custom title
    let title;
    if (USE_CUSTOM_TITLES && CUSTOM_TITLES[fileName]) {
      title = CUSTOM_TITLES[fileName];
    } else {
      title = path.basename(fileName, path.extname(fileName))
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word
    }

    // Check if this image should be featured
    const isFeatured = FEATURED_IMAGES.includes(fileName);
    
    // Create form data with all required fields
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('title', title);
    formData.append('mediaType', 'file'); // Explicitly set mediaType to 'file' (not 'youtube')
    formData.append('inGallery', 'true'); // Always add to gallery
    formData.append('inHeroCarousel', ADD_TO_HERO || isFeatured ? 'true' : 'false');
    formData.append('inFacilitiesCarousel', isFeatured ? 'true' : 'false');
    formData.append('category', DEFAULT_CATEGORY);
    
    // Add caption if available (using title as default caption)
    formData.append('caption', title);

    // Upload to Media collection
    const response = await axios.post(`${API_URL}/media`, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `JWT ${token}`,
      },
    });

    console.log(`✓ Uploaded to Media Gallery: ${fileName} (${title})`);
    return response.data;
  } catch (error) {
    console.error(`Failed to upload ${fileName} to Media:`, error.response?.data || error.message);
    throw new Error(`Failed to upload ${fileName} to Media`);
  }
}

// Process a batch of images
async function processBatch(imageFiles, startIndex, token) {
  const endIndex = Math.min(startIndex + BATCH_SIZE, imageFiles.length);
  const batch = imageFiles.slice(startIndex, endIndex);
  const results = { success: 0, error: 0 };

  const promises = batch.map(async (fileName) => {
    const filePath = path.join(IMAGES_FOLDER, fileName);
    try {
      console.log(`Processing: ${fileName}`);
      
      // Upload to Media collection with gallery flag
      await uploadToMedia(filePath, fileName, token);
      
      return { success: true };
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error.message);
      return { success: false };
    }
  });

  const batchResults = await Promise.all(promises);
  
  batchResults.forEach(result => {
    if (result.success) {
      results.success++;
    } else {
      results.error++;
    }
  });

  return results;
}

// Main function to process all images
async function bulkUpload() {
  try {
    // Check if images folder exists
    if (!fs.existsSync(IMAGES_FOLDER)) {
      console.error(`Images folder not found: ${IMAGES_FOLDER}`);
      console.log(`Please create the folder at: ${IMAGES_FOLDER}`);
      return;
    }

    // Get authentication token
    console.log('Authenticating with Payload CMS...');
    const token = await getAuthToken();
    console.log('Authentication successful');

    // Get list of image files
    const files = fs.readdirSync(IMAGES_FOLDER);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log(`No image files found in ${IMAGES_FOLDER}`);
      return;
    }

    console.log(`Found ${imageFiles.length} images to upload to gallery`);
    console.log(`Processing in batches of ${BATCH_SIZE} with ${BATCH_DELAY}ms delay between batches`);

    // Process in batches
    let totalSuccess = 0;
    let totalError = 0;

    for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
      console.log(`\n--- Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imageFiles.length / BATCH_SIZE)} ---`);
      
      const batchResults = await processBatch(imageFiles, i, token);
      
      totalSuccess += batchResults.success;
      totalError += batchResults.error;
      
      // Wait between batches
      if (i + BATCH_SIZE < imageFiles.length) {
        console.log(`Waiting ${BATCH_DELAY}ms before next batch...`);
        await wait(BATCH_DELAY);
      }
    }

    console.log('\n==== UPLOAD SUMMARY ====');
    console.log(`Total images: ${imageFiles.length}`);
    console.log(`Successfully uploaded: ${totalSuccess}`);
    console.log(`Failed: ${totalError}`);
    console.log('========================');

  } catch (error) {
    console.error('Bulk upload failed:', error.message);
  }
}

// Validate configuration before running
function validateConfig() {
  const missing = [];
  if (!EMAIL) missing.push('ADMIN_EMAIL');
  if (!PASSWORD) missing.push('ADMIN_PASSWORD');
  
  if (missing.length > 0) {
    console.error(`Missing required configuration: ${missing.join(', ')}`);
    console.log('Please update the configuration in bulk-upload-config.js');
    return false;
  }
  return true;
}

// Run the script if configuration is valid
if (validateConfig()) {
  console.log('Starting bulk upload process...');
  bulkUpload().catch(console.error);
} else {
  process.exit(1);
} 
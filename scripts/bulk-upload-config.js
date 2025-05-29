// Configuration for the bulk upload script
// Copy this file to 'bulk-upload-config.js' and modify as needed

module.exports = {
  // Payload CMS URL
  PAYLOAD_URL: 'https://asakerala-backend.onrender.com',
  
  // Admin credentials for authentication
  ADMIN_EMAIL: 'admin@asakerala.org',
  ADMIN_PASSWORD: 'Admin@123',
  
  // Path to folder containing images to upload (absolute path or relative to script)
  IMAGES_FOLDER: '../images-to-upload',
  
  // Default category for all images
  // Options: exterior, rooms, training, japanese, facilities, sustainability
  DEFAULT_CATEGORY: 'exterior',
  
  // Allow overriding titles (if false, will generate from filenames)
  USE_CUSTOM_TITLES: false,
  
  // Custom titles mapping (only used if USE_CUSTOM_TITLES is true)
  // Format: { 'filename.jpg': 'Custom Title' }
  CUSTOM_TITLES: {},
  ADD_TO_HERO: false,
  FEATURED_IMAGES: [],
  // Batch size (how many images to process in parallel)
  BATCH_SIZE: 1,
  
  // Delay between batches in milliseconds (to avoid overwhelming the server)
  BATCH_DELAY: 2000,
}; 
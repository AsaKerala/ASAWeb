// Configuration for the bulk upload script
// Copy this file to 'bulk-upload-config.js' and modify as needed

module.exports = {
  // Payload CMS URL
  PAYLOAD_URL: 'http://localhost:8000',
  
  // Admin credentials for authentication
  ADMIN_EMAIL: 'your-admin-email@example.com',
  ADMIN_PASSWORD: 'your-admin-password',
  
  // Path to folder containing images to upload (absolute path or relative to script)
  IMAGES_FOLDER: '../images-to-upload',
  
  // Default category for all images
  // Options: exterior, rooms, training, japanese, facilities, sustainability, other
  DEFAULT_CATEGORY: 'exterior',
  
  // Allow overriding titles (if false, will generate from filenames)
  USE_CUSTOM_TITLES: false,
  
  // Custom titles mapping (only used if USE_CUSTOM_TITLES is true)
  // Format: { 'filename.jpg': 'Custom Title' }
  CUSTOM_TITLES: {},
  
  // Add all images to the hero carousel
  ADD_TO_HERO: false,
  
  // List of specific images to mark as featured and add to hero carousel
  // Format: ['image1.jpg', 'image2.jpg']
  FEATURED_IMAGES: [],
  
  // Batch size (how many images to process in parallel)
  BATCH_SIZE: 5,
  
  // Delay between batches in milliseconds (to avoid overwhelming the server)
  BATCH_DELAY: 1000,
}; 
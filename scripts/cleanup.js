/**
 * Script to cleanup temporary files, binary files, and other artifacts that might cause build issues
 */

const fs = require('fs');
const path = require('path');

// Directories to clean
const DIRECTORIES_TO_CLEAN = [
  'frontend/node_modules/.cache',
  'frontend/.next/cache',
  'backend/node_modules/.cache',
];

// Patterns of files to remove
const FILE_PATTERNS_TO_REMOVE = [
  /\.DS_Store$/,  // macOS system files
  /Thumbs\.db$/,  // Windows thumbnail cache
  /desktop\.ini$/,  // Windows desktop settings
  /\.log$/,       // Log files
];

console.log('Starting cleanup process...');

// Clean up directories
DIRECTORIES_TO_CLEAN.forEach(dir => {
  const fullPath = path.resolve(dir);
  
  try {
    if (fs.existsSync(fullPath)) {
      console.log(`Removing directory: ${fullPath}`);
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✅ Removed: ${fullPath}`);
    } else {
      console.log(`Directory not found (skipping): ${fullPath}`);
    }
  } catch (err) {
    console.error(`❌ Error removing directory ${fullPath}: ${err.message}`);
  }
});

// Function to walk directory and find files matching patterns
function walkDir(dir, callback) {
  try {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filepath = path.join(dir, file);
      const stats = fs.statSync(filepath);
      
      if (stats.isDirectory()) {
        walkDir(filepath, callback);
      } else if (stats.isFile()) {
        callback(filepath);
      }
    });
  } catch (err) {
    console.error(`Error walking directory ${dir}: ${err.message}`);
  }
}

// Remove files matching patterns
let removedCount = 0;

console.log('Scanning for files to remove...');

['frontend', 'backend'].forEach(baseDir => {
  walkDir(baseDir, (filePath) => {
    const shouldRemove = FILE_PATTERNS_TO_REMOVE.some(pattern => pattern.test(filePath));
    
    if (shouldRemove) {
      try {
        console.log(`Removing file: ${filePath}`);
        fs.unlinkSync(filePath);
        removedCount++;
      } catch (err) {
        console.error(`❌ Error removing file ${filePath}: ${err.message}`);
      }
    }
  });
});

console.log(`\n✨ Cleanup complete! Removed ${removedCount} files.`);
console.log('You can now rebuild your Docker containers with:');
console.log('npm run docker:dev:build    (for development)');
console.log('npm run docker:build        (for production)'); 
/**
 * Cross-platform script to set up environment files
 */

const fs = require('fs');
const path = require('path');

// Paths relative to the project root
const SOURCE_FILES = [
  'backend/.env.example',
  'frontend/.env.example'
];

const TARGET_FILES = [
  'backend/.env',
  'frontend/.env'
];

// Function to copy a file
function copyFile(source, target) {
  try {
    // Check if source exists
    if (!fs.existsSync(source)) {
      console.error(`Error: Source file does not exist: ${source}`);
      return false;
    }

    // Create directory if it doesn't exist
    const targetDir = path.dirname(target);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy file
    fs.copyFileSync(source, target);
    console.log(`✅ Copied: ${source} → ${target}`);
    return true;
  } catch (err) {
    console.error(`❌ Error copying ${source} to ${target}: ${err.message}`);
    return false;
  }
}

// Main function
function setupEnv() {
  console.log('Setting up environment files...');
  
  let success = true;
  for (let i = 0; i < SOURCE_FILES.length; i++) {
    const sourceFile = SOURCE_FILES[i];
    const targetFile = TARGET_FILES[i];
    
    if (!copyFile(sourceFile, targetFile)) {
      success = false;
    }
  }
  
  if (success) {
    console.log('\n✨ All environment files set up successfully!');
    console.log('You can now run the Docker containers with:');
    console.log('npm run docker:dev:up    (for development)');
    console.log('npm run docker:up        (for production)');
  } else {
    console.error('\n❌ There were errors setting up the environment files.');
    process.exit(1);
  }
}

// Run the setup
setupEnv(); 
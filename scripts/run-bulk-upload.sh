#!/bin/bash

echo "ASA Web Gallery Bulk Upload Tool"
echo "==============================="
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed or not in your PATH."
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

# Check if required modules are installed
echo "Checking for required npm modules..."
cd "$(dirname "$0")/.."

if [ ! -d "node_modules/axios" ]; then
  echo "Installing required modules..."
  npm install axios form-data --save-dev
fi

# Create images-to-upload directory if it doesn't exist
if [ ! -d "$(dirname "$0")/../images-to-upload" ]; then
  echo "Creating images-to-upload directory..."
  mkdir -p "$(dirname "$0")/../images-to-upload"
  echo "Please place your images in the newly created 'images-to-upload' folder."
  echo "Then run this script again."
  read -p "Press Enter to continue..."
  exit 0
fi

# Check if there are images in the folder
image_count=$(find "$(dirname "$0")/../images-to-upload" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \) | wc -l)
if [ "$image_count" -eq 0 ]; then
  echo "No images found in the 'images-to-upload' folder."
  echo "Please add your images to the folder and run this script again."
  read -p "Press Enter to continue..."
  exit 0
fi

# Check if configuration file exists
if [ ! -f "$(dirname "$0")/bulk-upload-config.js" ]; then
  echo "Configuration file not found."
  echo "Creating from example..."
  cp "$(dirname "$0")/bulk-upload-config.example.js" "$(dirname "$0")/bulk-upload-config.js"
  echo "Please edit the configuration file:"
  echo "$(dirname "$0")/bulk-upload-config.js"
  echo "Set your admin email, password, and other options."
  echo "Then run this script again."
  read -p "Press Enter to continue..."
  exit 0
fi

echo "Running bulk upload script..."
echo
node "$(dirname "$0")/bulkUploadToGallery.js"

echo
echo "Bulk upload completed."
read -p "Press Enter to continue..." 
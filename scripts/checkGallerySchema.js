const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load config
const configPath = path.resolve(__dirname, './bulk-upload-config.js');
let config;

try {
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

async function getCollectionSchema(collection, token) {
  try {
    // Try to get a sample entry from the collection to see its structure
    const response = await axios.get(`${API_URL}/${collection}?limit=1`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    
    console.log(`${collection} collection sample:`, JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error(`Failed to get ${collection} schema:`, error.response?.data || error.message);
    throw new Error(`Failed to get ${collection} schema`);
  }
}

async function createTestGalleryEntry(token) {
  try {
    // Try different formats for the image relationship
    const formats = [
      { format: "Direct ID", data: { title: "Test 1", image: "someMediaId", category: "exterior" } },
      { format: "Object with ID", data: { title: "Test 2", image: { id: "someMediaId" }, category: "exterior" } },
      { format: "Relation Object", data: { title: "Test 3", image: { relationTo: "media", value: "someMediaId" }, category: "exterior" } }
    ];
    
    for (const format of formats) {
      try {
        console.log(`Trying format: ${format.format}`);
        console.log(JSON.stringify(format.data, null, 2));
        
        const response = await axios.post(
          `${API_URL}/gallery`,
          format.data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${token}`,
            },
          }
        );
        
        console.log(`Success with format: ${format.format}`);
        return;
      } catch (error) {
        console.error(`Error with format ${format.format}:`, error.response?.data || error.message);
      }
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

async function main() {
  try {
    // Get authentication token
    console.log('Authenticating with Payload CMS...');
    const token = await getAuthToken();
    console.log('Authentication successful');
    
    // Check Media collection
    console.log('\nChecking Media collection:');
    await getCollectionSchema('media', token);
    
    // Check Gallery collection
    console.log('\nChecking Gallery collection:');
    await getCollectionSchema('gallery', token);
    
    // Try creating a test Gallery entry with different formats
    console.log('\nTrying different formats for Gallery creation:');
    await createTestGalleryEntry(token);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main(); 
# Cloudinary Setup Guide

This guide explains how to set up Cloudinary for media storage with your PayloadCMS backend to solve the issue of media files being lost when the backend server restarts on Render.

## Overview

By using Cloudinary as the storage provider for your media files:

1. Media files are stored in Cloudinary's cloud storage instead of on your Render server
2. Files remain accessible even when your Render server restarts
3. You get CDN benefits for better global access to your media

## Setup Steps

### 1. Create a Cloudinary Account

1. Sign up for a free Cloudinary account at [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. After signing up, you'll be taken to your dashboard where you can find your credentials:
   - Cloud Name
   - API Key
   - API Secret

### 2. Update Environment Variables

Add these variables to your backend environment:

```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### For Local Development:
- These are already added to your `.env` file
- Replace the placeholder values with your actual Cloudinary credentials

#### For Render Deployment:
1. Go to your Render dashboard
2. Select your backend service
3. Navigate to "Environment" tab
4. Add the three environment variables with your Cloudinary credentials
5. Click "Save Changes" and redeploy your service

### 3. Implementation Details

The integration is already set up in your codebase:

1. **Server Configuration**: The Cloudinary middleware is added in `server.ts`
2. **Payload Plugin**: The Cloudinary plugin is added to `payload.config.ts`
3. **Media Collection**: The Media collection is configured to work with Cloudinary

### 4. Testing the Integration

After deployment:

1. Log in to your admin panel
2. Navigate to the Media section
3. Upload a new image or other media file
4. The file should be uploaded to Cloudinary instead of your server
5. Verify this by checking the media details - it should have Cloudinary-specific fields
6. You can also verify by restarting your Render service and confirming the media is still accessible

### 5. Troubleshooting

If you encounter issues:

- Check your server logs for any Cloudinary-related errors
- Verify your environment variables are correctly set
- Ensure the Media collection is properly configured
- Make sure the Cloudinary middleware is loaded before Payload initialization

## Migration of Existing Media

If you have existing media files in your Render server that you want to migrate to Cloudinary:

1. Download your existing media files from Render
2. Re-upload them through the PayloadCMS admin interface
3. The files will be stored in Cloudinary instead of locally

## Cloudinary Free Tier Limitations

The free tier of Cloudinary includes:

- 25GB of storage
- 25GB of monthly bandwidth
- Basic transformations
- 500 monthly transformations

This should be sufficient for a small to medium-sized website. 
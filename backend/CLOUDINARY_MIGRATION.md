# Cloudinary Media Migration Guide

This document explains the migration of media files from local storage to Cloudinary.

## What is Cloudinary?

Cloudinary is a cloud-based media management service that provides solutions for storing, optimizing, and delivering images and videos. Using Cloudinary solves the problem of losing media files when the backend server restarts on services like Render.com that don't provide persistent storage.

## Why Migrate to Cloudinary?

- **Persistent Storage**: Media files are stored in the cloud and won't be lost when the backend server restarts
- **Improved Performance**: Cloudinary optimizes images and serves them through a global CDN
- **Automatic Transformations**: Easily resize, crop, and transform images on-the-fly
- **Reduced Backend Load**: Offloads media storage and delivery from your server

## Prerequisites

Before migrating to Cloudinary, you need to:

1. Create a free Cloudinary account at https://cloudinary.com/
2. Get your Cloudinary credentials (Cloud Name, API Key, API Secret)
3. Update your `.env` file with the Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Migration Process

This codebase includes a migration script that will automatically:

1. Find all media files in the database
2. Upload each file to Cloudinary
3. Update the database records with Cloudinary URLs

To run the migration:

```bash
npm run migrate-to-cloudinary
```

The script will output progress information as it processes each file.

## After Migration

After migration is complete:

1. All existing media files will be available via Cloudinary URLs
2. New uploads will automatically go to Cloudinary
3. Your application will be resilient to server restarts

## Troubleshooting

If you encounter issues with the migration:

1. Check your Cloudinary credentials in the `.env` file
2. Ensure your Cloudinary account has sufficient storage space
3. Verify network connectivity to Cloudinary's API
4. Check the server logs for any specific error messages

### Common Errors:

#### Error: Collection "media" > "upload.handlers" must be an array
This error occurs if the handlers property in the Media collection is not properly defined as an array.
Solution: Update the `handlers` property in `src/collections/Media.ts` to be an array of objects with `name` and `fn` properties.

#### Type errors in migration script
The migration script may encounter type errors with the document properties.
Solution: Ensure proper type checking in the migration script or add explicit type assertions.

## After Migration Verification

After running the migration script, verify that:

1. All media files show a Cloudinary URL in the Payload CMS admin panel
2. Media files can be accessed through both the original URL path and the Cloudinary URL
3. New media uploads automatically get stored in Cloudinary

## Monitoring

You can monitor your Cloudinary usage and manage your media through the Cloudinary dashboard at https://cloudinary.com/console 
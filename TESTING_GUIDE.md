# ASA Kerala Website Testing Guide

This document provides a comprehensive guide to testing the ASA Kerala website functionality in your local development environment.

## Prerequisites

- Docker and Docker Compose installed
- Git repository cloned
- Environment files set up (run `npm run setup:env` if not done already)

## Starting the Development Environment

1. Start all services using Docker Compose:
   ```bash
   npm run docker:dev:up
   ```

2. Seed the database with test data:
   ```bash
   docker-compose -f docker-compose.dev.yml exec backend npm run seed
   ```

## Testing User Authentication

### Regular User Authentication

1. **Access the Frontend**:
   - Open your browser and go to: http://localhost:3000
   - Click "Log In" or navigate to http://localhost:3000/login
   - Use one of the test member accounts:
     - Email: `member1@example.com`
     - Password: `Member@123`

2. **Verify Authentication Success**:
   - You should be redirected to the dashboard
   - Your name should appear in the header
   - You should see personalized content based on your account

3. **Testing Authentication Failure**:
   - Try logging in with incorrect credentials
   - Verify appropriate error messages are displayed

### Admin Authentication

1. **Access the Admin Panel**:
   - In a different browser or incognito window, go to: http://localhost:8000/admin
   - Log in using the admin credentials:
     - Email: `admin@asakerala.org`
     - Password: `Admin@123`

2. **Verify Admin Access**:
   - You should see the Payload CMS dashboard
   - All collections should be accessible
   - You should have full CRUD permissions

## Testing Content Management

### Creating and Editing Events

1. **Create a New Event**:
   - In the admin panel, navigate to "Events"
   - Click "Create New"
   - Fill in the required fields:
     - Title
     - Slug
     - Start and End dates
     - Location details
     - Summary and content
     - Set status to "Published"
   - Save the event

2. **Verify Event Creation**:
   - Go to the frontend (logged in as a regular user)
   - Navigate to the Events page
   - Find your newly created event
   - Verify all details are displayed correctly

3. **Edit an Existing Event**:
   - Return to the admin panel
   - Find the event you created
   - Change some details (title, dates, etc.)
   - Save the changes

4. **Verify Event Updates**:
   - Return to the frontend
   - Refresh or navigate to the Events page
   - Verify the changes are reflected

### User Profile Management

1. **Edit a User Profile**:
   - In the admin panel, navigate to "Users"
   - Find the user you're testing with (e.g., member1@example.com)
   - Edit some profile details:
     - Name
     - Contact information
     - Membership details
   - Save the changes

2. **Verify Profile Updates**:
   - Switch to the frontend browser (logged in as that user)
   - Navigate to the profile page
   - Verify the changes are reflected

## Testing Event Registration System

1. **Register for an Event (Frontend)**:
   - Log in as a regular user
   - Navigate to the Events page
   - Find an event with registration enabled
   - Click "Register" or "Join Event"
   - Complete any required registration form
   - Submit the registration

2. **Verify Registration in Admin Panel**:
   - Switch to the admin panel
   - Navigate to "Event Registrations"
   - Find the registration for the user and event
   - Verify all details are correct

3. **Update Registration Status**:
   - In the admin panel, edit the registration
   - Change the status (e.g., from "pending" to "confirmed")
   - Save the changes

4. **Verify Status Update in Frontend**:
   - Return to the frontend
   - Navigate to "My Events" in the dashboard
   - Verify the updated registration status is displayed

## Testing Certificate Generation

1. **Mark Event Attendance**:
   - In the admin panel, navigate to "Event Registrations"
   - Find or create a registration for the member you're logged in as
   - Edit the registration and set:
     - Status to "attended"
     - Save the changes

2. **Generate Certificate**:
   - Edit the registration again and set:
     - `certificateIssued` to `true`
     - Add certificate details:
       - Certificate ID (e.g., `CERT-ABC123-2023`)
       - Issue date (current date)
       - Certificate URL (e.g., `/certificates/CERT-ABC123-2023`)
     - Save the changes

3. **Verify Certificate in Frontend**:
   - Switch to the frontend browser
   - Navigate to the certificates page at `/dashboard/certificates`
   - Verify the certificate appears in the list
   - Click "View Certificate" to check the certificate view

4. **Test Certificate Generation Endpoint**:
   - Navigate to `/dashboard/certificates/[event-registration-id]/generate`
   - Verify the certificate generation process
   - Confirm the certificate appears in the list after generation

## Testing Resource Access

1. **Create Resources with Access Control**:
   - In the admin panel, navigate to "Resources" (or "Member Resources")
   - Create a new resource with:
     - Title and description
     - Upload or link to a file
     - Set access control to require event registration
     - Associate with a specific event
     - Save the resource

2. **Test Access as Registered User**:
   - In the frontend, log in as a user registered for the associated event
   - Navigate to the resources section
   - Verify the resource is visible and accessible
   - Download or view the resource

3. **Test Access Restrictions**:
   - Log in as a different user not registered for the event
   - Navigate to the resources section
   - Verify the resource is either not visible or shows access denied

## Testing User Dashboard

1. **Test Dashboard Overview**:
   - Log in as a regular user
   - Navigate to the dashboard
   - Verify all dashboard sections load correctly
   - Check that user-specific information is displayed

2. **Test Notifications**:
   - Navigate to the notifications section
   - Verify notifications are displayed
   - Test notification filters if available
   - Test notification preference settings

3. **Test My Events Section**:
   - Navigate to the My Events section
   - Verify upcoming and past events are correctly categorized
   - Test event filtering and search functionality
   - Verify event details are displayed correctly

4. **Test Certificate Section**:
   - Navigate to the certificates section
   - Verify certificates are listed correctly
   - Test certificate filtering
   - Test certificate download functionality

## Database Inspection

1. **Access MongoDB Express**:
   - Open your browser and go to: http://localhost:8081
   - Navigate through the database collections
   - Inspect records for:
     - Users
     - Events
     - Event Registrations
     - Certificates
     - Resources

2. **Verify Data Integrity**:
   - Check relationships between collections
   - Verify document structures match expected schemas
   - Confirm changes made through the UI are reflected in the database

## Cross-browser Testing

1. **Test on Multiple Browsers**:
   - Chrome
   - Firefox
   - Edge (if available)
   - Verify functionality works consistently across browsers

2. **Test Responsive Design**:
   - Use browser developer tools to test different screen sizes
   - Verify the layout adjusts appropriately for:
     - Mobile devices
     - Tablets
     - Desktop screens

## Performance Testing

1. **Test Page Load Times**:
   - Use browser developer tools to measure page load times
   - Check network requests for any slow-loading resources
   - Verify image optimizations are working

2. **Test Form Submissions**:
   - Submit forms with both valid and invalid data
   - Verify appropriate validation messages
   - Check submission processing time

## Clean Up

When finished testing:

1. Stop all services:
   ```bash
   npm run docker:dev:down
   ```

2. To completely clean up (deletes all data):
   ```bash
   npm run docker:dev:clean
   ```

## Additional Tips

1. **Using Different Browsers**: To maintain separate sessions easily, use Chrome for the admin panel and Firefox (or Edge) for the frontend user.

2. **Testing Tools**:
   - Use browser developer tools for debugging
   - Check console for JavaScript errors
   - Use network inspector to verify API calls

3. **Log Files**: Check Docker logs for any backend errors:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f backend
   ```

4. **Troubleshooting**:
   - If the frontend can't connect to the backend, check the `.env.local` file
   - For database connection issues, check MongoDB logs
   - For authentication issues, verify JWT secret is consistent 
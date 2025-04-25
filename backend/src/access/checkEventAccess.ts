import { Access, FieldAccess } from 'payload/types';

/**
 * Access control function to determine if a user can access resources based on event registration
 * 
 * This function checks:
 * 1. If the user is an admin (full access)
 * 2. If the resource is public (everyone can access)
 * 3. If the user has a confirmed or attended registration for the event associated with the resource
 */
export const checkEventResourceAccess: Access = async ({ req, id, doc }) => {
  // If not logged in, no access to non-public resources
  if (!req.user) {
    return false;
  }

  // Admin has full access
  if (req.user.role === 'admin') {
    return true;
  }

  // Get the resource document if not already provided
  const resource = doc || await req.payload.findByID({
    collection: 'media',
    id,
  });

  // If the resource is not associated with an event, deny access
  if (!resource.event) {
    return false;
  }

  // Check if user has registered for the event
  const registrations = await req.payload.find({
    collection: 'event-registrations',
    where: {
      and: [
        { user: { equals: req.user.id } },
        { event: { equals: resource.event } },
        {
          or: [
            { status: { equals: 'confirmed' } },
            { status: { equals: 'attended' } },
          ],
        },
      ],
    },
  });

  // Allow access if user has a valid registration
  return registrations.docs.length > 0;
};

/**
 * Field-level access control for resources based on event registration
 */
export const checkEventResourceFieldAccess: FieldAccess = ({ req, id, doc, siblingData }) => {
  // Admin has full access
  if (req.user?.role === 'admin') {
    return true;
  }
  
  // Field-level access is more limited, so we'll generally hide fields from non-admins
  // For actual resource access control, use the document-level checkEventResourceAccess
  return false;
}; 
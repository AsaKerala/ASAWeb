import { Access } from 'payload/config';
import { User } from '../payload-types';

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true if user has role of 'admin'
  return Boolean(user?.role === 'admin');
};

export const isAdminOrSelf = ({ req: { user }, id }) => {
  // Return true if user has role of 'admin'
  // or if the logged in user is the document being edited
  if (user) {
    if (user.role === 'admin') return true;
    if (user.id === id) return true;
  }

  return false;
};

export const isAdminOrBelongsToUserRelation = ({ relationField }: { relationField: string }): Access => 
  ({ req: { user } }) => {
    // If there's no user, return false
    if (!user) return false;

    // If user is admin, allow
    if (user.role === 'admin') return true;

    // Otherwise, only allow if document references the logged-in user
    return {
      [relationField]: {
        equals: user.id,
      },
    };
  };

export const isAdminOrHasAccessToActivity: Access = ({ req: { user } }) => {
  // Admin has access to all activity logs
  if (user?.role === 'admin') return true;
  
  // Non-admin users can only see their own activity logs
  if (user) {
    return {
      user: {
        equals: user.id,
      },
    };
  }
  
  // No user = no access
  return false;
}; 
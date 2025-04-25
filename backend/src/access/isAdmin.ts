import { Access } from 'payload/types';

// Check if the user is an admin
export const isAdmin: Access = ({ req }) => {
  const { user } = req || {};
  if (user && user.role === 'admin') return true;
  return false;
};

// Check if the user is an admin or the user themselves
export const isAdminOrSelf: Access = ({ req }) => {
  const { user } = req || {};
  const id = req?.params?.id;
  
  if (!user) return false;
  
  // Admin can access all
  if (user.role === 'admin') return true;
  
  // Users can access their own data
  if (id && user.id === id) return true;
  
  // For list endpoints, return only the user's own document
  if (!id) {
    return {
      id: {
        equals: user.id,
      },
    };
  }
  
  return false;
};

// Check if the user is authenticated (can be any role)
export const isAuthenticated: Access = ({ req }) => {
  const { user } = req || {};
  return Boolean(user);
};

// Check if user is a member (either regular member or admin)
export const isMember: Access = ({ req }) => {
  const { user } = req || {};
  return Boolean(user && (user.role === 'member' || user.role === 'admin'));
};

// Only allow active members (useful for member-only features)
export const isActiveMember: Access = ({ req }) => {
  const { user } = req || {};
  
  if (!user) return false;
  
  // Admins always have access
  if (user.role === 'admin') return true;
  
  // For members, check if their membership is active
  return Boolean(
    user.role === 'member' && 
    user.membership?.membershipStatus === 'active'
  );
}; 
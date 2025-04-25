import { PayloadRequest } from 'payload/types';

/**
 * Utility function to check if a user has a specific role
 * @param {PayloadRequest} req - The Payload request object
 * @param {string} role - The role to check for
 * @returns {boolean} - Whether the user has the specified role
 */
export const checkRole = (req: PayloadRequest, role: string): boolean => {
  // Must have a user
  if (!req.user) return false;
  
  // Check if the user has the specified role
  return req.user.role === role;
};

/**
 * Utility function to check if a user is an admin
 * @param {PayloadRequest} req - The Payload request object
 * @returns {boolean} - Whether the user is an admin
 */
export const checkAdmin = (req: PayloadRequest): boolean => {
  return checkRole(req, 'admin');
};

/**
 * Utility function to check if a user is a member
 * @param {PayloadRequest} req - The Payload request object
 * @returns {boolean} - Whether the user is a member
 */
export const checkMember = (req: PayloadRequest): boolean => {
  return checkRole(req, 'member');
}; 
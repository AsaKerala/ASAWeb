import { Endpoint } from 'payload/config';
import { PayloadRequest } from 'payload/types';

/**
 * Endpoint to check if the authenticated user has admin access
 */
const checkAdminEndpoint: Endpoint = {
  path: '/check-admin',
  method: 'get',
  handler: async (req: PayloadRequest, res) => {
    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({
          isAdmin: false,
          message: 'Unauthorized',
        });
      }

      // Check if the user has the 'admin' role
      const isAdmin = req.user.role === 'admin';

      return res.status(200).json({
        isAdmin,
        message: isAdmin ? 'User has admin access' : 'User does not have admin access',
      });
    } catch (error) {
      console.error('Error checking admin access:', error);
      return res.status(500).json({
        isAdmin: false,
        message: 'An error occurred while checking admin access',
      });
    }
  },
};

export default checkAdminEndpoint; 
import { Endpoint } from 'payload/config';
import { isAuthenticated } from '../../access/isAdmin';

/**
 * This endpoint returns a list of members for the member directory
 * Access is restricted to authenticated users, and only returns members
 * who have opted to show their profile in the directory
 */
export const getMembersEndpoint: Endpoint = {
  path: '/members/directory',
  method: 'get',
  handler: async (req, res, next) => {
    const { payload } = req;
    
    try {
      // First, verify the user is authenticated
      if (!req.user) {
        return res.status(401).json({
          message: 'Unauthorized. You must be logged in to access the member directory.',
        });
      }
      
      // Query members who have opted to be in the directory
      const result = await payload.find({
        collection: 'users',
        where: {
          and: [
            { 
              role: { 
                equals: 'member'
              }
            },
            {
              'membership.membershipStatus': {
                equals: 'active'
              }
            },
            {
              'preferences.showProfileInDirectory': {
                equals: true
              }
            }
          ]
        },
        // Sort by name
        sort: 'name',
        // Pagination
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      });
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching members directory:', error);
      return res.status(500).json({
        message: 'An error occurred while retrieving member directory.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
}; 
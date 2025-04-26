import { PayloadRequest } from 'payload/types';
import { logActivity } from '../utilities/activityLogger';

/**
 * Auth hooks to log authentication activities
 */
export const authHooks = {
  /**
   * Hook that runs after a successful login
   */
  afterLogin: async ({ req, user }: { req: PayloadRequest; user: any }): Promise<void> => {
    // Log the login activity
    await logActivity(req.payload, {
      action: 'login',
      entityType: 'user',
      entityId: user.id,
      userId: user.id,
      req,
      details: {
        message: `User ${user.email} logged in`,
      },
    });
  },

  /**
   * Hook that runs after a successful logout
   */
  afterLogout: async ({ req }: { req: PayloadRequest }): Promise<void> => {
    if (req.user) {
      const user = req.user;
      // Log the logout activity
      await logActivity(req.payload, {
        action: 'logout',
        entityType: 'user',
        entityId: user.id,
        userId: user.id,
        req,
        details: {
          message: `User ${user.email} logged out`,
        },
      });
    }
  },

  /**
   * Hook that runs after a user is created
   */
  afterUserCreate: async ({ req, doc }: { req: PayloadRequest; doc: any }): Promise<void> => {
    // Log the user creation
    await logActivity(req.payload, {
      action: 'create',
      entityType: 'user',
      entityId: doc.id,
      userId: req.user?.id, // Creator ID (admin or self-registration)
      req,
      details: {
        message: `User account created for ${doc.email}`,
      },
    });
  },

  /**
   * Hook that runs after a user is updated
   */
  afterUserUpdate: async ({ req, doc, previousDoc }: { req: PayloadRequest; doc: any; previousDoc: any }): Promise<void> => {
    // Skip logging if no changes were made
    if (JSON.stringify(doc) === JSON.stringify(previousDoc)) {
      return;
    }

    // Determine what fields were updated
    const updatedFields: string[] = [];
    Object.keys(doc).forEach(key => {
      if (['updatedAt', 'createdAt'].includes(key)) return;
      
      if (JSON.stringify(doc[key]) !== JSON.stringify(previousDoc[key])) {
        updatedFields.push(key);
      }
    });

    // Log the user update
    await logActivity(req.payload, {
      action: 'update',
      entityType: 'user',
      entityId: doc.id,
      userId: req.user?.id,
      req,
      details: {
        message: `User profile updated for ${doc.email}`,
        updatedFields,
      },
    });
  },
}; 
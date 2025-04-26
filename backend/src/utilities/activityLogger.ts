import { Payload } from 'payload';
import { Request } from 'express';

export interface ActivityLogParams {
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'register' | 'book' | 'cancel' | 'approve' | 'reject' | 'other';
  entityType: 'user' | 'event' | 'room-booking' | 'event-booking' | 'event-registration' | 'program' | 'news' | 'facility' | 'resource' | 'system' | 'youtube-video';
  entityId?: string;
  userId?: string;
  details?: any;
  status?: 'success' | 'failed' | 'pending';
  req?: Request;
}

/**
 * Log an activity in the system
 */
export const logActivity = async (payload: Payload, params: ActivityLogParams): Promise<void> => {
  try {
    const { action, entityType, entityId = null, userId = null, details = null, status = 'success', req = null } = params;
    
    // Prepare log data
    const logData: any = {
      action,
      entityType,
      status,
    };
    
    // Add entity ID if provided
    if (entityId) {
      logData.entityId = entityId;
    }
    
    // Add user relation if we have a user ID
    if (userId) {
      logData.user = userId;
    }
    
    // Add details if provided
    if (details) {
      logData.details = details;
    }
    
    // Add IP and user agent if request is provided
    if (req) {
      // Get IP from request, accounting for proxies
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (ip) {
        logData.ip = Array.isArray(ip) ? ip[0] : ip;
      }
      
      // Get user agent
      const userAgent = req.headers['user-agent'];
      if (userAgent) {
        logData.userAgent = userAgent;
      }
    }
    
    // Create the activity log
    await payload.create({
      collection: 'activity-logs',
      data: logData,
    });
    
    console.log(`Activity logged: ${action} ${entityType} ${entityId || ''}`);
  } catch (error) {
    console.error('Error logging activity:', error);
    // We don't want to throw errors from the logger as it could disrupt the main flow
  }
};

/**
 * Create a middleware that logs an activity
 */
export const createActivityLogMiddleware = (params: Omit<ActivityLogParams, 'req'>) => {
  return async (req, res, next) => {
    try {
      // Get user ID from the authenticated user
      const userId = req.user?.id;
      
      // Log the activity
      await logActivity(req.payload, {
        ...params,
        userId,
        req,
      });
      
      next();
    } catch (error) {
      // Log error but continue with the request
      console.error('Error in activity log middleware:', error);
      next();
    }
  };
}; 
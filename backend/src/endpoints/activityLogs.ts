import { Endpoint } from 'payload/config';
import { PayloadRequest } from 'payload/types';
import { Response, NextFunction } from 'express';
import { logActivity } from '../utilities/activityLogger';

/**
 * Get system activity logs
 * Admin users can see all logs, regular users can only see their own logs
 */
export const getActivityLogs: Endpoint = {
  path: '/activity-logs',
  method: 'get',
  handler: async (req: PayloadRequest, res: Response, next: NextFunction) => {
    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({
        message: 'You must be logged in to view activity logs',
      });
    }
    
    try {
      const isAdmin = req.user.role === 'admin';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const sort = req.query.sort || '-createdAt'; // Default sort by newest
      
      // Build query
      const query: any = {};
      
      // If not admin, only show own logs
      if (!isAdmin) {
        query.user = {
          equals: req.user.id,
        };
      }
      
      // Apply filters if provided
      if (req.query.action) {
        query.action = {
          equals: req.query.action,
        };
      }
      
      if (req.query.entityType) {
        query.entityType = {
          equals: req.query.entityType,
        };
      }
      
      if (req.query.entityId) {
        query.entityId = {
          equals: req.query.entityId,
        };
      }
      
      if (req.query.status) {
        query.status = {
          equals: req.query.status,
        };
      }
      
      // Date range filter
      if (req.query.startDate) {
        if (!query.createdAt) query.createdAt = {};
        query.createdAt.greater_than_equal = new Date(req.query.startDate as string).toISOString();
      }
      
      if (req.query.endDate) {
        if (!query.createdAt) query.createdAt = {};
        query.createdAt.less_than_equal = new Date(req.query.endDate as string).toISOString();
      }
      
      // Execute query
      const logs = await req.payload.find({
        collection: 'activity-logs',
        where: query,
        sort: sort as string,
        page,
        limit,
        depth: 1, // Include user information
      });
      
      // Log this activity for audit purposes
      await logActivity(req.payload, {
        action: 'other',
        entityType: 'system',
        userId: req.user.id,
        details: { message: 'Viewed activity logs' },
        req,
      });
      
      return res.json(logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return res.status(500).json({
        message: 'An error occurred while fetching activity logs',
        error: error.message,
      });
    }
  },
}; 
/**
 * Groups Controller
 * 
 * Thin HTTP layer for group operations
 * All business logic delegated to service layer
 * 
 * 8 endpoints:
 * 1. getMyGroups - GET /groups/my-groups
 * 2. getDiscoveredGroups - GET /groups/discover
 * 3. getGroupInvites - GET /groups/invites
 * 4. getGroupSchedule - GET /groups/schedule
 * 5. createGroup - POST /groups
 * 6. joinGroup - POST /groups/:id/join
 * 7. leaveGroup - POST /groups/:id/leave
 * 8. acceptInvite - POST /groups/:id/accept-invite
 * 9. rejectInvite - POST /groups/:id/reject-invite (bonus)
 */

import {
  getMyGroupsService,
  getDiscoveredGroupsService,
  createGroupService,
  joinGroupService,
  leaveGroupService,
  getGroupInvitesService,
  acceptInviteService,
  rejectInviteService,
  getGroupScheduleService,
} from '../services/group.service.js';

/**
 * GET /api/groups/my-groups
 * 
 * Get all groups where user is a member
 * 
 * Query parameters:
 * - page: number (default 1)
 * - limit: number (default 50)
 * 
 * Response: (200 OK)
 * {
 *   groups: Array<Group>,
 *   total: number,
 *   page: number,
 *   pages: number
 * }
 * 
 * Requires: Authentication
 */
export const getMyGroups = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await getMyGroupsService(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Get my groups error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'GET_MY_GROUPS_ERROR',
    });
  }
};

/**
 * GET /api/groups/discover
 * 
 * Get public groups user is not a member of
 * 
 * Query parameters:
 * - page: number (default 1)
 * - limit: number (default 50)
 * - search: string (optional, for future search feature)
 * 
 * Response: (200 OK)
 * {
 *   groups: Array<Group>,
 *   total: number,
 *   page: number,
 *   pages: number
 * }
 * 
 * Requires: Authentication
 */
export const getDiscoveredGroups = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await getDiscoveredGroupsService(
      userId,
      parseInt(page),
      parseInt(limit)
    );

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Get discovered groups error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'DISCOVER_GROUPS_ERROR',
    });
  }
};

/**
 * POST /api/groups
 * 
 * Create a new group
 * User creating the group becomes admin automatically
 * 
 * Request body:
 * {
 *   name: string (required),
 *   description: string (optional),
 *   privacy: 'public' | 'private' (required),
 *   avatar: string (optional, Cloudinary URL)
 * }
 * 
 * Response: (201 Created)
 * {
 *   _id: string,
 *   name: string,
 *   description: string,
 *   privacy: string,
 *   avatar: string | null,
 *   createdBy: string,
 *   memberCount: number,
 *   messageCount: number,
 *   isActive: boolean,
 *   createdAt: Date
 * }
 * 
 * Requires: Authentication
 */
export const createGroup = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const { name, description, privacy, avatar } = req.body;

    const newGroup = await createGroupService(userId, {
      name,
      description,
      privacy,
      avatar,
    });

    return res.status(201).json(newGroup);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Create group error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'CREATE_GROUP_ERROR',
    });
  }
};

/**
 * POST /api/groups/:id/join
 * 
 * Join a public group
 * 
 * URL parameters:
 * - id: group ID (MongoDB ObjectId)
 * 
 * Response: (200 OK)
 * {
 *   _id: string,
 *   name: string,
 *   ...group fields...,
 *   memberCount: number
 * }
 * 
 * Requires: Authentication
 */
export const joinGroup = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id: groupId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const updatedGroup = await joinGroupService(userId, groupId);

    return res.status(200).json(updatedGroup);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Join group error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'JOIN_GROUP_ERROR',
    });
  }
};

/**
 * POST /api/groups/:id/leave
 * 
 * Leave a group
 * 
 * URL parameters:
 * - id: group ID (MongoDB ObjectId)
 * 
 * Response: (200 OK)
 * {
 *   message: string,
 *   group: Group object
 * }
 * 
 * Requires: Authentication
 */
export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id: groupId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const updatedGroup = await leaveGroupService(userId, groupId);

    return res.status(200).json({
      message: 'Left group successfully',
      group: updatedGroup,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Leave group error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'LEAVE_GROUP_ERROR',
    });
  }
};

/**
 * GET /api/groups/invites
 * 
 * Get all pending group invitations for user
 * 
 * Response: (200 OK)
 * {
 *   invites: Array<GroupInvite>,
 *   total: number
 * }
 * 
 * Requires: Authentication
 * 
 * NOTE: Feature placeholder - invitations to be implemented later
 */
export const getGroupInvites = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await getGroupInvitesService(userId);

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Get invites error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'GET_INVITES_ERROR',
    });
  }
};

/**
 * POST /api/groups/:id/accept-invite
 * 
 * Accept a group invitation
 * 
 * URL parameters:
 * - id: group ID (MongoDB ObjectId)
 * 
 * Response: (200 OK)
 * {
 *   message: string,
 *   group: Group object
 * }
 * 
 * Requires: Authentication
 * 
 * NOTE: For now, acts like joining a group
 */
export const acceptInvite = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id: groupId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const group = await acceptInviteService(userId, groupId);

    return res.status(200).json({
      message: 'Invitation accepted successfully',
      group,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Accept invite error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'ACCEPT_INVITE_ERROR',
    });
  }
};

/**
 * POST /api/groups/:id/reject-invite
 * 
 * Reject a group invitation
 * 
 * URL parameters:
 * - id: group ID (MongoDB ObjectId)
 * 
 * Response: (200 OK)
 * {
 *   message: string
 * }
 * 
 * Requires: Authentication
 * 
 * NOTE: Placeholder - feature for later
 */
export const rejectInvite = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id: groupId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await rejectInviteService(userId, groupId);

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Reject invite error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'REJECT_INVITE_ERROR',
    });
  }
};

/**
 * GET /api/groups/schedule
 * 
 * Get scheduled sessions for user's groups
 * 
 * Response: (200 OK)
 * {
 *   schedules: Array<Schedule>,
 *   total: number
 * }
 * 
 * Requires: Authentication
 * 
 * NOTE: Feature placeholder - schedules to be implemented later
 */
export const getGroupSchedule = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await getGroupScheduleService(userId);

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Get schedule error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'GET_SCHEDULE_ERROR',
    });
  }
};

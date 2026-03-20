/**
 * Groups Routes
 * 
 * RESTful API endpoints for group management:
 * 
 * GET    /api/groups/my-groups      - Get user's groups
 * GET    /api/groups/discover       - Discover public groups
 * GET    /api/groups/invites        - Get pending invitations
 * GET    /api/groups/schedule       - Get group schedules
 * POST   /api/groups                - Create new group
 * POST   /api/groups/:id/join       - Join a group
 * POST   /api/groups/:id/leave      - Leave a group
 * POST   /api/groups/:id/accept-invite - Accept invite
 * POST   /api/groups/:id/reject-invite - Reject invite
 * 
 * All routes require authentication (protectRoute middleware)
 */

import express from 'express';
import { protectRoute } from '../../../middleware/auth.middleware.js';
import {
  getMyGroups,
  getDiscoveredGroups,
  createGroup,
  joinGroup,
  leaveGroup,
  getGroupInvites,
  acceptInvite,
  rejectInvite,
  getGroupSchedule,
} from '../controller/group.controller.js';
import {
  validatePagination,
  validateGroupId,
  verifyGroupExists,
  validateGroupCreationData,
} from '../middleware/group.middleware.js';

const router = express.Router();

/**
 * All routes require authentication
 */
router.use(protectRoute);

/**
 * GET /api/groups/my-groups
 * Get all groups where user is a member
 * Supports pagination
 */
router.get('/my-groups', validatePagination, getMyGroups);

/**
 * GET /api/groups/discover
 * Get public groups user can join
 * Supports pagination
 */
router.get('/discover', validatePagination, getDiscoveredGroups);

/**
 * GET /api/groups/invites
 * Get pending group invitations
 * Feature placeholder - for future implementation
 */
router.get('/invites', getGroupInvites);

/**
 * GET /api/groups/schedule
 * Get scheduled sessions in user's groups
 * Feature placeholder - for future implementation
 */
router.get('/schedule', getGroupSchedule);

/**
 * POST /api/groups
 * Create a new group
 * Creator becomes admin automatically
 * 
 * Request body:
 * {
 *   name: string (required),
 *   description: string (optional),
 *   privacy: 'public' | 'private' (required),
 *   avatar: string (optional, Cloudinary URL)
 * }
 */
router.post('/', validateGroupCreationData, createGroup);

/**
 * POST /api/groups/:id/join
 * Join a public group
 * User becomes regular member
 */
router.post(
  '/:id/join',
  validateGroupId,
  verifyGroupExists,
  joinGroup
);

/**
 * POST /api/groups/:id/leave
 * Leave a group
 * Prevents last admin from leaving
 */
router.post(
  '/:id/leave',
  validateGroupId,
  verifyGroupExists,
  leaveGroup
);

/**
 * POST /api/groups/:id/accept-invite
 * Accept a group invitation
 * Currently acts like joining a group
 */
router.post(
  '/:id/accept-invite',
  validateGroupId,
  verifyGroupExists,
  acceptInvite
);

/**
 * POST /api/groups/:id/reject-invite
 * Reject a group invitation
 * Feature placeholder - for future implementation
 */
router.post(
  '/:id/reject-invite',
  validateGroupId,
  verifyGroupExists,
  rejectInvite
);

export default router;

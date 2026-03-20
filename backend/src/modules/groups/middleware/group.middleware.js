/**
 * Groups Middleware
 * 
 * Validation middleware for group operations:
 * - Validate page and limit parameters
 * - Validate group ID format
 * - Validate group exists
 * - Check user is group member
 * - Check user is group admin (for sensitive ops)
 * 
 * These middleware can be chained to routes for FAANG-style validation
 */

import Group from '../models/Group.js';

/**
 * Validate pagination query parameters
 * 
 * Ensures page and limit are valid numbers
 * Prevents SQL injection-style attacks through pagination
 * 
 * Sets: req.pagination = { page, limit }
 */
export const validatePagination = (req, res, next) => {
  try {
    let { page = 1, limit = 50 } = req.query;

    // Convert to integers
    page = parseInt(page);
    limit = parseInt(limit);

    // Validate page
    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        message: 'Page must be a positive number',
        code: 'INVALID_PAGE',
      });
    }

    // Validate limit (max 100 per request for performance)
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: 'Limit must be between 1 and 100',
        code: 'INVALID_LIMIT',
      });
    }

    // Attach to request
    req.pagination = { page, limit };
    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid pagination parameters',
      code: 'PAGINATION_ERROR',
    });
  }
};

/**
 * Validate MongoDB ObjectId format
 * 
 * Ensures group ID in params is valid ObjectId
 * Prevents invalid database queries
 * 
 * Checks: req.params.id
 */
export const validateGroupId = (req, res, next) => {
  try {
    const { id } = req.params;

    // Simple ObjectId validation (24 hex chars)
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: 'Invalid group ID format',
        code: 'INVALID_GROUP_ID',
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid group ID',
      code: 'GROUP_ID_ERROR',
    });
  }
};

/**
 * Verify group exists and is active
 * 
 * Fetches group from database
 * Checks isActive flag
 * Sets: req.group = Group object
 * 
 * Precondition: validateGroupId middleware must run first
 */
export const verifyGroupExists = async (req, res, next) => {
  try {
    const { id: groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: 'Group not found',
        code: 'GROUP_NOT_FOUND',
      });
    }

    if (!group.isActive) {
      return res.status(410).json({
        message: 'This group is no longer active',
        code: 'GROUP_INACTIVE',
      });
    }

    // Attach group to request for next middleware/controller
    req.group = group;
    next();
  } catch (error) {
    console.error('Verify group exists error:', error);
    return res.status(500).json({
      message: 'Failed to verify group',
      code: 'VERIFY_GROUP_ERROR',
    });
  }
};

/**
 * Check user is a member of the group
 * 
 * Validates user (from auth middleware) is member of group
 * Sets: req.isMember = true/false
 * 
 * Preconditions:
 * - protectRoute middleware (sets req.user)
 * - verifyGroupExists middleware (sets req.group)
 */
export const checkGroupMembership = (req, res, next) => {
  try {
    const userId = req.user?._id;
    const group = req.group;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    if (!group) {
      return res.status(500).json({
        message: 'Group not found in request',
        code: 'INTERNAL_ERROR',
      });
    }

    // Check if user is member
    const isMember = group.members.some(
      (member) => member.userId.toString() === userId.toString()
    );

    req.isMember = isMember;
    req.userRole = isMember
      ? group.members.find((m) => m.userId.toString() === userId.toString())
          ?.role || null
      : null;

    next();
  } catch (error) {
    console.error('Check membership error:', error);
    return res.status(500).json({
      message: 'Failed to check group membership',
      code: 'MEMBERSHIP_ERROR',
    });
  }
};

/**
 * Require user to be group member
 * 
 * Blocks request if user is not group member
 * Use after checkGroupMembership
 */
export const requireGroupMembership = (req, res, next) => {
  if (!req.isMember) {
    return res.status(403).json({
      message: 'You must be a member of this group to perform this action',
      code: 'NOT_GROUP_MEMBER',
    });
  }
  next();
};

/**
 * Require user to be group admin
 * 
 * Checks user role is 'admin'
 * Use after checkGroupMembership
 */
export const requireGroupAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      message: 'Only group admins can perform this action',
      code: 'NOT_ADMIN',
    });
  }
  next();
};

/**
 * Require user to be group admin or creator
 * 
 * Checks user is admin OR created the group
 */
export const requireGroupAdminOrCreator = (req, res, next) => {
  const userId = req.user?._id;
  const group = req.group;

  const isAdmin = req.userRole === 'admin';
  const isCreator = group?.createdBy?.toString() === userId?.toString();

  if (!isAdmin && !isCreator) {
    return res.status(403).json({
      message: 'Only group administrators can perform this action',
      code: 'INSUFFICIENT_PERMISSIONS',
    });
  }
  next();
};

/**
 * Validate group creation data
 * 
 * Ensures POST /groups request has valid data
 */
export const validateGroupCreationData = (req, res, next) => {
  try {
    const { name, description, privacy, avatar } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        message: 'Group name is required and must be a non-empty string',
        code: 'INVALID_NAME',
      });
    }

    // Validate name length
    if (name.trim().length > 100) {
      return res.status(400).json({
        message: 'Group name must be less than 100 characters',
        code: 'NAME_TOO_LONG',
      });
    }

    // Validate privacy
    if (!privacy || !['public', 'private'].includes(privacy)) {
      return res.status(400).json({
        message: 'Privacy must be "public" or "private"',
        code: 'INVALID_PRIVACY',
      });
    }

    // Validate description if provided
    if (
      description &&
      (typeof description !== 'string' || description.length > 500)
    ) {
      return res.status(400).json({
        message: 'Description must be a string with max 500 characters',
        code: 'INVALID_DESCRIPTION',
      });
    }

    // Validate avatar if provided
    if (avatar && typeof avatar !== 'string') {
      return res.status(400).json({
        message: 'Avatar must be a valid URL',
        code: 'INVALID_AVATAR',
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid group data',
      code: 'VALIDATION_ERROR',
    });
  }
};

/**
 * Groups Service Layer
 * 
 * Handles all group management business logic:
 * - Get user's groups (my groups)
 * - Discover public groups
 * - Handle group invitations
 * - Create groups
 * - Join/leave groups
 * - Accept/reject invites
 * - Manage group members
 * 
 * Designed for language portability (rewritable in other languages)
 * All database queries and validations happen here
 */

import Group from '../models/Group.js';
import User from '../../../models/User.js';
import GroupMessage from '../../messages/groupMessages/models/GroupMessage.js';

/**
 * Get User's Groups (Groups member is part of)
 * 
 * Retrieves all groups where user is a member
 * with pagination support for scalability
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number (default 1)
 * @param {number} limit - Results per page (default 50)
 * @returns {Promise<{groups: Array, total: number, page: number, pages: number}>}
 * @throws {Error} If user not found or query fails
 */
export const getMyGroupsService = async (userId, page = 1, limit = 50) => {
  try {
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Find groups where user is a member
    const groups = await Group.find({
      'members.userId': userId,
      isActive: true,
    })
      .select('-members') // Exclude full members array for efficiency
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for read-only queries (faster)

    // Get total count for pagination
    const total = await Group.countDocuments({
      'members.userId': userId,
      isActive: true,
    });

    const pages = Math.ceil(total / limit);

    return {
      groups,
      total,
      page,
      pages,
    };
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to fetch your groups');
    err.code = 'GET_MY_GROUPS_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Get Discovered Groups (Public groups to join)
 * 
 * Retrieves all public groups user is NOT a member of
 * Useful for group discovery and exploration
 * 
 * @param {string} userId - User ID (to exclude user's own groups)
 * @param {number} page - Page number (default 1)
 * @param {number} limit - Results per page (default 50)
 * @returns {Promise<{groups: Array, total: number, page: number, pages: number}>}
 * @throws {Error} If query fails
 */
export const getDiscoveredGroupsService = async (userId, page = 1, limit = 50) => {
  try {
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    const skip = (page - 1) * limit;

    // Find public groups where user is NOT a member
    const groups = await Group.find({
      privacy: 'public',
      'members.userId': { $ne: userId }, // Exclude groups user is already in
      isActive: true,
    })
      .select('-members')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Group.countDocuments({
      privacy: 'public',
      'members.userId': { $ne: userId },
      isActive: true,
    });

    const pages = Math.ceil(total / limit);

    return {
      groups,
      total,
      page,
      pages,
    };
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to discover groups');
    err.code = 'DISCOVER_GROUPS_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Create New Group
 * 
 * Creates a new group with creator as admin
 * Initializes with empty members array (creator added separately)
 * 
 * @param {string} userId - Creator user ID
 * @param {Object} groupData - Group data
 * @param {string} groupData.name - Group name
 * @param {string} groupData.description - Group description
 * @param {string} groupData.privacy - 'public' or 'private'
 * @param {string} [groupData.avatar] - Group avatar URL
 * @returns {Promise<Object>} Created group with member count
 * @throws {Error} If validation or creation fails
 */
export const createGroupService = async (userId, groupData) => {
  try {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    // Validate required fields
    const { name, description, privacy, avatar } = groupData;

    if (!name || !name.trim()) {
      const error = new Error('Group name is required');
      error.code = 'MISSING_GROUP_NAME';
      error.statusCode = 400;
      throw error;
    }

    if (!privacy || !['public', 'private'].includes(privacy)) {
      const error = new Error('Group privacy must be "public" or "private"');
      error.code = 'INVALID_PRIVACY';
      error.statusCode = 400;
      throw error;
    }

    // Create group with creator as admin member
    const newGroup = new Group({
      name: name.trim(),
      description: description ? description.trim() : '',
      privacy,
      avatar: avatar || null,
      createdBy: userId,
      members: [
        {
          userId,
          role: 'admin',
          joinedAt: new Date(),
        },
      ],
      isActive: true,
    });

    const savedGroup = await newGroup.save();

    // Remove sensitive fields from response
    const groupResponse = savedGroup.toObject();
    delete groupResponse.members; // Don't expose full members array

    return {
      ...groupResponse,
      memberCount: 1, // Creator is member
    };
  } catch (error) {
    if (error.statusCode) throw error;

    // Handle duplicate key error (if group name + creator unique)
    if (error?.code === 11000) {
      const err = new Error('A group with this name already exists');
      err.code = 'DUPLICATE_GROUP';
      err.statusCode = 409;
      throw err;
    }

    const err = new Error('Failed to create group');
    err.code = 'CREATE_GROUP_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Join Group
 * 
 * Adds user to a public group as a regular member
 * Validates group exists and user is not already a member
 * 
 * @param {string} userId - User ID joining
 * @param {string} groupId - Group ID to join
 * @returns {Promise<Object>} Updated group (without members array)
 * @throws {Error} If user already member or group doesn't exist
 */
export const joinGroupService = async (userId, groupId) => {
  try {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      const error = new Error('Group not found');
      error.code = 'GROUP_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    // Check if group is active
    if (!group.isActive) {
      const error = new Error('This group is no longer active');
      error.code = 'GROUP_INACTIVE';
      error.statusCode = 410;
      throw error;
    }

    // Check if user is already a member
    const isMember = group.members.some(
      (member) => member.userId.toString() === userId
    );

    if (isMember) {
      const error = new Error('You are already a member of this group');
      error.code = 'ALREADY_MEMBER';
      error.statusCode = 409;
      throw error;
    }

    // Add user as member
    group.members.push({
      userId,
      role: 'member',
      joinedAt: new Date(),
    });

    const updatedGroup = await group.save();

    // Return group without full members array
    const groupResponse = updatedGroup.toObject();
    delete groupResponse.members;

    return {
      ...groupResponse,
      memberCount: updatedGroup.members.length,
    };
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to join group');
    err.code = 'JOIN_GROUP_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Leave Group
 * 
 * Removes user from a group
 * Prevents last admin from leaving (unless solo)
 * 
 * @param {string} userId - User ID leaving
 * @param {string} groupId - Group ID to leave
 * @returns {Promise<Object>} Updated group
 * @throws {Error} If user not in group or is only admin
 */
export const leaveGroupService = async (userId, groupId) => {
  try {
    // Find group
    const group = await Group.findById(groupId);
    if (!group) {
      const error = new Error('Group not found');
      error.code = 'GROUP_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      (member) => member.userId.toString() === userId
    );

    if (memberIndex === -1) {
      const error = new Error('You are not a member of this group');
      error.code = 'NOT_MEMBER';
      error.statusCode = 404;
      throw error;
    }

    // Prevent last admin from leaving
    const isLastAdmin =
      group.members[memberIndex].role === 'admin' &&
      group.members.filter((m) => m.role === 'admin').length === 1;

    if (isLastAdmin && group.members.length > 1) {
      const error = new Error(
        'Last admin cannot leave. Assign another admin or delete the group.'
      );
      error.code = 'LAST_ADMIN_CANNOT_LEAVE';
      error.statusCode = 403;
      throw error;
    }

    // Remove user from members
    group.members.splice(memberIndex, 1);

    // If group is empty, mark as inactive
    if (group.members.length === 0) {
      group.isActive = false;
    }

    const updatedGroup = await group.save();

    const groupResponse = updatedGroup.toObject();
    delete groupResponse.members;

    return {
      ...groupResponse,
      memberCount: updatedGroup.members.length,
    };
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to leave group');
    err.code = 'LEAVE_GROUP_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Get Group Invites
 * 
 * Get invitations sent to user
 * (For now, returns empty - feature for later)
 * 
 * @param {string} userId - User ID
 * @returns {Promise<{invites: Array}>} User's invitations
 */
export const getGroupInvitesService = async (userId) => {
  try {
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    // TODO: Implement group invitations when feature is ready
    // For now, return empty array as placeholder

    return {
      invites: [],
      total: 0,
    };
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to fetch invitations');
    err.code = 'GET_INVITES_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Accept Group Invite
 * 
 * Accept an invitation to join a group
 * (For now, placeholder - feature for later)
 * 
 * @param {string} userId - User ID accepting invite
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Acceptance confirmation
 */
export const acceptInviteService = async (userId, groupId) => {
  try {
    // TODO: Implement when invitations feature is ready
    // For now, acts like joining a group

    return await joinGroupService(userId, groupId);
  } catch (error) {
    const err = error.statusCode
      ? error
      : new Error('Failed to accept invitation');
    err.code = err.code || 'ACCEPT_INVITE_ERROR';
    err.statusCode = err.statusCode || 500;
    throw err;
  }
};

/**
 * Reject Group Invite
 * 
 * Reject an invitation to join a group
 * (For now, placeholder - feature for later)
 * 
 * @param {string} userId - User ID rejecting invite
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Rejection confirmation
 */
export const rejectInviteService = async (userId, groupId) => {
  try {
    // TODO: Implement when invitations feature is ready
    return {
      message: 'Invitation rejected successfully',
      groupId,
    };
  } catch (error) {
    const err = new Error('Failed to reject invitation');
    err.code = 'REJECT_INVITE_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Get Group Schedule
 * 
 * Get scheduled sessions for groups
 * (Provision for later - returns empty for now)
 * 
 * @param {string} userId - User ID
 * @returns {Promise<{schedules: Array}>} User's group schedules
 */
export const getGroupScheduleService = async (userId) => {
  try {
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    // TODO: Implement schedules feature
    // For now, return empty array as placeholder

    return {
      schedules: [],
      total: 0,
    };
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to fetch schedules');
    err.code = 'GET_SCHEDULE_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

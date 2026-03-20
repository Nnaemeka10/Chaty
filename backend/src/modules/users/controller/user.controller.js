/**
 * Users Controller
 * 
 * HTTP layer for user profile operations
 * All business logic in user.service.js
 */

import {
  getAllUsersService,
  getUserProfileService,
  updateUserProfileService,
} from '../services/user.service.js';

/**
 * GET /api/users/:id
 * 
 * Get user profile by ID
 * 
 * URL parameters:
 * - id: User ID (MongoDB ObjectId)
 * 
 * Response: (200 OK)
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string | null,
 *   bio: string,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 * 
 * Requires: Authentication
 */
export const getUserProfile = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const requestingUserId = req.user?._id;

    if (!requestingUserId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const user = await getUserProfileService(userId);

    return res.status(200).json(user);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Get user profile error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'GET_PROFILE_ERROR',
    });
  }
};

/**
 * PUT /api/users/profile (note: current path, not self-id)
 * 
 * Update current user's profile
 * User can only update their own profile
 * 
 * Request body:
 * {
 *   bio: string (optional, max 500 chars),
 *   username: string (optional, 3-50 chars)
 * }
 * 
 * Response: (200 OK)
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string | null,
 *   bio: string,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 * 
 * Requires: Authentication
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const updatedUser = await updateUserProfileService(userId, req.body);

    return res.status(200).json(updatedUser);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Update user profile error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'UPDATE_PROFILE_ERROR',
    });
  }
};

/**
 * GET /api/users
 * 
 * Get all users for member selection
 * 
 * Query parameters:
 * - limit: Number of results (default: 100)
 * - skip: Pagination skip (default: 0)
 * - search: Search by username or email (optional)
 * 
 * Response: (200 OK)
 * Array<{
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string | null,
 *   bio: string,
 *   createdAt: Date,
 *   updatedAt: Date
 * }>
 * 
 * Requires: Authentication
 */
export const getAllUsers = async (req, res) => {
  try {
    const requestingUserId = req.user?._id;

    if (!requestingUserId) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED',
      });
    }

    const { limit = 100, skip = 0, search = '' } = req.query;

    const users = await getAllUsersService({
      limit,
      skip,
      search,
      excludeUserId: requestingUserId, // Don't show current user in list
    });

    return res.status(200).json(users);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Get all users error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'GET_USERS_ERROR',
    });
  }
};

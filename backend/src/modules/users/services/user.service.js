/**
 * Users Service Layer
 * 
 * Handles user profile operations:
 * - Get user profile
 * - Update user profile
 * 
 * Designed for language portability
 */

import User from '../../../models/User.js';

/**
 * Get User Profile by ID
 * 
 * Retrieves full user profile information
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User profile (without password)
 * @throws {Error} If user not found
 */
export const getUserProfileService = async (userId) => {
  try {
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    return user;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to fetch user profile');
    err.code = 'GET_PROFILE_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Update User Profile
 * 
 * Updates user profile data
 * Currently supports: bio, joinedDate (other fields as needed)
 * 
 * @param {string} userId - User ID to update
 * @param {Object} profileData - Data to update
 * @returns {Promise<Object>} Updated user (without password)
 * @throws {Error} If validation fails or update fails
 */
export const updateUserProfileService = async (userId, profileData) => {
  try {
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    // Validate and sanitize update data
    const updateData = {};

    // Allow updating specific fields (prevent mass assignment)
    const allowedFields = ['bio', 'username'];

    for (const field of allowedFields) {
      if (field in profileData && profileData[field] !== undefined) {
        updateData[field] = profileData[field];
      }
    }

    // Validate bio length if present
    if (
      updateData.bio &&
      typeof updateData.bio === 'string' &&
      updateData.bio.length > 500
    ) {
      const error = new Error('Bio must be less than 500 characters');
      error.code = 'BIO_TOO_LONG';
      error.statusCode = 400;
      throw error;
    }

    // Validate username length if present
    if (
      updateData.username &&
      typeof updateData.username === 'string' &&
      (updateData.username.length < 3 || updateData.username.length > 50)
    ) {
      const error = new Error('Username must be between 3 and 50 characters');
      error.code = 'INVALID_USERNAME_LENGTH';
      error.statusCode = 400;
      throw error;
    }

    // Update user and return updated document
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return updated document
    }).select('-password');

    return updatedUser;
  } catch (error) {
    if (error.statusCode) throw error;

    const err = new Error('Failed to update profile');
    err.code = 'UPDATE_PROFILE_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

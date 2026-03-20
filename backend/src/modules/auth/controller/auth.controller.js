/**
 * Auth Controller
 * 
 * Thin HTTP layer that:
 * - Extracts request data
 * - Calls service layer functions
 * - Handles HTTP responses
 * - Generates JWT tokens
 * 
 * All business logic is in auth.service.js for language portability
 */

import {
  signupService,
  loginService,
  updateProfileService,
  getUserProfileService,
} from '../services/auth.service.js';
import { generateToken } from '../../../lib/utils.js';

/**
 * POST /api/auth/signup
 * 
 * Register a new user account
 * 
 * Request body:
 * {
 *   initusername: string,
 *   initemail: string,
 *   initpassword: string
 * }
 * 
 * Response: (201 Created)
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string | null
 * }
 */
export const signup = async (req, res) => {
  try {
    const { initusername, initemail, initpassword } = req.body;

    // Call service layer to handle signup logic
    const { user } = await signupService(
      initusername,
      initemail,
      initpassword
    );

    // Generate JWT token and set as HTTP-only cookie
    generateToken(user._id, res);

    // Return created user
    return res.status(201).json(user);
  } catch (error) {
    // Service layer sets error.statusCode and error.message
    const statusCode = error.statusCode || 500;
    console.error('Signup error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'SIGNUP_ERROR',
    });
  }
};

/**
 * POST /api/auth/login
 * 
 * Authenticate user with email and password
 * 
 * Request body:
 * {
 *   initemail: string,
 *   initpassword: string
 * }
 * 
 * Response: (200 OK)
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string | null
 * }
 * 
 * Sets JWT token as HTTP-only cookie
 */
export const login = async (req, res) => {
  try {
    const { initemail, initpassword } = req.body;

    // Call service layer to authenticate
    const { user } = await loginService(initemail, initpassword);

    // Generate JWT token and set as HTTP-only cookie
    generateToken(user._id, res);

    // Return authenticated user
    return res.status(200).json(user);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Login error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'LOGIN_ERROR',
    });
  }
};

/**
 * POST /api/auth/logout
 * 
 * Clear JWT token cookie (user logout)
 * 
 * Response: (200 OK)
 * {
 *   message: string
 * }
 * 
 * Requires: Authentication (protectRoute middleware)
 */
export const logout = (_, res) => {
  // Clear JWT cookie with maxAge: 0
  res.cookie('jwt', '', { maxAge: 0 });

  return res.status(200).json({
    message: 'Logged out successfully',
  });
};

/**
 * PUT /api/auth/update-profile
 * 
 * Update user profile picture
 * 
 * Request body:
 * {
 *   profilePic: string (base64 encoded image)
 * }
 * 
 * Response: (200 OK)
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string (Cloudinary URL)
 * }
 * 
 * Requires: Authentication (protectRoute middleware)
 */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    // Call service layer to update profile
    const updatedUser = await updateProfileService(userId, profilePic);

    return res.status(200).json(updatedUser);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    console.error('Update profile error:', error.message);

    return res.status(statusCode).json({
      message: error.message,
      code: error.code || 'UPDATE_PROFILE_ERROR',
    });
  }
};

/**
 * GET /api/auth/check
 * 
 * Check authentication status and get current user profile
 * 
 * Response: (200 OK)
 * {
 *   _id: string,
 *   username: string,
 *   email: string,
 *   profilePic: string | null,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 * 
 * Requires: Authentication (protectRoute middleware)
 * 
 * Returns req.user set by protectRoute middleware
 */
export const checkAuth = (req, res) => {
  return res.status(200).json(req.user);
};

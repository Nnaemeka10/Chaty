/**
 * Users Routes
 * 
 * API endpoints for user profile management:
 * 
 * GET    /api/users/:id      - Get user profile
 * PUT    /api/users/profile  - Update current user profile
 */

import express from 'express';
import { protectRoute } from '../../../middleware/auth.middleware.js';
import { getUserProfile, updateUserProfile } from '../controller/user.controller.js';

const router = express.Router();

/**
 * All user profile routes require authentication
 */
router.use(protectRoute);

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
router.get('/:id', getUserProfile);

/**
 * PUT /api/users/profile
 * Update current user's profile
 * User can only update their own profile
 */
router.put('/profile', updateUserProfile);

export default router;

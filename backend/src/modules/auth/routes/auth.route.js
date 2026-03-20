/**
 * Auth Routes
 * 
 * Endpoints for user authentication and profile management
 * 
 * Public routes (no auth required):
 * - POST /signup - Register new account
 * - POST /login - Login to existing account
 * 
 * Protected routes (require JWT):
 * - POST /logout - Clear session
 * - PUT /update-profile - Update profile picture
 * - GET /check - Check auth status
 */

import express from 'express';
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from '../controller/auth.controller.js';
import { protectRoute } from '../../../middleware/auth.middleware.js';
import { arcjetProtection } from '../../../middleware/arcjet.middleware.js';

const router = express.Router();

// Apply Arcjet rate limiting to all routes
router.use(arcjetProtection);

/**
 * Public Routes
 */

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login with email and password
router.post('/login', login);

/**
 * Protected Routes (require authentication)
 */

// POST /api/auth/logout - Logout (clear JWT cookie)
router.post('/logout', protectRoute, logout);

// PUT /api/auth/update-profile - Update profile picture
router.put('/update-profile', protectRoute, updateProfile);

// GET /api/auth/check - Check auth status and get current user
router.get('/check', protectRoute, checkAuth);

export default router;

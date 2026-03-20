/**
 * Auth Service Layer
 * 
 * Handles all authentication business logic:
 * - User registration/signup
 * - User login validation
 * - Password hashing and verification
 * - Token generation
 * - Profile updates
 * - Email notifications
 * 
 * Designed for language portability (can be rewritten in Go, Rust, etc.)
 */

import User from '../../../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/utils.js';
import { sendWelcomeEmail } from '../../../emails/emailHandlers.js';
import cloudinary from '../../../lib/cloudinary.js';
import { ENV } from '../../../lib/env.js';

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitizes user input by trimming and normalizing
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input, isEmail = false) => {
  let sanitized = typeof input === 'string' ? input.trim() : '';
  if (isEmail) {
    sanitized = sanitized.toLowerCase();
  }
  return sanitized;
};

/**
 * Register/Signup Service
 * 
 * Creates a new user account with:
 * - Input validation (username, email, password)
 * - Password strength check
 * - Duplicate email check
 * - Password hashing (bcryptjs)
 * - User creation in database
 * - Welcome email notification
 * 
 * @param {string} username - Username for new account
 * @param {string} email - Email for new account
 * @param {string} password - Password for new account
 * @returns {Promise<{user: Object, token: string}>} New user and JWT token
 * @throws {Error} With specific error codes for different failure scenarios
 */
export const signupService = async (username, email, password) => {
  try {
    // Step 1: Sanitize inputs
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email, true);
    const passwordInput = sanitizeInput(password);

    // Step 2: Validate all required fields are present
    if (!sanitizedUsername || !sanitizedEmail || !passwordInput) {
      const error = new Error('All fields are required (username, email, password)');
      error.code = 'MISSING_FIELDS';
      error.statusCode = 400;
      throw error;
    }

    // Step 3: Validate password strength (minimum 6 characters)
    if (passwordInput.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.code = 'WEAK_PASSWORD';
      error.statusCode = 400;
      throw error;
    }

    // Step 4: Validate email format
    if (!validateEmail(sanitizedEmail)) {
      const error = new Error('Please provide a valid email address');
      error.code = 'INVALID_EMAIL';
      error.statusCode = 400;
      throw error;
    }

    // Step 5: Check for duplicate email
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      const error = new Error('Email address is already registered');
      error.code = 'DUPLICATE_EMAIL';
      error.statusCode = 409;
      throw error;
    }

    // Step 6: Hash password using bcryptjs (10 salt rounds for security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordInput, salt);

    // Step 7: Create new user in database
    const newUser = new User({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Step 8: Send welcome email asynchronously (non-blocking)
    try {
      await sendWelcomeEmail(
        savedUser.email,
        savedUser.username,
        ENV.CLIENT_URL
      );
    } catch (emailError) {
      console.error('Welcome email failed (non-critical):', emailError.message);
      // Continue even if email fails - user account is already created
    }

    // Step 9: Return user data (without password) and generate token
    return {
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
      },
      isNewUser: true,
    };
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error?.code === 11000 && error.keyPattern?.email) {
      const err = new Error('Email address is already registered');
      err.code = 'DUPLICATE_EMAIL';
      err.statusCode = 409;
      throw err;
    }

    // Re-throw with status code if already set
    if (error.statusCode) throw error;

    // Generic server error
    const err = new Error('Failed to create user account. Please try again.');
    err.code = 'SIGNUP_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Login Service
 * 
 * Authenticates user credentials:
 * - Email validation and lookup
 * - Password verification via bcryptjs
 * - Secure credential comparison (no user enumeration)
 * 
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<{user: Object}>} User data if authentication succeeds
 * @throws {Error} With code 'INVALID_CREDENTIALS' for any auth failure
 */
export const loginService = async (email, password) => {
  try {
    // Step 1: Sanitize inputs
    const sanitizedEmail = sanitizeInput(email, true);
    const passwordInput = sanitizeInput(password);

    // Step 2: Validate inputs are provided
    if (!sanitizedEmail || !passwordInput) {
      const error = new Error('Email and password are required');
      error.code = 'MISSING_CREDENTIALS';
      error.statusCode = 400;
      throw error;
    }

    // Step 3: Find user by email
    const user = await User.findOne({ email: sanitizedEmail });

    // Step 4: Verify password (using bcryptjs compare)
    // Important: Don't reveal which field is incorrect to prevent user enumeration
    if (!user) {
      const error = new Error('Invalid email or password');
      error.code = 'INVALID_CREDENTIALS';
      error.statusCode = 401;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(passwordInput, user.password);

    if (!isPasswordCorrect) {
      const error = new Error('Invalid email or password');
      error.code = 'INVALID_CREDENTIALS';
      error.statusCode = 401;
      throw error;
    }

    // Step 5: Return user data (without password)
    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    };
  } catch (error) {
    // Re-throw with status code if already set
    if (error.statusCode) throw error;

    // Generic server error
    const err = new Error('Failed to authenticate. Please try again.');
    err.code = 'LOGIN_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Update Profile Service
 * 
 * Updates user profile picture:
 * - Uploads image to Cloudinary
 * - Updates user record with image URL
 * 
 * @param {string} userId - User ID to update
 * @param {string} profilePic - Base64 encoded image data
 * @returns {Promise<Object>} Updated user data (excluding password)
 * @throws {Error} With specific error codes
 */
export const updateProfileService = async (userId, profilePic) => {
  try {
    // Step 1: Validate inputs
    if (!userId) {
      const error = new Error('User ID is required');
      error.code = 'MISSING_USER_ID';
      error.statusCode = 400;
      throw error;
    }

    if (!profilePic) {
      const error = new Error('Profile picture is required');
      error.code = 'MISSING_PROFILE_PIC';
      error.statusCode = 400;
      throw error;
    }

    // Step 2: Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    if (!uploadResponse.secure_url) {
      const error = new Error('Image upload failed. Please try again.');
      error.code = 'UPLOAD_FAILED';
      error.statusCode = 500;
      throw error;
    }

    // Step 3: Update user record in database with new avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true } // Return updated document
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      error.statusCode = 404;
      throw error;
    }

    return updatedUser;
  } catch (error) {
    // Re-throw with status code if already set
    if (error.statusCode) throw error;

    // Generic server error
    const err = new Error('Failed to update profile. Please try again.');
    err.code = 'UPDATE_PROFILE_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

/**
 * Get User Profile Service
 * 
 * Retrieves user profile data (for "check" endpoint)
 * 
 * @param {string} userId - User ID to retrieve
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

    const err = new Error('Failed to retrieve user profile');
    err.code = 'PROFILE_ERROR';
    err.statusCode = 500;
    throw err;
  }
};

import express from "express";
import { protectRoute } from "../../../../middleware/auth.middleware.js";
import { arcjetProtection } from "../../../../middleware/arcjet.middleware.js";
import {
  validateGroupMembership,
  validateGroupAdmin,
  validateMessageOwnership,
  validatePagination,
  validateGroupExists,
} from "../middleware/groupMessage.middleware.js";
import {
  getGroupMessages,
  sendGroupMessage,
  editGroupMessage,
  deleteGroupMessage,
  reactToMessage,
  togglePinMessage,
  markMessageAsRead,
} from "../controller/groupMessage.controller.js";

const router = express.Router();

/**
 * Middleware chain: Rate limiting → Authentication → Authorization
 */
router.use(arcjetProtection, protectRoute);

/**
 * GET /messages/group/:groupId
 * Fetch all messages for a group with pagination
 */
router.get(
  "/group/:groupId",
  validateGroupExists,
  validateGroupMembership,
  validatePagination,
  getGroupMessages
);

/**
 * POST /messages/group/:groupId
 * Send a new message to a group
 */
router.post(
  "/group/:groupId",
  validateGroupExists,
  validateGroupMembership,
  sendGroupMessage
);

/**
 * PUT /messages/group/:groupId/:messageId
 * Edit a message (owner only)
 */
router.put(
  "/group/:groupId/:messageId",
  validateGroupExists,
  validateGroupMembership,
  validateMessageOwnership,
  editGroupMessage
);

/**
 * DELETE /messages/group/:groupId/:messageId
 * Delete a message (owner only)
 */
router.delete(
  "/group/:groupId/:messageId",
  validateGroupExists,
  validateGroupMembership,
  validateMessageOwnership,
  deleteGroupMessage
);

/**
 * POST /messages/group/:groupId/:messageId/react
 * Add/remove reaction to a message
 */
router.post(
  "/group/:groupId/:messageId/react",
  validateGroupExists,
  validateGroupMembership,
  reactToMessage
);

/**
 * POST /messages/group/:groupId/:messageId/pin
 * Pin/unpin a message (admin only)
 */
router.post(
  "/group/:groupId/:messageId/pin",
  validateGroupExists,
  validateGroupAdmin,
  togglePinMessage
);

/**
 * POST /messages/group/:groupId/:messageId/read
 * Mark a message as read by the user
 */
router.post(
  "/group/:groupId/:messageId/read",
  validateGroupExists,
  validateGroupMembership,
  markMessageAsRead
);

export default router;

import Group from "../../../groups/models/Group.js";
import GroupMessage from "../models/GroupMessage.js";

/**
 * Validate that user is a member of the group
 * FAANG style: Fast membership check with single query
 */
export const validateGroupMembership = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Single query: Check if user is in group members
    const group = await Group.findOne(
      { _id: groupId, "members.userId": userId },
      { "members.$": 1 } // Return only the matched member
    );

    if (!group || !group.members.length) {
      return res.status(403).json({
        message: "Access denied: You are not a member of this group",
        code: "NOT_GROUP_MEMBER",
      });
    }

    // Attach group and user role to request for use in controllers
    req.group = group;
    req.userRole = group.members[0].role;
    req.isMemberOfGroup = true;

    next();
  } catch (error) {
    console.error("Error in validateGroupMembership middleware:", error);
    res.status(500).json({
      message: "Failed to validate group membership",
      error: error.message,
      code: "VALIDATION_ERROR",
    });
  }
};

/**
 * Validate that user is admin of the group
 * FAANG style: Reuse membership validation result
 */
export const validateGroupAdmin = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Single query: Check admin status
    const group = await Group.findOne(
      {
        _id: groupId,
        "members.userId": userId,
        "members.role": "admin",
      },
      { _id: 1 }
    );

    if (!group) {
      return res.status(403).json({
        message: "Access denied: Only group admins can perform this action",
        code: "NOT_ADMIN",
      });
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    console.error("Error in validateGroupAdmin middleware:", error);
    res.status(500).json({
      message: "Failed to validate admin status",
      error: error.message,
      code: "VALIDATION_ERROR",
    });
  }
};

/**
 * Validate message ownership (only sender can edit/delete)
 * FAANG style: Simple equality check, no DB query needed
 */
export const validateMessageOwnership = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    // Single query: Get message and check sender
    const message = await GroupMessage.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        code: "MESSAGE_NOT_FOUND",
      });
    }

    // Check if user is sender
    if (!message.senderId.equals(userId)) {
      return res.status(403).json({
        message: "Access denied: You can only edit/delete your own messages",
        code: "NOT_MESSAGE_OWNER",
      });
    }

    req.message = message;
    next();
  } catch (error) {
    console.error("Error in validateMessageOwnership middleware:", error);
    res.status(500).json({
      message: "Failed to validate message ownership",
      error: error.message,
      code: "VALIDATION_ERROR",
    });
  }
};

/**
 * Validate pagination parameters
 * FAANG style: Reusable pagination middleware
 */
export const validatePagination = (req, res, next) => {
  try {
    let { page = 1, limit = 50 } = req.query;

    // Convert to numbers and validate
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50)); // Max 100, min 1, default 50

    // Calculate skip for efficient database queries
    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };

    next();
  } catch (error) {
    console.error("Error in validatePagination middleware:", error);
    res.status(400).json({
      message: "Invalid pagination parameters",
      error: error.message,
      code: "INVALID_PAGINATION",
    });
  }
};

/**
 * Validate group exists (general purpose)
 * FAANG style: Single lightweight query
 */
export const validateGroupExists = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
        code: "GROUP_NOT_FOUND",
      });
    }

    req.group = group;
    next();
  } catch (error) {
    console.error("Error in validateGroupExists middleware:", error);
    res.status(500).json({
      message: "Failed to fetch group",
      error: error.message,
      code: "VALIDATION_ERROR",
    });
  }
};

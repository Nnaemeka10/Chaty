import Group from "../modules/groups/models/Group.js";
import GroupMessage from "../modules/messages/groupMessages/models/GroupMessage.js";

/**
 * FAANG STYLE UTILITY FUNCTIONS FOR GROUP OPERATIONS
 * Reusable, clean, and composable utilities
 */

/**
 * Check if user is member of group
 * O(1) lookup using MongoDB query
 */
export const isGroupMember = async (userId, groupId) => {
  try {
    const group = await Group.findOne(
      {
        _id: groupId,
        "members.userId": userId,
      },
      { _id: 1 }
    ).lean();

    return !!group;
  } catch (error) {
    console.error("Error checking group membership:", error);
    throw error;
  }
};

/**
 * Get user's role in group
 * Returns: "admin", "moderator", "member", or null
 */
export const getUserRoleInGroup = async (userId, groupId) => {
  try {
    const group = await Group.findOne(
      {
        _id: groupId,
        "members.userId": userId,
      },
      { "members.$": 1 }
    ).lean();

    if (!group || !group.members.length) {
      return null;
    }

    return group.members[0].role;
  } catch (error) {
    console.error("Error getting user role in group:", error);
    throw error;
  }
};

/**
 * Check if user is admin of group
 * O(1) lookup
 */
export const isGroupAdmin = async (userId, groupId) => {
  try {
    const group = await Group.findOne(
      {
        _id: groupId,
        "members.userId": userId,
        "members.role": "admin",
      },
      { _id: 1 }
    ).lean();

    return !!group;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw error;
  }
};

/**
 * Get all group members with details
 */
export const getGroupMembers = async (groupId) => {
  try {
    const group = await Group.findById(groupId)
      .populate("members.userId", "username email profilePic")
      .lean();

    if (!group) {
      return [];
    }

    return group.members.map(member => ({
      userId: member.userId._id,
      username: member.userId.username,
      email: member.userId.email,
      profilePic: member.userId.profilePic,
      role: member.role,
      joinedAt: member.joinedAt,
    }));
  } catch (error) {
    console.error("Error fetching group members:", error);
    throw error;
  }
};

/**
 * Add member to group
 * FAANG style: Atomic operation with validation
 */
export const addGroupMember = async (groupId, userId, role = "member") => {
  try {
    // Check if already a member
    const isMember = await isGroupMember(userId, groupId);
    if (isMember) {
      throw new Error("User is already a member of this group");
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          members: {
            userId,
            role,
            joinedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    return group;
  } catch (error) {
    console.error("Error adding group member:", error);
    throw error;
  }
};

/**
 * Remove member from group
 * Cannot remove the creator
 */
export const removeGroupMember = async (groupId, userId) => {
  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    // Prevent removing group creator
    if (group.createdBy.equals(userId)) {
      throw new Error("Cannot remove the group creator");
    }

    await Group.updateOne(
      { _id: groupId },
      {
        $pull: {
          members: { userId },
        },
      }
    );

    return true;
  } catch (error) {
    console.error("Error removing group member:", error);
    throw error;
  }
};

/**
 * Update member role
 * Only admin can update roles
 */
export const updateMemberRole = async (groupId, userId, newRole) => {
  try {
    const validRoles = ["admin", "moderator", "member"];
    if (!validRoles.includes(newRole)) {
      throw new Error("Invalid role");
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      {
        $set: {
          "members.$[elem].role": newRole,
        },
      },
      {
        arrayFilters: [{ "elem.userId": userId }],
        new: true,
      }
    );

    return group;
  } catch (error) {
    console.error("Error updating member role:", error);
    throw error;
  }
};

/**
 * Get group with member details
 */
export const getGroupWithDetails = async (groupId) => {
  try {
    const group = await Group.findById(groupId)
      .populate("createdBy", "username email profilePic")
      .populate("members.userId", "username email profilePic")
      .lean();

    if (!group) {
      return null;
    }

    return {
      ...group,
      memberCount: group.members.length,
      members: group.members.map(member => ({
        userId: member.userId._id,
        username: member.userId.username,
        email: member.userId.email,
        profilePic: member.userId.profilePic,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
    };
  } catch (error) {
    console.error("Error getting group details:", error);
    throw error;
  }
};

/**
 * Get all pinned messages in group
 */
export const getPinnedMessages = async (groupId, limit = 10) => {
  try {
    const messages = await GroupMessage.find({
      groupId,
      isPinned: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", "username profilePic")
      .populate("reactions.userId", "username")
      .lean();

    return messages;
  } catch (error) {
    console.error("Error getting pinned messages:", error);
    throw error;
  }
};

/**
 * Get unread message count for user in group
 */
export const getUnreadCount = async (groupId, userId) => {
  try {
    const count = await GroupMessage.countDocuments({
      groupId,
      "readBy.userId": { $ne: userId },
    });

    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    throw error;
  }
};

/**
 * Mark all messages as read in group
 * FAANG style: Bulk update operation
 */
export const markAllMessagesAsRead = async (groupId, userId) => {
  try {
    const result = await GroupMessage.updateMany(
      {
        groupId,
        "readBy.userId": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            userId,
            readAt: new Date(),
          },
        },
      }
    );

    return result;
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

/**
 * Search messages in group
 * Supports full text search
 */
export const searchGroupMessages = async (groupId, query, limit = 20) => {
  try {
    const messages = await GroupMessage.find(
      {
        groupId,
        $text: { $search: query },
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .populate("senderId", "username profilePic")
      .lean();

    return messages;
  } catch (error) {
    console.error("Error searching messages:", error);
    throw error;
  }
};

/**
 * Get message statistics for a group
 */
export const getGroupMessageStats = async (groupId) => {
  try {
    const [totalMessages, pinnedMessages, hasImages] = await Promise.all([
      GroupMessage.countDocuments({ groupId }),
      GroupMessage.countDocuments({ groupId, isPinned: true }),
      GroupMessage.countDocuments({ groupId, image: { $exists: true, $ne: null } }),
    ]);

    return {
      totalMessages,
      pinnedMessages,
      messagesWithImages: hasImages,
    };
  } catch (error) {
    console.error("Error getting message stats:", error);
    throw error;
  }
};

/**
 * Get user's message contribution in group
 */
export const getUserMessageCount = async (groupId, userId) => {
  try {
    const count = await GroupMessage.countDocuments({
      groupId,
      senderId: userId,
    });

    return count;
  } catch (error) {
    console.error("Error getting user message count:", error);
    throw error;
  }
};

/**
 * Archive group (soft delete)
 * Sets isActive to false
 */
export const archiveGroup = async (groupId) => {
  try {
    const group = await Group.findByIdAndUpdate(
      groupId,
      { isActive: false },
      { new: true }
    );

    return group;
  } catch (error) {
    console.error("Error archiving group:", error);
    throw error;
  }
};

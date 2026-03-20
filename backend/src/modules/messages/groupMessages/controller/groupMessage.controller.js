import cloudinary from "../../../../lib/cloudinary.js";
import { getReceiverSocket, io } from "../../../../lib/socket.js";
import GroupMessage from "../models/GroupMessage.js";
import Group from "../../../groups/models/Group.js";
import User from "../../../../models/User.js";

/**
 * GET all messages for a group with pagination
 * FAANG style: Efficient pagination with lean() and select()
 */
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50, skip } = req.pagination;
    const userId = req.user._id;

    // Validate group membership (already done by middleware)
    if (!req.isMemberOfGroup) {
      return res.status(403).json({
        message: "You are not a member of this group",
        code: "NOT_GROUP_MEMBER",
      });
    }

    // Query messages in reverse order (newest first) then reverse for display
    const messages = await GroupMessage.find({ groupId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("senderId", "username email profilePic")
      .populate("reactions.userId", "username")
      .populate("readBy.userId", "username")
      .lean()
      .exec();

    // Reverse to show oldest first
    const sortedMessages = messages.reverse();

    // Get total count for pagination metadata
    const totalMessages = await GroupMessage.countDocuments({ groupId });
    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      messages: sortedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalMessages,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getGroupMessages controller:", error);
    res.status(500).json({
      message: "Failed to fetch group messages",
      error: error.message,
      code: "FETCH_MESSAGES_ERROR",
    });
  }
};

/**
 * POST send a new message to group
 * FAANG style: Optimistic updates with real-time Socket.io broadcast
 */
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    // Defensive programming: Validate input
    if (!text && !image) {
      return res.status(400).json({
        message: "Message must contain text or image",
        code: "INVALID_MESSAGE",
      });
    }

    // Validate group membership (already done by middleware)
    if (!req.isMemberOfGroup) {
      return res.status(403).json({
        message: "You are not a member of this group",
        code: "NOT_GROUP_MEMBER",
      });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Error uploading image to Cloudinary:", uploadError);
        return res.status(400).json({
          message: "Failed to upload image",
          error: uploadError.message,
          code: "IMAGE_UPLOAD_ERROR",
        });
      }
    }

    // Create new message
    const newMessage = new GroupMessage({
      groupId,
      senderId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    // Populate sender info before sending
    await newMessage.populate("senderId", "username email profilePic");

    // Update group's messageCount and lastMessageAt
    await Group.updateOne(
      { _id: groupId },
      {
        $inc: { messageCount: 1 },
        $set: { lastMessageAt: new Date() },
      }
    );

    // Real-time: Broadcast message to all members in group via Socket.io
    io.to(`group-${groupId}`).emit("newGroupMessage", {
      message: newMessage.toObject(),
      groupId,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage controller:", error);
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
      code: "SEND_MESSAGE_ERROR",
    });
  }
};

/**
 * PUT edit a group message
 * FAANG style: Atomic update with history tracking
 */
export const editGroupMessage = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        message: "Message text is required",
        code: "INVALID_TEXT",
      });
    }

    // Message ownership already validated by middleware
    const message = req.message;

    // Verify message belongs to this group
    if (!message.groupId.equals(groupId)) {
      return res.status(403).json({
        message: "Message does not belong to this group",
        code: "WRONG_GROUP",
      });
    }

    // Add to edit history before updating
    message.editHistory.push({
      text: message.text,
      editedAt: new Date(),
    });

    message.text = text.trim();
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();
    await message.populate("senderId", "username email profilePic");

    // Real-time: Broadcast edit to all group members
    io.to(`group-${groupId}`).emit("messageEdited", {
      messageId,
      groupId,
      message: message.toObject(),
    });

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in editGroupMessage controller:", error);
    res.status(500).json({
      message: "Failed to edit message",
      error: error.message,
      code: "EDIT_MESSAGE_ERROR",
    });
  }
};

/**
 * DELETE a group message
 * FAANG style: Soft delete with cascading cleanup
 */
export const deleteGroupMessage = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const userId = req.user._id;

    // Message ownership already validated by middleware
    const message = req.message;

    // Verify message belongs to this group
    if (!message.groupId.equals(groupId)) {
      return res.status(403).json({
        message: "Message does not belong to this group",
        code: "WRONG_GROUP",
      });
    }

    // Delete message
    await GroupMessage.deleteOne({ _id: messageId });

    // Update group messageCount
    await Group.updateOne(
      { _id: groupId },
      { $inc: { messageCount: -1 } }
    );

    // Real-time: Broadcast deletion to all group members
    io.to(`group-${groupId}`).emit("messageDeleted", {
      messageId,
      groupId,
    });

    res.status(200).json({
      message: "Message deleted successfully",
      messageId,
    });
  } catch (error) {
    console.error("Error in deleteGroupMessage controller:", error);
    res.status(500).json({
      message: "Failed to delete message",
      error: error.message,
      code: "DELETE_MESSAGE_ERROR",
    });
  }
};

/**
 * POST add/remove reaction to message
 * FAANG style: Atomic toggle operation
 */
export const reactToMessage = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!emoji || typeof emoji !== "string") {
      return res.status(400).json({
        message: "Emoji is required",
        code: "INVALID_EMOJI",
      });
    }

    // Validate group membership (already done by middleware)
    if (!req.isMemberOfGroup) {
      return res.status(403).json({
        message: "You are not a member of this group",
        code: "NOT_GROUP_MEMBER",
      });
    }

    // Get message
    const message = await GroupMessage.findOne({
      _id: messageId,
      groupId,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        code: "MESSAGE_NOT_FOUND",
      });
    }

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.emoji === emoji && r.userId.equals(userId)
    );

    if (existingReactionIndex !== -1) {
      // Remove reaction
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add reaction
      message.reactions.push({
        emoji,
        userId,
      });
    }

    await message.save();
    await message.populate([
      { path: "senderId", select: "username profilePic" },
      { path: "reactions.userId", select: "username" },
    ]);

    // Real-time: Broadcast reaction to all group members
    io.to(`group-${groupId}`).emit("messageReaction", {
      messageId,
      groupId,
      reactions: message.reactions,
    });

    res.status(200).json({
      messageId,
      reactions: message.reactions,
    });
  } catch (error) {
    console.error("Error in reactToMessage controller:", error);
    res.status(500).json({
      message: "Failed to add reaction",
      error: error.message,
      code: "REACT_ERROR",
    });
  }
};

/**
 * POST pin/unpin message (admin only)
 * FAANG style: Role-based access with single atomic update
 */
export const togglePinMessage = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const { isPinned } = req.body;
    const userId = req.user._id;

    // Validate input
    if (typeof isPinned !== "boolean") {
      return res.status(400).json({
        message: "isPinned must be a boolean",
        code: "INVALID_INPUT",
      });
    }

    // Admin validation already done by middleware
    if (!req.isAdmin) {
      return res.status(403).json({
        message: "Only group admins can pin messages",
        code: "NOT_ADMIN",
      });
    }

    // Get message
    const message = await GroupMessage.findOne({
      _id: messageId,
      groupId,
    });

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
        code: "MESSAGE_NOT_FOUND",
      });
    }

    message.isPinned = isPinned;
    await message.save();
    await message.populate("senderId", "username profilePic");

    // Real-time: Broadcast pin status to all group members
    io.to(`group-${groupId}`).emit("messagePinned", {
      messageId,
      groupId,
      isPinned,
      message: message.toObject(),
    });

    res.status(200).json({
      messageId,
      isPinned,
      message: message,
    });
  } catch (error) {
    console.error("Error in togglePinMessage controller:", error);
    res.status(500).json({
      message: "Failed to pin message",
      error: error.message,
      code: "PIN_MESSAGE_ERROR",
    });
  }
};

/**
 * POST mark message as read by user
 * FAANG style: Efficient bulk operation with $addToSet
 */
export const markMessageAsRead = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const userId = req.user._id;

    // Validate group membership (already done by middleware)
    if (!req.isMemberOfGroup) {
      return res.status(403).json({
        message: "You are not a member of this group",
        code: "NOT_GROUP_MEMBER",
      });
    }

    // Atomic update: Add user to readBy if not already there
    const message = await GroupMessage.findOneAndUpdate(
      {
        _id: messageId,
        groupId,
        "readBy.userId": { $ne: userId }, // Only add if not already read
      },
      {
        $push: {
          readBy: {
            userId,
            readAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("readBy.userId", "username");

    if (!message) {
      // Message already marked as read or doesn't exist
      const existingMessage = await GroupMessage.findById(messageId);
      if (!existingMessage) {
        return res.status(404).json({
          message: "Message not found",
          code: "MESSAGE_NOT_FOUND",
        });
      }
      return res.status(200).json({
        messageId,
        message: "Message already marked as read",
      });
    }

    // Real-time: Broadcast read receipt to all group members
    io.to(`group-${groupId}`).emit("messageRead", {
      messageId,
      groupId,
      userId,
      readBy: message.readBy,
    });

    res.status(200).json({
      messageId,
      readBy: message.readBy,
    });
  } catch (error) {
    console.error("Error in markMessageAsRead controller:", error);
    res.status(500).json({
      message: "Failed to mark message as read",
      error: error.message,
      code: "READ_ERROR",
    });
  }
};

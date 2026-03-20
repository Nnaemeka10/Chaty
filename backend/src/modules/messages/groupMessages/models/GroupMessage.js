import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
  {
    // Core Message Data
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    // Media & Files
    image: {
      type: String, // Cloudinary URL
      default: null,
    },

    file: {
      type: String, // Cloudinary URL
      default: null,
    },

    // Message Features
    reactions: [
      {
        emoji: {
          type: String,
          required: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    isPinned: {
      type: Boolean,
      default: false,
    },

    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Editing
    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    editHistory: [
      {
        text: String,
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for efficient queries
groupMessageSchema.index({ groupId: 1, createdAt: -1 });
groupMessageSchema.index({ senderId: 1 });
groupMessageSchema.index({ isPinned: 1 });
groupMessageSchema.index({ "readBy.userId": 1 });
groupMessageSchema.index({ groupId: 1, isPinned: 1 });

// Virtual for calculating memberCount (number of people who read)
groupMessageSchema.virtual("readCount").get(function () {
  return this.readBy.length;
});

// Ensure virtuals are included in response
groupMessageSchema.set("toJSON", { virtuals: true });

const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);

export default GroupMessage;

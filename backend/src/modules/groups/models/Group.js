import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    avatar: {
      type: String,
      default: null, // Cloudinary URL
    },

    // Members Management
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "moderator", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Group Status & Settings
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Metadata
    messageCount: {
      type: Number,
      default: 0,
    },

    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
groupSchema.index({ name: "text", description: "text" });
groupSchema.index({ "members.userId": 1 });
groupSchema.index({ createdBy: 1 });
groupSchema.index({ privacy: 1 });
groupSchema.index({ isActive: 1 });

const Group = mongoose.model("Group", groupSchema);

export default Group;

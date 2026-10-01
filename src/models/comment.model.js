// ael_backend/src/models/comment.model.js

import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    targetType: {
      type: String,
      enum: ["blog", "incident", "general", "market-update", "marketUpdate"],
      default: "blog",
      index: true,
    },
    targetId: {
      type: String,
      required: true,
      index: true,
    },
    targetTitle: {
      type: String,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userFullName: {
      type: String,
      default: "",
    },
    userEmail: {
      type: String,
      default: "",
    },
    userAvatar: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", commentSchema);

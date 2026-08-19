// src/models/clientMessage.model.js

import mongoose, { Schema } from "mongoose";

const clientMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 20,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 2000,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    is_replied: {
      type: Boolean,
      default: false,
    },
    replied_at: {
      type: Date,
      default: null,
    },
    ip_address: {
      type: String,
      default: "",
    },
    user_agent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
clientMessageSchema.index({ createdAt: -1 });
clientMessageSchema.index({ is_read: 1 });
clientMessageSchema.index({ email: 1 });
clientMessageSchema.index({ createdAt: -1, is_read: 1 });

// Static method to get unread messages count
clientMessageSchema.statics.getUnreadCount = function () {
  return this.countDocuments({ is_read: false });
};

// Instance method to mark as read
clientMessageSchema.methods.markAsRead = function () {
  this.is_read = true;
  return this.save();
};

// Instance method to mark as replied
clientMessageSchema.methods.markAsReplied = function () {
  this.is_replied = true;
  this.replied_at = new Date();
  return this.save();
};

export const ClientMessage = mongoose.model(
  "ClientMessage",
  clientMessageSchema
);

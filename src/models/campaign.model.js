// ael_backend/src/models/campaign.model.js
import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["sms", "email"],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetAudience: {
      type: String,
      required: true,
      enum: ["all_subscribers", "dealers", "consumers", "industrial_users", "custom_list"],
      default: "all_subscribers",
    },
    subject: {
      type: String,
      trim: true,
      default: "", // Required for email
    },
    messageContent: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      default: "SafeLPG-BD",
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    characterCount: {
      type: Number,
      default: 0,
    },
    isBanglaUnicode: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "completed", "failed"],
      default: "completed",
      index: true,
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    deliveredCount: {
      type: Number,
      default: 0,
    },
    openedCount: {
      type: Number,
      default: 0,
    },
    clickedCount: {
      type: Number,
      default: 0,
    },
    operatorBreakdown: {
      gp: { type: Number, default: 0 },
      robi: { type: Number, default: 0 },
      banglalink: { type: Number, default: 0 },
      teletalk: { type: Number, default: 0 },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Campaign = mongoose.model("Campaign", campaignSchema);

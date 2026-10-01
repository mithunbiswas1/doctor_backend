// ael_backend/src/models/subscriptionPlan.model.js
import mongoose, { Schema } from "mongoose";

const subscriptionPlanSchema = new Schema(
  {
    planKey: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    nameEn: {
      type: String,
      required: true,
      trim: true,
    },
    nameBn: {
      type: String,
      required: true,
      trim: true,
    },
    taglineEn: {
      type: String,
      default: "",
    },
    taglineBn: {
      type: String,
      default: "",
    },
    durationDays: {
      type: Number,
      required: true,
      default: 30,
    },
    durationLabelEn: {
      type: String,
      default: "30 days",
    },
    durationLabelBn: {
      type: String,
      default: "৩০ দিন",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    badgeEn: {
      type: String,
      default: "",
    },
    badgeBn: {
      type: String,
      default: "",
    },
    featuresEn: [
      {
        type: String,
        trim: true,
      },
    ],
    featuresBn: [
      {
        type: String,
        trim: true,
      },
    ],
    isPopular: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionPlan = mongoose.model(
  "SubscriptionPlan",
  subscriptionPlanSchema
);

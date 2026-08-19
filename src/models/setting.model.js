// src/models/setting.model.js
import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    // General Settings
    websiteName: {
      type: String,
      trim: true,
      default: "",
    },
    websiteTitle: {
      type: String,
      trim: true,
      default: "",
    },
    websiteDescription: {
      type: String,
      trim: true,
      default: "",
    },
    websiteKeywords: {
      type: String,
      trim: true,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    logoWhite: {
      type: String,
      default: "",
    },
    favicon: {
      type: String,
      default: "",
    },

    // Contact Information
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    secondaryPhone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    supportEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    googleMapEmbed: {
      type: String,
      trim: true,
      default: "",
    },
    googleMapLink: {
      type: String,
      trim: true,
      default: "",
    },

    // Social Media
    facebook: {
      type: String,
      trim: true,
      default: "",
    },
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    twitter: {
      type: String,
      trim: true,
      default: "",
    },
    youtube: {
      type: String,
      trim: true,
      default: "",
    },
    reddit: {
      type: String,
      trim: true,
      default: "",
    },
    tiktok: {
      type: String,
      trim: true,
      default: "",
    },
    github: {
      type: String,
      trim: true,
      default: "",
    },
    pinterest: {
      type: String,
      trim: true,
      default: "",
    },
    whatsapp: {
      type: String,
      trim: true,
      default: "",
    },

    // SEO Settings
    metaTitle: {
      type: String,
      trim: true,
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      default: "",
    },
    metaKeywords: {
      type: String,
      trim: true,
      default: "",
    },
    openGraphImage: {
      type: String,
      default: "",
    },

    // Analytics
    googleAnalyticsId: {
      type: String,
      trim: true,
      default: "",
    },
    googleTagManagerId: {
      type: String,
      trim: true,
      default: "",
    },

    // Email Settings
    smtpHost: {
      type: String,
      trim: true,
      default: "",
    },
    smtpPort: {
      type: String,
      trim: true,
      default: "",
    },
    smtpUsername: {
      type: String,
      trim: true,
      default: "",
    },
    smtpPassword: {
      type: String,
      trim: true,
      default: "",
    },
    fromEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    fromName: {
      type: String,
      trim: true,
      default: "",
    },

    // Footer Settings
    footerAbout: {
      type: String,
      trim: true,
      default: "",
    },
    copyright: {
      type: String,
      trim: true,
      default: "",
    },

    // Status
    is_active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
settingSchema.index({ is_active: 1 });
settingSchema.index({ createdAt: -1 });

// Static method to get active settings
settingSchema.statics.getActiveSettings = function () {
  return this.findOne({ is_active: true });
};

export const Setting = mongoose.model("Setting", settingSchema);

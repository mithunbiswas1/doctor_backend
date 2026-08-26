// src/models/setting.model.js

import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    // Basic Settings
    website_name: {
      type: String,
      required: [true, "Website name is required"],
      trim: true,
      maxlength: 100,
    },
    website_name_hi: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    tagline_hi: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    logo: {
      type: String,
      required: [true, "Logo is required"],
    },
    favicon: {
      type: String,
      required: [true, "Favicon is required"],
    },

    // Opening Hours (Array)
    opening_hours: [
      {
        day: {
          type: String,
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Contact
    contact: {
      phone: {
        type: String,
        trim: true,
      },
      emergency_phone: {
        type: String,
        trim: true,
      },
      whatsapp: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      address: {
        type: String,
        trim: true,
      },
      address_hi: {
        type: String,
        trim: true,
      },
    },

    // Social Links
    social: {
      facebook: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      youtube: {
        type: String,
        trim: true,
      },
      tiktok: {
        type: String,
        trim: true,
      },
      reddit: {
        type: String,
        trim: true,
      },
      google_map: {
        type: String,
        trim: true,
      },
      threads: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
    },

    // Status
    is_active: {
      type: Boolean,
      default: true,
    },

    // Metadata
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
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

// Indexes
settingSchema.index({ is_active: 1 });
settingSchema.index({ website_name: 1 });

// Static method to get active settings
settingSchema.statics.getActiveSettings = function () {
  return this.findOne({ is_active: true });
};

export const Setting = mongoose.model("Setting", settingSchema);

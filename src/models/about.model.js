// src/models/about.model.js

import mongoose, { Schema } from "mongoose";

const aboutSchema = new Schema(
  {
    // Page Banner Section
    page_banner_title: {
      type: String,
      required: [true, "Page banner title is required"],
      trim: true,
    },
    page_banner_title_hi: {
      type: String,
      trim: true,
    },
    page_banner_subtitle: {
      type: String,
      required: [true, "Page banner subtitle is required"],
      trim: true,
    },
    page_banner_subtitle_hi: {
      type: String,
      trim: true,
    },
    page_banner_image: {
      type: String,
      required: [true, "Page banner image is required"],
    },

    // Chairman Section
    chairman_image: {
      type: String,
      required: [true, "Chairman image is required"],
    },
    chairman_name: {
      type: String,
      required: [true, "Chairman name is required"],
      trim: true,
    },
    chairman_name_hi: {
      type: String,
      trim: true,
    },
    chairman_designation: {
      type: String,
      required: [true, "Chairman designation is required"],
      trim: true,
    },
    chairman_designation_hi: {
      type: String,
      trim: true,
    },
    chairman_message: {
      type: String,
      required: [true, "Chairman message is required"],
      trim: true,
    },
    chairman_message_hi: {
      type: String,
      trim: true,
    },

    // Mission & Vision
    mission: {
      type: String,
      required: [true, "Mission is required"],
      trim: true,
    },
    mission_hi: {
      type: String,
      trim: true,
    },
    vision: {
      type: String,
      required: [true, "Vision is required"],
      trim: true,
    },
    vision_hi: {
      type: String,
      trim: true,
    },

    // Areas of Expertise (String - comma separated)
    areas_of_expertise: {
      type: String,
      required: [true, "Areas of expertise is required"],
      trim: true,
    },
    areas_of_expertise_hi: {
      type: String,
      trim: true,
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
aboutSchema.index({ is_active: 1 });

// Static method to get active about
aboutSchema.statics.getActiveAbout = function () {
  return this.findOne({ is_active: true });
};

export const About = mongoose.model("About", aboutSchema);

// src/models/homeBanner.model.js

import mongoose, { Schema } from "mongoose";

const homeBannerSchema = new Schema(
  {
    // Heading / Welcome Text
    heading: {
      type: String,
      required: [true, "Heading is required"],
      trim: true,
      maxlength: 100,
    },
    heading_hi: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Doctor Name
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      maxlength: 100,
    },
    name_hi: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // Degrees (Array)
    degree: {
      type: [String],
      required: [true, "At least one degree is required"],
    },
    degree_hi: {
      type: [String],
    },

    // Designation / Title
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
      maxlength: 200,
    },
    designation_hi: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    // Short Description
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 500,
    },
    short_description_hi: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Banner Image
    banner_image: {
      type: String,
      required: [true, "Banner image is required"],
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

// Indexes for better performance
homeBannerSchema.index({ is_active: 1 });
homeBannerSchema.index({ createdAt: -1 });

// Static method to get active banner
homeBannerSchema.statics.getActiveBanner = function () {
  return this.findOne({ is_active: true });
};

// Instance method to toggle status
homeBannerSchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const HomeBanner = mongoose.model("HomeBanner", homeBannerSchema);

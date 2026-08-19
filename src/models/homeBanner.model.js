// src/models/homeBanner.model.js

import mongoose, { Schema } from "mongoose";

const homeBannerSchema = new Schema(
  {
    banner_image: {
      type: String,
      required: [true, "Banner image is required"],
    },
    first_title: {
      type: String,
      required: [true, "First title is required"],
      trim: true,
      maxlength: 100,
    },
    sub_title: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    middle_title: {
      type: String,
      required: [true, "Middle title is required"],
      trim: true,
      maxlength: 100,
    },
    last_title: {
      type: String,
      required: [true, "Last title is required"],
      trim: true,
      maxlength: 100,
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
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
homeBannerSchema.index({ order: 1 });
homeBannerSchema.index({ createdAt: -1 });

// Static method to get active banners
homeBannerSchema.statics.getActiveBanners = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

// Instance method to toggle status
homeBannerSchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const HomeBanner = mongoose.model("HomeBanner", homeBannerSchema);

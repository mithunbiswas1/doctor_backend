// src/models/homeAlliance.model.js

import mongoose, { Schema } from "mongoose";

const homeAllianceSchema = new Schema(
  {
    // Alliance Images
    alliance_image1: {
      type: String,
      default: "default-alliance.png",
    },
    alliance_image2: {
      type: String,
      default: "default-alliance.png",
    },
    alliance_image3: {
      type: String,
      default: "default-alliance.png",
    },
    alliance_image4: {
      type: String,
      default: "default-alliance.png",
    },

    // Statistics
    experience_year: {
      type: Number,
      required: [true, "Experience year is required"],
      min: 0,
    },
    client: {
      type: Number,
      required: [true, "Client count is required"],
      min: 0,
    },
    projects: {
      type: Number,
      required: [true, "Projects count is required"],
      min: 0,
    },
    countries: {
      type: Number,
      required: [true, "Countries count is required"],
      min: 0,
    },

    // Status
    is_active: {
      type: Boolean,
      default: true,
    },

    // Audit fields
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
homeAllianceSchema.index({ is_active: 1 });
homeAllianceSchema.index({ createdAt: -1 });

// Static method to get active alliance
homeAllianceSchema.statics.getActiveAlliance = function () {
  return this.findOne({ is_active: true });
};

// Instance method to toggle status
homeAllianceSchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const HomeAlliance = mongoose.model("HomeAlliance", homeAllianceSchema);

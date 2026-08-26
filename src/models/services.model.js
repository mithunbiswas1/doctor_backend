// src/models/service.model.js

import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    // Service Title
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    title_hi: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    // Service Description
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    description_hi: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Order for sorting
    order: {
      type: Number,
      default: 0,
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
serviceSchema.index({ is_active: 1 });
serviceSchema.index({ order: 1 });
serviceSchema.index({ title: 1 });

// Static method to get active services
serviceSchema.statics.getActiveServices = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

export const Service = mongoose.model("Service", serviceSchema);

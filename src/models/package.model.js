// src/models/package.model.js

import mongoose, { Schema } from "mongoose";

const packageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Package name is required"],
      trim: true,
      maxlength: 100,
    },
    price: {
      type: String,
      required: [true, "Price is required"],
      trim: true,
      maxlength: 50,
    },
    billing: {
      type: String,
      required: [true, "Billing information is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    buttonText: {
      type: String,
      required: [true, "Button text is required"],
      trim: true,
      maxlength: 50,
      default: "Get Started",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    badge: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    features: {
      type: [String],
      required: [true, "Features are required"],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one feature is required",
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
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
packageSchema.index({ is_active: 1 });
packageSchema.index({ order: 1 });
packageSchema.index({ createdAt: -1 });

// Static method to get active packages
packageSchema.statics.getActivePackages = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

// Instance method to toggle status
packageSchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const Package = mongoose.model("Package", packageSchema);

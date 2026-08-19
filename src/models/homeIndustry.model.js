// src/models/homeIndustry.model.js
import mongoose, { Schema } from "mongoose";

const homeIndustrySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Industry title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Industry description is required"],
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
      required: [true, "Industry image is required"],
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
homeIndustrySchema.index({ is_active: 1 });
homeIndustrySchema.index({ order: 1 });
homeIndustrySchema.index({ createdAt: -1 });
homeIndustrySchema.index({ title: 1 });

// Static method to get active industries
homeIndustrySchema.statics.getActiveIndustries = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

// Instance method to toggle status
homeIndustrySchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const HomeIndustry = mongoose.model("HomeIndustry", homeIndustrySchema);

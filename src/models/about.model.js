// src/models/about.model.js
import mongoose, { Schema } from "mongoose";

const aboutSchema = new Schema(
  {
    banner_image: {
      type: String,
      required: [true, "Banner image is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    short_description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: 500,
    },
    chairman_image: {
      type: String,
      required: [true, "Chairman image is required"],
    },
    chairman_message: {
      type: String,
      required: [true, "Chairman message is required"],
      trim: true,
    },
    chairman_name: {
      type: String,
      required: [true, "Chairman name is required"],
      trim: true,
      maxlength: 100,
    },
    chairman_designation: {
      type: String,
      required: [true, "Chairman designation is required"],
      trim: true,
      maxlength: 100,
    },
    mission: {
      type: String,
      required: [true, "Mission is required"],
      trim: true,
    },
    vision: {
      type: String,
      required: [true, "Vision is required"],
      trim: true,
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
aboutSchema.index({ is_active: 1 });
aboutSchema.index({ createdAt: -1 });

// Static method to get active about page
aboutSchema.statics.getActiveAbout = function () {
  return this.findOne({ is_active: true });
};

// Instance method to toggle status
aboutSchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const About = mongoose.model("About", aboutSchema);

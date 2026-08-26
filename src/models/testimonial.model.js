// src/models/testimonial.model.js

import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
  {
    // Patient Name
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    name_hi: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    // Comment
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: 500,
    },
    comment_hi: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    // Video URL (YouTube embed)
    video_url: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
    },
    // Patient Image
    image: {
      type: String,
      required: [true, "Patient image is required"],
    },
    // Rating (1-5)
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    // Order for sorting
    order: {
      type: Number,
      default: 0,
    },
    // Featured testimonial (shown as main)
    is_featured: {
      type: Boolean,
      default: false,
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
testimonialSchema.index({ is_active: 1 });
testimonialSchema.index({ order: 1 });
testimonialSchema.index({ is_featured: 1 });

// Static method to get active testimonials
testimonialSchema.statics.getActiveTestimonials = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

// Static method to get featured testimonial
testimonialSchema.statics.getFeaturedTestimonial = function () {
  return this.findOne({ is_active: true, is_featured: true });
};

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);

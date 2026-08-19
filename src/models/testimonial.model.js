// src/models/testimonial.model.js
import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "Testimonial message is required"],
      trim: true,
      maxlength: 1000,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: 100,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "default-testimonial.png",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
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
testimonialSchema.index({ is_active: 1 });
testimonialSchema.index({ order: 1 });
testimonialSchema.index({ createdAt: -1 });
testimonialSchema.index({ name: 1 });

// Static method to get active testimonials
testimonialSchema.statics.getActiveTestimonials = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

// Instance method to toggle status
testimonialSchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);

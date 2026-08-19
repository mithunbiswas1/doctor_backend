// src/models/section.model.js

import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Section name is required"],
      unique: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    image: {
      type: String,
      default: "default-section.png",
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

// Pre-save middleware to generate slug if not provided
sectionSchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Check for duplicate slug
  if (this.slug) {
    const existingSection = await mongoose.model("Section").findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });
    if (existingSection) {
      // Append random number to make slug unique
      this.slug = `${this.slug}-${Math.floor(Math.random() * 1000)}`;
    }
  }

  next();
});

// Indexes for better performance
sectionSchema.index({ name: 1 });
sectionSchema.index({ slug: 1 });
sectionSchema.index({ is_active: 1 });
sectionSchema.index({ createdAt: -1 });

// Static method to get active sections
sectionSchema.statics.getActiveSections = function () {
  return this.find({ is_active: true }).sort({ createdAt: -1 });
};

// Instance method to deactivate section
sectionSchema.methods.deactivate = function () {
  this.is_active = false;
  return this.save();
};

// Instance method to activate section
sectionSchema.methods.activate = function () {
  this.is_active = true;
  return this.save();
};

export const Section = mongoose.model("Section", sectionSchema);
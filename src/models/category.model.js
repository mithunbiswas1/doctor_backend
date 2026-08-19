// src/models/category.model.js

import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
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
      default: "default-category.png",
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
categorySchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Check for duplicate slug
  if (this.slug) {
    const existingCategory = await mongoose.model("Category").findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });
    if (existingCategory) {
      // Append random number to make slug unique
      this.slug = `${this.slug}-${Math.floor(Math.random() * 1000)}`;
    }
  }

  next();
});

// Indexes for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ is_active: 1 });
categorySchema.index({ createdAt: -1 });

// Static method to get active categories
categorySchema.statics.getActiveCategories = function () {
  return this.find({ is_active: true }).sort({ createdAt: -1 });
};

// Instance method to deactivate category
categorySchema.methods.deactivate = function () {
  this.is_active = false;
  return this.save();
};

// Instance method to activate category
categorySchema.methods.activate = function () {
  this.is_active = true;
  return this.save();
};

export const Category = mongoose.model("Category", categorySchema);

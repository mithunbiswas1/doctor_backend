// ael_backend/src/models/blogCategory.model.js

import mongoose, { Schema } from "mongoose";

const blogCategorySchema = new Schema(
  {
    nameEn: {
      type: String,
      required: [true, "English category name is required"],
      trim: true,
    },
    nameBn: {
      type: String,
      required: [true, "Bengali category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

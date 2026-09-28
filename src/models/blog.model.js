// ael_backend/src/models/blog.model.js

import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema(
  {
    titleEn: {
      type: String,
      required: [true, "English title is required"],
      trim: true,
    },
    titleBn: {
      type: String,
      required: [true, "Bengali title is required"],
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
    descriptionEn: {
      type: String,
      required: [true, "English summary is required"],
    },
    descriptionBn: {
      type: String,
      required: [true, "Bengali summary is required"],
    },
    contentEn: {
      type: String,
      default: "",
    },
    contentBn: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "seminar",
      trim: true,
    },
    categoryBn: {
      type: String,
      default: "সেমিনার",
      trim: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
    },
    authorEn: {
      type: String,
      default: "Safe LPG Technical Committee",
    },
    authorBn: {
      type: String,
      default: "সেইফ এলপিজি টেকনিক্যাল কমিটি",
    },
    readTimeEn: {
      type: String,
      default: "5 min read",
    },
    readTimeBn: {
      type: String,
      default: "৫ মিনিট পাঠ",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
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

export const Blog = mongoose.model("Blog", blogSchema);

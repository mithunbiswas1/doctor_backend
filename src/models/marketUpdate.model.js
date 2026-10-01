// ael_backend/src/models/marketUpdate.model.js

import mongoose, { Schema } from "mongoose";

const marketUpdateSchema = new Schema(
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
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["incidents", "berc", "global"],
      default: "incidents",
      index: true,
    },
    categoryBn: {
      type: String,
      default: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
      trim: true,
    },
    summaryEn: {
      type: String,
      required: [true, "English summary is required"],
      trim: true,
    },
    summaryBn: {
      type: String,
      required: [true, "Bengali summary is required"],
      trim: true,
    },
    contentEn: {
      type: String,
      default: "",
    },
    contentBn: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
    },
    pdfUrl: {
      type: String,
      default: "",
    },
    pdfOriginalName: {
      type: String,
      default: "",
    },
    pdfSize: {
      type: Number,
      default: 0,
    },
    authorEn: {
      type: String,
      default: "Safe LPG Research & Intelligence",
    },
    authorBn: {
      type: String,
      default: "সেইফ এলপিজি রিসার্চ অ্যান্ড ইন্টেলিজেন্স",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },
    metaTitleBn: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },
    metaDescriptionBn: {
      type: String,
      default: "",
      trim: true,
    },
    metaKeywords: {
      type: String,
      default: "",
      trim: true,
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

// Search indexes
marketUpdateSchema.index({
  titleEn: "text",
  titleBn: "text",
  summaryEn: "text",
  summaryBn: "text",
});

export const MarketUpdate = mongoose.model("MarketUpdate", marketUpdateSchema);

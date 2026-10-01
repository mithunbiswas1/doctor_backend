// ael_backend/src/models/advertisement.model.js

import mongoose, { Schema } from "mongoose";

const advertisementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slot: {
      type: String,
      required: true,
      enum: [
        "header_banner",
        "sidebar_ad",
        "mid_content",
        "footer_banner",
        "sponsored_post",
        "popup_ad",
      ],
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "html5"],
      default: "image",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    htmlContent: {
      type: String,
      default: "",
    },
    clickUrl: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Advertisement = mongoose.model(
  "Advertisement",
  advertisementSchema
);

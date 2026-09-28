// ael_backend/src/models/homeBanner.model.js
import mongoose, { Schema } from "mongoose";

const slideSchema = new Schema({
  image: { type: String, required: true },
  alt: { type: String, default: "LPG Safety Facilities" },
  altBn: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const homeBannerSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },
    titleBn: {
      type: String,
      default: "",
      trim: true,
    },
    accent: {
      type: String,
      default: "",
      trim: true,
    },
    accentBn: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    descriptionBn: {
      type: String,
      default: "",
    },
    btnPrimaryText: {
      type: String,
      default: "",
    },
    btnPrimaryTextBn: {
      type: String,
      default: "",
    },
    btnPrimaryHref: {
      type: String,
      default: "",
    },
    btnSecondaryText: {
      type: String,
      default: "",
    },
    btnSecondaryTextBn: {
      type: String,
      default: "",
    },
    btnSecondaryHref: {
      type: String,
      default: "",
    },
    slides: {
      type: [slideSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const HomeBanner = mongoose.model("HomeBanner", homeBannerSchema);

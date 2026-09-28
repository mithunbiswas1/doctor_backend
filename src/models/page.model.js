// src/models/page.model.js
import mongoose, { Schema } from "mongoose";

const pageSchema = new Schema(
  {
    pageKey: {
      type: String,
      required: [true, "pageKey is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      trim: true,
    },
    titleBn: {
      type: String,
      trim: true,
    },
    banner: {
      type: {
        type: String,
        default: "visual", // "visual" | "centered"
      },
      icon: { type: String, default: "" }, // "scale" | "lock" | "help" | "shield"
      title: { type: String, default: "" },
      titleBn: { type: String, default: "" },
      accent: { type: String, default: "" },
      accentBn: { type: String, default: "" },
      description: { type: String, default: "" },
      descriptionBn: { type: String, default: "" },
      btnPrimaryText: { type: String, default: "" },
      btnPrimaryTextBn: { type: String, default: "" },
      btnPrimaryHref: { type: String, default: "" },
      btnSecondaryText: { type: String, default: "" },
      btnSecondaryTextBn: { type: String, default: "" },
      btnSecondaryHref: { type: String, default: "" },
      imageSrc: { type: String, default: "" },
      imageAlt: { type: String, default: "Safe LPG Platform" },
      imageAltBn: { type: String, default: "" },
      slide1Src: { type: String, default: "" },
      slide1Alt: { type: String, default: "" },
      slide2Src: { type: String, default: "" },
      slide2Alt: { type: String, default: "" },
      slide3Src: { type: String, default: "" },
      slide3Alt: { type: String, default: "" },
    },
    sections: {
      type: Schema.Types.Mixed,
      default: {},
    },
    contentHtml: {
      type: String,
      default: "",
    },
    contentHtmlBn: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: true,
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

export const Page = mongoose.model("Page", pageSchema);
export default Page;

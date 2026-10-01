// ael_backend/src/models/directory.model.js
import mongoose, { Schema } from "mongoose";

const directorySchema = new Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["dealer", "consumer", "industrial_client"],
      default: "dealer",
      index: true,
    },
    businessName: {
      type: String,
      trim: true,
      default: "",
    },
    district: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    upazila: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["verified", "active", "suspended"],
      default: "verified",
      index: true,
    },
    cylinderBrand: {
      type: String,
      default: "Omera / Bashundhara",
    },
    monthlyVolume: {
      type: Number,
      default: 50,
    },
    licenseNumber: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

directorySchema.index({ name: "text", businessName: "text", phone: "text" });

export const Directory = mongoose.model("Directory", directorySchema);

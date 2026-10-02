// src/models/setting.model.js
import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    key: {
      type: String,
      default: "general_settings",
      unique: true,
      index: true,
    },
    siteName: {
      type: String,
      default: "AEL SafeLPG Bangladesh",
    },
    siteEmail: {
      type: String,
      default: "support@safelpg.com",
    },
    sitePhone: {
      type: String,
      default: "+880 9603 44 66 89",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    seoTitle: {
      type: String,
      default: "Safe LPG Bangladesh | National LPG Safety & Awareness Portal",
    },
    seoDescription: {
      type: String,
      default:
        "Official national portal for LPG safety awareness, technical guidelines, certified courses, and regulatory directives.",
    },
    smsSenderId: {
      type: String,
      default: "SafeLPG-BD",
    },
    smsProvider: {
      type: String,
      default: "generic",
    },
    smtpFromName: {
      type: String,
      default: "AEL SafeLPG Bangladesh",
    },
    smtpFromEmail: {
      type: String,
      default: "newsletter@safelpg.com",
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingSchema);

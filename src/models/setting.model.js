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

    // 1. General & Brand Identity
    siteName: {
      type: String,
      default: "AEL SafeLPG Bangladesh",
    },
    tagline: {
      type: String,
      default: "National LPG Safety & Awareness Portal",
    },
    siteLogo: {
      type: String,
      default: "/safe_lpg_2.png",
    },
    footerLogo: {
      type: String,
      default: "/safe_lpg_2.png",
    },
    favicon: {
      type: String,
      default: "/favicon.ico",
    },
    copyrightText: {
      type: String,
      default: "All rights reserved. Powered by Safe LPG Bangladesh.",
    },
    footerAbout: {
      type: String,
      default:
        "Promoting certified LPG safety awareness and regulatory compliance across Bangladesh for a safer today and sustainable tomorrow.",
    },

    // 2. Contact & Topbar Information
    siteEmail: {
      type: String,
      default: "support@safelpg.com",
    },
    sitePhone: {
      type: String,
      default: "+880 9603 44 66 89",
    },
    hotlineLabel: {
      type: String,
      default: "LPG Emergency Hotline",
    },
    emergencyPhone: {
      type: String,
      default: "999",
    },
    whatsappNumber: {
      type: String,
      default: "+880 1711 00 00 00",
    },
    address: {
      type: String,
      default: "House # 12, Road # 7, Dhanmondi, Dhaka-1205, Bangladesh",
    },
    workingHours: {
      type: String,
      default: "Saturday - Thursday: 9:00 AM - 6:00 PM",
    },
    mapEmbedUrl: {
      type: String,
      default: "",
    },

    // 3. Social Media URLs
    facebookUrl: {
      type: String,
      default: "https://facebook.com",
    },
    twitterUrl: {
      type: String,
      default: "https://twitter.com",
    },
    linkedinUrl: {
      type: String,
      default: "https://linkedin.com",
    },
    youtubeUrl: {
      type: String,
      default: "https://youtube.com",
    },
    instagramUrl: {
      type: String,
      default: "",
    },

    // 4. Topbar & Announcement Banner
    topbarEnabled: {
      type: Boolean,
      default: true,
    },
    topbarAnnouncement: {
      type: String,
      default: "",
    },
    topbarAnnouncementUrl: {
      type: String,
      default: "",
    },

    // 5. SEO & Search Engine Optimization
    seoTitle: {
      type: String,
      default: "Safe LPG Bangladesh | National LPG Safety & Awareness Portal",
    },
    seoDescription: {
      type: String,
      default:
        "Official national portal for LPG safety awareness, technical guidelines, certified courses, and regulatory directives.",
    },
    seoKeywords: {
      type: String,
      default: "LPG safety, Bangladesh, cylinder safety, BERC, LOAB, explosive department",
    },
    metaAuthor: {
      type: String,
      default: "Safe LPG Bangladesh",
    },

    // 6. Gateways & Infrastructure
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceNotice: {
      type: String,
      default: "We are currently conducting scheduled system maintenance. Please check back shortly.",
    },
    smsSenderId: {
      type: String,
      default: "SafeLPG-BD",
    },
    smsProvider: {
      type: String,
      default: "generic",
    },
    smsApiKey: {
      type: String,
      default: "",
    },
    smtpFromName: {
      type: String,
      default: "AEL SafeLPG Bangladesh",
    },
    smtpFromEmail: {
      type: String,
      default: "newsletter@safelpg.com",
    },
    smtpHost: {
      type: String,
      default: "",
    },
    smtpPort: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingSchema);

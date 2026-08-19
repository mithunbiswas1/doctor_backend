// src/controllers/setting.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Setting } from "../models/setting.model.js";
import mongoose from "mongoose";

// Transform setting data for consistent response
const transformSettingData = (setting) => {
  return {
    id: setting._id.toString(),
    // General
    websiteName: setting.websiteName || "",
    websiteTitle: setting.websiteTitle || "",
    websiteDescription: setting.websiteDescription || "",
    websiteKeywords: setting.websiteKeywords || "",
    logo: setting.logo || "",
    logoWhite: setting.logoWhite || "",
    favicon: setting.favicon || "",
    // Contact
    phone: setting.phone || "",
    secondaryPhone: setting.secondaryPhone || "",
    email: setting.email || "",
    supportEmail: setting.supportEmail || "",
    address: setting.address || "",
    googleMapEmbed: setting.googleMapEmbed || "",
    googleMapLink: setting.googleMapLink || "",
    // Social
    facebook: setting.facebook || "",
    instagram: setting.instagram || "",
    linkedin: setting.linkedin || "",
    twitter: setting.twitter || "",
    youtube: setting.youtube || "",
    reddit: setting.reddit || "",
    tiktok: setting.tiktok || "",
    github: setting.github || "",
    pinterest: setting.pinterest || "",
    whatsapp: setting.whatsapp || "",
    // SEO
    metaTitle: setting.metaTitle || "",
    metaDescription: setting.metaDescription || "",
    metaKeywords: setting.metaKeywords || "",
    openGraphImage: setting.openGraphImage || "",
    // Analytics
    googleAnalyticsId: setting.googleAnalyticsId || "",
    googleTagManagerId: setting.googleTagManagerId || "",
    // Email
    smtpHost: setting.smtpHost || "",
    smtpPort: setting.smtpPort || "",
    smtpUsername: setting.smtpUsername || "",
    smtpPassword: setting.smtpPassword || "",
    fromEmail: setting.fromEmail || "",
    fromName: setting.fromName || "",
    // Footer
    footerAbout: setting.footerAbout || "",
    copyright: setting.copyright || "",
    // Meta
    is_active: setting.is_active,
    createdBy: setting.createdBy,
    updatedBy: setting.updatedBy,
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
  };
};

// Create or Update Settings API
const createOrUpdateSettings = asyncHandler(async (req, res) => {
  const updateData = req.body;
  const userId = req.user._id;

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Handle file uploads
  if (req.files) {
    if (req.files.logo) {
      updateData.logo = `public/upload/${req.files.logo[0].filename}`;
    }
    if (req.files.logoWhite) {
      updateData.logoWhite = `public/upload/${req.files.logoWhite[0].filename}`;
    }
    if (req.files.favicon) {
      updateData.favicon = `public/upload/${req.files.favicon[0].filename}`;
    }
    if (req.files.openGraphImage) {
      updateData.openGraphImage = `public/upload/${req.files.openGraphImage[0].filename}`;
    }
  }

  // Check if settings already exists
  let existingSettings = await Setting.findOne();

  // Add updatedBy
  updateData.updatedBy = userId;

  let settings;

  if (existingSettings) {
    // Update existing settings
    settings = await Setting.findByIdAndUpdate(
      existingSettings._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "userName fullName bio image");
  } else {
    // Create new settings
    updateData.createdBy = userId;
    settings = await Setting.create(updateData);
    settings = await Setting.findById(settings._id).populate(
      "createdBy updatedBy",
      "userName fullName bio image"
    );
  }

  if (!settings) {
    throw new ApiError(500, "Something went wrong while saving settings");
  }

  const transformedSettings = transformSettingData(settings);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedSettings,
        existingSettings
          ? "Settings updated successfully"
          : "Settings created successfully"
      )
    );
});

// Get Settings API
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne().populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  const transformedSettings = transformSettingData(settings);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSettings, "Settings fetched successfully")
    );
});

// Get Settings by ID API
const getSettingsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Settings ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Settings ID format");
  }

  const settings = await Setting.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  const transformedSettings = transformSettingData(settings);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSettings, "Settings fetched successfully")
    );
});

// Toggle Settings Status API
const toggleSettingsStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Settings ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Settings ID format");
  }

  const settings = await Setting.findById(id);
  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  const updatedSettings = await Setting.findByIdAndUpdate(
    id,
    {
      is_active: !settings.is_active,
      updatedBy: req.user?._id || settings.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedSettings = transformSettingData(updatedSettings);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedSettings,
        `Settings ${updatedSettings.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

export {
  createOrUpdateSettings,
  getSettings,
  getSettingsById,
  toggleSettingsStatus,
};

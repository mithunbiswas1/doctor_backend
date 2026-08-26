// src/controllers/setting.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Setting } from "../models/setting.model.js";
import mongoose from "mongoose";

// Transform settings data
const transformSettingsData = (settings) => {
  return {
    id: settings._id.toString(),
    website_name: settings.website_name,
    website_name_hi: settings.website_name_hi || "",
    tagline: settings.tagline || "",
    tagline_hi: settings.tagline_hi || "",
    logo: settings.logo,
    favicon: settings.favicon,
    opening_hours: settings.opening_hours || [],
    contact: {
      phone: settings.contact?.phone || "",
      emergency_phone: settings.contact?.emergency_phone || "",
      whatsapp: settings.contact?.whatsapp || "",
      email: settings.contact?.email || "",
      address: settings.contact?.address || "",
      address_hi: settings.contact?.address_hi || "",
    },
    social: {
      facebook: settings.social?.facebook || "",
      instagram: settings.social?.instagram || "",
      youtube: settings.social?.youtube || "",
      tiktok: settings.social?.tiktok || "",
      reddit: settings.social?.reddit || "",
      google_map: settings.social?.google_map || "",
      threads: settings.social?.threads || "",
      twitter: settings.social?.twitter || "",
    },
    is_active: settings.is_active,
    createdBy: settings.createdBy,
    updatedBy: settings.updatedBy,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
};

// Create or Update Settings
const createOrUpdateSettings = asyncHandler(async (req, res) => {
  const {
    website_name,
    website_name_hi,
    tagline,
    tagline_hi,
    opening_hours,
    contact,
    social,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Required field validation
  if (!website_name) {
    throw new ApiError(400, "Website name is required");
  }
  if (!req.files || !req.files.logo || !req.files.favicon) {
    throw new ApiError(400, "Both logo and favicon are required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Parse opening_hours if it's a string
  let parsedOpeningHours = opening_hours;
  if (typeof opening_hours === "string") {
    try {
      parsedOpeningHours = JSON.parse(opening_hours);
    } catch {
      parsedOpeningHours = [];
    }
  }

  // Parse contact if it's a string
  let parsedContact = contact;
  if (typeof contact === "string") {
    try {
      parsedContact = JSON.parse(contact);
    } catch {
      parsedContact = {};
    }
  }

  // Parse social if it's a string
  let parsedSocial = social;
  if (typeof social === "string") {
    try {
      parsedSocial = JSON.parse(social);
    } catch {
      parsedSocial = {};
    }
  }

  // Prepare update data
  const updateData = {
    website_name,
    website_name_hi: website_name_hi || "",
    tagline: tagline || "",
    tagline_hi: tagline_hi || "",
    logo: `public/upload/${req.files.logo[0].filename}`,
    favicon: `public/upload/${req.files.favicon[0].filename}`,
    opening_hours: parsedOpeningHours || [],
    contact: {
      phone: parsedContact?.phone || "",
      emergency_phone: parsedContact?.emergency_phone || "",
      whatsapp: parsedContact?.whatsapp || "",
      email: parsedContact?.email || "",
      address: parsedContact?.address || "",
      address_hi: parsedContact?.address_hi || "",
    },
    social: {
      facebook: parsedSocial?.facebook || "",
      instagram: parsedSocial?.instagram || "",
      youtube: parsedSocial?.youtube || "",
      tiktok: parsedSocial?.tiktok || "",
      reddit: parsedSocial?.reddit || "",
      google_map: parsedSocial?.google_map || "",
      threads: parsedSocial?.threads || "",
      twitter: parsedSocial?.twitter || "",
    },
    updatedBy: userId,
  };

  // Handle is_active
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Find existing settings or create new one
  let settings = await Setting.findOne();

  if (settings) {
    settings = await Setting.findByIdAndUpdate(
      settings._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "userName fullName bio image");
  } else {
    updateData.createdBy = userId;
    settings = await Setting.create(updateData);
    settings = await Setting.findById(settings._id).populate(
      "createdBy updatedBy",
      "userName fullName bio image"
    );
  }

  const transformedSettings = transformSettingsData(settings);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedSettings,
        settings
          ? "Settings updated successfully"
          : "Settings created successfully"
      )
    );
});

// Get Settings
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne().populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  const transformedSettings = transformSettingsData(settings);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSettings, "Settings fetched successfully")
    );
});

// Get Active Settings (for frontend)
const getActiveSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne({ is_active: true }).populate(
    "createdBy",
    "userName fullName bio image"
  );

  if (!settings) {
    throw new ApiError(404, "Active settings not found");
  }

  const transformedSettings = transformSettingsData(settings);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedSettings,
        "Active settings fetched successfully"
      )
    );
});

// Update Settings
const updateSettings = asyncHandler(async (req, res) => {
  const {
    website_name,
    website_name_hi,
    tagline,
    tagline_hi,
    opening_hours,
    contact,
    social,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Find existing settings
  const settings = await Setting.findOne();
  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  // Parse opening_hours if it's a string
  let parsedOpeningHours = opening_hours;
  if (typeof opening_hours === "string") {
    try {
      parsedOpeningHours = JSON.parse(opening_hours);
    } catch {
      parsedOpeningHours = [];
    }
  }

  // Parse contact if it's a string
  let parsedContact = contact;
  if (typeof contact === "string") {
    try {
      parsedContact = JSON.parse(contact);
    } catch {
      parsedContact = {};
    }
  }

  // Parse social if it's a string
  let parsedSocial = social;
  if (typeof social === "string") {
    try {
      parsedSocial = JSON.parse(social);
    } catch {
      parsedSocial = {};
    }
  }

  // Prepare update data
  const updateData = {};

  if (website_name) updateData.website_name = website_name;
  if (website_name_hi !== undefined)
    updateData.website_name_hi = website_name_hi;
  if (tagline !== undefined) updateData.tagline = tagline;
  if (tagline_hi !== undefined) updateData.tagline_hi = tagline_hi;
  if (parsedOpeningHours) updateData.opening_hours = parsedOpeningHours;

  if (parsedContact) {
    updateData.contact = {
      phone: parsedContact?.phone || "",
      emergency_phone: parsedContact?.emergency_phone || "",
      whatsapp: parsedContact?.whatsapp || "",
      email: parsedContact?.email || "",
      address: parsedContact?.address || "",
      address_hi: parsedContact?.address_hi || "",
    };
  }

  if (parsedSocial) {
    updateData.social = {
      facebook: parsedSocial?.facebook || "",
      instagram: parsedSocial?.instagram || "",
      youtube: parsedSocial?.youtube || "",
      tiktok: parsedSocial?.tiktok || "",
      reddit: parsedSocial?.reddit || "",
      google_map: parsedSocial?.google_map || "",
      threads: parsedSocial?.threads || "",
      twitter: parsedSocial?.twitter || "",
    };
  }

  // Handle file uploads
  if (req.files) {
    if (req.files.logo) {
      updateData.logo = `public/upload/${req.files.logo[0].filename}`;
    }
    if (req.files.favicon) {
      updateData.favicon = `public/upload/${req.files.favicon[0].filename}`;
    }
  }

  // Handle is_active
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Add updatedBy
  updateData.updatedBy = userId;

  // Update settings
  const updatedSettings = await Setting.findByIdAndUpdate(
    settings._id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedSettings = transformSettingsData(updatedSettings);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSettings, "Settings updated successfully")
    );
});

// Toggle Settings Status
const toggleSettingsStatus = asyncHandler(async (req, res) => {
  const settings = await Setting.findOne();

  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  const updatedSettings = await Setting.findByIdAndUpdate(
    settings._id,
    {
      is_active: !settings.is_active,
      updatedBy: req.user?._id || settings.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedSettings = transformSettingsData(updatedSettings);

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
  getActiveSettings,
  updateSettings,
  toggleSettingsStatus,
};

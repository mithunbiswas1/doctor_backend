// src/controllers/homeBanner.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HomeBanner } from "../models/homeBanner.model.js";
import mongoose from "mongoose";

// Transform banner data for consistent response
const transformBannerData = (banner) => {
  return {
    id: banner._id.toString(),
    heading: banner.heading,
    heading_hi: banner.heading_hi || "",
    name: banner.name,
    name_hi: banner.name_hi || "",
    degree: banner.degree || [],
    degree_hi: banner.degree_hi || [],
    designation: banner.designation,
    designation_hi: banner.designation_hi || "",
    short_description: banner.short_description,
    short_description_hi: banner.short_description_hi || "",
    banner_image: banner.banner_image,
    is_active: banner.is_active,
    createdBy: banner.createdBy,
    updatedBy: banner.updatedBy,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
};

// Create or Update Home Banner (Single Document)
const createOrUpdateHomeBanner = asyncHandler(async (req, res) => {
  const {
    heading,
    heading_hi,
    name,
    name_hi,
    degree,
    degree_hi,
    designation,
    designation_hi,
    short_description,
    short_description_hi,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Required field validation
  if (!heading) {
    throw new ApiError(400, "Heading is required");
  }
  if (!name) {
    throw new ApiError(400, "Doctor name is required");
  }
  if (!degree || degree.length === 0) {
    throw new ApiError(400, "At least one degree is required");
  }
  if (!designation) {
    throw new ApiError(400, "Designation is required");
  }
  if (!short_description) {
    throw new ApiError(400, "Short description is required");
  }
  if (!req.file) {
    throw new ApiError(400, "Banner image is required");
  }

  // Parse degree arrays if they come as strings
  let parsedDegree = degree;
  let parsedDegreeHi = degree_hi;

  if (typeof degree === "string") {
    try {
      parsedDegree = JSON.parse(degree);
    } catch {
      parsedDegree = degree.split(",").map((d) => d.trim());
    }
  }

  if (typeof degree_hi === "string") {
    try {
      parsedDegreeHi = JSON.parse(degree_hi);
    } catch {
      parsedDegreeHi = degree_hi.split(",").map((d) => d.trim());
    }
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Prepare update data
  const updateData = {
    heading,
    heading_hi: heading_hi || "",
    name,
    name_hi: name_hi || "",
    degree: parsedDegree,
    degree_hi: parsedDegreeHi || [],
    designation,
    designation_hi: designation_hi || "",
    short_description,
    short_description_hi: short_description_hi || "",
    updatedBy: userId,
  };

  // Handle file upload
  if (req.file) {
    updateData.banner_image = `public/upload/${req.file.filename}`;
  }

  // Handle is_active
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Find existing banner or create new one
  let banner = await HomeBanner.findOne();

  if (banner) {
    // Update existing banner
    banner = await HomeBanner.findByIdAndUpdate(
      banner._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "userName fullName bio image");
  } else {
    // Create new banner
    updateData.createdBy = userId;
    banner = await HomeBanner.create(updateData);
    banner = await HomeBanner.findById(banner._id).populate(
      "createdBy updatedBy",
      "userName fullName bio image"
    );
  }

  const transformedBanner = transformBannerData(banner);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBanner,
        banner ? "Banner updated successfully" : "Banner created successfully"
      )
    );
});

// Get Home Banner (Single Document)
const getHomeBanner = asyncHandler(async (req, res) => {
  const banner = await HomeBanner.findOne().populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  const transformedBanner = transformBannerData(banner);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedBanner, "Banner fetched successfully")
    );
});

// Get Active Home Banner (for frontend)
const getActiveHomeBanner = asyncHandler(async (req, res) => {
  const banner = await HomeBanner.findOne({ is_active: true }).populate(
    "createdBy",
    "userName fullName bio image"
  );

  if (!banner) {
    throw new ApiError(404, "Active banner not found");
  }

  const transformedBanner = transformBannerData(banner);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBanner,
        "Active banner fetched successfully"
      )
    );
});

// Update Home Banner
const updateHomeBanner = asyncHandler(async (req, res) => {
  const {
    heading,
    heading_hi,
    name,
    name_hi,
    degree,
    degree_hi,
    designation,
    designation_hi,
    short_description,
    short_description_hi,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Find existing banner
  const banner = await HomeBanner.findOne();
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  // Prepare update data
  const updateData = {};

  if (heading) updateData.heading = heading;
  if (heading_hi !== undefined) updateData.heading_hi = heading_hi;
  if (name) updateData.name = name;
  if (name_hi !== undefined) updateData.name_hi = name_hi;
  if (designation) updateData.designation = designation;
  if (designation_hi !== undefined) updateData.designation_hi = designation_hi;
  if (short_description) updateData.short_description = short_description;
  if (short_description_hi !== undefined)
    updateData.short_description_hi = short_description_hi;

  // Handle degree arrays
  if (degree) {
    let parsedDegree = degree;
    if (typeof degree === "string") {
      try {
        parsedDegree = JSON.parse(degree);
      } catch {
        parsedDegree = degree.split(",").map((d) => d.trim());
      }
    }
    updateData.degree = parsedDegree;
  }

  if (degree_hi !== undefined) {
    let parsedDegreeHi = degree_hi;
    if (typeof degree_hi === "string") {
      try {
        parsedDegreeHi = JSON.parse(degree_hi);
      } catch {
        parsedDegreeHi = degree_hi.split(",").map((d) => d.trim());
      }
    }
    updateData.degree_hi = parsedDegreeHi;
  }

  // Handle file upload
  if (req.file) {
    updateData.banner_image = `public/upload/${req.file.filename}`;
  }

  // Handle is_active
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Add updatedBy
  updateData.updatedBy = userId;

  // Update banner
  const updatedBanner = await HomeBanner.findByIdAndUpdate(
    banner._id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedBanner = transformBannerData(updatedBanner);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedBanner, "Banner updated successfully")
    );
});

// Toggle Home Banner Status
const toggleHomeBannerStatus = asyncHandler(async (req, res) => {
  const banner = await HomeBanner.findOne();

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  const updatedBanner = await HomeBanner.findByIdAndUpdate(
    banner._id,
    {
      is_active: !banner.is_active,
      updatedBy: req.user?._id || banner.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedBanner = transformBannerData(updatedBanner);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBanner,
        `Banner ${updatedBanner.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Delete Home Banner
const deleteHomeBanner = asyncHandler(async (req, res) => {
  const banner = await HomeBanner.findOne();

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  await HomeBanner.findByIdAndDelete(banner._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedId: banner._id,
        message: "Banner permanently deleted from database",
      },
      "Banner deleted successfully"
    )
  );
});

export {
  createOrUpdateHomeBanner,
  getHomeBanner,
  getActiveHomeBanner,
  updateHomeBanner,
  toggleHomeBannerStatus,
  deleteHomeBanner,
};

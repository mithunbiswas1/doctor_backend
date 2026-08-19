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
    banner_image: banner.banner_image,
    first_title: banner.first_title,
    sub_title: banner.sub_title || "",
    middle_title: banner.middle_title,
    last_title: banner.last_title,
    url: banner.url || "",
    is_active: banner.is_active,
    order: banner.order,
    createdBy: banner.createdBy,
    updatedBy: banner.updatedBy,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
};

// Create Home Banner API
const createHomeBanner = asyncHandler(async (req, res) => {
  const {
    first_title,
    sub_title,
    middle_title,
    last_title,
    url,
    is_active,
    order,
  } = req.body;

  const userId = req.user._id;

  // Handle file upload
  let bannerImage = "default-banner.png";

  if (req.file) {
    bannerImage = `public/upload/${req.file.filename}`;
  }

  // Required field validation
  if (!first_title) {
    throw new ApiError(400, "First title is required");
  }

  if (!middle_title) {
    throw new ApiError(400, "Middle title is required");
  }

  if (!last_title) {
    throw new ApiError(400, "Last title is required");
  }

  if (!req.file) {
    throw new ApiError(400, "Banner image is required");
  }

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Create banner data
  const bannerData = {
    banner_image: bannerImage,
    first_title,
    sub_title: sub_title || "",
    middle_title,
    last_title,
    url: url || "",
    is_active: is_active !== undefined ? is_active : true,
    order: order || 0,
    createdBy: userId,
  };

  try {
    const banner = await HomeBanner.create(bannerData);

    const createdBanner = await HomeBanner.findById(banner._id).populate(
      "createdBy",
      "userName fullName bio image"
    );

    if (!createdBanner) {
      throw new ApiError(500, "Something went wrong while creating banner");
    }

    const transformedBanner = transformBannerData(createdBanner);

    return res
      .status(201)
      .json(
        new ApiResponse(201, transformedBanner, "Banner created successfully")
      );
  } catch (error) {
    console.error("Banner creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Banner validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while creating banner");
  }
});

// Get Home Banner by ID API
const getHomeBannerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Banner ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Banner ID format");
  }

  const banner = await HomeBanner.findById(id).populate(
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

// Get All Home Banners List API (with pagination, search, filter)
const getHomeBannerList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    is_active,
  } = req.query;

  // Build query object
  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { first_title: { $regex: search, $options: "i" } },
      { sub_title: { $regex: search, $options: "i" } },
      { middle_title: { $regex: search, $options: "i" } },
      { last_title: { $regex: search, $options: "i" } },
      { url: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by active status
  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  // Sort options
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // Execute query with pagination
  const banners = await HomeBanner.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Transform banners data
  const transformedBanners = banners.map((banner) =>
    transformBannerData(banner)
  );

  // Get total count for pagination
  const totalCount = await HomeBanner.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        banners: transformedBanners,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Banners fetched successfully"
    )
  );
});

// Get Active Home Banners List API (for frontend)
const getActiveHomeBanners = asyncHandler(async (req, res) => {
  const banners = await HomeBanner.find({ is_active: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "userName fullName bio image");

  const transformedBanners = banners.map((banner) =>
    transformBannerData(banner)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBanners,
        "Active banners fetched successfully"
      )
    );
});

// Update Home Banner API
const updateHomeBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  if (!id) {
    throw new ApiError(400, "Banner ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Banner ID format");
  }

  const banner = await HomeBanner.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  // Parse boolean fields that might come as strings
  const booleanFields = ["is_active"];

  booleanFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      if (updateData[field] === "true" || updateData[field] === "false") {
        updateData[field] = updateData[field] === "true";
      }
    }
  });

  // Handle file upload
  if (req.file) {
    updateData.banner_image = `public/upload/${req.file.filename}`;
  }

  // Add updatedBy field
  if (req.user?._id) {
    updateData.updatedBy = req.user._id;
  }

  // Remove any undefined or null fields
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined || updateData[key] === null) {
      delete updateData[key];
    }
  });

  const updatedBanner = await HomeBanner.findByIdAndUpdate(
    id,
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

// Delete Home Banner API - Hard Delete
const deleteHomeBanner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Banner ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Banner ID format");
    }

    const banner = await HomeBanner.findById(id);

    if (!banner) {
      throw new ApiError(404, "Banner not found");
    }

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
    await HomeBanner.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Banner permanently deleted from database",
        },
        "Banner deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete banner error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting banner");
  }
});

// Toggle Home Banner Status API
const toggleHomeBannerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Banner ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Banner ID format");
  }

  const banner = await HomeBanner.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  const updatedBanner = await HomeBanner.findByIdAndUpdate(
    id,
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

// Bulk Update Order API
const updateBannerOrder = asyncHandler(async (req, res) => {
  const { banners } = req.body; // [{id: "bannerId", order: 0}]

  if (!banners || !Array.isArray(banners) || banners.length === 0) {
    throw new ApiError(400, "Banners data is required");
  }

  const bulkOperations = banners.map((item) => ({
    updateOne: {
      filter: { _id: item.id },
      update: {
        $set: {
          order: item.order,
          updatedBy: req.user?._id,
        },
      },
    },
  }));

  await HomeBanner.bulkWrite(bulkOperations);

  const updatedBanners = await HomeBanner.find({
    _id: { $in: banners.map((item) => item.id) },
  })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort({ order: 1 });

  const transformedBanners = updatedBanners.map((banner) =>
    transformBannerData(banner)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBanners,
        "Banner order updated successfully"
      )
    );
});

export {
  createHomeBanner,
  getHomeBannerById,
  getHomeBannerList,
  getActiveHomeBanners,
  updateHomeBanner,
  deleteHomeBanner,
  toggleHomeBannerStatus,
  updateBannerOrder,
};

// src/controllers/package.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Package } from "../models/package.model.js";
import mongoose from "mongoose";

// Transform package data for consistent response
const transformPackageData = (pkg) => {
  return {
    id: pkg._id.toString(),
    name: pkg.name,
    price: pkg.price,
    billing: pkg.billing,
    description: pkg.description,
    buttonText: pkg.buttonText,
    theme: pkg.theme,
    badge: pkg.badge || "",
    features: pkg.features || [],
    order: pkg.order,
    is_active: pkg.is_active,
    createdBy: pkg.createdBy,
    updatedBy: pkg.updatedBy,
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
  };
};

// Create Package API
const createPackage = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    billing,
    description,
    buttonText,
    theme,
    badge,
    features,
    order,
    is_active,
  } = req.body;
  const userId = req.user._id;

  // Required field validation
  if (!name) throw new ApiError(400, "Package name is required");
  if (!price) throw new ApiError(400, "Price is required");
  if (!billing) throw new ApiError(400, "Billing information is required");
  if (!description) throw new ApiError(400, "Description is required");
  if (!features || !Array.isArray(features) || features.length === 0) {
    throw new ApiError(400, "At least one feature is required");
  }
  if (!userId) throw new ApiError(400, "User is required");

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) throw new ApiError(404, "User not found");

  // Create package data
  const packageData = {
    name,
    price,
    billing,
    description,
    buttonText: buttonText || "Get Started",
    theme: theme || "light",
    badge: badge || "",
    features,
    order: order || 0,
    is_active: is_active !== undefined ? is_active : true,
    createdBy: userId,
  };

  try {
    const pkg = await Package.create(packageData);
    const createdPackage = await Package.findById(pkg._id).populate(
      "createdBy updatedBy",
      "userName fullName bio image"
    );

    if (!createdPackage) {
      throw new ApiError(500, "Something went wrong while creating package");
    }

    const transformedPackage = transformPackageData(createdPackage);

    return res
      .status(201)
      .json(
        new ApiResponse(201, transformedPackage, "Package created successfully")
      );
  } catch (error) {
    console.error("Package creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Package validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while creating package");
  }
});

// Get Package by ID API
const getPackageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Package ID is required");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Package ID format");
  }

  const pkg = await Package.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!pkg) throw new ApiError(404, "Package not found");

  const transformedPackage = transformPackageData(pkg);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedPackage, "Package fetched successfully")
    );
});

// Get All Packages List API (with pagination, search, filter)
const getPackageList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "order",
    sortOrder = "asc",
    is_active,
  } = req.query;

  // Build query object
  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
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
  const packages = await Package.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Transform packages data
  const transformedPackages = packages.map((pkg) => transformPackageData(pkg));

  // Get total count for pagination
  const totalCount = await Package.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        packages: transformedPackages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Packages fetched successfully"
    )
  );
});

// Get Active Packages API (for frontend)
const getActivePackages = asyncHandler(async (req, res) => {
  const packages = await Package.find({ is_active: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "userName fullName bio image");

  const transformedPackages = packages.map((pkg) => transformPackageData(pkg));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedPackages,
        "Active packages fetched successfully"
      )
    );
});

// Update Package API
const updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  if (!id) throw new ApiError(400, "Package ID is required");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Package ID format");
  }

  const pkg = await Package.findById(id);
  if (!pkg) throw new ApiError(404, "Package not found");

  // Parse boolean fields that might come as strings
  const booleanFields = ["is_active"];

  booleanFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      if (updateData[field] === "true" || updateData[field] === "false") {
        updateData[field] = updateData[field] === "true";
      }
    }
  });

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

  const updatedPackage = await Package.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedPackage = transformPackageData(updatedPackage);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedPackage, "Package updated successfully")
    );
});

// Delete Package API - Hard Delete
const deletePackage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(400, "Package ID is required");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Package ID format");
    }

    const pkg = await Package.findById(id);
    if (!pkg) throw new ApiError(404, "Package not found");

    // Hard Delete
    await Package.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Package permanently deleted from database",
        },
        "Package deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete package error:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Internal server error while deleting package");
  }
});

// Toggle Package Status API
const togglePackageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Package ID is required");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Package ID format");
  }

  const pkg = await Package.findById(id);
  if (!pkg) throw new ApiError(404, "Package not found");

  const updatedPackage = await Package.findByIdAndUpdate(
    id,
    {
      is_active: !pkg.is_active,
      updatedBy: req.user?._id || pkg.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedPackage = transformPackageData(updatedPackage);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedPackage,
        `Package ${updatedPackage.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Update Order API
const updatePackageOrder = asyncHandler(async (req, res) => {
  const { packages } = req.body;

  if (!packages || !Array.isArray(packages) || packages.length === 0) {
    throw new ApiError(400, "Packages data is required");
  }

  const bulkOperations = packages.map((item) => ({
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

  await Package.bulkWrite(bulkOperations);

  const updatedPackages = await Package.find({
    _id: { $in: packages.map((item) => item.id) },
  })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort({ order: 1 });

  const transformedPackages = updatedPackages.map((pkg) =>
    transformPackageData(pkg)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedPackages,
        "Package order updated successfully"
      )
    );
});

export {
  createPackage,
  getPackageById,
  getPackageList,
  getActivePackages,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  updatePackageOrder,
};

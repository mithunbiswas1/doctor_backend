// src/controllers/homeIndustry.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HomeIndustry } from "../models/homeIndustry.model.js";
import mongoose from "mongoose";

// Transform industry data for consistent response
const transformIndustryData = (industry) => {
  return {
    id: industry._id.toString(),
    title: industry.title,
    description: industry.description,
    image: industry.image,
    is_active: industry.is_active,
    order: industry.order,
    createdBy: industry.createdBy,
    updatedBy: industry.updatedBy,
    createdAt: industry.createdAt,
    updatedAt: industry.updatedAt,
  };
};

// Create Home Industry API
const createHomeIndustry = asyncHandler(async (req, res) => {
  const { title, description, is_active, order } = req.body;

  const userId = req.user._id;

  // Handle file upload
  let industryImage = "default-industry.png";

  if (req.file) {
    industryImage = `public/upload/${req.file.filename}`;
  }

  // Required field validation
  if (!title) {
    throw new ApiError(400, "Industry title is required");
  }

  if (!description) {
    throw new ApiError(400, "Industry description is required");
  }

  if (!req.file) {
    throw new ApiError(400, "Industry image is required");
  }

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Create industry data
  const industryData = {
    title,
    description,
    image: industryImage,
    is_active: is_active !== undefined ? is_active : true,
    order: order || 0,
    createdBy: userId,
  };

  try {
    const industry = await HomeIndustry.create(industryData);

    const createdIndustry = await HomeIndustry.findById(industry._id).populate(
      "createdBy",
      "userName fullName bio image"
    );

    if (!createdIndustry) {
      throw new ApiError(500, "Something went wrong while creating industry");
    }

    const transformedIndustry = transformIndustryData(createdIndustry);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          transformedIndustry,
          "Industry created successfully"
        )
      );
  } catch (error) {
    console.error("Industry creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Industry validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while creating industry");
  }
});

// Get Home Industry by ID API
const getHomeIndustryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Industry ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Industry ID format");
  }

  const industry = await HomeIndustry.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!industry) {
    throw new ApiError(404, "Industry not found");
  }

  const transformedIndustry = transformIndustryData(industry);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedIndustry, "Industry fetched successfully")
    );
});

// Get All Home Industries List API (with pagination, search, filter)
const getHomeIndustryList = asyncHandler(async (req, res) => {
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
      { title: { $regex: search, $options: "i" } },
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
  const industries = await HomeIndustry.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Transform industries data
  const transformedIndustries = industries.map((industry) =>
    transformIndustryData(industry)
  );

  // Get total count for pagination
  const totalCount = await HomeIndustry.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        industries: transformedIndustries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Industries fetched successfully"
    )
  );
});

// Get Active Home Industries List API (for frontend)
const getActiveHomeIndustries = asyncHandler(async (req, res) => {
  const industries = await HomeIndustry.find({ is_active: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "userName fullName bio image");

  const transformedIndustries = industries.map((industry) =>
    transformIndustryData(industry)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedIndustries,
        "Active industries fetched successfully"
      )
    );
});

// Update Home Industry API
const updateHomeIndustry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  if (!id) {
    throw new ApiError(400, "Industry ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Industry ID format");
  }

  const industry = await HomeIndustry.findById(id);
  if (!industry) {
    throw new ApiError(404, "Industry not found");
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
    updateData.image = `public/upload/${req.file.filename}`;
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

  const updatedIndustry = await HomeIndustry.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedIndustry = transformIndustryData(updatedIndustry);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedIndustry, "Industry updated successfully")
    );
});

// Delete Home Industry API - Hard Delete
const deleteHomeIndustry = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Industry ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Industry ID format");
    }

    const industry = await HomeIndustry.findById(id);

    if (!industry) {
      throw new ApiError(404, "Industry not found");
    }

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
    await HomeIndustry.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Industry permanently deleted from database",
        },
        "Industry deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete industry error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting industry");
  }
});

// Toggle Home Industry Status API
const toggleHomeIndustryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Industry ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Industry ID format");
  }

  const industry = await HomeIndustry.findById(id);
  if (!industry) {
    throw new ApiError(404, "Industry not found");
  }

  const updatedIndustry = await HomeIndustry.findByIdAndUpdate(
    id,
    {
      is_active: !industry.is_active,
      updatedBy: req.user?._id || industry.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedIndustry = transformIndustryData(updatedIndustry);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedIndustry,
        `Industry ${updatedIndustry.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Update Order API
const updateIndustryOrder = asyncHandler(async (req, res) => {
  const { industries } = req.body; // [{id: "industryId", order: 0}]

  if (!industries || !Array.isArray(industries) || industries.length === 0) {
    throw new ApiError(400, "Industries data is required");
  }

  const bulkOperations = industries.map((item) => ({
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

  await HomeIndustry.bulkWrite(bulkOperations);

  const updatedIndustries = await HomeIndustry.find({
    _id: { $in: industries.map((item) => item.id) },
  })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort({ order: 1 });

  const transformedIndustries = updatedIndustries.map((industry) =>
    transformIndustryData(industry)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedIndustries,
        "Industry order updated successfully"
      )
    );
});

export {
  createHomeIndustry,
  getHomeIndustryById,
  getHomeIndustryList,
  getActiveHomeIndustries,
  updateHomeIndustry,
  deleteHomeIndustry,
  toggleHomeIndustryStatus,
  updateIndustryOrder,
};

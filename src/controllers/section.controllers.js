// src/controllers/section.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Section } from "../models/section.model.js";
import mongoose from "mongoose";

// Transform section data for consistent response
const transformSectionData = (section) => {
  return {
    id: section._id.toString(),
    name: section.name,
    slug: section.slug,
    description: section.description,
    image: section.image,
    is_active: section.is_active,
    createdBy: section.createdBy,
    updatedBy: section.updatedBy,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
};

// Create Section API
const createSection = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;

  const userId = req.user._id;

  // Validation
  if (!name) {
    throw new ApiError(400, "Section name is required");
  }

  if (name.length < 2) {
    throw new ApiError(400, "Section name must be at least 2 characters long");
  }

  // Check if section already exists
  const existingSection = await Section.findOne({
    $or: [{ name: name.trim() }, { slug: slug }],
  });

  if (existingSection) {
    const conflict = existingSection.name === name.trim() ? "Name" : "Slug";
    throw new ApiError(409, `${conflict} already exists`);
  }

  // Handle image upload
  let imagePath = "default-section.png";
  if (req.file) {
    imagePath = `public/upload/${req.file.filename}`;
  }

  // Generate slug if not provided
  let finalSlug = slug;
  if (!finalSlug) {
    finalSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Create section
  const section = await Section.create({
    name: name.trim(),
    slug: finalSlug,
    description: description || "",
    image: imagePath,
    createdBy: userId,
    updatedBy: userId,
  });

  // Populate user info
  const populatedSection = await Section.findById(section._id)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedSection = transformSectionData(populatedSection);

  return res
    .status(201)
    .json(
      new ApiResponse(201, transformedSection, "Section created successfully")
    );
});

// Get All Sections API with Pagination (Public)
const getAllSections = asyncHandler(async (req, res) => {
  const {
    is_active,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = req.query;

  // Convert page and limit to numbers
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Build query
  const query = {};

  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Calculate skip
  const skip = (pageNum - 1) * limitNum;

  // Get total count for pagination
  const totalCount = await Section.countDocuments(query);

  // Get sections with pagination
  const sections = await Section.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)
    .lean();

  const transformedSections = sections.map(transformSectionData);

  // Pagination info
  const totalPages = Math.ceil(totalCount / limitNum);
  const currentPage = pageNum;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: transformedSections,
        pagination: {
          currentPage,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      },
      "Sections fetched successfully"
    )
  );
});

// Get Active Sections API (Public)
const getActiveSections = asyncHandler(async (req, res) => {
  const sections = await Section.getActiveSections()
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedSections = sections.map(transformSectionData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedSections,
        "Active sections fetched successfully"
      )
    );
});

// Get Section by ID API
const getSectionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid section ID format");
  }

  const section = await Section.findById(id)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const transformedSection = transformSectionData(section);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSection, "Section fetched successfully")
    );
});

// Get Section by Slug API (Public)
const getSectionBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const section = await Section.findOne({ slug })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const transformedSection = transformSectionData(section);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSection, "Section fetched successfully")
    );
});

// Update Section API
const updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, is_active } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid section ID format");
  }

  // Check if section exists
  const section = await Section.findById(id);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  // Check for duplicate name
  if (name && name !== section.name) {
    const existingSection = await Section.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existingSection) {
      throw new ApiError(409, "Section name already exists");
    }
  }

  // Check for duplicate slug
  if (slug && slug !== section.slug) {
    const existingSection = await Section.findOne({
      slug: slug,
      _id: { $ne: id },
    });
    if (existingSection) {
      throw new ApiError(409, "Section slug already exists");
    }
  }

  // Handle image upload
  let imagePath = section.image;
  if (req.file) {
    imagePath = `public/upload/${req.file.filename}`;
  }

  // Build update data
  const updateData = {
    updatedBy: userId,
  };

  if (name) updateData.name = name.trim();
  if (slug) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (is_active !== undefined) updateData.is_active = is_active;
  if (req.file) updateData.image = imagePath;

  // Update section
  const updatedSection = await Section.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedSection = transformSectionData(updatedSection);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedSection, "Section updated successfully")
    );
});

// Delete Section API
const deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid section ID format");
  }

  const section = await Section.findById(id);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  await Section.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Section deleted successfully"));
});

// Toggle Section Status API
const toggleSectionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid section ID format");
  }

  const section = await Section.findById(id);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const updatedSection = await Section.findByIdAndUpdate(
    id,
    {
      is_active: !section.is_active,
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedSection = transformSectionData(updatedSection);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedSection,
        `Section ${updatedSection.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Delete Sections API
const bulkDeleteSections = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of section IDs");
  }

  // Validate all IDs
  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid section IDs: ${invalidIds.join(", ")}`);
  }

  // Check if all sections exist
  const sections = await Section.find({ _id: { $in: ids } });
  if (sections.length !== ids.length) {
    throw new ApiError(404, "Some sections not found");
  }

  // Delete sections
  await Section.deleteMany({ _id: { $in: ids } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: sections.length },
        `${sections.length} sections deleted successfully`
      )
    );
});

export {
  createSection,
  getAllSections,
  getActiveSections,
  getSectionById,
  getSectionBySlug,
  updateSection,
  deleteSection,
  toggleSectionStatus,
  bulkDeleteSections,
};

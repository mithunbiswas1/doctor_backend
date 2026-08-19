// src/controllers/category.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

// Transform category data for consistent response
const transformCategoryData = (category) => {
  return {
    id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    is_active: category.is_active,
    createdBy: category.createdBy,
    updatedBy: category.updatedBy,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

// Create Category API
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description } = req.body;

  const userId = req.user._id;

  // Validation
  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  if (name.length < 2) {
    throw new ApiError(400, "Category name must be at least 2 characters long");
  }

  // Check if category already exists
  const existingCategory = await Category.findOne({
    $or: [{ name: name.trim() }, { slug: slug }],
  });

  if (existingCategory) {
    const conflict = existingCategory.name === name.trim() ? "Name" : "Slug";
    throw new ApiError(409, `${conflict} already exists`);
  }

  // Handle image upload
  let imagePath = "default-category.png";
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

  // Create category
  const category = await Category.create({
    name: name.trim(),
    slug: finalSlug,
    description: description || "",
    image: imagePath,
    createdBy: userId,
    updatedBy: userId,
  });

  // Populate user info
  const populatedCategory = await Category.findById(category._id)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedCategory = transformCategoryData(populatedCategory);

  return res
    .status(201)
    .json(
      new ApiResponse(201, transformedCategory, "Category created successfully")
    );
});

// Get All Categories API (Public)
const getAllCategories = asyncHandler(async (req, res) => {
  const {
    is_active,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

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

  const categories = await Category.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .lean();

  const transformedCategories = categories.map(transformCategoryData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedCategories,
        "Categories fetched successfully"
      )
    );
});

// Get Active Categories API (Public)
const getActiveCategories = asyncHandler(async (req, res) => {
  const categories = await Category.getActiveCategories()
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedCategories = categories.map(transformCategoryData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedCategories,
        "Active categories fetched successfully"
      )
    );
});

// Get Category by ID API
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const category = await Category.findById(id)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const transformedCategory = transformCategoryData(category);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedCategory, "Category fetched successfully")
    );
});

// Get Category by Slug API (Public)
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const category = await Category.findOne({ slug })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const transformedCategory = transformCategoryData(category);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedCategory, "Category fetched successfully")
    );
});

// Update Category API
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, is_active } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check for duplicate name
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existingCategory) {
      throw new ApiError(409, "Category name already exists");
    }
  }

  // Check for duplicate slug
  if (slug && slug !== category.slug) {
    const existingCategory = await Category.findOne({
      slug: slug,
      _id: { $ne: id },
    });
    if (existingCategory) {
      throw new ApiError(409, "Category slug already exists");
    }
  }

  // Handle image upload
  let imagePath = category.image;
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

  // Update category
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedCategory = transformCategoryData(updatedCategory);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedCategory, "Category updated successfully")
    );
});

// Delete Category API
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await Category.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

// Toggle Category Status API
const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      is_active: !category.is_active,
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedCategory = transformCategoryData(updatedCategory);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedCategory,
        `Category ${updatedCategory.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Delete Categories API
const bulkDeleteCategories = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of category IDs");
  }

  // Validate all IDs
  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid category IDs: ${invalidIds.join(", ")}`);
  }

  // Check if all categories exist
  const categories = await Category.find({ _id: { $in: ids } });
  if (categories.length !== ids.length) {
    throw new ApiError(404, "Some categories not found");
  }

  // Delete categories
  await Category.deleteMany({ _id: { $in: ids } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: categories.length },
        `${categories.length} categories deleted successfully`
      )
    );
});

export {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  bulkDeleteCategories,
};

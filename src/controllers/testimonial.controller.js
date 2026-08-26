// src/controllers/testimonial.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Testimonial } from "../models/testimonial.model.js";
import mongoose from "mongoose";

// Transform testimonial data
const transformTestimonialData = (testimonial) => {
  return {
    id: testimonial._id.toString(),
    name: testimonial.name,
    name_hi: testimonial.name_hi || "",
    comment: testimonial.comment,
    comment_hi: testimonial.comment_hi || "",
    video_url: testimonial.video_url,
    image: testimonial.image,
    rating: testimonial.rating || 5,
    order: testimonial.order || 0,
    is_featured: testimonial.is_featured || false,
    is_active: testimonial.is_active,
    createdBy: testimonial.createdBy,
    updatedBy: testimonial.updatedBy,
    createdAt: testimonial.createdAt,
    updatedAt: testimonial.updatedAt,
  };
};

// Create Testimonial
const createTestimonial = asyncHandler(async (req, res) => {
  const {
    name,
    name_hi,
    comment,
    comment_hi,
    video_url,
    rating,
    order,
    is_featured,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Required field validation
  if (!name) {
    throw new ApiError(400, "Name is required");
  }
  if (!comment) {
    throw new ApiError(400, "Comment is required");
  }
  if (!video_url) {
    throw new ApiError(400, "Video URL is required");
  }
  if (!req.file) {
    throw new ApiError(400, "Patient image is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // If this testimonial is featured, remove featured from others
  if (is_featured === true || is_featured === "true") {
    await Testimonial.updateMany({ is_featured: true }, { is_featured: false });
  }

  // Prepare testimonial data
  const testimonialData = {
    name,
    name_hi: name_hi || "",
    comment,
    comment_hi: comment_hi || "",
    video_url,
    image: `public/upload/${req.file.filename}`,
    rating: rating || 5,
    order: order || 0,
    is_featured: is_featured === "true" || is_featured === true,
    is_active: is_active !== undefined ? is_active : true,
    createdBy: userId,
  };

  const testimonial = await Testimonial.create(testimonialData);
  const createdTestimonial = await Testimonial.findById(
    testimonial._id
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedTestimonial = transformTestimonialData(createdTestimonial);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        transformedTestimonial,
        "Testimonial created successfully"
      )
    );
});

// Get All Testimonials
const getTestimonials = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "order",
    sortOrder = "asc",
    is_active,
    is_featured,
  } = req.query;

  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { comment: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by active status
  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  // Filter by featured
  if (is_featured !== undefined) {
    query.is_featured = is_featured === "true";
  }

  // Sort options
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  const testimonials = await Testimonial.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const transformedTestimonials = testimonials.map((testimonial) =>
    transformTestimonialData(testimonial)
  );

  const totalCount = await Testimonial.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        testimonials: transformedTestimonials,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Testimonials fetched successfully"
    )
  );
});

// Get Active Testimonials (for frontend)
const getActiveTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ is_active: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "userName fullName bio image");

  const transformedTestimonials = testimonials.map((testimonial) =>
    transformTestimonialData(testimonial)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedTestimonials,
        "Active testimonials fetched successfully"
      )
    );
});

// Get Featured Testimonial
const getFeaturedTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findOne({
    is_active: true,
    is_featured: true,
  }).populate("createdBy", "userName fullName bio image");

  if (!testimonial) {
    throw new ApiError(404, "Featured testimonial not found");
  }

  const transformedTestimonial = transformTestimonialData(testimonial);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedTestimonial,
        "Featured testimonial fetched successfully"
      )
    );
});

// Get Testimonial by ID
const getTestimonialById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Testimonial ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Testimonial ID format");
  }

  const testimonial = await Testimonial.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  const transformedTestimonial = transformTestimonialData(testimonial);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedTestimonial,
        "Testimonial fetched successfully"
      )
    );
});

// Update Testimonial
const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    name_hi,
    comment,
    comment_hi,
    video_url,
    rating,
    order,
    is_featured,
    is_active,
  } = req.body;

  if (!id) {
    throw new ApiError(400, "Testimonial ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Testimonial ID format");
  }

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  // If this testimonial is being set as featured, remove featured from others
  if (is_featured === true || is_featured === "true") {
    await Testimonial.updateMany(
      { _id: { $ne: id }, is_featured: true },
      { is_featured: false }
    );
  }

  // Prepare update data
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (name_hi !== undefined) updateData.name_hi = name_hi;
  if (comment !== undefined) updateData.comment = comment;
  if (comment_hi !== undefined) updateData.comment_hi = comment_hi;
  if (video_url !== undefined) updateData.video_url = video_url;
  if (rating !== undefined) updateData.rating = rating;
  if (order !== undefined) updateData.order = order;
  if (is_featured !== undefined) {
    updateData.is_featured = is_featured === "true" || is_featured === true;
  }
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Handle file upload
  if (req.file) {
    updateData.image = `public/upload/${req.file.filename}`;
  }

  // Add updatedBy
  if (req.user?._id) {
    updateData.updatedBy = req.user._id;
  }

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedTestimonial = transformTestimonialData(updatedTestimonial);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedTestimonial,
        "Testimonial updated successfully"
      )
    );
});

// Delete Testimonial
const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Testimonial ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Testimonial ID format");
  }

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  await Testimonial.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedId: id,
        message: "Testimonial permanently deleted from database",
      },
      "Testimonial deleted successfully"
    )
  );
});

// Toggle Testimonial Status
const toggleTestimonialStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Testimonial ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Testimonial ID format");
  }

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  const updatedTestimonial = await Testimonial.findByIdAndUpdate(
    id,
    {
      is_active: !testimonial.is_active,
      updatedBy: req.user?._id || testimonial.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedTestimonial = transformTestimonialData(updatedTestimonial);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedTestimonial,
        `Testimonial ${updatedTestimonial.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Update Order
const updateTestimonialOrder = asyncHandler(async (req, res) => {
  const { testimonials } = req.body;

  if (
    !testimonials ||
    !Array.isArray(testimonials) ||
    testimonials.length === 0
  ) {
    throw new ApiError(400, "Testimonials data is required");
  }

  const bulkOperations = testimonials.map((item) => ({
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

  await Testimonial.bulkWrite(bulkOperations);

  const updatedTestimonials = await Testimonial.find({
    _id: { $in: testimonials.map((item) => item.id) },
  })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort({ order: 1 });

  const transformedTestimonials = updatedTestimonials.map((testimonial) =>
    transformTestimonialData(testimonial)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedTestimonials,
        "Testimonial order updated successfully"
      )
    );
});

export {
  createTestimonial,
  getTestimonials,
  getActiveTestimonials,
  getFeaturedTestimonial,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  updateTestimonialOrder,
};

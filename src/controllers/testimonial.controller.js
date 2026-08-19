// src/controllers/testimonial.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Testimonial } from "../models/testimonial.model.js";
import mongoose from "mongoose";

// Transform testimonial data for consistent response
const transformTestimonialData = (testimonial) => {
  return {
    id: testimonial._id.toString(),
    message: testimonial.message,
    name: testimonial.name,
    position: testimonial.position,
    company: testimonial.company,
    image: testimonial.image,
    rating: testimonial.rating,
    is_active: testimonial.is_active,
    order: testimonial.order,
    createdBy: testimonial.createdBy,
    updatedBy: testimonial.updatedBy,
    createdAt: testimonial.createdAt,
    updatedAt: testimonial.updatedAt,
  };
};

// Create Testimonial API
const createTestimonial = asyncHandler(async (req, res) => {
  const { message, name, position, company, rating, is_active, order } =
    req.body;

  const userId = req.user._id;

  // Handle file upload
  let testimonialImage = "default-testimonial.png";

  if (req.file) {
    testimonialImage = `public/upload/${req.file.filename}`;
  }

  // Required field validation
  if (!message) {
    throw new ApiError(400, "Testimonial message is required");
  }

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  if (!position) {
    throw new ApiError(400, "Position is required");
  }

  if (!company) {
    throw new ApiError(400, "Company name is required");
  }

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Create testimonial data
  const testimonialData = {
    message,
    name,
    position,
    company,
    image: testimonialImage,
    rating: rating || 5,
    is_active: is_active !== undefined ? is_active : true,
    order: order || 0,
    createdBy: userId,
  };

  try {
    const testimonial = await Testimonial.create(testimonialData);

    const createdTestimonial = await Testimonial.findById(
      testimonial._id
    ).populate("createdBy", "userName fullName bio image");

    if (!createdTestimonial) {
      throw new ApiError(
        500,
        "Something went wrong while creating testimonial"
      );
    }

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
  } catch (error) {
    console.error("Testimonial creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(
        400,
        `Testimonial validation failed: ${error.message}`
      );
    }
    throw new ApiError(500, "Internal server error while creating testimonial");
  }
});

// Get Testimonial by ID API
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

// Get All Testimonials List API (with pagination, search, filter)
const getTestimonialList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    is_active,
    rating,
  } = req.query;

  // Build query object
  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { message: { $regex: search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by active status
  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  // Filter by rating
  if (rating) {
    query.rating = parseInt(rating);
  }

  // Sort options
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // Execute query with pagination
  const testimonials = await Testimonial.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Transform testimonials data
  const transformedTestimonials = testimonials.map((testimonial) =>
    transformTestimonialData(testimonial)
  );

  // Get total count for pagination
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

// Get Active Testimonials List API (for frontend)
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

// Update Testimonial API
const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

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

// Delete Testimonial API - Hard Delete
const deleteTestimonial = asyncHandler(async (req, res) => {
  try {
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

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
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
  } catch (error) {
    console.error("Delete testimonial error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting testimonial");
  }
});

// Toggle Testimonial Status API
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

// Bulk Update Order API
const updateTestimonialOrder = asyncHandler(async (req, res) => {
  const { testimonials } = req.body; // [{id: "testimonialId", order: 0}]

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
  getTestimonialById,
  getTestimonialList,
  getActiveTestimonials,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  updateTestimonialOrder,
};

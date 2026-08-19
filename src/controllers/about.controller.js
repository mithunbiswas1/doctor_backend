// src/controllers/about.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { About } from "../models/about.model.js";
import mongoose from "mongoose";

// Transform about data for consistent response
const transformAboutData = (about) => {
  return {
    id: about._id.toString(),
    banner_image: about.banner_image,
    title: about.title,
    short_description: about.short_description,
    chairman_image: about.chairman_image,
    chairman_message: about.chairman_message,
    chairman_name: about.chairman_name,
    chairman_designation: about.chairman_designation,
    mission: about.mission,
    vision: about.vision,
    is_active: about.is_active,
    createdBy: about.createdBy,
    updatedBy: about.updatedBy,
    createdAt: about.createdAt,
    updatedAt: about.updatedAt,
  };
};

// Create or Update About Page API
const createOrUpdateAbout = asyncHandler(async (req, res) => {
  const {
    title,
    short_description,
    chairman_message,
    chairman_name,
    chairman_designation,
    mission,
    vision,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Required field validation
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!short_description) {
    throw new ApiError(400, "Short description is required");
  }

  if (!chairman_message) {
    throw new ApiError(400, "Chairman message is required");
  }

  if (!chairman_name) {
    throw new ApiError(400, "Chairman name is required");
  }

  if (!chairman_designation) {
    throw new ApiError(400, "Chairman designation is required");
  }

  if (!mission) {
    throw new ApiError(400, "Mission is required");
  }

  if (!vision) {
    throw new ApiError(400, "Vision is required");
  }

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Check if about page already exists
  let existingAbout = await About.findOne();

  // Handle file uploads
  let bannerImage = "default-banner.png";
  let chairmanImage = "default-chairman.png";

  if (req.files) {
    if (req.files.banner_image) {
      bannerImage = `public/upload/${req.files.banner_image[0].filename}`;
    }
    if (req.files.chairman_image) {
      chairmanImage = `public/upload/${req.files.chairman_image[0].filename}`;
    }
  }

  const aboutData = {
    title,
    short_description,
    chairman_message,
    chairman_name,
    chairman_designation,
    mission,
    vision,
    is_active: is_active !== undefined ? is_active : true,
    updatedBy: userId,
  };

  // Add images only if uploaded
  if (req.files) {
    if (req.files.banner_image) {
      aboutData.banner_image = bannerImage;
    }
    if (req.files.chairman_image) {
      aboutData.chairman_image = chairmanImage;
    }
  }

  let about;

  if (existingAbout) {
    // Update existing about page
    about = await About.findByIdAndUpdate(
      existingAbout._id,
      { $set: aboutData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "userName fullName bio image");
  } else {
    // Create new about page
    aboutData.createdBy = userId;
    about = await About.create(aboutData);
    about = await About.findById(about._id).populate(
      "createdBy updatedBy",
      "userName fullName bio image"
    );
  }

  if (!about) {
    throw new ApiError(500, "Something went wrong while saving about page");
  }

  const transformedAbout = transformAboutData(about);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedAbout,
        existingAbout
          ? "About page updated successfully"
          : "About page created successfully"
      )
    );
});

// Get About Page API
const getAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne().populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!about) {
    throw new ApiError(404, "About page not found");
  }

  const transformedAbout = transformAboutData(about);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedAbout, "About page fetched successfully")
    );
});

// Get About Page by ID API
const getAboutById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "About ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid About ID format");
  }

  const about = await About.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!about) {
    throw new ApiError(404, "About page not found");
  }

  const transformedAbout = transformAboutData(about);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedAbout, "About page fetched successfully")
    );
});

// Toggle About Status API
const toggleAboutStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "About ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid About ID format");
  }

  const about = await About.findById(id);
  if (!about) {
    throw new ApiError(404, "About page not found");
  }

  const updatedAbout = await About.findByIdAndUpdate(
    id,
    {
      is_active: !about.is_active,
      updatedBy: req.user?._id || about.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedAbout = transformAboutData(updatedAbout);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedAbout,
        `About page ${updatedAbout.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

export { createOrUpdateAbout, getAbout, getAboutById, toggleAboutStatus };

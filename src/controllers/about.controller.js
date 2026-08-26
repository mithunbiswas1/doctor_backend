// src/controllers/about.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { About } from "../models/about.model.js";
import mongoose from "mongoose";

// Transform about data
const transformAboutData = (about) => {
  return {
    id: about._id.toString(),
    // Page Banner
    page_banner_title: about.page_banner_title,
    page_banner_title_hi: about.page_banner_title_hi || "",
    page_banner_subtitle: about.page_banner_subtitle,
    page_banner_subtitle_hi: about.page_banner_subtitle_hi || "",
    page_banner_image: about.page_banner_image,
    // Chairman
    chairman_image: about.chairman_image,
    chairman_name: about.chairman_name,
    chairman_name_hi: about.chairman_name_hi || "",
    chairman_designation: about.chairman_designation,
    chairman_designation_hi: about.chairman_designation_hi || "",
    chairman_message: about.chairman_message,
    chairman_message_hi: about.chairman_message_hi || "",
    // Mission & Vision
    mission: about.mission,
    mission_hi: about.mission_hi || "",
    vision: about.vision,
    vision_hi: about.vision_hi || "",
    // Areas of Expertise
    areas_of_expertise: about.areas_of_expertise || "",
    areas_of_expertise_hi: about.areas_of_expertise_hi || "",
    // Status
    is_active: about.is_active,
    createdBy: about.createdBy,
    updatedBy: about.updatedBy,
    createdAt: about.createdAt,
    updatedAt: about.updatedAt,
  };
};

// Create or Update About
const createOrUpdateAbout = asyncHandler(async (req, res) => {
  const {
    // Page Banner
    page_banner_title,
    page_banner_title_hi,
    page_banner_subtitle,
    page_banner_subtitle_hi,
    // Chairman
    chairman_name,
    chairman_name_hi,
    chairman_designation,
    chairman_designation_hi,
    chairman_message,
    chairman_message_hi,
    // Mission & Vision
    mission,
    mission_hi,
    vision,
    vision_hi,
    // Areas of Expertise
    areas_of_expertise,
    areas_of_expertise_hi,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Required field validation
  if (!page_banner_title) {
    throw new ApiError(400, "Page banner title is required");
  }
  if (!page_banner_subtitle) {
    throw new ApiError(400, "Page banner subtitle is required");
  }
  if (!chairman_name) {
    throw new ApiError(400, "Chairman name is required");
  }
  if (!chairman_designation) {
    throw new ApiError(400, "Chairman designation is required");
  }
  if (!chairman_message) {
    throw new ApiError(400, "Chairman message is required");
  }
  if (!mission) {
    throw new ApiError(400, "Mission is required");
  }
  if (!vision) {
    throw new ApiError(400, "Vision is required");
  }
  if (!areas_of_expertise) {
    throw new ApiError(400, "Areas of expertise is required");
  }
  if (!req.files || !req.files.page_banner_image || !req.files.chairman_image) {
    throw new ApiError(
      400,
      "Both page banner image and chairman image are required"
    );
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Prepare update data
  const updateData = {
    // Page Banner
    page_banner_title,
    page_banner_title_hi: page_banner_title_hi || "",
    page_banner_subtitle,
    page_banner_subtitle_hi: page_banner_subtitle_hi || "",
    page_banner_image: `public/upload/${req.files.page_banner_image[0].filename}`,
    // Chairman
    chairman_name,
    chairman_name_hi: chairman_name_hi || "",
    chairman_designation,
    chairman_designation_hi: chairman_designation_hi || "",
    chairman_message,
    chairman_message_hi: chairman_message_hi || "",
    chairman_image: `public/upload/${req.files.chairman_image[0].filename}`,
    // Mission & Vision
    mission,
    mission_hi: mission_hi || "",
    vision,
    vision_hi: vision_hi || "",
    // Areas of Expertise
    areas_of_expertise: areas_of_expertise || "",
    areas_of_expertise_hi: areas_of_expertise_hi || "",
    updatedBy: userId,
  };

  // Handle is_active
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Find existing about or create new one
  let about = await About.findOne();

  if (about) {
    about = await About.findByIdAndUpdate(
      about._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("createdBy updatedBy", "userName fullName bio image");
  } else {
    updateData.createdBy = userId;
    about = await About.create(updateData);
    about = await About.findById(about._id).populate(
      "createdBy updatedBy",
      "userName fullName bio image"
    );
  }

  const transformedAbout = transformAboutData(about);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedAbout,
        about ? "About updated successfully" : "About created successfully"
      )
    );
});

// Get About
const getAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne().populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!about) {
    throw new ApiError(404, "About not found");
  }

  const transformedAbout = transformAboutData(about);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedAbout, "About fetched successfully"));
});

// Get Active About (for frontend)
const getActiveAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne({ is_active: true }).populate(
    "createdBy",
    "userName fullName bio image"
  );

  if (!about) {
    throw new ApiError(404, "Active about not found");
  }

  const transformedAbout = transformAboutData(about);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedAbout,
        "Active about fetched successfully"
      )
    );
});

// Update About
const updateAbout = asyncHandler(async (req, res) => {
  const {
    page_banner_title,
    page_banner_title_hi,
    page_banner_subtitle,
    page_banner_subtitle_hi,
    chairman_name,
    chairman_name_hi,
    chairman_designation,
    chairman_designation_hi,
    chairman_message,
    chairman_message_hi,
    mission,
    mission_hi,
    vision,
    vision_hi,
    areas_of_expertise,
    areas_of_expertise_hi,
    is_active,
  } = req.body;

  const userId = req.user._id;

  // Find existing about
  const about = await About.findOne();
  if (!about) {
    throw new ApiError(404, "About not found");
  }

  // Prepare update data
  const updateData = {};

  // Page Banner
  if (page_banner_title) updateData.page_banner_title = page_banner_title;
  if (page_banner_title_hi !== undefined)
    updateData.page_banner_title_hi = page_banner_title_hi;
  if (page_banner_subtitle)
    updateData.page_banner_subtitle = page_banner_subtitle;
  if (page_banner_subtitle_hi !== undefined)
    updateData.page_banner_subtitle_hi = page_banner_subtitle_hi;

  // Chairman
  if (chairman_name) updateData.chairman_name = chairman_name;
  if (chairman_name_hi !== undefined)
    updateData.chairman_name_hi = chairman_name_hi;
  if (chairman_designation)
    updateData.chairman_designation = chairman_designation;
  if (chairman_designation_hi !== undefined)
    updateData.chairman_designation_hi = chairman_designation_hi;
  if (chairman_message) updateData.chairman_message = chairman_message;
  if (chairman_message_hi !== undefined)
    updateData.chairman_message_hi = chairman_message_hi;

  // Mission & Vision
  if (mission) updateData.mission = mission;
  if (mission_hi !== undefined) updateData.mission_hi = mission_hi;
  if (vision) updateData.vision = vision;
  if (vision_hi !== undefined) updateData.vision_hi = vision_hi;

  // Areas of Expertise
  if (areas_of_expertise !== undefined) {
    updateData.areas_of_expertise = areas_of_expertise;
  }
  if (areas_of_expertise_hi !== undefined) {
    updateData.areas_of_expertise_hi = areas_of_expertise_hi;
  }

  // Handle file uploads
  if (req.files) {
    if (req.files.page_banner_image) {
      updateData.page_banner_image = `public/upload/${req.files.page_banner_image[0].filename}`;
    }
    if (req.files.chairman_image) {
      updateData.chairman_image = `public/upload/${req.files.chairman_image[0].filename}`;
    }
  }

  // Handle is_active
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Add updatedBy
  updateData.updatedBy = userId;

  // Update about
  const updatedAbout = await About.findByIdAndUpdate(
    about._id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedAbout = transformAboutData(updatedAbout);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedAbout, "About updated successfully"));
});

// Toggle About Status
const toggleAboutStatus = asyncHandler(async (req, res) => {
  const about = await About.findOne();

  if (!about) {
    throw new ApiError(404, "About not found");
  }

  const updatedAbout = await About.findByIdAndUpdate(
    about._id,
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
        `About ${updatedAbout.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Delete About
const deleteAbout = asyncHandler(async (req, res) => {
  const about = await About.findOne();

  if (!about) {
    throw new ApiError(404, "About not found");
  }

  await About.findByIdAndDelete(about._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedId: about._id,
        message: "About permanently deleted from database",
      },
      "About deleted successfully"
    )
  );
});

export {
  createOrUpdateAbout,
  getAbout,
  getActiveAbout,
  updateAbout,
  toggleAboutStatus,
  deleteAbout,
};

// src/controllers/homeAlliance.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HomeAlliance } from "../models/homeAlliance.model.js";

// Transform alliance data for consistent response
const transformAllianceData = (alliance) => {
  return {
    id: alliance._id.toString(),
    alliance_image1: alliance.alliance_image1,
    alliance_image2: alliance.alliance_image2,
    alliance_image3: alliance.alliance_image3,
    alliance_image4: alliance.alliance_image4,
    experience_year: alliance.experience_year,
    client: alliance.client,
    projects: alliance.projects,
    countries: alliance.countries,
    is_active: alliance.is_active,
    createdBy: alliance.createdBy,
    updatedBy: alliance.updatedBy,
    createdAt: alliance.createdAt,
    updatedAt: alliance.updatedAt,
  };
};

// Create or Update Alliance API
const createOrUpdateAlliance = asyncHandler(async (req, res) => {
  const { experience_year, client, projects, countries, is_active } = req.body;

  const userId = req.user._id;

  // Validate required fields
  if (experience_year === undefined || experience_year === null) {
    throw new ApiError(400, "Experience year is required");
  }
  if (client === undefined || client === null) {
    throw new ApiError(400, "Client count is required");
  }
  if (projects === undefined || projects === null) {
    throw new ApiError(400, "Projects count is required");
  }
  if (countries === undefined || countries === null) {
    throw new ApiError(400, "Countries count is required");
  }

  // Handle alliance images
  let allianceImage1 = "default-alliance.png";
  let allianceImage2 = "default-alliance.png";
  let allianceImage3 = "default-alliance.png";
  let allianceImage4 = "default-alliance.png";

  if (req.files) {
    if (req.files.alliance_image1) {
      allianceImage1 = `public/upload/${req.files.alliance_image1[0].filename}`;
    }
    if (req.files.alliance_image2) {
      allianceImage2 = `public/upload/${req.files.alliance_image2[0].filename}`;
    }
    if (req.files.alliance_image3) {
      allianceImage3 = `public/upload/${req.files.alliance_image3[0].filename}`;
    }
    if (req.files.alliance_image4) {
      allianceImage4 = `public/upload/${req.files.alliance_image4[0].filename}`;
    }
  }

  // Check if alliance already exists
  let existingAlliance = await HomeAlliance.findOne();

  if (existingAlliance) {
    // Update existing alliance
    const updateData = {
      experience_year: parseInt(experience_year),
      client: parseInt(client),
      projects: parseInt(projects),
      countries: parseInt(countries),
      updatedBy: userId,
      is_active:
        is_active !== undefined ? is_active : existingAlliance.is_active,
    };

    // Update alliance images if provided
    if (allianceImage1) {
      updateData.alliance_image1 = allianceImage1;
    }
    if (allianceImage2) {
      updateData.alliance_image2 = allianceImage2;
    }
    if (allianceImage3) {
      updateData.alliance_image3 = allianceImage3;
    }
    if (allianceImage4) {
      updateData.alliance_image4 = allianceImage4;
    }

    const updatedAlliance = await HomeAlliance.findByIdAndUpdate(
      existingAlliance._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const transformedData = transformAllianceData(updatedAlliance);

    return res
      .status(200)
      .json(
        new ApiResponse(200, transformedData, "Alliance updated successfully")
      );
  } else {
    // Create new alliance
    const allianceData = {
      alliance_image1: allianceImage1,
      alliance_image2: allianceImage2,
      alliance_image3: allianceImage3,
      alliance_image4: allianceImage4,
      experience_year: parseInt(experience_year),
      client: parseInt(client),
      projects: parseInt(projects),
      countries: parseInt(countries),
      createdBy: userId,
      updatedBy: userId,
      is_active: is_active !== undefined ? is_active : true,
    };

    const alliance = await HomeAlliance.create(allianceData);

    const createdAlliance = await HomeAlliance.findById(alliance._id);
    if (!createdAlliance) {
      throw new ApiError(500, "Something went wrong while creating alliance");
    }

    const transformedData = transformAllianceData(createdAlliance);

    return res
      .status(201)
      .json(
        new ApiResponse(201, transformedData, "Alliance created successfully")
      );
  }
});

// Get Alliance API (Public)
const getAlliance = asyncHandler(async (req, res) => {
  const alliance = await HomeAlliance.findOne({ is_active: true });

  if (!alliance) {
    throw new ApiError(404, "Alliance not found");
  }

  const transformedData = transformAllianceData(alliance);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedData, "Alliance fetched successfully")
    );
});

// Get Alliance by ID API (Admin)
const getAllianceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Alliance ID is required");
  }

  const alliance = await HomeAlliance.findById(id);
  if (!alliance) {
    throw new ApiError(404, "Alliance not found");
  }

  const transformedData = transformAllianceData(alliance);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedData, "Alliance fetched successfully")
    );
});

// Delete Alliance API
const deleteAlliance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Alliance ID is required");
  }

  const alliance = await HomeAlliance.findById(id);
  if (!alliance) {
    throw new ApiError(404, "Alliance not found");
  }

  await HomeAlliance.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Alliance deleted successfully"));
});

// Toggle Alliance Status API
const toggleAllianceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Alliance ID is required");
  }

  const alliance = await HomeAlliance.findById(id);
  if (!alliance) {
    throw new ApiError(404, "Alliance not found");
  }

  const updatedAlliance = await HomeAlliance.findByIdAndUpdate(
    id,
    { is_active: !alliance.is_active },
    { new: true }
  );

  const transformedData = transformAllianceData(updatedAlliance);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedData,
        `Alliance ${updatedAlliance.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Delete Alliance Image
const deleteAllianceImage = asyncHandler(async (req, res) => {
  const { id, imageKey } = req.params;

  if (!id) {
    throw new ApiError(400, "Alliance ID is required");
  }

  if (!imageKey) {
    throw new ApiError(400, "Image key is required");
  }

  const validKeys = [
    "alliance_image1",
    "alliance_image2",
    "alliance_image3",
    "alliance_image4",
  ];
  if (!validKeys.includes(imageKey)) {
    throw new ApiError(400, "Invalid image key");
  }

  const alliance = await HomeAlliance.findById(id);
  if (!alliance) {
    throw new ApiError(404, "Alliance not found");
  }

  // Set the specific alliance image to default
  alliance[imageKey] = "default-alliance.png";
  await alliance.save();

  const transformedData = transformAllianceData(alliance);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedData,
        "Alliance image deleted successfully"
      )
    );
});

export {
  createOrUpdateAlliance,
  getAlliance,
  getAllianceById,
  deleteAlliance,
  toggleAllianceStatus,
  deleteAllianceImage,
};

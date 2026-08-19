// src/controllers/homeCompany.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { HomeCompany } from "../models/homeCompany.model.js";
import mongoose from "mongoose";

// Transform company data for consistent response
const transformCompanyData = (company) => {
  return {
    id: company._id.toString(),
    image: company.image,
    title: company.title,
    is_active: company.is_active,
    order: company.order,
    createdBy: company.createdBy,
    updatedBy: company.updatedBy,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
  };
};

// Create Home Company API
const createHomeCompany = asyncHandler(async (req, res) => {
  const { title, is_active, order } = req.body;

  const userId = req.user._id;

  // Handle file upload
  let companyImage = "default-company.png";

  if (req.file) {
    companyImage = `public/upload/${req.file.filename}`;
  }

  // Required field validation
  if (!title) {
    throw new ApiError(400, "Company title is required");
  }

  if (!req.file) {
    throw new ApiError(400, "Company image is required");
  }

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Create company data
  const companyData = {
    image: companyImage,
    title,
    is_active: is_active !== undefined ? is_active : true,
    order: order || 0,
    createdBy: userId,
  };

  try {
    const company = await HomeCompany.create(companyData);

    const createdCompany = await HomeCompany.findById(company._id).populate(
      "createdBy",
      "userName fullName bio image"
    );

    if (!createdCompany) {
      throw new ApiError(500, "Something went wrong while creating company");
    }

    const transformedCompany = transformCompanyData(createdCompany);

    return res
      .status(201)
      .json(
        new ApiResponse(201, transformedCompany, "Company created successfully")
      );
  } catch (error) {
    console.error("Company creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Company validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while creating company");
  }
});

// Get Home Company by ID API
const getHomeCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Company ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Company ID format");
  }

  const company = await HomeCompany.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const transformedCompany = transformCompanyData(company);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedCompany, "Company fetched successfully")
    );
});

// Get All Home Companies List API (with pagination, search, filter)
const getHomeCompanyList = asyncHandler(async (req, res) => {
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
    query.$or = [{ title: { $regex: search, $options: "i" } }];
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
  const companies = await HomeCompany.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Transform companies data
  const transformedCompanies = companies.map((company) =>
    transformCompanyData(company)
  );

  // Get total count for pagination
  const totalCount = await HomeCompany.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        companies: transformedCompanies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Companies fetched successfully"
    )
  );
});

// Get Active Home Companies List API (for frontend)
const getActiveHomeCompanies = asyncHandler(async (req, res) => {
  const companies = await HomeCompany.find({ is_active: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "userName fullName bio image");

  const transformedCompanies = companies.map((company) =>
    transformCompanyData(company)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedCompanies,
        "Active companies fetched successfully"
      )
    );
});

// Update Home Company API
const updateHomeCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  if (!id) {
    throw new ApiError(400, "Company ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Company ID format");
  }

  const company = await HomeCompany.findById(id);
  if (!company) {
    throw new ApiError(404, "Company not found");
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

  const updatedCompany = await HomeCompany.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedCompany = transformCompanyData(updatedCompany);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedCompany, "Company updated successfully")
    );
});

// Delete Home Company API - Hard Delete
const deleteHomeCompany = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Company ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Company ID format");
    }

    const company = await HomeCompany.findById(id);

    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
    await HomeCompany.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Company permanently deleted from database",
        },
        "Company deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete company error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting company");
  }
});

// Toggle Home Company Status API
const toggleHomeCompanyStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Company ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Company ID format");
  }

  const company = await HomeCompany.findById(id);
  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  const updatedCompany = await HomeCompany.findByIdAndUpdate(
    id,
    {
      is_active: !company.is_active,
      updatedBy: req.user?._id || company.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedCompany = transformCompanyData(updatedCompany);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedCompany,
        `Company ${updatedCompany.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Update Order API
const updateCompanyOrder = asyncHandler(async (req, res) => {
  const { companies } = req.body; // [{id: "companyId", order: 0}]

  if (!companies || !Array.isArray(companies) || companies.length === 0) {
    throw new ApiError(400, "Companies data is required");
  }

  const bulkOperations = companies.map((item) => ({
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

  await HomeCompany.bulkWrite(bulkOperations);

  const updatedCompanies = await HomeCompany.find({
    _id: { $in: companies.map((item) => item.id) },
  })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort({ order: 1 });

  const transformedCompanies = updatedCompanies.map((company) =>
    transformCompanyData(company)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedCompanies,
        "Company order updated successfully"
      )
    );
});

export {
  createHomeCompany,
  getHomeCompanyById,
  getHomeCompanyList,
  getActiveHomeCompanies,
  updateHomeCompany,
  deleteHomeCompany,
  toggleHomeCompanyStatus,
  updateCompanyOrder,
};

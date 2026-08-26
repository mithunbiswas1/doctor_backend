// src/controllers/service.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Service } from "../models/service.model.js";
import mongoose from "mongoose";

// Transform service data
const transformServiceData = (service) => {
  return {
    id: service._id.toString(),
    title: service.title,
    title_hi: service.title_hi || "",
    description: service.description,
    description_hi: service.description_hi || "",
    order: service.order,
    is_active: service.is_active,
    createdBy: service.createdBy,
    updatedBy: service.updatedBy,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
};

// Create Service
const createService = asyncHandler(async (req, res) => {
  const { title, title_hi, description, description_hi, order, is_active } =
    req.body;

  const userId = req.user._id;

  // Required field validation
  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  // Check if user exists
  const userExists = await mongoose.model("User").findById(userId);
  if (!userExists) {
    throw new ApiError(404, "User not found");
  }

  // Prepare service data
  const serviceData = {
    title,
    title_hi: title_hi || "",
    description,
    description_hi: description_hi || "",
    order: order || 0,
    is_active: is_active !== undefined ? is_active : true,
    createdBy: userId,
  };

  const service = await Service.create(serviceData);
  const createdService = await Service.findById(service._id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  const transformedService = transformServiceData(createdService);

  return res
    .status(201)
    .json(
      new ApiResponse(201, transformedService, "Service created successfully")
    );
});

// Get All Services
const getServices = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "order",
    sortOrder = "asc",
    is_active,
  } = req.query;

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

  const services = await Service.find(query)
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const transformedServices = services.map((service) =>
    transformServiceData(service)
  );

  const totalCount = await Service.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        services: transformedServices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Services fetched successfully"
    )
  );
});

// Get Active Services (for frontend)
const getActiveServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ is_active: true })
    .sort({ order: 1, createdAt: -1 })
    .populate("createdBy", "userName fullName bio image");

  const transformedServices = services.map((service) =>
    transformServiceData(service)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedServices,
        "Active services fetched successfully"
      )
    );
});

// Get Service by ID
const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Service ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Service ID format");
  }

  const service = await Service.findById(id).populate(
    "createdBy updatedBy",
    "userName fullName bio image"
  );

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const transformedService = transformServiceData(service);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedService, "Service fetched successfully")
    );
});

// Update Service
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, title_hi, description, description_hi, order, is_active } =
    req.body;

  if (!id) {
    throw new ApiError(400, "Service ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Service ID format");
  }

  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  // Prepare update data
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (title_hi !== undefined) updateData.title_hi = title_hi;
  if (description !== undefined) updateData.description = description;
  if (description_hi !== undefined) updateData.description_hi = description_hi;
  if (order !== undefined) updateData.order = order;
  if (is_active !== undefined) {
    updateData.is_active = is_active === "true" || is_active === true;
  }

  // Add updatedBy
  if (req.user?._id) {
    updateData.updatedBy = req.user._id;
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedService = transformServiceData(updatedService);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedService, "Service updated successfully")
    );
});

// Delete Service
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Service ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Service ID format");
  }

  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  await Service.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedId: id,
        message: "Service permanently deleted from database",
      },
      "Service deleted successfully"
    )
  );
});

// Toggle Service Status
const toggleServiceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Service ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Service ID format");
  }

  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    {
      is_active: !service.is_active,
      updatedBy: req.user?._id || service.createdBy,
    },
    { new: true }
  ).populate("createdBy updatedBy", "userName fullName bio image");

  const transformedService = transformServiceData(updatedService);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedService,
        `Service ${updatedService.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Bulk Update Order
const updateServiceOrder = asyncHandler(async (req, res) => {
  const { services } = req.body;

  if (!services || !Array.isArray(services) || services.length === 0) {
    throw new ApiError(400, "Services data is required");
  }

  const bulkOperations = services.map((item) => ({
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

  await Service.bulkWrite(bulkOperations);

  const updatedServices = await Service.find({
    _id: { $in: services.map((item) => item.id) },
  })
    .populate("createdBy updatedBy", "userName fullName bio image")
    .sort({ order: 1 });

  const transformedServices = updatedServices.map((service) =>
    transformServiceData(service)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedServices,
        "Service order updated successfully"
      )
    );
});

export {
  createService,
  getServices,
  getActiveServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  updateServiceOrder,
};

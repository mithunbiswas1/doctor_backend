// ael_backend/src/controllers/archive.controllers.js

import { Archive } from "../models/archive.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get archive records with category, search, and year/date filtering
 */
export const getArchiveRecords = asyncHandler(async (req, res) => {
  const { category, search, year, page = 1, limit = 20 } = req.query;

  const filter = { isPublished: true };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (year && year !== "all") {
    const startYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endYear = new Date(`${year}-12-31T23:59:59.999Z`);
    filter.publishDate = { $gte: startYear, $lte: endYear };
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { titleBn: searchRegex },
      { referenceNumber: searchRegex },
      { summary: searchRegex },
      { summaryBn: searchRegex },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [records, total] = await Promise.all([
    Archive.find(filter)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("createdBy", "fullName userName email"),
    Archive.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        records,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
      "Archive records retrieved successfully"
    )
  );
});

/**
 * Public: Get single archive item
 */
export const getArchiveById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await Archive.findById(id).populate(
    "createdBy",
    "fullName userName email"
  );

  if (!record) {
    throw new ApiError(404, "Archive document not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Archive record retrieved"));
});

/**
 * Public: Increment document download count
 */
export const trackDownload = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await Archive.findByIdAndUpdate(
    id,
    { $inc: { downloadCount: 1 } },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, "Archive item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { downloadCount: record.downloadCount }, "Download recorded"));
});

/**
 * Admin: Get all archive items with pagination & status filters
 */
export const getAdminArchiveRecords = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 50 } = req.query;

  const filter = {};

  if (category && category !== "all") {
    filter.category = category;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { titleBn: searchRegex },
      { referenceNumber: searchRegex },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [records, total] = await Promise.all([
    Archive.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("createdBy", "fullName userName email"),
    Archive.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        records,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
      "Admin archive records retrieved"
    )
  );
});

/**
 * Admin: Create an archive document
 */
export const createArchiveRecord = asyncHandler(async (req, res) => {
  const { title, titleBn, category } = req.body;

  if (!title || !titleBn) {
    throw new ApiError(400, "English and Bengali titles are required");
  }

  const record = await Archive.create({
    ...req.body,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, record, "Archive record created successfully"));
});

/**
 * Admin: Update an archive document
 */
export const updateArchiveRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await Archive.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    throw new ApiError(404, "Archive document not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Archive record updated successfully"));
});

/**
 * Admin: Delete an archive document
 */
export const deleteArchiveRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await Archive.findByIdAndDelete(id);

  if (!record) {
    throw new ApiError(404, "Archive document not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Archive record deleted successfully"));
});

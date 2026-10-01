// ael_backend/src/controllers/advertisement.controllers.js

import { Advertisement } from "../models/advertisement.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get active ad for a slot and increment impressions
 */
export const getActiveAdBySlot = asyncHandler(async (req, res) => {
  const { slot } = req.params;
  const now = new Date();

  // Find active, unexpired ad for this slot
  const ad = await Advertisement.findOneAndUpdate(
    {
      slot,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    },
    { $inc: { impressions: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, ad || null, "Ad retrieved successfully"));
});

/**
 * Public: Track click on an ad
 */
export const trackAdClick = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ad = await Advertisement.findByIdAndUpdate(
    id,
    { $inc: { clicks: 1 } },
    { new: true }
  );

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { clicks: ad.clicks }, "Ad click recorded"));
});

/**
 * Admin: Get all ads with filters
 */
export const getAllAdsAdmin = asyncHandler(async (req, res) => {
  const { slot, isActive, search } = req.query;

  const query = {};
  if (slot && slot !== "all") query.slot = slot;
  if (isActive !== undefined && isActive !== "all") {
    query.isActive = isActive === "true";
  }
  if (search && search.trim()) {
    query.title = { $regex: search.trim(), $options: "i" };
  }

  const ads = await Advertisement.find(query).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, ads, "All ads fetched successfully"));
});

/**
 * Admin: Create new advertisement
 */
export const createAdAdmin = asyncHandler(async (req, res) => {
  const { title, slot, type, imageUrl, htmlContent, clickUrl, startDate, endDate, isActive } =
    req.body;

  if (!title || !slot || !clickUrl || !endDate) {
    throw new ApiError(400, "Title, slot, clickUrl, and endDate are required");
  }

  const ad = await Advertisement.create({
    title: title.trim(),
    slot,
    type: type || "image",
    imageUrl: imageUrl || "",
    htmlContent: htmlContent || "",
    clickUrl: clickUrl.trim(),
    startDate: startDate ? new Date(startDate) : new Date(),
    endDate: new Date(endDate),
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, ad, "Advertisement created successfully"));
});

/**
 * Admin: Update advertisement
 */
export const updateAdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ad = await Advertisement.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ad, "Advertisement updated successfully"));
});

/**
 * Admin: Delete advertisement
 */
export const deleteAdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ad = await Advertisement.findByIdAndDelete(id);
  if (!ad) {
    throw new ApiError(404, "Advertisement not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Advertisement deleted successfully"));
});

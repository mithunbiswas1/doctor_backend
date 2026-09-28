// src/controllers/page.controllers.js
import { Page } from "../models/page.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get single page content and banner by key
 */
export const getPageByKey = asyncHandler(async (req, res) => {
  const { pageKey } = req.params;
  if (!pageKey) {
    throw new ApiError(400, "pageKey is required");
  }

  const page = await Page.findOne({ pageKey: pageKey.toLowerCase() });

  return res.status(200).json(
    new ApiResponse(
      200,
      page || null,
      page ? "Page retrieved successfully" : "Page not configured in DB yet"
    )
  );
});

/**
 * Admin: Get all configured pages
 */
export const getAllPages = asyncHandler(async (req, res) => {
  const pages = await Page.find().sort({ pageKey: 1 });
  return res.status(200).json(
    new ApiResponse(200, pages, "Pages list retrieved successfully")
  );
});

/**
 * Admin: Create or update page content and banner by key
 */
export const updatePageByKey = asyncHandler(async (req, res) => {
  const { pageKey } = req.params;
  if (!pageKey) {
    throw new ApiError(400, "pageKey is required");
  }

  const {
    title,
    titleBn,
    banner,
    sections,
    contentHtml,
    contentHtmlBn,
    isPublished,
  } = req.body;

  const updateData = {
    pageKey: pageKey.toLowerCase(),
    ...(title !== undefined && { title }),
    ...(titleBn !== undefined && { titleBn }),
    ...(banner !== undefined && { banner }),
    ...(sections !== undefined && { sections }),
    ...(contentHtml !== undefined && { contentHtml }),
    ...(contentHtmlBn !== undefined && { contentHtmlBn }),
    ...(isPublished !== undefined && { isPublished }),
    updatedBy: req.user?._id,
  };

  const page = await Page.findOneAndUpdate(
    { pageKey: pageKey.toLowerCase() },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  return res.status(200).json(
    new ApiResponse(200, page, "Page updated successfully")
  );
});

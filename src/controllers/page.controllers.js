import { Page } from "../models/page.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { dispatchNewsletterForNewContent } from "../utils/newsletterDispatcher.js";

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

  const existingPage = await Page.findOne({ pageKey: pageKey.toLowerCase() });

  const page = await Page.findOneAndUpdate(
    { pageKey: pageKey.toLowerCase() },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  // If safety guidelines page, check if new guideline document was added
  if (pageKey.toLowerCase() === "safety-guidelines" && sections) {
    const prevDocs = existingPage?.sections?.documentDownloads || [];
    const newDocs = sections?.documentDownloads || [];
    if (newDocs.length > prevDocs.length) {
      const latestDoc = newDocs[newDocs.length - 1];
      dispatchNewsletterForNewContent({
        type: "safety_guideline",
        item: {
          title: latestDoc.title || latestDoc.titleEn,
          titleBn: latestDoc.titleBn,
          description: latestDoc.description || latestDoc.descriptionEn,
          descriptionBn: latestDoc.descriptionBn,
          itemType: "guideline",
        },
        createdBy: req.user?._id,
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(200, page, "Page updated successfully")
  );
});

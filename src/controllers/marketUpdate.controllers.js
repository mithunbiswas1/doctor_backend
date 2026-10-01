// ael_backend/src/controllers/marketUpdate.controllers.js

import { MarketUpdate } from "../models/marketUpdate.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CATEGORY_NAMES_BN = {
  incidents: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
  berc: "বিইআরসি বার্তা ও মূল্য সার্কুলার",
  global: "বৈশ্বিক মার্কেট আপডেট ও ট্রেন্ড",
};

/**
 * Public: Get paginated list of published market updates with search & category filter
 */
export const getPublicMarketUpdates = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    q = "",
    category = "all",
    featured = "",
    sortBy = "publishDate",
    order = "desc",
  } = req.query;

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (validPage - 1) * validLimit;

  const filter = { isPublished: true };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (featured === "true") {
    filter.isFeatured = true;
  }

  if (q && q.trim() && q !== "undefined" && q !== "null") {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { titleEn: searchRegex },
      { titleBn: searchRegex },
      { summaryEn: searchRegex },
      { summaryBn: searchRegex },
      { tags: searchRegex },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === "asc" ? 1 : -1;

  const [updates, total] = await Promise.all([
    MarketUpdate.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(validLimit)
      .select("-contentEn -contentBn"), // Exclude full rich-text for list payload optimization
    MarketUpdate.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: updates,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit) || 1,
        },
      },
      "Market updates fetched successfully"
    )
  );
});

/**
 * Public: Get single market update by slug (with view count increment)
 */
export const getPublicMarketUpdateBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const update = await MarketUpdate.findOneAndUpdate(
    { slug: slug.toLowerCase(), isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  ).populate("createdBy", "fullName email role");

  if (!update) {
    throw new ApiError(404, "Market update article not found");
  }

  // Get related updates in the same category
  const related = await MarketUpdate.find({
    category: update.category,
    _id: { $ne: update._id },
    isPublished: true,
  })
    .sort({ publishDate: -1 })
    .limit(3)
    .select("titleEn titleBn slug category image publishDate summaryEn summaryBn");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        article: update,
        related,
      },
      "Market update details fetched successfully"
    )
  );
});

/**
 * Admin: Get all market updates (including drafts)
 */
export const getAdminMarketUpdates = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    q = "",
    category = "all",
    status = "all",
  } = req.query;

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (validPage - 1) * validLimit;

  const filter = {};

  if (category && category !== "all") {
    filter.category = category;
  }

  if (status === "published") {
    filter.isPublished = true;
  } else if (status === "draft") {
    filter.isPublished = false;
  }

  if (q && q.trim() && q !== "undefined" && q !== "null") {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { titleEn: searchRegex },
      { titleBn: searchRegex },
      { summaryEn: searchRegex },
      { summaryBn: searchRegex },
    ];
  }

  const [updates, total] = await Promise.all([
    MarketUpdate.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .populate("createdBy", "fullName email role"),
    MarketUpdate.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: updates,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit) || 1,
        },
      },
      "Admin market updates fetched successfully"
    )
  );
});

/**
 * Admin: Get single market update by ID or Slug
 */
export const getMarketUpdateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const update = await MarketUpdate.findOne({
    $or: [
      { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
      { slug: id.toLowerCase() },
    ],
  }).populate("createdBy", "fullName email role");

  if (!update) {
    throw new ApiError(404, "Market update record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, update, "Market update fetched successfully"));
});

/**
 * Admin: Create new market update
 */
export const createMarketUpdate = asyncHandler(async (req, res) => {
  const {
    titleEn,
    titleBn,
    slug,
    category = "incidents",
    categoryBn,
    summaryEn,
    summaryBn,
    contentEn = "",
    contentBn = "",
    authorEn,
    authorBn,
    publishDate,
    isPublished = true,
    isFeatured = false,
    tags,
    metaTitle,
    metaTitleBn,
    metaDescription,
    metaDescriptionBn,
    metaKeywords,
  } = req.body;

  if (!titleEn || !titleBn || !summaryEn || !summaryBn) {
    throw new ApiError(
      400,
      "Both English and Bengali titles and summaries are mandatory"
    );
  }

  // Derive unique slug
  let generatedSlug = (slug || titleEn)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const existingSlug = await MarketUpdate.findOne({ slug: generatedSlug });
  if (existingSlug) {
    generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
  }

  // Handle uploaded Image
  let imageUrl = req.body.image;
  if (req.files && req.files.image && req.files.image[0]) {
    imageUrl = `/public/upload/${req.files.image[0].filename}`;
  }

  // Handle uploaded PDF
  let pdfUrl = req.body.pdfUrl || "";
  let pdfOriginalName = req.body.pdfOriginalName || "";
  let pdfSize = req.body.pdfSize || 0;

  if (req.files && req.files.pdf && req.files.pdf[0]) {
    const pdfFile = req.files.pdf[0];
    pdfUrl = `/public/upload/${pdfFile.filename}`;
    pdfOriginalName = pdfFile.originalname;
    pdfSize = pdfFile.size;
  }

  // Parse tags
  let parsedTags = [];
  if (Array.isArray(tags)) {
    parsedTags = tags;
  } else if (typeof tags === "string") {
    try {
      parsedTags = JSON.parse(tags);
    } catch {
      parsedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  const finalCategoryBn =
    categoryBn || CATEGORY_NAMES_BN[category] || "মার্কেট আপডেট";

  const marketUpdate = await MarketUpdate.create({
    titleEn: titleEn.trim(),
    titleBn: titleBn.trim(),
    slug: generatedSlug,
    category,
    categoryBn: finalCategoryBn,
    summaryEn: summaryEn.trim(),
    summaryBn: summaryBn.trim(),
    contentEn,
    contentBn,
    image: imageUrl,
    pdfUrl,
    pdfOriginalName,
    pdfSize,
    authorEn: authorEn || "Safe LPG Research & Intelligence",
    authorBn: authorBn || "সেইফ এলপিজি রিসার্চ অ্যান্ড ইন্টেলিজেন্স",
    publishDate: publishDate ? new Date(publishDate) : new Date(),
    isPublished: isPublished === "true" || isPublished === true,
    isFeatured: isFeatured === "true" || isFeatured === true,
    tags: parsedTags,
    metaTitle,
    metaTitleBn,
    metaDescription,
    metaDescriptionBn,
    metaKeywords,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        marketUpdate,
        "Market update created successfully"
      )
    );
});

/**
 * Admin: Update market update
 */
export const updateMarketUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const update = await MarketUpdate.findById(id);
  if (!update) {
    throw new ApiError(404, "Market update record not found");
  }

  const {
    titleEn,
    titleBn,
    slug,
    category,
    categoryBn,
    summaryEn,
    summaryBn,
    contentEn,
    contentBn,
    authorEn,
    authorBn,
    publishDate,
    isPublished,
    isFeatured,
    tags,
    removePdf,
    metaTitle,
    metaTitleBn,
    metaDescription,
    metaDescriptionBn,
    metaKeywords,
  } = req.body;

  // Handle unique slug if updated
  if (slug && slug !== update.slug) {
    let cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const conflict = await MarketUpdate.findOne({
      slug: cleanSlug,
      _id: { $ne: update._id },
    });
    if (conflict) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }
    update.slug = cleanSlug;
  }

  if (titleEn !== undefined) update.titleEn = titleEn.trim();
  if (titleBn !== undefined) update.titleBn = titleBn.trim();
  if (summaryEn !== undefined) update.summaryEn = summaryEn.trim();
  if (summaryBn !== undefined) update.summaryBn = summaryBn.trim();
  if (contentEn !== undefined) update.contentEn = contentEn;
  if (contentBn !== undefined) update.contentBn = contentBn;

  if (category !== undefined) {
    update.category = category;
    update.categoryBn =
      categoryBn || CATEGORY_NAMES_BN[category] || update.categoryBn;
  }

  if (authorEn !== undefined) update.authorEn = authorEn;
  if (authorBn !== undefined) update.authorBn = authorBn;
  if (publishDate !== undefined) update.publishDate = new Date(publishDate);
  if (isPublished !== undefined)
    update.isPublished = isPublished === "true" || isPublished === true;
  if (isFeatured !== undefined)
    update.isFeatured = isFeatured === "true" || isFeatured === true;

  if (metaTitle !== undefined) update.metaTitle = metaTitle;
  if (metaTitleBn !== undefined) update.metaTitleBn = metaTitleBn;
  if (metaDescription !== undefined) update.metaDescription = metaDescription;
  if (metaDescriptionBn !== undefined) update.metaDescriptionBn = metaDescriptionBn;
  if (metaKeywords !== undefined) update.metaKeywords = metaKeywords;

  // Parse tags if provided
  if (tags !== undefined) {
    if (Array.isArray(tags)) {
      update.tags = tags;
    } else if (typeof tags === "string") {
      try {
        update.tags = JSON.parse(tags);
      } catch {
        update.tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }
  }

  // Handle image upload
  if (req.files && req.files.image && req.files.image[0]) {
    update.image = `/public/upload/${req.files.image[0].filename}`;
  } else if (req.body.image) {
    update.image = req.body.image;
  }

  // Handle PDF upload
  if (req.files && req.files.pdf && req.files.pdf[0]) {
    const pdfFile = req.files.pdf[0];
    update.pdfUrl = `/public/upload/${pdfFile.filename}`;
    update.pdfOriginalName = pdfFile.originalname;
    update.pdfSize = pdfFile.size;
  } else if (removePdf === "true" || removePdf === true) {
    update.pdfUrl = "";
    update.pdfOriginalName = "";
    update.pdfSize = 0;
  } else if (req.body.pdfUrl !== undefined) {
    update.pdfUrl = req.body.pdfUrl;
    if (req.body.pdfOriginalName) update.pdfOriginalName = req.body.pdfOriginalName;
  }

  await update.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, update, "Market update updated successfully")
    );
});

/**
 * Admin: Delete market update
 */
export const deleteMarketUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const update = await MarketUpdate.findById(id);
  if (!update) {
    throw new ApiError(404, "Market update not found");
  }

  await update.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Market update deleted successfully"));
});

// ael_backend/src/controllers/blog.controllers.js

import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get paginated list of published blogs with search & filter
 */
export const getPublicBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    q = "",
    category = "all",
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (validPage - 1) * validLimit;

  const filter = { isPublished: true };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { titleEn: searchRegex },
      { titleBn: searchRegex },
      { descriptionEn: searchRegex },
      { descriptionBn: searchRegex },
      { tags: searchRegex },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = order === "asc" ? 1 : -1;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort(sortOptions).skip(skip).limit(validLimit),
    Blog.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: blogs,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit) || 1,
        },
      },
      "Blogs fetched successfully"
    )
  );
});

/**
 * Public: Get single blog by slug or ID & increment view count
 */
export const getPublicBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await Blog.findOneAndUpdate(
    {
      $or: [{ slug: slug.toLowerCase() }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
      isPublished: true,
    },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog post fetched successfully"));
});

/**
 * Admin: Get all blogs (including unpublished/drafts)
 */
export const getAdminBlogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, q = "", category = "all" } = req.query;

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (validPage - 1) * validLimit;

  const filter = {};
  if (category && category !== "all") {
    filter.category = category;
  }

  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { titleEn: searchRegex },
      { titleBn: searchRegex },
      { descriptionEn: searchRegex },
    ];
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .populate("createdBy", "fullName email role"),
    Blog.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        data: blogs,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit) || 1,
        },
      },
      "Admin blogs fetched successfully"
    )
  );
});

/**
 * Admin: Create new blog post (Bilingual)
 */
export const createBlog = asyncHandler(async (req, res) => {
  const {
    titleEn,
    titleBn,
    slug,
    descriptionEn,
    descriptionBn,
    contentEn,
    contentBn,
    category,
    categoryBn,
    authorEn,
    authorBn,
    readTimeEn,
    readTimeBn,
    tags,
    isPublished = true,
  } = req.body;

  if (!titleEn || !titleBn || !descriptionEn || !descriptionBn) {
    throw new ApiError(
      400,
      "Both English and Bengali titles and summaries are mandatory"
    );
  }

  // Derive slug
  let generatedSlug = (slug || titleEn)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  // Ensure unique slug
  let existing = await Blog.findOne({ slug: generatedSlug });
  if (existing) {
    generatedSlug = `${generatedSlug}-${Date.now().toString().slice(-4)}`;
  }

  // Uploaded image handling
  let imageUrl = req.body.image;
  if (req.files && req.files.image && req.files.image[0]) {
    imageUrl = `/public/upload/${req.files.image[0].filename}`;
  }

  // Parse tags if submitted as JSON string or comma-separated
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

  const blog = await Blog.create({
    titleEn,
    titleBn,
    slug: generatedSlug,
    descriptionEn,
    descriptionBn,
    contentEn: contentEn || "",
    contentBn: contentBn || "",
    category: category || "seminar",
    categoryBn: categoryBn || "সেমিনার",
    authorEn: authorEn || "Safe LPG Technical Committee",
    authorBn: authorBn || "সেইফ এলপিজি টেকনিক্যাল কমিটি",
    readTimeEn: readTimeEn || "5 min read",
    readTimeBn: readTimeBn || "৫ মিনিট পাঠ",
    tags: parsedTags,
    image: imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
    isPublished: isPublished === "true" || isPublished === true,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog post created successfully"));
});

/**
 * Admin: Update existing blog post
 */
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  const updates = { ...req.body };

  if (req.files && req.files.image && req.files.image[0]) {
    updates.image = `/public/upload/${req.files.image[0].filename}`;
  }

  if (updates.tags) {
    if (typeof updates.tags === "string") {
      try {
        updates.tags = JSON.parse(updates.tags);
      } catch {
        updates.tags = updates.tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }
  }

  if (updates.isPublished !== undefined) {
    updates.isPublished = updates.isPublished === "true" || updates.isPublished === true;
  }

  Object.assign(blog, updates);
  await blog.save();

  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog post updated successfully"));
});

/**
 * Admin: Delete blog post
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    throw new ApiError(404, "Blog post not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Blog post deleted successfully"));
});

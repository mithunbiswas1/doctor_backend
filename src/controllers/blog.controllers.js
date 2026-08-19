// src/controllers/blog.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Blog } from "../models/blog.model.js";
import mongoose from "mongoose";

// Transform blog data for consistent response
const transformBlogData = (blog) => {
  return {
    id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    client: blog.client,
    duration: blog.duration,
    short_description: blog.short_description,
    description: blog.description,
    technologies: blog.technologies,
    thumbnail: blog.thumbnail,
    banner: blog.banner,
    gallery: blog.gallery,
    meta_title: blog.meta_title,
    meta_description: blog.meta_description,
    seo_keyword: blog.seo_keyword,
    createBy: blog.createBy,
    post_date: blog.post_date,
    is_active: blog.is_active,
    views: blog.views,
    published_at: blog.published_at,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
};

// Create Blog API
const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    category,
    client,
    duration,
    short_description,
    description,
    technologies,
    meta_title,
    meta_description,
    seo_keyword,
    post_date,
    is_active,
    published_at,
  } = req.body;

  const userId = req.user._id;

  // Handle file uploads
  let thumbnailFile = "default-thumbnail.png";
  let bannerFile = "default-banner.png";
  let galleryFiles = [];

  if (req.files) {
    if (req.files.thumbnail) {
      thumbnailFile = `public/upload/${req.files.thumbnail[0].filename}`;
    }
    if (req.files.banner) {
      bannerFile = `public/upload/${req.files.banner[0].filename}`;
    }
    if (req.files.gallery && req.files.gallery.length > 0) {
      galleryFiles = req.files.gallery.map(
        (file) => `public/upload/${file.filename}`
      );
    }
  }

  // Required field validation
  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  if (!client) {
    throw new ApiError(400, "Client name is required");
  }

  if (!duration) {
    throw new ApiError(400, "Duration is required");
  }

  if (!short_description) {
    throw new ApiError(400, "Short description is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  if (!technologies || technologies.length === 0) {
    throw new ApiError(400, "At least one technology is required");
  }

  if (!userId) {
    throw new ApiError(400, "User is required");
  }

  // Check if blog with same slug already exists
  const existingBlog = await Blog.findOne({
    slug:
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
  });
  if (existingBlog) {
    throw new ApiError(409, "Blog with this slug already exists");
  }

  const createByExists = await mongoose.model("User").findById(userId);
  if (!createByExists) {
    throw new ApiError(404, "User not found");
  }

  // Parse technologies if it's a string
  let parsedTechnologies = [];
  try {
    if (typeof technologies === "string") {
      parsedTechnologies = JSON.parse(technologies);
    } else if (Array.isArray(technologies)) {
      parsedTechnologies = technologies;
    } else {
      parsedTechnologies = [];
    }
  } catch (error) {
    console.error("Technologies Parse Error:", error);
    throw new ApiError(400, "Invalid technologies format");
  }

  // Create blog data
  const blogData = {
    title,
    slug:
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    category,
    client,
    duration,
    short_description,
    description,
    technologies: parsedTechnologies,
    thumbnail: thumbnailFile,
    banner: bannerFile,
    gallery: galleryFiles,
    meta_title: meta_title || "",
    meta_description: meta_description || "",
    seo_keyword: seo_keyword || "",
    createBy: userId,
    post_date: post_date || "",
    is_active: is_active !== undefined ? is_active : true,
    published_at: published_at || new Date(),
  };

  try {
    const blog = await Blog.create(blogData);

    const createdBlog = await Blog.findById(blog._id);
    if (!createdBlog) {
      throw new ApiError(500, "Something went wrong while creating blog");
    }

    const transformedBlog = transformBlogData(createdBlog);

    return res
      .status(201)
      .json(
        new ApiResponse(201, transformedBlog, "Case study created successfully")
      );
  } catch (error) {
    console.error("Blog creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Blog validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while creating blog");
  }
});

// Get Blog by ID API
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Blog ID is required");
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Increment view count
  await blog.incrementViews();

  const transformedBlog = transformBlogData(blog);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedBlog, "Blog fetched successfully"));
});

// Get Blog by Slug API
const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Blog slug is required");
  }

  const blog = await Blog.findOne({ slug }).populate(
    "createBy",
    "userName fullName bio image"
  );
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Increment view count
  await blog.incrementViews();

  const transformedBlog = transformBlogData(blog);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedBlog, "Blog fetched successfully"));
});

// Get All Blogs API (with pagination, search, filter)
const getListBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    is_active,
    category,
    createBy,
    technologies,
  } = req.query;

  // Build query object
  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { short_description: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { client: { $regex: search, $options: "i" } },
      { technologies: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Filter by active status
  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by technologies
  if (technologies) {
    const techArray = Array.isArray(technologies)
      ? technologies
      : [technologies];
    query.technologies = { $in: techArray };
  }

  if (createBy) {
    query.createBy = createBy;
  }

  // Sort options
  const sortOptions = {};

  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // Execute query with pagination
  const blogs = await Blog.find(query)
    .populate("createBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Transform blogs data
  const transformedBlogs = blogs.map((blog) => transformBlogData(blog));

  // Get total count for pagination
  const totalCount = await Blog.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        blogs: transformedBlogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Blogs fetched successfully"
    )
  );
});

// Get Active Blogs List API (for frontend)
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ is_active: true }).sort({ published_at: -1 });

  const transformedBlogs = blogs.map((blog) => transformBlogData(blog));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBlogs,
        "Active blogs list fetched successfully"
      )
    );
});

// Get Sitemap Blogs API
const getSitemapBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find(
    { is_active: true },
    {
      slug: 1,
      title: 1,
      updatedAt: 1,
      createdAt: 1,
      published_at: 1,
      is_active: 1,
      _id: 0,
    }
  )
    .sort({ published_at: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total: blogs.length,
        blogs: blogs.map((blog) => ({
          slug: blog.slug,
          title: blog.title,
          lastmod: blog.updatedAt || blog.published_at || blog.createdAt,
          is_active: blog.is_active,
        })),
      },
      "Sitemap blogs fetched successfully"
    )
  );
});

// Update Blog API
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  console.log("Raw Update Data:", updateData);

  if (!id) {
    throw new ApiError(400, "Blog ID is required");
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  // Parse specific fields that come as strings from multipart/form-data
  const fieldsToParse = ["technologies"];

  fieldsToParse.forEach((field) => {
    if (updateData[field] && typeof updateData[field] === "string") {
      try {
        updateData[field] = JSON.parse(updateData[field]);
      } catch (error) {
        throw new ApiError(400, `Invalid ${field} format`);
      }
    }
  });

  // Parse boolean fields that might come as strings
  const booleanFields = ["is_active"];

  booleanFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      if (updateData[field] === "true" || updateData[field] === "false") {
        updateData[field] = updateData[field] === "true";
      }
    }
  });

  console.log("Parsed Update Data:", updateData);

  // AuthorId validation - if authorId is provided
  if (updateData.authorId) {
    const authorExists = await mongoose
      .model("User")
      .findById(updateData.authorId);
    if (!authorExists) {
      throw new ApiError(404, "Author not found");
    }
    updateData.createBy = updateData.authorId;
    delete updateData.authorId;
  }

  // Slug handling
  if (updateData.slug && updateData.slug !== blog.slug) {
    const slugExists = await Blog.findOne({
      slug: updateData.slug,
      _id: { $ne: id },
    });

    if (slugExists) {
      throw new ApiError(400, "Slug already exists");
    }
  }

  // Image uploads
  if (req.files) {
    if (req.files.thumbnail) {
      updateData.thumbnail = `public/upload/${req.files.thumbnail[0].filename}`;
    }
    if (req.files.banner) {
      updateData.banner = `public/upload/${req.files.banner[0].filename}`;
    }
    if (req.files.gallery && req.files.gallery.length > 0) {
      const newGalleryFiles = req.files.gallery.map(
        (file) => `public/upload/${file.filename}`
      );
      // If gallery exists, append new images
      if (blog.gallery && blog.gallery.length > 0) {
        updateData.gallery = [...blog.gallery, ...newGalleryFiles];
      } else {
        updateData.gallery = newGalleryFiles;
      }
    }
  }

  // Handle createBy field
  if (!updateData.createBy && req.user?._id) {
    updateData.createBy = blog.createBy || req.user._id;
  }

  // Remove any undefined or null fields
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined || updateData[key] === null) {
      delete updateData[key];
    }
  });

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  const transformedBlog = transformBlogData(updatedBlog);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedBlog, "Blog updated successfully"));
});

// Delete Blog API - Hard Delete
const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request for ID:", id);

    if (!id) {
      throw new ApiError(400, "Blog ID is required");
    }

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Blog ID format");
    }

    const blog = await Blog.findById(id);
    console.log("Found blog:", blog);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
    const deletedBlog = await Blog.findByIdAndDelete(id);

    console.log("Blog permanently deleted from database");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Blog permanently deleted from database",
        },
        "Blog deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete blog error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting blog");
  }
});

// Toggle Blog Status API
const toggleBlogStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Blog ID is required");

  const blog = await Blog.findById(id);
  if (!blog) throw new ApiError(404, "Blog not found");

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { is_active: !blog.is_active },
    { new: true }
  );

  const transformedBlog = transformBlogData(updatedBlog);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBlog,
        `Blog ${updatedBlog.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Get Popular Blogs API
const getPopularBlogs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const blogs = await Blog.find({ is_active: true })
    .sort({ views: -1, published_at: -1 })
    .limit(parseInt(limit));

  const transformedBlogs = blogs.map((blog) => transformBlogData(blog));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedBlogs,
        "Popular blogs fetched successfully"
      )
    );
});

export {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getAllBlogs,
  getListBlogs,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  getPopularBlogs,
  getSitemapBlogs,
};

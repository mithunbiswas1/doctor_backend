import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";

// Transform project data for consistent response
const transformProjectData = (project) => {
  return {
    id: project._id.toString(),
    title: project.title,
    slug: project.slug,
    category: project.category,
    client: project.client,
    duration: project.duration,
    short_description: project.short_description,
    description: project.description,
    technologies: project.technologies,
    thumbnail: project.thumbnail,
    banner: project.banner,
    gallery: project.gallery,
    meta_title: project.meta_title,
    meta_description: project.meta_description,
    seo_keyword: project.seo_keyword,
    createBy: project.createBy,
    post_date: project.post_date,
    is_active: project.is_active,
    views: project.views,
    published_at: project.published_at,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

// Create Project API
const createProject = asyncHandler(async (req, res) => {
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

  // Check if project with same slug already exists
  const existingProject = await Project.findOne({
    slug:
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
  });
  if (existingProject) {
    throw new ApiError(409, "Project with this slug already exists");
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

  // Create project data
  const projectData = {
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
    const project = await Project.create(projectData);

    const createdProject = await Project.findById(project._id);
    if (!createdProject) {
      throw new ApiError(500, "Something went wrong while creating project");
    }

    const transformedProject = transformProjectData(createdProject);

    return res
      .status(201)
      .json(
        new ApiResponse(201, transformedProject, "Project created successfully")
      );
  } catch (error) {
    console.error("Project creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Project validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while creating project");
  }
});

// Get Project by ID API
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Increment view count
  await project.incrementViews();

  const transformedProject = transformProjectData(project);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedProject, "Project fetched successfully")
    );
});

// Get Project by Slug API
const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Project slug is required");
  }

  const project = await Project.findOne({ slug }).populate(
    "createBy",
    "userName fullName bio image"
  );
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Increment view count
  await project.incrementViews();

  const transformedProject = transformProjectData(project);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedProject, "Project fetched successfully")
    );
});

// Get All Projects API (with pagination, search, filter)
const getListProjects = asyncHandler(async (req, res) => {
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
  const projects = await Project.find(query)
    .populate("createBy", "userName fullName bio image")
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Transform projects data
  const transformedProjects = projects.map((project) =>
    transformProjectData(project)
  );

  // Get total count for pagination
  const totalCount = await Project.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        projects: transformedProjects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Projects fetched successfully"
    )
  );
});

// Get Active Projects List API (for frontend)
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ is_active: true }).sort({
    published_at: -1,
  });

  const transformedProjects = projects.map((project) =>
    transformProjectData(project)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedProjects,
        "Active projects list fetched successfully"
      )
    );
});

// Get Sitemap Projects API
const getSitemapProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find(
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
        total: projects.length,
        projects: projects.map((project) => ({
          slug: project.slug,
          title: project.title,
          lastmod:
            project.updatedAt || project.published_at || project.createdAt,
          is_active: project.is_active,
        })),
      },
      "Sitemap projects fetched successfully"
    )
  );
});

// Update Project API
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updateData = req.body;

  console.log("Raw Update Data:", updateData);

  if (!id) {
    throw new ApiError(400, "Project ID is required");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
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
  if (updateData.slug && updateData.slug !== project.slug) {
    const slugExists = await Project.findOne({
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
      if (project.gallery && project.gallery.length > 0) {
        updateData.gallery = [...project.gallery, ...newGalleryFiles];
      } else {
        updateData.gallery = newGalleryFiles;
      }
    }
  }

  // Handle createBy field
  if (!updateData.createBy && req.user?._id) {
    updateData.createBy = project.createBy || req.user._id;
  }

  // Remove any undefined or null fields
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined || updateData[key] === null) {
      delete updateData[key];
    }
  });

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  const transformedProject = transformProjectData(updatedProject);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedProject, "Project updated successfully")
    );
});

// Delete Project API - Hard Delete
const deleteProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request for ID:", id);

    if (!id) {
      throw new ApiError(400, "Project ID is required");
    }

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Project ID format");
    }

    const project = await Project.findById(id);
    console.log("Found project:", project);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
    const deletedProject = await Project.findByIdAndDelete(id);

    console.log("Project permanently deleted from database");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Project permanently deleted from database",
        },
        "Project deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete project error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting project");
  }
});

// Toggle Project Status API
const toggleProjectStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Project ID is required");

  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");

  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { is_active: !project.is_active },
    { new: true }
  );

  const transformedProject = transformProjectData(updatedProject);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedProject,
        `Project ${updatedProject.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// Get Popular Projects API
const getPopularProjects = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const projects = await Project.find({ is_active: true })
    .sort({ views: -1, published_at: -1 })
    .limit(parseInt(limit));

  const transformedProjects = projects.map((project) =>
    transformProjectData(project)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedProjects,
        "Popular projects fetched successfully"
      )
    );
});

export {
  createProject,
  getProjectById,
  getProjectBySlug,
  getAllProjects,
  getListProjects,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  getPopularProjects,
  getSitemapProjects,
};

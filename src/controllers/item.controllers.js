// src/controllers/item.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Item } from "../models/item.model.js";
import { Category } from "../models/category.model.js";
import { Section } from "../models/section.model.js";
import mongoose from "mongoose";

// Transform item data for consistent response
const transformItemData = (item) => {
  // Calculate min and max price from variations
  let minPrice = 0;
  let maxPrice = 0;

  if (item.variations && item.variations.length > 0) {
    const prices = item.variations.map((v) => {
      return v.variation_offer_price !== null &&
        v.variation_offer_price !== undefined
        ? v.variation_offer_price
        : v.variation_regular_price;
    });
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  return {
    id: item._id.toString(),
    name: item.name,
    slug: item.slug,
    category: item.category,
    sections: item.sections || [],
    short_description: item.short_description || "",
    description: item.description || "",
    min_price: minPrice,
    max_price: maxPrice,
    image: item.image,
    gallery: item.gallery || [],
    is_veg: item.is_veg,
    is_spicy: item.is_spicy,
    preparation_time: item.preparation_time,
    is_available: item.is_available,
    is_active: item.is_active,
    sku: item.sku,
    variations: item.variations || [],
    features: item.features || [],
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};

// ==================== CREATE ITEM ====================
const createItem = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    category,
    sections,
    short_description,
    description,
    is_veg,
    is_spicy,
    preparation_time,
    is_available,
    sku,
    variations,
    features,
  } = req.body;

  const userId = req.user._id;

  // Validation
  if (!name) {
    throw new ApiError(400, "Item name is required");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  // Parse sections if it's a string
  let parsedSections = sections;
  if (typeof sections === "string") {
    try {
      parsedSections = JSON.parse(sections);
    } catch (e) {
      parsedSections = [];
    }
  }

  // Ensure parsedSections is an array
  if (!Array.isArray(parsedSections)) {
    parsedSections = [];
  }

  // Check if sections exist (if provided)
  if (parsedSections && parsedSections.length > 0) {
    // Filter out any invalid IDs
    const validSectionIds = parsedSections.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validSectionIds.length !== parsedSections.length) {
      throw new ApiError(400, "Invalid section ID format");
    }

    const sectionDocs = await Section.find({ _id: { $in: validSectionIds } });
    if (sectionDocs.length !== validSectionIds.length) {
      throw new ApiError(404, "Some sections not found");
    }
  }

  // Check if item name already exists
  const existingItem = await Item.findOne({ name: name.trim() });
  if (existingItem) {
    throw new ApiError(409, "Item name already exists");
  }

  // Check if slug already exists (if provided)
  if (slug) {
    const existingSlug = await Item.findOne({ slug });
    if (existingSlug) {
      throw new ApiError(409, "Slug already exists");
    }
  }

  // Handle image upload
  let imagePath = "default-item.png";
  if (req.files && req.files.image) {
    imagePath = `public/upload/${req.files.image[0].filename}`;
  }

  // Handle gallery images
  let galleryPaths = [];
  if (req.files && req.files.gallery) {
    galleryPaths = req.files.gallery.map(
      (file) => `public/upload/${file.filename}`
    );
  }

  // Parse variations if it's a string
  let parsedVariations = variations;
  if (typeof variations === "string") {
    try {
      parsedVariations = JSON.parse(variations);
    } catch (e) {
      parsedVariations = [];
    }
  }

  // Validate variations (must have at least one)
  if (!parsedVariations || parsedVariations.length === 0) {
    throw new ApiError(400, "At least one variation is required");
  }

  // Parse features if it's a string
  let parsedFeatures = features;
  if (typeof features === "string") {
    try {
      parsedFeatures = JSON.parse(features);
    } catch (e) {
      parsedFeatures = [];
    }
  }

  // Create item
  const item = await Item.create({
    name: name.trim(),
    slug: slug || undefined,
    category,
    sections: parsedSections || [],
    short_description: short_description || "",
    description: description || "",
    image: imagePath,
    gallery: galleryPaths,
    is_veg: is_veg === "true" || is_veg === true,
    is_spicy: is_spicy === "true" || is_spicy === true,
    preparation_time: preparation_time ? Number(preparation_time) : 15,
    is_available: is_available === "true" || is_available === true,
    sku: sku || undefined,
    variations: parsedVariations || [],
    features: parsedFeatures || [],
    createdBy: userId,
    updatedBy: userId,
  });

  const populatedItem = await Item.findById(item._id)
    .populate("category", "name slug")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItem = transformItemData(populatedItem);

  return res
    .status(201)
    .json(new ApiResponse(201, transformedItem, "Item created successfully"));
});

// ==================== GET ALL ITEMS ====================
const getAllItems = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category,
    sections,
    is_active,
    is_available,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
  } = req.query;

  const query = {};

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { short_description: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by sections (multiple)
  if (sections) {
    const sectionIds = Array.isArray(sections) ? sections : [sections];
    query.sections = { $in: sectionIds };
  }

  // Filter by status
  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  if (is_available !== undefined) {
    query.is_available = is_available === "true";
  }

  // Price filtering using aggregation
  // We'll use aggregation pipeline for price filtering
  const pipeline = [];

  // Match stage for basic filters
  const matchStage = { $match: query };
  pipeline.push(matchStage);

  // Add fields for min and max price calculation
  pipeline.push({
    $addFields: {
      calculated_min_price: {
        $min: {
          $map: {
            input: "$variations",
            as: "v",
            in: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$$v.variation_offer_price", null] },
                    { $ne: ["$$v.variation_offer_price", undefined] },
                  ],
                },
                then: "$$v.variation_offer_price",
                else: "$$v.variation_regular_price",
              },
            },
          },
        },
      },
      calculated_max_price: {
        $max: {
          $map: {
            input: "$variations",
            as: "v",
            in: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$$v.variation_offer_price", null] },
                    { $ne: ["$$v.variation_offer_price", undefined] },
                  ],
                },
                then: "$$v.variation_offer_price",
                else: "$$v.variation_regular_price",
              },
            },
          },
        },
      },
    },
  });

  // Filter by price range
  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);

    pipeline.push({
      $match: {
        $or: [
          { calculated_min_price: priceFilter },
          { calculated_max_price: priceFilter },
        ],
      },
    });
  }

  // Sort
  const sortOptions = {};
  if (sortBy === "min_price" || sortBy === "max_price") {
    sortOptions[
      sortBy === "min_price" ? "calculated_min_price" : "calculated_max_price"
    ] = sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }
  pipeline.push({ $sort: sortOptions });

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: parseInt(limit) });

  // Lookup for populated fields
  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  });
  pipeline.push({
    $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
  });

  pipeline.push({
    $lookup: {
      from: "sections",
      localField: "sections",
      foreignField: "_id",
      as: "sections",
    },
  });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "createdBy",
      foreignField: "_id",
      as: "createdBy",
    },
  });
  pipeline.push({
    $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
  });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "updatedBy",
      foreignField: "_id",
      as: "updatedBy",
    },
  });
  pipeline.push({
    $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true },
  });

  // Count total for pagination
  const countPipeline = [
    { $match: query },
    {
      $addFields: {
        calculated_min_price: {
          $min: {
            $map: {
              input: "$variations",
              as: "v",
              in: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$$v.variation_offer_price", null] },
                      { $ne: ["$$v.variation_offer_price", undefined] },
                    ],
                  },
                  then: "$$v.variation_offer_price",
                  else: "$$v.variation_regular_price",
                },
              },
            },
          },
        },
        calculated_max_price: {
          $max: {
            $map: {
              input: "$variations",
              as: "v",
              in: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$$v.variation_offer_price", null] },
                      { $ne: ["$$v.variation_offer_price", undefined] },
                    ],
                  },
                  then: "$$v.variation_offer_price",
                  else: "$$v.variation_regular_price",
                },
              },
            },
          },
        },
      },
    },
  ];

  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);

    countPipeline.push({
      $match: {
        $or: [
          { calculated_min_price: priceFilter },
          { calculated_max_price: priceFilter },
        ],
      },
    });
  }

  countPipeline.push({ $count: "total" });

  const [items, countResult] = await Promise.all([
    Item.aggregate(pipeline),
    Item.aggregate(countPipeline),
  ]);

  const totalCount = countResult.length > 0 ? countResult[0].total : 0;

  // Transform items
  const transformedItems = items.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    slug: item.slug,
    category: item.category,
    sections: item.sections || [],
    short_description: item.short_description || "",
    description: item.description || "",
    min_price: item.calculated_min_price || 0,
    max_price: item.calculated_max_price || 0,
    image: item.image,
    gallery: item.gallery || [],
    is_veg: item.is_veg,
    is_spicy: item.is_spicy,
    preparation_time: item.preparation_time,
    is_available: item.is_available,
    is_active: item.is_active,
    sku: item.sku,
    variations: item.variations || [],
    features: item.features || [],
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: transformedItems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit: parseInt(limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Items fetched successfully"
    )
  );
});

// ==================== GET ITEMS BY CATEGORY ====================
const getItemsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID format");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const items = await Item.getItemsByCategory(categoryId)
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItems = items.map(transformItemData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedItems,
        "Items by category fetched successfully"
      )
    );
});

// ==================== GET ITEMS BY CATEGORY SLUG ====================
const getItemsByCategoryBySlug = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;

  if (!categorySlug) {
    throw new ApiError(400, "Category slug is required");
  }

  // Find category by slug
  const category = await Category.findOne({ slug: categorySlug });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Get pagination and filter parameters
  const {
    page = 1,
    limit = 10,
    search = "",
    sections,
    is_available,
    is_active,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
  } = req.query;

  // Build query
  const query = {
    category: category._id,
  };

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { short_description: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by sections
  if (sections) {
    const sectionIds = Array.isArray(sections) ? sections : [sections];
    query.sections = { $in: sectionIds };
  }

  // Filter by availability
  if (is_available !== undefined) {
    query.is_available = is_available === "true";
  }

  // Filter by active status
  if (is_active !== undefined) {
    query.is_active = is_active === "true";
  }

  // Price filtering using aggregation
  const pipeline = [];

  // Match stage for basic filters
  const matchStage = { $match: query };
  pipeline.push(matchStage);

  // Add fields for min and max price calculation
  pipeline.push({
    $addFields: {
      calculated_min_price: {
        $min: {
          $map: {
            input: "$variations",
            as: "v",
            in: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$$v.variation_offer_price", null] },
                    { $ne: ["$$v.variation_offer_price", undefined] },
                  ],
                },
                then: "$$v.variation_offer_price",
                else: "$$v.variation_regular_price",
              },
            },
          },
        },
      },
      calculated_max_price: {
        $max: {
          $map: {
            input: "$variations",
            as: "v",
            in: {
              $cond: {
                if: {
                  $and: [
                    { $ne: ["$$v.variation_offer_price", null] },
                    { $ne: ["$$v.variation_offer_price", undefined] },
                  ],
                },
                then: "$$v.variation_offer_price",
                else: "$$v.variation_regular_price",
              },
            },
          },
        },
      },
    },
  });

  // Filter by price range
  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);

    pipeline.push({
      $match: {
        $or: [
          { calculated_min_price: priceFilter },
          { calculated_max_price: priceFilter },
        ],
      },
    });
  }

  // Sort
  const sortOptions = {};
  if (sortBy === "min_price" || sortBy === "max_price") {
    sortOptions[
      sortBy === "min_price" ? "calculated_min_price" : "calculated_max_price"
    ] = sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }
  pipeline.push({ $sort: sortOptions });

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: parseInt(limit) });

  // Lookup for populated fields
  pipeline.push({
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  });
  pipeline.push({
    $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
  });

  pipeline.push({
    $lookup: {
      from: "sections",
      localField: "sections",
      foreignField: "_id",
      as: "sections",
    },
  });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "createdBy",
      foreignField: "_id",
      as: "createdBy",
    },
  });
  pipeline.push({
    $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
  });

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "updatedBy",
      foreignField: "_id",
      as: "updatedBy",
    },
  });
  pipeline.push({
    $unwind: { path: "$updatedBy", preserveNullAndEmptyArrays: true },
  });

  // Count total for pagination
  const countPipeline = [
    { $match: query },
    {
      $addFields: {
        calculated_min_price: {
          $min: {
            $map: {
              input: "$variations",
              as: "v",
              in: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$$v.variation_offer_price", null] },
                      { $ne: ["$$v.variation_offer_price", undefined] },
                    ],
                  },
                  then: "$$v.variation_offer_price",
                  else: "$$v.variation_regular_price",
                },
              },
            },
          },
        },
        calculated_max_price: {
          $max: {
            $map: {
              input: "$variations",
              as: "v",
              in: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$$v.variation_offer_price", null] },
                      { $ne: ["$$v.variation_offer_price", undefined] },
                    ],
                  },
                  then: "$$v.variation_offer_price",
                  else: "$$v.variation_regular_price",
                },
              },
            },
          },
        },
      },
    },
  ];

  if (minPrice || maxPrice) {
    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);

    countPipeline.push({
      $match: {
        $or: [
          { calculated_min_price: priceFilter },
          { calculated_max_price: priceFilter },
        ],
      },
    });
  }

  countPipeline.push({ $count: "total" });

  const [items, countResult] = await Promise.all([
    Item.aggregate(pipeline),
    Item.aggregate(countPipeline),
  ]);

  const totalCount = countResult.length > 0 ? countResult[0].total : 0;

  // Transform items
  const transformedItems = items.map((item) => ({
    id: item._id.toString(),
    name: item.name,
    slug: item.slug,
    category: item.category,
    sections: item.sections || [],
    short_description: item.short_description || "",
    description: item.description || "",
    min_price: item.calculated_min_price || 0,
    max_price: item.calculated_max_price || 0,
    image: item.image,
    gallery: item.gallery || [],
    is_veg: item.is_veg,
    is_spicy: item.is_spicy,
    preparation_time: item.preparation_time,
    is_available: item.is_available,
    is_active: item.is_active,
    sku: item.sku,
    variations: item.variations || [],
    features: item.features || [],
    createdBy: item.createdBy,
    updatedBy: item.updatedBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        category: {
          id: category._id,
          name: category.name,
          slug: category.slug,
          image: category.image,
        },
        items: transformedItems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit: parseInt(limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Items by category slug fetched successfully"
    )
  );
});

// ==================== GET ITEMS BY SECTION ====================
const getItemsBySection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(sectionId)) {
    throw new ApiError(400, "Invalid section ID format");
  }

  const section = await Section.findById(sectionId);
  if (!section) {
    throw new ApiError(404, "Section not found");
  }

  const items = await Item.getItemsBySection(sectionId)
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItems = items.map(transformItemData);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedItems,
        "Items by section fetched successfully"
      )
    );
});

// ==================== GET ITEM BY ID ====================
const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  const item = await Item.findById(id)
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const transformedItem = transformItemData(item);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedItem, "Item fetched successfully"));
});

// ==================== GET ITEM BY SLUG ====================
const getItemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const item = await Item.findOne({ slug })
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const transformedItem = transformItemData(item);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedItem, "Item fetched successfully"));
});

// ==================== GET ITEMS BY SLUGS (Bulk) ====================
const getItemsBySlugs = asyncHandler(async (req, res) => {
  const { slugs } = req.body;

  if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
    throw new ApiError(400, "Please provide an array of slugs");
  }

  const items = await Item.find({ slug: { $in: slugs } })
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItems = items.map(transformItemData);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedItems, "Items fetched successfully"));
});

// ==================== GET CARD ITEMS (For Cards Display) ====================
const getCardItems = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category,
    sections,
    is_available,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  // Only get active items
  query.is_active = true;

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { short_description: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by sections (multiple)
  if (sections) {
    const sectionIds = Array.isArray(sections) ? sections : [sections];
    query.sections = { $in: sectionIds };
  }

  // Filter by availability
  if (is_available !== undefined) {
    query.is_available = is_available === "true";
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get items with only required fields
  const items = await Item.find(query)
    .select("name slug image variations")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip(skip)
    .lean();

  const totalCount = await Item.countDocuments(query);

  // Transform items for card display - only return required fields
  const transformedItems = items.map((item) => {
    // Get first variation (first variation in array)
    const firstVariation =
      item.variations && item.variations.length > 0 ? item.variations[0] : null;

    return {
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      image: item.image,
      // First variation details
      variation: firstVariation
        ? {
            regular_price: firstVariation.variation_regular_price,
            offer_price: firstVariation.variation_offer_price,
          }
        : null,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items: transformedItems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          limit: parseInt(limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Card items fetched successfully"
    )
  );
});

// ==================== UPDATE ITEM ====================
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    category,
    sections,
    short_description,
    description,
    is_veg,
    is_spicy,
    preparation_time,
    is_available,
    is_active,
    sku,
    variations,
    features,
  } = req.body;

  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  // Check if category exists if updating category
  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
  }

  // Parse sections if it's a string
  let parsedSections = sections;
  if (typeof sections === "string") {
    try {
      parsedSections = JSON.parse(sections);
    } catch (e) {
      parsedSections = [];
    }
  }

  // Ensure parsedSections is an array
  if (!Array.isArray(parsedSections)) {
    parsedSections = [];
  }

  // Check if sections exist if updating sections
  if (parsedSections && parsedSections.length > 0) {
    // Filter out any invalid IDs
    const validSectionIds = parsedSections.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validSectionIds.length !== parsedSections.length) {
      throw new ApiError(400, "Invalid section ID format");
    }

    const sectionDocs = await Section.find({ _id: { $in: validSectionIds } });
    if (sectionDocs.length !== validSectionIds.length) {
      throw new ApiError(404, "Some sections not found");
    }
  }

  // Check duplicate name
  if (name && name !== item.name) {
    const existingItem = await Item.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existingItem) {
      throw new ApiError(409, "Item name already exists");
    }
  }

  // Check duplicate slug
  if (slug && slug !== item.slug) {
    const existingSlug = await Item.findOne({
      slug: slug,
      _id: { $ne: id },
    });
    if (existingSlug) {
      throw new ApiError(409, "Slug already exists");
    }
  }

  // Handle image upload
  let imagePath = item.image;
  if (req.files && req.files.image) {
    imagePath = `public/upload/${req.files.image[0].filename}`;
  }

  // Handle gallery images
  let galleryPaths = item.gallery || [];
  if (req.files && req.files.gallery) {
    const newGallery = req.files.gallery.map(
      (file) => `public/upload/${file.filename}`
    );
    galleryPaths = [...galleryPaths, ...newGallery];
  }

  // Parse variations
  let parsedVariations = variations;
  if (typeof variations === "string") {
    try {
      parsedVariations = JSON.parse(variations);
    } catch (e) {
      parsedVariations = item.variations;
    }
  }

  // Parse features
  let parsedFeatures = features;
  if (typeof features === "string") {
    try {
      parsedFeatures = JSON.parse(features);
    } catch (e) {
      parsedFeatures = item.features;
    }
  }

  // Build update data
  const updateData = {
    updatedBy: userId,
  };

  if (name) updateData.name = name.trim();
  if (slug) updateData.slug = slug;
  if (category) updateData.category = category;
  if (sections !== undefined) updateData.sections = parsedSections || [];
  if (short_description !== undefined)
    updateData.short_description = short_description;
  if (description !== undefined) updateData.description = description;
  if (is_veg !== undefined)
    updateData.is_veg = is_veg === "true" || is_veg === true;
  if (is_spicy !== undefined)
    updateData.is_spicy = is_spicy === "true" || is_spicy === true;
  if (preparation_time !== undefined)
    updateData.preparation_time = Number(preparation_time);
  if (is_available !== undefined)
    updateData.is_available = is_available === "true" || is_available === true;
  if (is_active !== undefined)
    updateData.is_active = is_active === "true" || is_active === true;
  if (sku) updateData.sku = sku;
  if (req.files && req.files.image) updateData.image = imagePath;
  if (req.files && req.files.gallery) updateData.gallery = galleryPaths;
  if (parsedVariations && parsedVariations.length > 0)
    updateData.variations = parsedVariations;
  if (parsedFeatures) updateData.features = parsedFeatures;

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItem = transformItemData(updatedItem);

  return res
    .status(200)
    .json(new ApiResponse(200, transformedItem, "Item updated successfully"));
});

// ==================== DELETE ITEM ====================
const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  await Item.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item deleted successfully"));
});

// ==================== TOGGLE ITEM STATUS ====================
const toggleItemStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      is_active: !item.is_active,
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItem = transformItemData(updatedItem);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedItem,
        `Item ${updatedItem.is_active ? "activated" : "deactivated"} successfully`
      )
    );
});

// ==================== TOGGLE ITEM AVAILABILITY ====================
const toggleItemAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid item ID format");
  }

  const item = await Item.findById(id);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      is_available: !item.is_available,
      updatedBy: userId,
    },
    { new: true }
  )
    .populate("category", "name slug image")
    .populate("sections", "name slug")
    .populate("createdBy updatedBy", "userName fullName bio image")
    .lean();

  const transformedItem = transformItemData(updatedItem);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedItem,
        `Item ${updatedItem.is_available ? "available" : "unavailable"} updated successfully`
      )
    );
});

// ==================== BULK DELETE ITEMS ====================
const bulkDeleteItems = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of item IDs");
  }

  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid item IDs: ${invalidIds.join(", ")}`);
  }

  const items = await Item.find({ _id: { $in: ids } });
  if (items.length !== ids.length) {
    throw new ApiError(404, "Some items not found");
  }

  await Item.deleteMany({ _id: { $in: ids } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: items.length },
        `${items.length} items deleted successfully`
      )
    );
});

export {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsByCategoryBySlug,
  getItemsBySection,
  getItemById,
  getItemBySlug,
  getItemsBySlugs,
  updateItem,
  deleteItem,
  toggleItemStatus,
  toggleItemAvailability,
  bulkDeleteItems,
  getCardItems,
};

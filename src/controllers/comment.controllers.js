// ael_backend/src/controllers/comment.controllers.js

import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public/Subscriber: Get approved comments for a target (e.g. blog slug or incident ID)
 * Returns hierarchical comments (top-level + nested replies)
 */
export const getCommentsByTarget = asyncHandler(async (req, res) => {
  const { targetId, targetType = "blog" } = req.query;

  if (!targetId) {
    throw new ApiError(400, "targetId query parameter is required");
  }

  // Secure User Identity: Strictly trust authenticated JWT, never accept arbitrary query spoofing
  const currentUserId = req.user?._id || null;

  // Admin sees all, author sees own pending + approved, public sees approved
  const isAdmin =
    req.user &&
    (req.user.role === "admin" ||
      req.user.role === "super_admin" ||
      req.user.role === "superadmin");
  const statusFilter = isAdmin
    ? {}
    : currentUserId
      ? {
        $or: [
          { status: "approved" },
          { status: "pending", userId: currentUserId },
        ],
      }
      : { status: "approved" };

  // 1. Fetch top-level comments
  const topComments = await Comment.find({
    targetId: String(targetId).trim(),
    targetType,
    parentId: null,
    ...statusFilter,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (topComments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments found"));
  }

  // 2. Fetch replies for these top-level comments
  const topIds = topComments.map((c) => c._id);
  const replies = await Comment.find({
    parentId: { $in: topIds },
    ...statusFilter,
  })
    .sort({ createdAt: 1 })
    .lean();

  // 3. Map replies into parent comments
  const replyMap = {};
  replies.forEach((rep) => {
    const pId = rep.parentId.toString();
    if (!replyMap[pId]) replyMap[pId] = [];
    replyMap[pId].push(rep);
  });

  const structured = topComments.map((comment) => ({
    ...comment,
    replies: replyMap[comment._id.toString()] || [],
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, structured, "Comments retrieved successfully"));
});

/**
 * Subscriber: Post new comment or 1-level reply
 * Includes anti-spam rate limiting (max 5 comments per hour)
 */
export const addComment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { targetId, targetType = "blog", targetTitle = "", content, parentId } = req.body;

  if (!targetId || !content || !content.trim()) {
    throw new ApiError(400, "targetId and content are required");
  }

  // Anti-spam Rate Limiting: Max 5 comments per hour per user
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await Comment.countDocuments({
    userId: user._id,
    createdAt: { $gte: oneHourAgo },
  });

  if (recentCount >= 5) {
    throw new ApiError(
      429,
      "Anti-spam protection: You can submit at most 5 comments per hour. Please wait."
    );
  }

  // If this is a reply, verify parent comment exists
  let cleanParentId = null;
  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      throw new ApiError(404, "Parent comment not found");
    }
    // Enforce max 1-level deep: if parent already has a parentId, attach to top parent
    cleanParentId = parentComment.parentId || parentComment._id;
  }

  const newComment = await Comment.create({
    targetType,
    targetId: String(targetId).trim(),
    targetTitle: String(targetTitle).trim(),
    userId: user._id,
    userName: user.userName || user.name || "Subscriber",
    userFullName: user.fullName || user.userName || "Subscriber",
    userEmail: user.email || "",
    userAvatar: user.profilePhoto?.url || user.image?.url || "",
    content: content.trim(),
    status: "pending", // requires admin approval before public visibility
    parentId: cleanParentId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment posted successfully"));
});

/**
 * Admin: Get all comments with search, filter, and pagination
 */
export const getAllCommentsAdmin = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status && status !== "all") {
    query.status = status;
  }
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [
      { content: regex },
      { userName: regex },
      { userFullName: regex },
      { targetTitle: regex },
      { targetId: regex },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const comments = await Comment.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const totalCount = await Comment.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit) || 1,
          totalCount,
        },
      },
      "Admin comments fetched successfully"
    )
  );
});

/**
 * Admin: Update comment status (approve, reject) or edit text
 */
export const updateCommentStatusAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, content } = req.body;

  const updateData = {};
  if (status) updateData.status = status;
  if (content && content.trim()) updateData.content = content.trim();

  const comment = await Comment.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, `Comment marked as ${comment.status}`));
});

/**
 * Admin: Delete comment and its nested replies
 */
export const deleteCommentAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // Delete this comment and any child replies attached to it
  await Comment.deleteMany({
    $or: [{ _id: id }, { parentId: id }],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment and replies deleted successfully"));
});

// src/controllers/clientMessage.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ClientMessage } from "../models/clientMessage.model.js";
import mongoose from "mongoose";

// Transform message data for consistent response
const transformMessageData = (message) => {
  return {
    id: message._id.toString(),
    name: message.name,
    email: message.email,
    phone: message.phone,
    subject: message.subject,
    message: message.message,
    is_read: message.is_read,
    is_replied: message.is_replied,
    replied_at: message.replied_at,
    ip_address: message.ip_address,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};

// Create Client Message API (Public)
const createClientMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Required field validation
  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!phone) {
    throw new ApiError(400, "Phone number is required");
  }

  if (!subject) {
    throw new ApiError(400, "Subject is required");
  }

  if (!message) {
    throw new ApiError(400, "Message is required");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Phone validation (basic)
  if (phone.length < 10) {
    throw new ApiError(400, "Phone number must be at least 10 characters");
  }

  // Create message data
  const messageData = {
    name,
    email,
    phone,
    subject,
    message,
    ip_address: req.ip || req.connection?.remoteAddress || "",
    user_agent: req.headers?.["user-agent"] || "",
  };

  try {
    const clientMessage = await ClientMessage.create(messageData);

    if (!clientMessage) {
      throw new ApiError(500, "Something went wrong while sending message");
    }

    const transformedMessage = transformMessageData(clientMessage);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          transformedMessage,
          "Message sent successfully! We'll get back to you soon."
        )
      );
  } catch (error) {
    console.error("Message creation error:", error);
    if (error.name === "ValidationError") {
      throw new ApiError(400, `Message validation failed: ${error.message}`);
    }
    throw new ApiError(500, "Internal server error while sending message");
  }
});

// Get All Client Messages API (Private - Admin)
const getClientMessages = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    is_read,
    is_replied,
    sortBy = "createdAt",
    sortOrder = "desc",
    startDate,
    endDate,
  } = req.query;

  // Build query object
  const query = {};

  // Search functionality
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by read status
  if (is_read !== undefined && is_read !== "") {
    query.is_read = is_read === "true";
  }

  // Filter by replied status
  if (is_replied !== undefined && is_replied !== "") {
    query.is_replied = is_replied === "true";
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  // Sort options
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // Execute query with pagination
  const messages = await ClientMessage.find(query)
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Transform messages data
  const transformedMessages = messages.map((message) =>
    transformMessageData(message)
  );

  // Get total count for pagination
  const totalCount = await ClientMessage.countDocuments(query);

  // Get unread count
  const unreadCount = await ClientMessage.getUnreadCount();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        messages: transformedMessages,
        unreadCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: parseInt(page) < Math.ceil(totalCount / parseInt(limit)),
          hasPrev: parseInt(page) > 1,
        },
      },
      "Messages fetched successfully"
    )
  );
});

// Get Client Message by ID API (Private)
const getClientMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Message ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Message ID format");
  }

  const message = await ClientMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Mark as read if not already
  if (!message.is_read) {
    await message.markAsRead();
  }

  const transformedMessage = transformMessageData(message);

  return res
    .status(200)
    .json(
      new ApiResponse(200, transformedMessage, "Message fetched successfully")
    );
});

// Delete Client Message API (Private)
const deleteClientMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Message ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid Message ID format");
    }

    const message = await ClientMessage.findById(id);

    if (!message) {
      throw new ApiError(404, "Message not found");
    }

    // Hard Delete - Database থেকে সম্পূর্ণ Remove
    await ClientMessage.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          deletedId: id,
          message: "Message permanently deleted from database",
        },
        "Message deleted successfully"
      )
    );
  } catch (error) {
    console.error("Delete message error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(500, "Internal server error while deleting message");
  }
});

// Mark Message as Read API (Private)
const markMessageAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Message ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Message ID format");
  }

  const message = await ClientMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.is_read) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transformMessageData(message),
          "Message already read"
        )
      );
  }

  await message.markAsRead();

  const transformedMessage = transformMessageData(message);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedMessage,
        "Message marked as read successfully"
      )
    );
});

// Mark Message as Replied API (Private)
const markMessageAsReplied = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Message ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Message ID format");
  }

  const message = await ClientMessage.findById(id);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  await message.markAsReplied();

  const transformedMessage = transformMessageData(message);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transformedMessage,
        "Message marked as replied successfully"
      )
    );
});

// Get Unread Messages Count API (Private)
const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await ClientMessage.getUnreadCount();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { unreadCount }, "Unread count fetched successfully")
    );
});

// Bulk Delete Messages API (Private)
const bulkDeleteMessages = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Message IDs are required");
  }

  // Validate all IDs
  const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
  if (invalidIds.length > 0) {
    throw new ApiError(400, `Invalid message IDs: ${invalidIds.join(", ")}`);
  }

  const result = await ClientMessage.deleteMany({
    _id: { $in: ids },
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "No messages found to delete");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        deletedCount: result.deletedCount,
        message: `${result.deletedCount} message(s) deleted successfully`,
      },
      "Messages deleted successfully"
    )
  );
});

export {
  createClientMessage,
  getClientMessages,
  getClientMessageById,
  deleteClientMessage,
  markMessageAsRead,
  markMessageAsReplied,
  getUnreadCount,
  bulkDeleteMessages,
};

// src/controllers/contact.controllers.js
import { ContactMessage } from "../models/contactMessage.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Submit a contact / support message
 */
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  if (!fullName || !email || !message) {
    throw new ApiError(400, "Full name, email, and message are required");
  }

  const newMessage = await ContactMessage.create({
    fullName: fullName.trim(),
    email: email.trim(),
    phone: (phone || "").trim(),
    subject: (subject || "General Inquiry").trim(),
    message: message.trim(),
  });

  return res.status(201).json(
    new ApiResponse(201, newMessage, "Thank you! Your message has been received.")
  );
});

/**
 * Admin: Get all contact messages with optional filter
 */
export const getContactMessages = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};
  if (status && status !== "all") {
    query.status = status;
  }
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, messages, "Contact messages retrieved successfully")
  );
});

/**
 * Admin: Update status / notes of a contact message
 */
export const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const message = await ContactMessage.findById(id);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (status) message.status = status;
  if (adminNotes !== undefined) message.adminNotes = adminNotes;

  await message.save();

  return res.status(200).json(
    new ApiResponse(200, message, "Message status updated successfully")
  );
});

/**
 * Admin: Delete a contact message
 */
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const message = await ContactMessage.findByIdAndDelete(id);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { id }, "Message deleted successfully")
  );
});

// src/controllers/contact.controllers.js
import { ContactMessage } from "../models/contactMessage.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMail } from "../utils/email.service.js";

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

/**
 * Admin: Reply to a contact message via SMTP Email
 */
export const replyContactMessageEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { recipientEmail, recipientName, replySubject, replyMessage } = req.body;

  if (!recipientEmail || !replyMessage) {
    throw new ApiError(400, "Recipient email and reply message are required");
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <div style="background-color: #22081f; padding: 15px 20px; border-radius: 6px 6px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 18px; font-weight: 700;">AEL SafeLPG Bangladesh</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #d4a373;">Official Support & Administration</p>
      </div>
      <div style="padding: 24px; background-color: #ffffff;">
        <p style="font-size: 14px; color: #334155; margin-top: 0;">Dear <strong>${recipientName || "Valued User"}</strong>,</p>
        <div style="font-size: 14px; line-height: 1.6; color: #1e293b; margin: 16px 0; white-space: pre-wrap;">${replyMessage}</div>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">
          Best regards,<br />
          <strong>AEL SafeLPG Administration Team</strong><br />
          Email: info@safelpg.com | Web: www.safelpg.com
        </p>
      </div>
    </div>
  `;

  const emailResult = await sendMail({
    to: recipientEmail,
    subject: replySubject || "Regarding your inquiry on AEL SafeLPG",
    html: htmlContent,
    text: replyMessage,
  });

  if (id) {
    await ContactMessage.findByIdAndUpdate(id, {
      status: "replied",
      adminNotes: `Replied via email on ${new Date().toISOString()}`,
    });
  }

  return res.status(200).json(
    new ApiResponse(200, emailResult, "Reply email sent successfully")
  );
});


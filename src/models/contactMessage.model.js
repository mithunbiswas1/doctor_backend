// src/models/contactMessage.model.js
import mongoose, { Schema } from "mongoose";

const contactMessageSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
export default ContactMessage;

// ael_backend/src/models/archive.model.js
import mongoose, { Schema } from "mongoose";

const archiveSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleBn: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "incident_news",
        "meeting_updates",
        "stakeholder_updates",
        "safety_instructions",
        "regulatory_circulars",
      ],
      default: "regulatory_circulars",
      index: true,
    },
    summary: {
      type: String,
      default: "",
    },
    summaryBn: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    contentBn: {
      type: String,
      default: "",
    },
    documentUrl: {
      type: String,
      default: "",
    },
    referenceNumber: {
      type: String,
      trim: true,
      default: "",
    },
    publishDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Full text search index
archiveSchema.index({
  title: "text",
  titleBn: "text",
  referenceNumber: "text",
  summary: "text",
  summaryBn: "text",
});

export const Archive = mongoose.model("Archive", archiveSchema);

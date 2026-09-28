// ael_backend/src/controllers/certificate.controllers.js

import { Certificate } from "../models/certificate.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Validate digital certificate by certificate ID
 */
export const verifyCertificate = asyncHandler(async (req, res) => {
  const { certId } = req.params;

  if (!certId) {
    throw new ApiError(400, "Certificate ID is required");
  }

  const certificate = await Certificate.findOne({
    certificateId: certId.trim().toUpperCase(),
  });

  if (!certificate) {
    throw new ApiError(404, "Certificate not found in national registry");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, certificate, "Valid certificate record found"));
});

/**
 * Admin: Get all issued certificates with search
 */
export const getAllCertificates = asyncHandler(async (req, res) => {
  const { q } = req.query;

  const filter = {};
  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { certificateId: searchRegex },
      { studentName: searchRegex },
      { studentNameBn: searchRegex },
      { courseTitle: searchRegex },
    ];
  }

  const certificates = await Certificate.find(filter).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, certificates, "Certificates fetched successfully")
    );
});

/**
 * Admin: Issue new manual certificate
 */
export const createCertificate = asyncHandler(async (req, res) => {
  const {
    certificateId,
    studentName,
    studentNameBn,
    courseTitle,
    courseTitleBn,
    grade,
    authorizedBy,
  } = req.body;

  if (!certificateId || !studentName || !courseTitle) {
    throw new ApiError(
      400,
      "Certificate ID, student name, and course title are required"
    );
  }

  const cleanId = certificateId.trim().toUpperCase();
  const existing = await Certificate.findOne({ certificateId: cleanId });

  if (existing) {
    throw new ApiError(409, `Certificate ID '${cleanId}' already exists`);
  }

  const now = new Date();
  const issueDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const issueDateBn = now.toLocaleDateString("bn-BD");

  const certificate = await Certificate.create({
    ...req.body,
    certificateId: cleanId,
    issueDate,
    issueDateBn,
    grade: grade || "Pass (90%)",
    status: "Verified & Valid",
    authorizedBy: authorizedBy || "Engr. Mahmudul Hasan (DoE Lead Auditor)",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, certificate, "Certificate issued successfully"));
});

/**
 * Admin: Update certificate
 */
export const updateCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, certificate, "Certificate updated successfully"));
});

/**
 * Admin: Delete / revoke certificate
 */
export const deleteCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findByIdAndDelete(id);

  if (!certificate) {
    throw new ApiError(404, "Certificate not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Certificate deleted successfully"));
});

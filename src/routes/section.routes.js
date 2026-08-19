// src/routes/section.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createSection,
  getAllSections,
  getActiveSections,
  getSectionById,
  getSectionBySlug,
  updateSection,
  deleteSection,
  toggleSectionStatus,
  bulkDeleteSections,
} from "../controllers/section.controllers.js";

// Configure multer for single image upload
const sectionUpload = upload.single("image");

// ============ Public Routes (No Authentication Required) ============
router.route("/get-all-sections").get(getAllSections);
router.route("/get-active-sections").get(getActiveSections);
router.route("/get-section-by-id/:id").get(getSectionById);
router.route("/get-section-by-slug/:slug").get(getSectionBySlug);

// ============ Protected Routes (Authentication Required) ============
router.route("/create-section").post(verifyJWT, sectionUpload, createSection);
router
  .route("/update-section/:id")
  .put(verifyJWT, sectionUpload, updateSection);
router.route("/delete-section/:id").delete(verifyJWT, deleteSection);
router
  .route("/toggle-section-status/:id")
  .patch(verifyJWT, toggleSectionStatus);
router.route("/bulk-delete-sections").post(verifyJWT, bulkDeleteSections);

export default router;

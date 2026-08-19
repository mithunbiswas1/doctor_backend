// src/routes/category.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createCategory,
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  bulkDeleteCategories,
} from "../controllers/category.controllers.js";

// Configure multer for single image upload
const categoryUpload = upload.single("image");

// ============ Public Routes (No Authentication Required) ============
router.route("/get-all-categories").get(getAllCategories);
router.route("/get-active-categories").get(getActiveCategories);
router.route("/get-category-by-id/:id").get(getCategoryById);
router.route("/get-category-by-slug/:slug").get(getCategoryBySlug);

// ============ Protected Routes (Authentication Required) ============
router.route("/create-category").post(verifyJWT, categoryUpload, createCategory);
router.route("/update-category/:id").put(verifyJWT, categoryUpload, updateCategory);
router.route("/delete-category/:id").delete(verifyJWT, deleteCategory);
router.route("/toggle-category-status/:id").patch(verifyJWT, toggleCategoryStatus);
router.route("/bulk-delete-categories").post(verifyJWT, bulkDeleteCategories);

export default router;
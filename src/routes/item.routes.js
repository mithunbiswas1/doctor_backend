// src/routes/item.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createItem,
  getAllItems,
  getItemsByCategory,
  getItemsByCategoryBySlug,
  getItemById,
  getItemBySlug,
  getItemsBySlugs,
  updateItem,
  deleteItem,
  toggleItemStatus,
  toggleItemAvailability,
  bulkDeleteItems,
  getCardItems,
} from "../controllers/item.controllers.js";

// Configure multer for multiple file uploads
const itemUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// ============ Public Routes (No Auth Required) ============
router.route("/get-all-items").get(getAllItems);
router.route("/get-card-items").get(getCardItems);
router.route("/get-items-by-category/:categoryId").get(getItemsByCategory);
router
  .route("/get-items-by-category-slug/:categorySlug")
  .get(getItemsByCategoryBySlug);
router.route("/get-item-by-id/:id").get(getItemById);
router.route("/get-item-by-slug/:slug").get(getItemBySlug);
router.route("/get-items-by-slugs").post(getItemsBySlugs);

// ============ Protected Routes (Auth Required) ============
router.route("/create-item").post(verifyJWT, itemUpload, createItem);
router.route("/update-item/:id").put(verifyJWT, itemUpload, updateItem);
router.route("/delete-item/:id").delete(verifyJWT, deleteItem);
router.route("/toggle-item-status/:id").patch(verifyJWT, toggleItemStatus);
router
  .route("/toggle-item-availability/:id")
  .patch(verifyJWT, toggleItemAvailability);
router.route("/bulk-delete-items").post(verifyJWT, bulkDeleteItems);

export default router;

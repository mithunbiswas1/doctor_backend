// src/routes/homeIndustry.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createHomeIndustry,
  getHomeIndustryById,
  getHomeIndustryList,
  getActiveHomeIndustries,
  updateHomeIndustry,
  deleteHomeIndustry,
  toggleHomeIndustryStatus,
  updateIndustryOrder,
} from "../controllers/homeIndustry.controller.js";

// Configure multer for single file upload
const industryUpload = upload.single("image");

// Public routes
router.route("/get-active-industries").get(getActiveHomeIndustries);
router.route("/get-home-industry-list").get(getHomeIndustryList);
router.route("/get-home-industry-by-id/:id").get(getHomeIndustryById);

// Protected routes (require authentication)
router
  .route("/create-home-industry")
  .post(verifyJWT, industryUpload, createHomeIndustry);
router
  .route("/update-home-industry/:id")
  .put(verifyJWT, industryUpload, updateHomeIndustry);
router.route("/delete-home-industry/:id").delete(verifyJWT, deleteHomeIndustry);
router
  .route("/toggle-home-industry-status/:id")
  .patch(verifyJWT, toggleHomeIndustryStatus);
router.route("/update-industry-order").put(verifyJWT, updateIndustryOrder);

export default router;

// routes/homeBanner.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrUpdateHomeBanner,
  getHomeBanner,
  getActiveHomeBanner,
  updateHomeBanner,
  toggleHomeBannerStatus,
  deleteHomeBanner,
} from "../controllers/homeBanner.controller.js";

// Configure multer for single file upload
const bannerUpload = upload.single("banner_image");

// Public routes
router.route("/get-active-banner").get(getActiveHomeBanner);
router.route("/get-home-banner").get(getHomeBanner);

// Protected routes (require authentication)
router
  .route("/create-or-update-home-banner")
  .post(verifyJWT, bannerUpload, createOrUpdateHomeBanner);
router
  .route("/update-home-banner")
  .put(verifyJWT, bannerUpload, updateHomeBanner);
router
  .route("/toggle-home-banner-status")
  .patch(verifyJWT, toggleHomeBannerStatus);
router.route("/delete-home-banner").delete(verifyJWT, deleteHomeBanner);

export default router;

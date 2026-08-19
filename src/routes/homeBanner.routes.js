// routes/homeBanner.routes.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createHomeBanner,
  getHomeBannerById,
  getHomeBannerList,
  getActiveHomeBanners,
  updateHomeBanner,
  deleteHomeBanner,
  toggleHomeBannerStatus,
  updateBannerOrder,
} from "../controllers/homeBanner.controller.js";

// Configure multer for single file upload
const bannerUpload = upload.single("banner_image");

// Public routes (no /api/v1 prefix needed)
router.route("/get-active-banners").get(getActiveHomeBanners);
router.route("/get-home-banner-list").get(getHomeBannerList);
router.route("/get-home-banner-by-id/:id").get(getHomeBannerById);

// Protected routes (require authentication)
router
  .route("/create-home-banner")
  .post(verifyJWT, bannerUpload, createHomeBanner);
router
  .route("/update-home-banner/:id")
  .put(verifyJWT, bannerUpload, updateHomeBanner);
router.route("/delete-home-banner/:id").delete(verifyJWT, deleteHomeBanner);
router
  .route("/toggle-home-banner-status/:id")
  .patch(verifyJWT, toggleHomeBannerStatus);
router.route("/update-banner-order").put(verifyJWT, updateBannerOrder);

export default router;

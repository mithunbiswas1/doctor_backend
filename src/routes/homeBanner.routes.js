// ael_backend/src/routes/homeBanner.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getHomeBanner,
  updateHomeBanner,
  uploadBannerSlides,
} from "../controllers/homeBanner.controllers.js";

const router = Router();

// Public: Get home banner data
router.route("/").get(getHomeBanner);

// Admin: Update home banner details & slides
router
  .route("/")
  .put(verifyJWT, updateHomeBanner)
  .patch(verifyJWT, updateHomeBanner);

// Admin: Upload multiple slide images (Drag & Drop)
router
  .route("/upload-slides")
  .post(verifyJWT, upload.array("images", 10), uploadBannerSlides);

export default router;

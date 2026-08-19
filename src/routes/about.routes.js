// src/routes/about.routes.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrUpdateAbout,
  getAbout,
  getAboutById,
  toggleAboutStatus,
} from "../controllers/about.controller.js";

// Configure multer for multiple file uploads
const aboutUpload = upload.fields([
  { name: "banner_image", maxCount: 1 },
  { name: "chairman_image", maxCount: 1 },
]);

// Public routes
router.route("/get-about").get(getAbout);
router.route("/get-about-by-id/:id").get(getAboutById);

// Protected routes (require authentication)
router
  .route("/create-or-update-about")
  .post(verifyJWT, aboutUpload, createOrUpdateAbout);
router.route("/toggle-about-status/:id").patch(verifyJWT, toggleAboutStatus);

export default router;

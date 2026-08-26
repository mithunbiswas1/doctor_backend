// routes/about.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrUpdateAbout,
  getAbout,
  getActiveAbout,
  updateAbout,
  toggleAboutStatus,
  deleteAbout,
} from "../controllers/about.controller.js";

// Configure multer for multiple files
const aboutUpload = upload.fields([
  { name: "page_banner_image", maxCount: 1 },
  { name: "chairman_image", maxCount: 1 },
]);

// Public routes
router.route("/get-about").get(getAbout);
router.route("/get-active-about").get(getActiveAbout);

// Protected routes
router
  .route("/create-or-update-about")
  .post(verifyJWT, aboutUpload, createOrUpdateAbout);
router.route("/update-about").put(verifyJWT, aboutUpload, updateAbout);
router.route("/toggle-about-status").patch(verifyJWT, toggleAboutStatus);
router.route("/delete-about").delete(verifyJWT, deleteAbout);

export default router;

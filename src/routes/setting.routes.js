// src/routes/setting.routes.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrUpdateSettings,
  getSettings,
  getSettingsById,
  toggleSettingsStatus,
} from "../controllers/setting.controller.js";

// Configure multer for multiple file uploads
const settingsUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "logoWhite", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "openGraphImage", maxCount: 1 },
]);

// Public routes
router.route("/get-settings").get(getSettings);
router.route("/get-settings-by-id/:id").get(getSettingsById);

// Protected routes (require authentication)
router
  .route("/create-or-update-settings")
  .post(verifyJWT, settingsUpload, createOrUpdateSettings);
router
  .route("/toggle-settings-status/:id")
  .patch(verifyJWT, toggleSettingsStatus);

export default router;

// routes/setting.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrUpdateSettings,
  getSettings,
  getActiveSettings,
  updateSettings,
  toggleSettingsStatus,
} from "../controllers/setting.controller.js";

// Configure multer for multiple files
const settingsUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]);

// Public routes
router.route("/get-settings").get(getSettings);
router.route("/get-active-settings").get(getActiveSettings);

// Protected routes
router
  .route("/create-or-update-settings")
  .post(verifyJWT, settingsUpload, createOrUpdateSettings);
router.route("/update-settings").put(verifyJWT, settingsUpload, updateSettings);
router.route("/toggle-settings-status").patch(verifyJWT, toggleSettingsStatus);

export default router;

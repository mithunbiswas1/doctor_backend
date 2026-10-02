// src/routes/admin.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  getDashboardOverviewStats,
  getSystemSettings,
  getPublicSettings,
  updateSystemSettings,
  getAnalyticsReports,
} from "../controllers/admin.controllers.js";

const router = Router();

const settingUpload = upload.fields([
  { name: "siteLogo", maxCount: 1 },
  { name: "footerLogo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]);

// Public settings (Website identity, phone, socials, logos, SEO)
router.route("/settings/public").get(getPublicSettings);

// Protected admin routes
router.route("/dashboard-stats").get(verifyJWT, getDashboardOverviewStats);
router.route("/settings").get(verifyJWT, getSystemSettings);
router.route("/settings").patch(verifyJWT, settingUpload, updateSystemSettings);
router.route("/reports").get(verifyJWT, getAnalyticsReports);

export default router;

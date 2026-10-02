// src/routes/admin.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getDashboardOverviewStats,
  getSystemSettings,
  updateSystemSettings,
  getAnalyticsReports,
} from "../controllers/admin.controllers.js";

const router = Router();

// Protected admin routes
router.route("/dashboard-stats").get(verifyJWT, getDashboardOverviewStats);
router.route("/settings").get(verifyJWT, getSystemSettings);
router.route("/settings").patch(verifyJWT, updateSystemSettings);
router.route("/reports").get(verifyJWT, getAnalyticsReports);

export default router;

// ael_backend/src/routes/advertisement.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getActiveAdBySlot,
  trackAdClick,
  getAllAdsAdmin,
  createAdAdmin,
  updateAdAdmin,
  deleteAdAdmin,
} from "../controllers/advertisement.controllers.js";

const router = Router();

// Public: Get active ad for a slot (auto-increments impressions)
router.route("/slot/:slot").get(getActiveAdBySlot);

// Public: Record click on an ad
router.route("/:id/click").post(trackAdClick);

// Admin: CRUD operations on advertisements
router.route("/admin/all").get(verifyJWT, getAllAdsAdmin);
router.route("/admin").post(verifyJWT, createAdAdmin);
router.route("/admin/:id").patch(verifyJWT, updateAdAdmin).delete(verifyJWT, deleteAdAdmin);

export default router;

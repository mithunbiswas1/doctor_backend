// ael_backend/src/routes/marketUpdate.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getPublicMarketUpdates,
  getPublicMarketUpdateBySlug,
  getAdminMarketUpdates,
  getMarketUpdateById,
  createMarketUpdate,
  updateMarketUpdate,
  deleteMarketUpdate,
} from "../controllers/marketUpdate.controllers.js";

const router = Router();

const uploadFields = [
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
];

// ── Public Routes ──
router.route("/").get(getPublicMarketUpdates);
router.route("/detail/:slug").get(getPublicMarketUpdateBySlug);

// ── Admin Protected Routes ──
router.route("/admin/all").get(verifyJWT, getAdminMarketUpdates);

router
  .route("/")
  .post(verifyJWT, upload.fields(uploadFields), createMarketUpdate);

router
  .route("/:id")
  .get(getMarketUpdateById)
  .patch(verifyJWT, upload.fields(uploadFields), updateMarketUpdate)
  .delete(verifyJWT, deleteMarketUpdate);

export default router;

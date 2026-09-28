// src/routes/page.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getPageByKey,
  getAllPages,
  updatePageByKey,
} from "../controllers/page.controllers.js";

const router = Router();

// Public: Get page content
router.route("/:pageKey").get(getPageByKey);

// Admin: Get all pages & update page
router
  .route("/:pageKey")
  .put(verifyJWT, updatePageByKey)
  .patch(verifyJWT, updatePageByKey);

export default router;

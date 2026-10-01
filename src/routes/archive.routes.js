// ael_backend/src/routes/archive.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getArchiveRecords,
  getArchiveById,
  trackDownload,
  getAdminArchiveRecords,
  createArchiveRecord,
  updateArchiveRecord,
  deleteArchiveRecord,
} from "../controllers/archive.controllers.js";

const router = Router();

// Public routes
router.route("/").get(getArchiveRecords);
router.route("/:id").get(getArchiveById);
router.route("/:id/download").post(trackDownload);

// Admin routes
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission("cms_pages", "view"), getAdminArchiveRecords);

router
  .route("/")
  .post(verifyJWT, checkPermission("cms_pages", "create"), createArchiveRecord);

router
  .route("/:id")
  .patch(verifyJWT, checkPermission("cms_pages", "edit"), updateArchiveRecord)
  .delete(verifyJWT, checkPermission("cms_pages", "delete"), deleteArchiveRecord);

export default router;

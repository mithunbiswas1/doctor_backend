// ael_backend/src/routes/directory.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getDirectoryStats,
  getDirectoryRecords,
  createDirectoryRecord,
  updateDirectoryRecord,
  deleteDirectoryRecord,
  bulkImportDirectory,
} from "../controllers/directory.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getDirectoryStats);
router.route("/bulk-import").post(checkPermission("users", "create"), bulkImportDirectory);
router
  .route("/")
  .get(getDirectoryRecords)
  .post(checkPermission("users", "create"), createDirectoryRecord);

router
  .route("/:id")
  .patch(checkPermission("users", "edit"), updateDirectoryRecord)
  .delete(checkPermission("users", "delete"), deleteDirectoryRecord);

export default router;

// src/routes/package.routes.js

import { Router } from "express";
import {
  createPackage,
  getPackageById,
  getPackageList,
  getActivePackages,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  updatePackageOrder,
} from "../controllers/package.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes
router.get("/get-active-packages", getActivePackages);
router.get("/get-package-list", getPackageList);
router.get("/get-package-by-id/:id", getPackageById);

// Protected routes (Admin only)
router.post("/create-package", verifyJWT, createPackage);
router.put("/update-package/:id", verifyJWT, updatePackage);
router.delete(
  "/delete-package/:id",
  verifyJWT,

  deletePackage
);
router.patch(
  "/toggle-package-status/:id",
  verifyJWT,

  togglePackageStatus
);
router.put(
  "/update-package-order",
  verifyJWT,

  updatePackageOrder
);

export default router;

// src/routes/homeAlliance.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrUpdateAlliance,
  getAlliance,
  getAllianceById,
  deleteAlliance,
  toggleAllianceStatus,
  deleteAllianceImage,
} from "../controllers/homeAlliance.controllers.js";

// Configure multer for alliance image uploads
const allianceUpload = upload.fields([
  { name: "alliance_image1", maxCount: 1 },
  { name: "alliance_image2", maxCount: 1 },
  { name: "alliance_image3", maxCount: 1 },
  { name: "alliance_image4", maxCount: 1 },
]);

// Public routes
router.route("/get-alliance").get(getAlliance);

// Protected routes (Admin only)
router
  .route("/create-or-update-alliance")
  .post(verifyJWT, allianceUpload, createOrUpdateAlliance);

router.route("/get-alliance-by-id/:id").get(verifyJWT, getAllianceById);

router.route("/delete-alliance/:id").delete(verifyJWT, deleteAlliance);

router
  .route("/toggle-alliance-status/:id")
  .patch(verifyJWT, toggleAllianceStatus);

router
  .route("/delete-alliance-image/:id/:imageKey")
  .delete(verifyJWT, deleteAllianceImage);

export default router;

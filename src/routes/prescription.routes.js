// src/routes/prescription.routes.js

import { Router } from "express";
import {
  adminCreatePrescriptionByUsername,
  adminGetPrescriptionsByUsername,
  adminUpdatePrescription,
  adminDeletePrescription,
  userGetMyPrescriptions,
} from "../controllers/prescription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// ==================== ADMIN (DOCTOR) ROUTES ====================
router
  .route("/create-by-username/:userName")
  .post(verifyJWT, adminCreatePrescriptionByUsername);
router
  .route("/get-by-username/:userName")
  .get(verifyJWT, adminGetPrescriptionsByUsername);
router
  .route("/update/:prescriptionId")
  .patch(verifyJWT, adminUpdatePrescription);
router
  .route("/delete/:prescriptionId")
  .delete(verifyJWT, adminDeletePrescription);

// ==================== USER (PATIENT) ROUTES ====================
router.route("/my-prescriptions").get(verifyJWT, userGetMyPrescriptions);

export default router;

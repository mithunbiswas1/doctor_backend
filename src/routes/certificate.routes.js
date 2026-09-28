// ael_backend/src/routes/certificate.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  verifyCertificate,
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from "../controllers/certificate.controllers.js";

const router = Router();

// Public validation
router.route("/verify/:certId").get(verifyCertificate);

// Admin routes
router
  .route("/all")
  .get(verifyJWT, checkPermission("certificates", "view"), getAllCertificates);

router
  .route("/")
  .post(verifyJWT, checkPermission("certificates", "create"), createCertificate);

router
  .route("/:id")
  .patch(verifyJWT, checkPermission("certificates", "edit"), updateCertificate)
  .delete(verifyJWT, checkPermission("certificates", "delete"), deleteCertificate);

export default router;

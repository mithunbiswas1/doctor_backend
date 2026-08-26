// routes/service.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createService,
  getServices,
  getActiveServices,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus,
  updateServiceOrder,
} from "../controllers/service.controller.js";

// Public routes
router.route("/get-active-services").get(getActiveServices);
router.route("/get-services").get(getServices);
router.route("/get-service-by-id/:id").get(getServiceById);

// Protected routes
router.route("/create-service").post(verifyJWT, createService);
router.route("/update-service/:id").put(verifyJWT, updateService);
router.route("/delete-service/:id").delete(verifyJWT, deleteService);
router
  .route("/toggle-service-status/:id")
  .patch(verifyJWT, toggleServiceStatus);
router.route("/update-service-order").put(verifyJWT, updateServiceOrder);

export default router;

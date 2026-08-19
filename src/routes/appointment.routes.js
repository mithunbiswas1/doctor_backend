// src/routes/appointment.routes.js

import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public route (no authentication needed for booking)
router.route("/create-appointment").post(createAppointment);

// Protected routes
router.use(verifyJWT);

// Admin only routes
router.route("/admin-all-appointments").get(getAllAppointments);
router
  .route("/admin-update-appointment-by-id/:appointmentId")
  .patch(updateAppointment);
router
  .route("/admin-delete-appointment-by-id/:appointmentId")
  .delete(deleteAppointment);

// User routes
router.route("/my-appointments").get(getMyAppointments);

// Shared route
router
  .route("/single-appointment-by-id/:appointmentId")
  .get(getAppointmentById);

export default router;

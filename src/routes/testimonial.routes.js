// src/routes/testimonial.routes.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createTestimonial,
  getTestimonialById,
  getTestimonialList,
  getActiveTestimonials,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  updateTestimonialOrder,
} from "../controllers/testimonial.controller.js";

// Configure multer for single file upload
const testimonialUpload = upload.single("image");

// Public routes
router.route("/get-active-testimonials").get(getActiveTestimonials);
router.route("/get-testimonial-list").get(getTestimonialList);
router.route("/get-testimonial-by-id/:id").get(getTestimonialById);

// Protected routes (require authentication)
router
  .route("/create-testimonial")
  .post(verifyJWT, testimonialUpload, createTestimonial);
router
  .route("/update-testimonial/:id")
  .put(verifyJWT, testimonialUpload, updateTestimonial);
router.route("/delete-testimonial/:id").delete(verifyJWT, deleteTestimonial);
router
  .route("/toggle-testimonial-status/:id")
  .patch(verifyJWT, toggleTestimonialStatus);
router
  .route("/update-testimonial-order")
  .put(verifyJWT, updateTestimonialOrder);

export default router;

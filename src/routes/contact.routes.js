// src/routes/contact.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  replyContactMessageEmail,
} from "../controllers/contact.controllers.js";

const router = Router();

// Public: Submit message
router.route("/").post(submitContactMessage);
router.route("/messages").post(submitContactMessage);

// Admin: Manage messages
router.route("/messages").get(verifyJWT, getContactMessages);
router.route("/messages/:id/reply").post(verifyJWT, replyContactMessageEmail);
router.route("/reply").post(verifyJWT, replyContactMessageEmail);
router
  .route("/messages/:id")
  .patch(verifyJWT, updateContactMessageStatus)
  .delete(verifyJWT, deleteContactMessage);

export default router;

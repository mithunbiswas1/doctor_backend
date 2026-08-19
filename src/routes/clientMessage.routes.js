// src/routes/clientMessage.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createClientMessage,
  getClientMessages,
  getClientMessageById,
  deleteClientMessage,
  markMessageAsRead,
  markMessageAsReplied,
  getUnreadCount,
  bulkDeleteMessages,
} from "../controllers/clientMessage.controller.js";

// Public routes (No authentication required)
router.route("/create-client-message").post(createClientMessage);

// Protected routes (require authentication - Admin only)
router.route("/get-client-messages").get(verifyJWT, getClientMessages);
router.route("/get-client-message/:id").get(verifyJWT, getClientMessageById);
router
  .route("/delete-client-message/:id")
  .delete(verifyJWT, deleteClientMessage);
router.route("/mark-message-as-read/:id").patch(verifyJWT, markMessageAsRead);
router
  .route("/mark-message-as-replied/:id")
  .patch(verifyJWT, markMessageAsReplied);
router.route("/get-unread-count").get(verifyJWT, getUnreadCount);
router.route("/bulk-delete-messages").post(verifyJWT, bulkDeleteMessages);

export default router;

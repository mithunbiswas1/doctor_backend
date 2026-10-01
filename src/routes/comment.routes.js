// ael_backend/src/routes/comment.routes.js

import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getCommentsByTarget,
  addComment,
  getAllCommentsAdmin,
  updateCommentStatusAdmin,
  deleteCommentAdmin,
} from "../controllers/comment.controllers.js";

const router = Router();

// Public: Get approved comments for blog/news/incident (also returns own pending comments if logged in)
router.route("/").get(optionalVerifyJWT, getCommentsByTarget);

// Subscriber: Post new comment or reply (requires auth)
router.route("/").post(verifyJWT, addComment);

// Admin: Moderate comments
router.route("/admin/all").get(verifyJWT, getAllCommentsAdmin);
router.route("/admin/:id/status").patch(verifyJWT, updateCommentStatusAdmin);
router.route("/admin/:id").delete(verifyJWT, deleteCommentAdmin);

export default router;

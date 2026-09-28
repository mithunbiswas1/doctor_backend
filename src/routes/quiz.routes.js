// ael_backend/src/routes/quiz.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getQuizByCourseId,
  submitQuiz,
  saveQuiz,
  getAllQuizzes,
  deleteQuiz,
} from "../controllers/quiz.controllers.js";

const router = Router();

// Public / Learner routes
router.route("/course/:courseId").get(getQuizByCourseId);
router.route("/submit").post(verifyJWT, submitQuiz);

// Admin routes
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission("quizzes", "view"), getAllQuizzes);

router
  .route("/save")
  .post(verifyJWT, checkPermission("quizzes", "create"), saveQuiz);

router
  .route("/:id")
  .delete(verifyJWT, checkPermission("quizzes", "delete"), deleteQuiz);

export default router;

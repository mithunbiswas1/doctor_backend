// ael_backend/src/routes/course.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyEnrolledCourses,
  enrollInCourse,
  uploadCourseVideo,
  uploadCourseImage,
  updateCourseProgress,
} from "../controllers/course.controllers.js";
import { upload, uploadVideo } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes
router.route("/").get(getCourses);

// Media Upload Routes (Admin only)
router
  .route("/upload-image")
  .post(
    verifyJWT,
    checkPermission("courses", "create"),
    upload.single("image"),
    uploadCourseImage
  );

router
  .route("/upload-video")
  .post(
    verifyJWT,
    checkPermission("courses", "create"),
    uploadVideo.single("video"),
    uploadCourseVideo
  );

// Subscriber / Learner authenticated routes
router.route("/subscriber/my-learning").get(verifyJWT, getMyEnrolledCourses);
router.route("/subscriber/enroll").post(verifyJWT, enrollInCourse);
router.route("/:id/progress").post(verifyJWT, updateCourseProgress);

// Single course details (after explicit static routes)
router.route("/:id").get(getCourseById);

// Admin routes
router
  .route("/")
  .post(verifyJWT, checkPermission("courses", "create"), createCourse);

router
  .route("/:id")
  .patch(verifyJWT, checkPermission("courses", "edit"), updateCourse)
  .delete(verifyJWT, checkPermission("courses", "delete"), deleteCourse);

export default router;

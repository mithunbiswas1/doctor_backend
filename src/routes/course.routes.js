// ael_backend/src/routes/course.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getCourses,
  getAdminCourses,
  getCourseEnrollmentHistory,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyEnrolledCourses,
  enrollInCourse,
  uploadCourseVideo,
  uploadCourseImage,
  uploadCoursePdf,
  updateCourseProgress,
} from "../controllers/course.controllers.js";
import { upload, uploadVideo } from "../middlewares/multer.middlewares.js";

const router = Router();

// Public routes
router.route("/").get(getCourses);

// Admin / Instructor courses management
router
  .route("/admin-list")
  .get(verifyJWT, checkPermission("courses", "view"), getAdminCourses);

// Instructor / Admin enrollment and sales history
router
  .route("/instructor/enrollments")
  .get(verifyJWT, checkPermission("courses", "view"), getCourseEnrollmentHistory);

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

router
  .route("/upload-pdf")
  .post(
    verifyJWT,
    checkPermission("courses", "create"),
    upload.single("pdf"),
    uploadCoursePdf
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

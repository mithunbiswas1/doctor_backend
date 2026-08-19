import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createProject,
  getProjectById,
  getProjectBySlug,
  getAllProjects,
  getListProjects,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  getPopularProjects,
  getSitemapProjects,
} from "../controllers/project.controllers.js";

// Configure multer for multiple file uploads with specific field names
const projectUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// Public routes
router.route("/get-all-projects").get(getAllProjects);
router.route("/get-all-sitemap-projects").get(getSitemapProjects);
router.route("/get-list-projects").get(getListProjects);
router.route("/get-popular-projects").get(getPopularProjects);
router.route("/get-project-by-slug/:slug").get(getProjectBySlug);
router.route("/get-project-by-id/:id").get(getProjectById);

// Protected routes (require authentication)
router.route("/create-project").post(verifyJWT, projectUpload, createProject);
router
  .route("/update-project/:id")
  .put(verifyJWT, projectUpload, updateProject);
router.route("/delete-project/:id").delete(verifyJWT, deleteProject);
router
  .route("/toggle-project-status/:id")
  .patch(verifyJWT, toggleProjectStatus);

export default router;

// ael_backend/src/routes/blog.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getPublicBlogs,
  getPublicBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controllers.js";

const router = Router();

const uploadFields = [{ name: "image", maxCount: 1 }];

// ── Public Routes ──
router.route("/").get(getPublicBlogs);
router.route("/detail/:slug").get(getPublicBlogBySlug);

// ── Admin Protected Routes ──
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission("blogs", "view"), getAdminBlogs);

router
  .route("/")
  .post(
    verifyJWT,
    checkPermission("blogs", "create"),
    upload.fields(uploadFields),
    createBlog
  );

router
  .route("/:id")
  .patch(
    verifyJWT,
    checkPermission("blogs", "edit"),
    upload.fields(uploadFields),
    updateBlog
  )
  .delete(verifyJWT, checkPermission("blogs", "delete"), deleteBlog);

export default router;

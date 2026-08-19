// src/routes/blog.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getAllBlogs,
  getListBlogs,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  getPopularBlogs,
  getSitemapBlogs,
} from "../controllers/blog.controllers.js";

// Configure multer for multiple file uploads with specific field names
const blogUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "gallery", maxCount: 10 }, // Allow up to 10 gallery images
]);

// Public routes
router.route("/get-all-blogs").get(getAllBlogs);
router.route("/get-all-sitemap-blogs").get(getSitemapBlogs);
router.route("/get-list-blogs").get(getListBlogs);
router.route("/get-popular-blogs").get(getPopularBlogs);
router.route("/get-blog-by-slug/:slug").get(getBlogBySlug);
router.route("/get-blog-by-id/:id").get(getBlogById);

// Protected routes (require authentication)
router.route("/create-blog").post(verifyJWT, blogUpload, createBlog);
router.route("/update-blog/:id").put(verifyJWT, blogUpload, updateBlog);
router.route("/delete-blog/:id").delete(verifyJWT, deleteBlog);
router.route("/toggle-blog-status/:id").patch(verifyJWT, toggleBlogStatus);

export default router;

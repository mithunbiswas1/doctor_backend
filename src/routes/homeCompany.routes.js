// src/routes/homeCompany.routes.js
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createHomeCompany,
  getHomeCompanyById,
  getHomeCompanyList,
  getActiveHomeCompanies,
  updateHomeCompany,
  deleteHomeCompany,
  toggleHomeCompanyStatus,
  updateCompanyOrder,
} from "../controllers/homeCompany.controller.js";

// Configure multer for single file upload
const companyUpload = upload.single("image");

// Public routes
router.route("/get-active-companies").get(getActiveHomeCompanies);
router.route("/get-home-company-list").get(getHomeCompanyList);
router.route("/get-home-company-by-id/:id").get(getHomeCompanyById);

// Protected routes (require authentication)
router
  .route("/create-home-company")
  .post(verifyJWT, companyUpload, createHomeCompany);
router
  .route("/update-home-company/:id")
  .put(verifyJWT, companyUpload, updateHomeCompany);
router.route("/delete-home-company/:id").delete(verifyJWT, deleteHomeCompany);
router
  .route("/toggle-home-company-status/:id")
  .patch(verifyJWT, toggleHomeCompanyStatus);
router.route("/update-company-order").put(verifyJWT, updateCompanyOrder);

export default router;

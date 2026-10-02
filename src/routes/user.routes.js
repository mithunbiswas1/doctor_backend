// src/routes/user.routes.js

import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import {
  registerUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  login,
  logout,
  refreshAccessToken,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getListUsers,
  getUserByIdForAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getPrescribedUsersList,
  getUserByUsername,
  getAuthorPublicProfile,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

const uploadFields = [{ name: "profilePhoto", maxCount: 1 }];

// Public routes
router.route("/register").post(upload.fields(uploadFields), registerUser);
router.route("/send-registration-otp").post(sendRegistrationOtp);
router.route("/new-otp").post(sendRegistrationOtp);
router.route("/verify-registration-otp").post(verifyRegistrationOtp);
router.route("/otp-verify").post(verifyRegistrationOtp);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/by-username/:userName").get(getUserByUsername);
router.route("/author/:identifier").get(getAuthorPublicProfile);
router.route("/authors/:identifier").get(getAuthorPublicProfile);

// Protected routes (require authentication)
router.route("/logout").post(verifyJWT, logout);
router.route("/profile").get(verifyJWT, getUserProfile);
router
  .route("/update-profile")
  .patch(verifyJWT, upload.fields(uploadFields), updateUserProfile);
router.route("/update-password").patch(verifyJWT, updatePassword);

// Admin routes
router.route("/list-users").get(verifyJWT, getListUsers);
router.route("/admin-user/:userId").get(verifyJWT, getUserByIdForAdmin);
router.route("/prescribed-list-users").get(verifyJWT, getPrescribedUsersList);
router
  .route("/update-user/:userId")
  .patch(verifyJWT, upload.fields(uploadFields), updateUserByAdmin);
router.route("/delete-user/:userId").delete(verifyJWT, deleteUserByAdmin);

export default router;

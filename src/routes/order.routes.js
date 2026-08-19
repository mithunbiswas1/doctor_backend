// src/routes/order.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  getOrdersByUser,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/order.controllers.js";

// ============ Public Route (No Authentication Required) ============
router.route("/create-order").post(createOrder);

// ============ Protected Routes (Authentication Required) ============
router.route("/get-all-orders").get(verifyJWT, getAllOrders);
router.route("/get-order-by-id/:id").get(verifyJWT, getOrderById);
router
  .route("/get-order-by-number/:orderNumber")
  .get(verifyJWT, getOrderByNumber);
router.route("/get-orders-by-user").get(verifyJWT, getOrdersByUser);
router.route("/update-order-status/:id").patch(verifyJWT, updateOrderStatus);
router
  .route("/update-payment-status/:id")
  .patch(verifyJWT, updatePaymentStatus);
router.route("/cancel-order/:id").patch(verifyJWT, cancelOrder);
router.route("/delete-order/:id").delete(verifyJWT, deleteOrder);

export default router;

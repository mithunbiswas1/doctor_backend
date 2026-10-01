// ael_backend/src/routes/subscription.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getSubscriptionPlans,
  initiateCheckout,
  getAdminSubscriptions,
  refundSubscription,
} from "../controllers/subscription.controllers.js";

const router = Router();

// Public routes
router.route("/plans").get(getSubscriptionPlans);
router.route("/checkout").post(initiateCheckout);

// Admin routes
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission("roles", "view"), getAdminSubscriptions);

router
  .route("/admin/:id/refund")
  .post(verifyJWT, checkPermission("roles", "edit"), refundSubscription);

export default router;

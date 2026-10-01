// ael_backend/src/routes/subscription.routes.js

import { Router } from "express";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getSubscriptionPlans,
  getAdminSubscriptionPlans,
  createSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  initiateCheckout,
  getMySubscriptionDetails,
  assignUserSubscription,
  revokeUserSubscription,
  getAdminSubscriptions,
  refundSubscription,
} from "../controllers/subscription.controllers.js";

const router = Router();

// Public / User routes
router.route("/plans").get(getSubscriptionPlans);
router.route("/checkout").post(optionalVerifyJWT, initiateCheckout);
router.route("/my").get(verifyJWT, getMySubscriptionDetails);

// Admin Plans Management
router
  .route("/admin/plans")
  .get(verifyJWT, checkPermission("roles", "view"), getAdminSubscriptionPlans)
  .post(verifyJWT, checkPermission("roles", "create"), createSubscriptionPlan);

router
  .route("/admin/plans/:id")
  .get(verifyJWT, checkPermission("roles", "view"), getSubscriptionPlanById)
  .patch(verifyJWT, checkPermission("roles", "edit"), updateSubscriptionPlan)
  .delete(verifyJWT, checkPermission("roles", "delete"), deleteSubscriptionPlan);

// Admin User Subscription Manual Assignment & Revocation
router
  .route("/admin/assign")
  .post(verifyJWT, checkPermission("roles", "edit"), assignUserSubscription);

router
  .route("/admin/revoke/:userId")
  .post(verifyJWT, checkPermission("roles", "edit"), revokeUserSubscription);

// Admin Transactions & Audit
router
  .route("/admin/all")
  .get(verifyJWT, checkPermission("roles", "view"), getAdminSubscriptions);

router
  .route("/admin/:id/refund")
  .post(verifyJWT, checkPermission("roles", "edit"), refundSubscription);

export default router;

// ael_backend/src/routes/newsletter.routes.js
import { Router } from "express";
import {
  subscribePublic,
  unsubscribePublic,
  getSubscribersAdmin,
  toggleSubscriberStatusAdmin,
  deleteSubscriberAdmin,
  broadcastManualNewsletterAdmin,
} from "../controllers/newsletter.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { verifyAdmin } from "../middlewares/admin.middlewares.js";

const router = Router();

// Public routes
router.route("/subscribe").post(subscribePublic);
router.route("/unsubscribe").post(unsubscribePublic);

// Admin routes
router.use(verifyJWT, verifyAdmin);
router.route("/subscribers").get(getSubscribersAdmin);
router.route("/subscribers/:id/toggle").patch(toggleSubscriberStatusAdmin);
router.route("/subscribers/:id").delete(deleteSubscriberAdmin);
router.route("/broadcast").post(broadcastManualNewsletterAdmin);

export default router;

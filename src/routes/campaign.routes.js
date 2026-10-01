// ael_backend/src/routes/campaign.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getCampaigns,
  getCampaignStats,
  createCampaign,
  deleteCampaign,
} from "../controllers/campaign.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getCampaignStats);
router.route("/").get(getCampaigns).post(createCampaign);
router.route("/:id").delete(deleteCampaign);

export default router;

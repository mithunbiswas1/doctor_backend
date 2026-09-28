// ael_backend/src/routes/role.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { checkPermission } from "../middlewares/permission.middlewares.js";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRolePermissions,
  deleteRole,
  getMyPermissions,
} from "../controllers/role.controllers.js";

const router = Router();

// Current user effective permissions
router.route("/my-permissions").get(verifyJWT, getMyPermissions);

// Super Admin / Role Manager Routes
router
  .route("/")
  .get(verifyJWT, checkPermission("roles", "view"), getAllRoles)
  .post(verifyJWT, checkPermission("roles", "create"), createRole);

router
  .route("/:id")
  .get(verifyJWT, checkPermission("roles", "view"), getRoleById)
  .patch(verifyJWT, checkPermission("roles", "edit"), updateRolePermissions)
  .delete(verifyJWT, checkPermission("roles", "delete"), deleteRole);

export default router;

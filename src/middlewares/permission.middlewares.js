// ael_backend/src/middlewares/permission.middlewares.js

import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Middleware to enforce granular role-based permissions
 * @param {string} moduleName - The module name ('blogs', 'courses', 'roles', etc.)
 * @param {string} action - The action ('view', 'create', 'edit', 'delete')
 */
export const checkPermission = (moduleName, action) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    // Super Admin has master authority across all modules
    if (user.role === "super_admin" || user.role === "admin") {
      return next();
    }

    // Resolve user's role configuration from DB
    const userRole = await Role.findOne({ name: user.role });

    if (!userRole) {
      throw new ApiError(403, "Access denied: Role definition not found");
    }

    // Find permissions for the requested module
    const modulePermission = userRole.permissions.find(
      (p) => p.module === moduleName
    );

    if (!modulePermission || !modulePermission.actions.includes(action)) {
      throw new ApiError(
        403,
        `Permission denied: Insufficient privileges to perform '${action}' on '${moduleName}'`
      );
    }

    next();
  });
};

/**
 * Middleware to require specific role(s)
 * @param  {...string} roles
 */
export const requireRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    if (user.role === "super_admin" || roles.includes(user.role)) {
      return next();
    }

    throw new ApiError(
      403,
      `Access denied: Required role is [${roles.join(", ")}]`
    );
  });
};

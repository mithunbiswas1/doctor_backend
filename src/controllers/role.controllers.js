// ael_backend/src/controllers/role.controllers.js

import { Role } from "../models/role.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get all configured roles and their permission matrices
 */
export const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().sort({ createdAt: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, roles, "Roles fetched successfully"));
});

/**
 * Get single role details by ID
 */
export const getRoleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = await Role.findById(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, role, "Role details fetched successfully"));
});

/**
 * Create a new custom role (Super Admin only)
 */
export const createRole = asyncHandler(async (req, res) => {
  const { name, label, description, permissions } = req.body;

  if (!name || !label) {
    throw new ApiError(400, "Role name and display label are required");
  }

  const normalizedName = name.toLowerCase().trim().replace(/\s+/g, "_");
  const existingRole = await Role.findOne({ name: normalizedName });

  if (existingRole) {
    throw new ApiError(409, `Role '${normalizedName}' already exists`);
  }

  const role = await Role.create({
    name: normalizedName,
    label,
    description: description || "",
    isSystem: false,
    permissions: permissions || [],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, role, "Custom role created successfully"));
});

/**
 * Update role permissions matrix (Super Admin only)
 */
export const updateRolePermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { label, description, permissions } = req.body;

  const role = await Role.findById(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (label) role.label = label;
  if (description !== undefined) role.description = description;
  if (permissions) role.permissions = permissions;

  await role.save();

  return res
    .status(200)
    .json(new ApiResponse(200, role, "Role permissions updated successfully"));
});

/**
 * Delete a custom role (Cannot delete system roles)
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  if (role.isSystem) {
    throw new ApiError(403, "System roles cannot be deleted");
  }

  await Role.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Role deleted successfully"));
});

/**
 * Get current authenticated user's permissions
 */
export const getMyPermissions = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Not authenticated");
  }

  // Super Admin has all permissions
  if (user.role === "super_admin" || user.role === "admin") {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          role: user.role,
          isSuperAdmin: true,
          permissions: [
            { module: "courses", actions: ["view", "create", "edit", "delete"] },
            { module: "quizzes", actions: ["view", "create", "edit", "delete"] },
            { module: "certificates", actions: ["view", "create", "edit", "delete"] },
            { module: "blogs", actions: ["view", "create", "edit", "delete"] },
            { module: "market_updates", actions: ["view", "create", "edit", "delete"] },
            { module: "roles", actions: ["view", "create", "edit", "delete"] },
            { module: "users", actions: ["view", "create", "edit", "delete"] },
            { module: "analytics", actions: ["view"] },
            { module: "settings", actions: ["view", "edit"] },
          ],
        },
        "User permissions resolved (Master Super Admin)"
      )
    );
  }

  const role = await Role.findOne({ name: user.role });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        role: user.role,
        isSuperAdmin: false,
        permissions: role ? role.permissions : [],
      },
      "User permissions resolved successfully"
    )
  );
});

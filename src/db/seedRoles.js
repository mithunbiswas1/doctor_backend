// ael_backend/src/db/seedRoles.js

import { Role } from "../models/role.model.js";

export const DEFAULT_ROLES = [
  {
    name: "super_admin",
    label: "Super Administrator",
    description: "Master administrator with unrestricted platform authority",
    isSystem: true,
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
  {
    name: "admin",
    label: "Administrator",
    description: "Platform administrator with operations, content, and user management authority",
    isSystem: true,
    permissions: [
      { module: "courses", actions: ["view", "create", "edit", "delete"] },
      { module: "quizzes", actions: ["view", "create", "edit", "delete"] },
      { module: "certificates", actions: ["view", "create", "edit", "delete"] },
      { module: "blogs", actions: ["view", "create", "edit", "delete"] },
      { module: "market_updates", actions: ["view", "create", "edit", "delete"] },
      { module: "users", actions: ["view", "create", "edit"] },
      { module: "messages", actions: ["view", "create", "edit", "delete"] },
      { module: "comments", actions: ["view", "create", "edit", "delete"] },
      { module: "subscriptions", actions: ["view", "create", "edit"] },
      { module: "analytics", actions: ["view"] },
    ],
  },
  {
    name: "instructor",
    label: "Instructor",
    description: "Manages courses, curriculum modules, quizzes, and certificates",
    isSystem: true,
    permissions: [
      { module: "courses", actions: ["view", "create", "edit", "delete"] },
      { module: "quizzes", actions: ["view", "create", "edit", "delete"] },
      { module: "certificates", actions: ["view", "create", "edit", "delete"] },
      { module: "blogs", actions: ["view", "create", "edit"] },
      { module: "analytics", actions: ["view"] },
    ],
  },
  {
    name: "subscriber",
    label: "Subscriber",
    description: "Premium subscriber with access to all paid masterclasses, videos, certificates, and comments",
    isSystem: true,
    permissions: [
      { module: "courses", actions: ["view"] },
      { module: "quizzes", actions: ["view"] },
      { module: "certificates", actions: ["view"] },
      { module: "blogs", actions: ["view"] },
      { module: "market_updates", actions: ["view"] },
      { module: "comments", actions: ["view", "create"] },
    ],
  },
  {
    name: "user",
    label: "User",
    description: "Registered member who can enroll in courses, browse content, and post comments",
    isSystem: true,
    permissions: [
      { module: "courses", actions: ["view"] },
      { module: "blogs", actions: ["view"] },
      { module: "market_updates", actions: ["view"] },
      { module: "certificates", actions: ["view"] },
      { module: "comments", actions: ["view", "create"] },
    ],
  },
];

export async function seedDefaultRoles() {
  try {
    for (const roleDef of DEFAULT_ROLES) {
      const exists = await Role.findOne({ name: roleDef.name });
      if (!exists) {
        await Role.create(roleDef);
        console.log(`[Seed] Initialized system role: ${roleDef.name}`);
      }
    }
  } catch (error) {
    console.error("[Seed Error] Failed to seed default roles:", error.message);
  }
}

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
    name: "course_admin",
    label: "Course Administrator",
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
    label: "Enrolled Subscriber",
    description: "Authenticated enrolled student with access to interactive classroom and quizzes",
    isSystem: true,
    permissions: [
      { module: "courses", actions: ["view"] },
      { module: "quizzes", actions: ["view"] },
      { module: "certificates", actions: ["view"] },
      { module: "blogs", actions: ["view"] },
      { module: "market_updates", actions: ["view"] },
    ],
  },
  {
    name: "general_user",
    label: "General User",
    description: "Public registered member with standard browsing access",
    isSystem: true,
    permissions: [
      { module: "courses", actions: ["view"] },
      { module: "blogs", actions: ["view"] },
      { module: "market_updates", actions: ["view"] },
      { module: "certificates", actions: ["view"] },
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

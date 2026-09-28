// ael_backend/src/models/role.model.js
import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    permissions: [
      {
        module: {
          type: String,
          required: true,
          trim: true,
        },
        actions: [
          {
            type: String,
            enum: ["view", "create", "edit", "delete"],
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Role = mongoose.model("Role", roleSchema);

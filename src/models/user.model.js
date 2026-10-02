// src/models/user.model.js

import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      default: undefined,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [
        "super_admin",
        "admin",
        "instructor",
        "subscriber",
        "user",
      ],
      default: "user",
    },
    permissions: [
      {
        page: {
          type: String,
          required: true,
          trim: true,
        },
        module: {
          type: String,
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
    bio: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    linkedin: {
      type: String,
      default: "",
      trim: true,
    },
    twitter: {
      type: String,
      default: "",
      trim: true,
    },
    facebook: {
      type: String,
      default: "",
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_newsletter_subscribed: {
      type: Boolean,
      default: true,
    },
    is_prescribed: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    enrolledCourses: [
      {
        courseId: { type: String, required: true },
        enrolledAt: { type: Date, default: Date.now },
        progressPercent: { type: Number, default: 0 },
        completedLessons: [{ type: String }],
        status: { type: String, enum: ["active", "completed"], default: "active" },
      },
    ],
    subscription: {
      planKey: {
        type: String,
        enum: [
          "free",
          "monthly",
          "half_yearly",
          "yearly",
          "professional",
          "course_single",
          "consumer",
          "dealer",
          "enterprise",
          null,
        ],
        default: "free",
      },
      planName: { type: String, default: "Free / Newsletter" },
      status: {
        type: String,
        enum: ["active", "expired", "revoked", "inactive"],
        default: "inactive",
      },
      startDate: { type: Date, default: null },
      expiresAt: { type: Date, default: null },
      transactionId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

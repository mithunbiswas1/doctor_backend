// src/models/homeCompany.model.js
import mongoose, { Schema } from "mongoose";

const homeCompanySchema = new Schema(
  {
    image: {
      type: String,
      required: [true, "Company image is required"],
    },
    title: {
      type: String,
      required: [true, "Company title is required"],
      trim: true,
      maxlength: 100,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
homeCompanySchema.index({ is_active: 1 });
homeCompanySchema.index({ order: 1 });
homeCompanySchema.index({ createdAt: -1 });
homeCompanySchema.index({ title: 1 });

// Static method to get active companies
homeCompanySchema.statics.getActiveCompanies = function () {
  return this.find({ is_active: true }).sort({ order: 1, createdAt: -1 });
};

// Instance method to toggle status
homeCompanySchema.methods.toggleStatus = function () {
  this.is_active = !this.is_active;
  return this.save();
};

export const HomeCompany = mongoose.model("HomeCompany", homeCompanySchema);

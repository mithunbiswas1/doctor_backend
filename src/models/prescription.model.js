// src/models/prescription.model.js

import mongoose, { Schema } from "mongoose";

const medicineSchema = new Schema({
  medicine_name: {
    type: String,
    required: [true, "Medicine name is required"],
    trim: true,
  },
  dosage_time: {
    type: String,
    required: [true, "Dosage time is required"],
    trim: true,
  },
  aftermeal: {
    type: Boolean,
    required: [true, "Please specify before or after meal"],
    default: true, // true = after meal, false = before meal
  },
  notes: {
    type: String,
    trim: true,
  },
});

const prescriptionSchema = new Schema(
  {
    // Patient Information
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient ID is required"],
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
      trim: true,
    },
    patientPhone: {
      type: String,
      required: [true, "Patient phone is required"],
      trim: true,
    },
    patientEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // Doctor Information
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor ID is required"],
    },
    doctorName: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
    },

    // Prescription Details
    prescriptionDate: {
      type: Date,
      required: [true, "Prescription date is required"],
      default: Date.now,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    medicines: {
      type: [medicineSchema],
      required: [true, "At least one medicine is required"],
      validate: {
        validator: function (medicines) {
          return medicines && medicines.length > 0;
        },
        message: "At least one medicine is required",
      },
    },
    next_visit: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ patientName: 1 });
prescriptionSchema.index({ patientPhone: 1 });
prescriptionSchema.index({ prescriptionDate: -1 });
prescriptionSchema.index({ createdAt: -1 });

export const Prescription = mongoose.model("Prescription", prescriptionSchema);

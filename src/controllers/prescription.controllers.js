// src/controllers/prescription.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Prescription } from "../models/prescription.model.js";
import { User } from "../models/user.model.js";

// ==================== ADMIN: Create Prescription by Username ====================
const adminCreatePrescriptionByUsername = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const { prescriptionDate, symptoms, medicines, next_visit, notes } = req.body;

  const doctorId = req.user._id;
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if (doctor.role !== "admin") {
    throw new ApiError(403, "Only admin/doctors can create prescriptions");
  }

  const patient = await User.findOne({ userName });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    throw new ApiError(400, "At least one medicine is required");
  }

  for (const medicine of medicines) {
    if (!medicine.medicine_name || !medicine.dosage_time) {
      throw new ApiError(
        400,
        "Each medicine must have medicine_name and dosage_time"
      );
    }
  }

  // Update patient's is_prescribed status
  await User.findByIdAndUpdate(patient._id, { is_prescribed: true });

  const prescription = await Prescription.create({
    patientId: patient._id,
    patientName: patient.fullName,
    patientPhone: patient.phone,
    patientEmail: patient.email,
    doctorId: doctor._id,
    doctorName: doctor.fullName,
    prescriptionDate: prescriptionDate || new Date(),
    symptoms: symptoms || [],
    medicines,
    next_visit,
    notes,
    createdBy: doctorId,
    updatedBy: doctorId,
  });

  const createdPrescription = await Prescription.findById(prescription._id)
    .populate("patientId", "fullName email phone image is_prescribed userName")
    .populate("doctorId", "fullName email image")
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdPrescription,
        "Prescription created successfully"
      )
    );
});

// ==================== ADMIN: Get Prescriptions by Username ====================
const adminGetPrescriptionsByUsername = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  const doctorId = req.user._id;
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if (doctor.role !== "admin") {
    throw new ApiError(
      403,
      "Only admin/doctors can view patient prescriptions"
    );
  }

  const patient = await User.findOne({ userName });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const prescriptions = await Prescription.find({ patientId: patient._id })
    .populate("doctorId", "fullName email image")
    .populate("createdBy", "fullName")
    .sort({ prescriptionDate: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        patient: {
          userName: patient.userName,
          fullName: patient.fullName,
          email: patient.email,
          phone: patient.phone,
          image: patient.image,
          is_prescribed: patient.is_prescribed,
        },
        prescriptions,
      },
      "Patient prescriptions fetched successfully"
    )
  );
});

// ==================== ADMIN: Update Prescription by ID ====================
const adminUpdatePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const { prescriptionDate, symptoms, medicines, next_visit, notes, isActive } =
    req.body;

  const doctorId = req.user._id;
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if (doctor.role !== "admin") {
    throw new ApiError(403, "Only admin/doctors can update prescriptions");
  }

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  if (medicines) {
    if (!Array.isArray(medicines) || medicines.length === 0) {
      throw new ApiError(400, "At least one medicine is required");
    }
    for (const medicine of medicines) {
      if (!medicine.medicine_name || !medicine.dosage_time) {
        throw new ApiError(
          400,
          "Each medicine must have medicine_name and dosage_time"
        );
      }
    }
  }

  const updateData = {
    ...(prescriptionDate && { prescriptionDate }),
    ...(symptoms !== undefined && { symptoms }),
    ...(medicines && { medicines }),
    ...(next_visit && { next_visit }),
    ...(notes !== undefined && { notes }),
    ...(isActive !== undefined && { isActive }),
    updatedBy: doctorId,
  };

  const updatedPrescription = await Prescription.findByIdAndUpdate(
    prescriptionId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("patientId", "fullName email phone image is_prescribed userName")
    .populate("doctorId", "fullName email image")
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPrescription,
        "Prescription updated successfully"
      )
    );
});

// ==================== ADMIN: Delete Prescription by ID ====================
const adminDeletePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;

  const doctorId = req.user._id;
  const doctor = await User.findById(doctorId);

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if (doctor.role !== "admin") {
    throw new ApiError(403, "Only admin/doctors can delete prescriptions");
  }

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    throw new ApiError(404, "Prescription not found");
  }

  // Check if patient has any other active prescriptions
  const otherPrescriptions = await Prescription.find({
    patientId: prescription.patientId,
    _id: { $ne: prescriptionId },
    isActive: true,
  });

  // If no other active prescriptions, update patient's is_prescribed to false
  if (otherPrescriptions.length === 0) {
    await User.findByIdAndUpdate(prescription.patientId, {
      is_prescribed: false,
    });
  }

  await Prescription.findByIdAndDelete(prescriptionId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Prescription deleted successfully"));
});

// ==================== USER: Get My Prescriptions (View Only) ====================
const userGetMyPrescriptions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "customer") {
    throw new ApiError(403, "Only patients can view their prescriptions");
  }

  const prescriptions = await Prescription.find({ patientId: userId })
    .populate("doctorId", "fullName email image")
    .populate("createdBy", "fullName")
    .sort({ prescriptionDate: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        prescriptions,
        "Your prescriptions fetched successfully"
      )
    );
});

export {
  adminCreatePrescriptionByUsername,
  adminGetPrescriptionsByUsername,
  adminUpdatePrescription,
  adminDeletePrescription,
  userGetMyPrescriptions,
};

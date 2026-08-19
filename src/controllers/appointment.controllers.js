// src/controllers/appointment.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

// Function to generate unique username from fullName
const generateUniqueUsername = async (fullName) => {
  let baseUsername = fullName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  if (!baseUsername) {
    baseUsername = "user";
  }

  let username = baseUsername;
  let counter = 1;

  let existingUser = await User.findOne({ userName: username });

  while (existingUser) {
    username = `${baseUsername}${counter}`;
    existingUser = await User.findOne({ userName: username });
    counter++;
  }

  return username;
};

// Create Appointment
const createAppointment = asyncHandler(async (req, res) => {
  const { patientName, patientPhone, patientEmail, problem, message } =
    req.body;

  if (!patientName || !patientPhone || !problem) {
    throw new ApiError(400, "Name, phone and problem are required");
  }

  let patientId = null;
  let user = null;

  // Check if user exists with this phone
  user = await User.findOne({ phone: patientPhone });

  if (!user) {
    // If user doesn't exist, create new user
    const userName = await generateUniqueUsername(patientName);
    const password = patientPhone; // Use phone as password

    user = await User.create({
      userName,
      fullName: patientName,
      phone: patientPhone,
      email: patientEmail || undefined,
      password: password,
      role: "customer",
    });
  }

  patientId = user._id;

  // Create appointment
  const appointment = await Appointment.create({
    patientId,
    patientName,
    patientPhone,
    patientEmail: patientEmail || user.email,
    problem,
    message,
    createdBy: req.user?._id || patientId,
    updatedBy: req.user?._id || patientId,
  });

  const createdAppointment = await Appointment.findById(appointment._id)
    .populate("patientId", "fullName email phone")
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdAppointment,
        "Appointment booked successfully"
      )
    );
});

// Get all appointments (Admin only)
const getAllAppointments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "appointmentDate",
    sortOrder = "desc",
    status,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { patientName: { $regex: search, $options: "i" } },
      { patientPhone: { $regex: search, $options: "i" } },
      { problem: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const appointments = await Appointment.find(query)
    .populate("patientId", "fullName email phone")
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalCount = await Appointment.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Appointments fetched successfully"
    )
  );
});

// Get user's appointments (Customer only)
const getMyAppointments = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const appointments = await Appointment.find({ patientId: userId })
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName")
    .sort({ appointmentDate: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        appointments,
        "Your appointments fetched successfully"
      )
    );
});

// Get appointment by ID
const getAppointmentById = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const appointment = await Appointment.findById(appointmentId)
    .populate("patientId", "fullName email phone")
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  if (user.role === "admin") {
    // Admin can view any appointment
  } else if (user.role === "customer") {
    // Customer can only view their own appointments
    if (appointment.patientId._id.toString() !== userId.toString()) {
      throw new ApiError(
        403,
        "You don't have permission to view this appointment"
      );
    }
  } else {
    throw new ApiError(
      403,
      "You don't have permission to view this appointment"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointment, "Appointment fetched successfully")
    );
});

// Update appointment (Admin only)
const updateAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const {
    patientName,
    patientPhone,
    patientEmail,
    problem,
    message,
    status,
    appointmentDate,
    isActive,
  } = req.body;

  const adminId = req.user._id;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== "admin") {
    throw new ApiError(403, "Only admins can update appointments");
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  const updateData = {
    ...(patientName && { patientName }),
    ...(patientPhone && { patientPhone }),
    ...(patientEmail !== undefined && { patientEmail }),
    ...(problem && { problem }),
    ...(message !== undefined && { message }),
    ...(status && { status }),
    ...(appointmentDate && { appointmentDate }),
    ...(isActive !== undefined && { isActive }),
    updatedBy: adminId,
  };

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("patientId", "fullName email phone")
    .populate("createdBy", "fullName")
    .populate("updatedBy", "fullName");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAppointment,
        "Appointment updated successfully"
      )
    );
});

// Delete appointment (Admin only)
const deleteAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const adminId = req.user._id;
  const admin = await User.findById(adminId);

  if (!admin || admin.role !== "admin") {
    throw new ApiError(403, "Only admins can delete appointments");
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  await Appointment.findByIdAndDelete(appointmentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment deleted successfully"));
});

export {
  createAppointment,
  getAllAppointments,
  getMyAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};

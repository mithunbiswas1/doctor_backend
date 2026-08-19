// src/controllers/user.controllers.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating accessToken and refreshToken"
    );
  }
};

// Function to generate unique username from fullName
const generateUniqueUsername = async (fullName) => {
  // Convert to lowercase, remove spaces, keep only alphanumeric
  let baseUsername = fullName
    .toLowerCase()
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^a-z0-9]/g, ""); // Remove special characters

  // If empty, use default
  if (!baseUsername) {
    baseUsername = "user";
  }

  let username = baseUsername;
  let counter = 1;

  // Check if username exists
  let existingUser = await User.findOne({ userName: username });

  // If exists, append number until unique
  while (existingUser) {
    username = `${baseUsername}${counter}`;
    existingUser = await User.findOne({ userName: username });
    counter++;
  }

  return username;
};

// User registration
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, bio } = req.body;

  // Validate required fields
  if (!fullName || !phone || !password) {
    throw new ApiError(400, "Full name, phone and password are required");
  }

  // Clean email - optional field
  const cleanedEmail = email && email.trim() !== "" ? email.trim() : undefined;

  // Check if user already exists by phone or email
  const existingUserQuery = {
    $or: [{ phone }],
  };

  if (cleanedEmail) {
    existingUserQuery.$or.push({ email: cleanedEmail });
  }

  const existingUser = await User.findOne(existingUserQuery);

  if (existingUser) {
    const conflicts = [];
    if (existingUser.phone === phone) conflicts.push("phone");
    if (cleanedEmail && existingUser.email === cleanedEmail)
      conflicts.push("email");
    throw new ApiError(409, `${conflicts.join(", ")} already exists`);
  }

  // Generate unique username from fullName
  const userName = await generateUniqueUsername(fullName);

  // Handle profile image upload
  const files = req.files || {};
  const profileImage = files.profilePhoto
    ? `public/upload/${files.profilePhoto[0].filename}`
    : undefined;

  const userData = {
    userName,
    fullName,
    phone,
    password,
    role: role || "customer",
    ...(cleanedEmail && { email }),
    ...(bio && { bio }),
    ...(profileImage && { image: profileImage }),
  };

  const user = await User.create(userData);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// User login
const login = asyncHandler(async (req, res) => {
  const { email, phone, userName, password } = req.body;

  if (!email && !phone && !userName) {
    throw new ApiError(400, "Email, phone or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  let user;

  if (phone) {
    user = await User.findOne({ phone });
  } else if (email) {
    user = await User.findOne({ email });
  } else if (userName) {
    user = await User.findOne({ userName });
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.is_active === false) {
    throw new ApiError(403, "User account is deactivated");
  }

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loginUser, accessToken, refreshToken },
        "Login successfully!"
      )
    );
});

// User logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "Logout successfully!"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if (token !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access Token refreshed!"
      )
    );
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    userName,
    fullName,
    phone,
    email,
    bio,
    address,
    city,
    district,
    state,
    country,
    postal_code,
  } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check unique fields
  if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({ userName, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }
  }

  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingPhone) {
      throw new ApiError(409, "Phone number already registered");
    }
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      throw new ApiError(409, "Email already registered");
    }
  }

  // Handle profile image upload
  const files = req.files || {};
  const profileImage = files.profilePhoto
    ? `public/upload/${files.profilePhoto[0].filename}`
    : undefined;

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(bio && { bio }),
    ...(address && { address }),
    ...(city && { city }),
    ...(district && { district }),
    ...(state && { state }),
    ...(country && { country }),
    ...(postal_code && { postal_code }),
    ...(profileImage && { image: profileImage }),
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Update password
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

// Admin: Get list of users
const getListUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    role,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const users = await User.find(query)
    .select("-password -refreshToken")
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalCount = await User.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1,
        },
      },
      "Users fetched successfully"
    )
  );
});

// Admin: Update user
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    userName,
    fullName,
    phone,
    email,
    role,
    is_active,
    bio,
    address,
    city,
    district,
    state,
    country,
    postal_code,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check unique fields
  if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({ userName, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }
  }

  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({ phone, _id: { $ne: userId } });
    if (existingPhone) {
      throw new ApiError(409, "Phone number already registered");
    }
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
    if (existingEmail) {
      throw new ApiError(409, "Email already registered");
    }
  }

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(role && { role }),
    ...(is_active !== undefined && { is_active }),
    ...(bio && { bio }),
    ...(address && { address }),
    ...(city && { city }),
    ...(district && { district }),
    ...(state && { state }),
    ...(country && { country }),
    ...(postal_code && { postal_code }),
  };

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Admin: Delete user
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (userId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Admins cannot delete themselves");
  }

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getListUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
};

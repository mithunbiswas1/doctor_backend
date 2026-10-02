import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { MarketUpdate } from "../models/marketUpdate.model.js";
import { NewsletterSubscriber } from "../models/newsletterSubscriber.model.js";
import { Otp } from "../models/otp.model.js";
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

// User registration
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, bio, is_prescribed } =
    req.body;

  if (!fullName || !phone || !password) {
    throw new ApiError(400, "Full name, phone and password are required");
  }

  const cleanedEmail = email && email.trim() !== "" ? email.trim() : undefined;

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

  const userName = await generateUniqueUsername(fullName);

  const files = req.files || {};
  const profileImage = files.profilePhoto
    ? `public/upload/${files.profilePhoto[0].filename}`
    : undefined;

  const userData = {
    userName,
    fullName,
    phone,
    password,
    role: "user",
    is_newsletter_subscribed: true,
    ...(cleanedEmail && { email }),
    ...(bio && { bio }),
    ...(profileImage && { image: profileImage }),
    ...(is_prescribed !== undefined && { is_prescribed }),
  };

  const user = await User.create(userData);

  // Automatically subscribe registered user to newsletter if email exists
  if (cleanedEmail) {
    try {
      await NewsletterSubscriber.findOneAndUpdate(
        { email: cleanedEmail.toLowerCase() },
        {
          $set: {
            email: cleanedEmail.toLowerCase(),
            name: fullName,
            phone,
            userId: user._id,
            source: "registration",
            isActive: true,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        },
        { upsert: true, new: true }
      );
    } catch (newsErr) {
      // Auto-subscription failed silently
    }
  }

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
    const cleanEmail = email.trim().toLowerCase();
    const aliasEmail = cleanEmail.replace("instrructor", "instructor");
    user = await User.findOne({
      $or: [{ email: cleanEmail }, { email: aliasEmail }],
    });
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
    designation,
    website,
    linkedin,
    twitter,
    facebook,
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

  const files = req.files || {};
  const profileImage = files.profilePhoto
    ? `public/upload/${files.profilePhoto[0].filename}`
    : undefined;

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(bio !== undefined && { bio }),
    ...(designation !== undefined && { designation }),
    ...(website !== undefined && { website }),
    ...(linkedin !== undefined && { linkedin }),
    ...(twitter !== undefined && { twitter }),
    ...(facebook !== undefined && { facebook }),
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
    is_prescribed,
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

  if (is_prescribed !== undefined) {
    query.is_prescribed = is_prescribed === "true";
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

// Admin: Get prescribed users list
const getPrescribedUsersList = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {
    is_prescribed: true,
    role: { $in: ["user", "general_user"] },
  };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const users = await User.find(query)
    .select("userName fullName email phone is_prescribed image")
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
      "Prescribed users fetched successfully"
    )
  );
});

// Admin: Get user by ID (including permissions and role)
const getUserByIdForAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
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
    is_prescribed,
    bio,
    address,
    city,
    district,
    state,
    country,
    postal_code,
    permissions,
  } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

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

  let parsedPermissions = permissions;
  if (typeof permissions === "string") {
    try {
      parsedPermissions = JSON.parse(permissions);
    } catch (e) {
      parsedPermissions = [];
    }
  }

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(role && { role }),
    ...(is_active !== undefined && { is_active }),
    ...(is_prescribed !== undefined && { is_prescribed }),
    ...(bio !== undefined && { bio }),
    ...(designation !== undefined && { designation }),
    ...(website !== undefined && { website }),
    ...(linkedin !== undefined && { linkedin }),
    ...(twitter !== undefined && { twitter }),
    ...(facebook !== undefined && { facebook }),
    ...(address && { address }),
    ...(city && { city }),
    ...(district && { district }),
    ...(state && { state }),
    ...(country && { country }),
    ...(postal_code && { postal_code }),
    ...(parsedPermissions !== undefined && { permissions: parsedPermissions }),
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

// Get user by username (public)
const getUserByUsername = asyncHandler(async (req, res) => {
  const { userName } = req.params;

  const user = await User.findOne({ userName }).select(
    "userName fullName email phone image is_prescribed role"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// Public: Get author public profile and their articles/blogs
const getAuthorPublicProfile = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  if (!identifier) {
    throw new ApiError(400, "Author identifier is required");
  }

  const raw = decodeURIComponent(identifier).trim();
  const isObjectId = mongoose.Types.ObjectId.isValid(raw) && raw.length === 24;
  const normalizedSlug = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  const spaceSeparated = raw.replace(/[-_+]/g, " ").trim();

  let author = null;

  if (isObjectId) {
    author = await User.findById(raw).select(
      "fullName userName image bio designation website linkedin twitter facebook role createdAt"
    );
  }

  if (!author) {
    author = await User.findOne({
      $or: [
        { userName: raw.toLowerCase() },
        { userName: normalizedSlug },
        { fullName: new RegExp(`^${raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        { fullName: new RegExp(`^${spaceSeparated.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      ],
    }).select("fullName userName image bio designation website linkedin twitter facebook role createdAt");
  }

  // If author record not found in Users, check if there are blogs or marketUpdates published under this author name
  if (!author) {
    const authorRegex = new RegExp(
      `^(${raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${spaceSeparated.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})$`,
      "i"
    );

    const [matchingBlog, matchingMarket] = await Promise.all([
      Blog.findOne({ authorEn: authorRegex, isPublished: true }),
      MarketUpdate.findOne({ authorEn: authorRegex, isPublished: true }),
    ]);

    const fallbackArticle = matchingBlog || matchingMarket;

    if (fallbackArticle) {
      author = {
        fullName: fallbackArticle.authorEn,
        userName: raw.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        image: null,
        bio: "Safe LPG Official Author & Industry Contributor",
        designation: "Author / LPG Specialist",
        role: "author",
        isGuestAuthor: true,
      };
    } else {
      throw new ApiError(404, "Author not found");
    }
  }

  const authorId = author._id;
  const authorNameRegex = new RegExp(
    `^${author.fullName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    "i"
  );

  const blogQuery = {
    isPublished: true,
    ...(authorId
      ? { $or: [{ createdBy: authorId }, { authorEn: authorNameRegex }] }
      : { authorEn: authorNameRegex }),
  };

  const marketUpdateQuery = {
    isPublished: true,
    ...(authorId
      ? { $or: [{ createdBy: authorId }, { authorEn: authorNameRegex }] }
      : { authorEn: authorNameRegex }),
  };

  const [blogs, marketUpdates] = await Promise.all([
    Blog.find(blogQuery)
      .sort({ createdAt: -1 })
      .select("titleEn titleBn slug category categoryBn image shortDescriptionEn shortDescriptionBn descriptionEn descriptionBn authorEn authorBn readTimeEn readTimeBn createdAt views")
      .populate("createdBy", "fullName userName image designation"),
    MarketUpdate.find(marketUpdateQuery)
      .sort({ createdAt: -1 })
      .select("titleEn titleBn slug category categoryBn image summaryEn summaryBn authorEn authorBn publishDate createdAt views")
      .populate("createdBy", "fullName userName image designation"),
  ]);

  const totalViews =
    blogs.reduce((acc, b) => acc + (b.views || 0), 0) +
    marketUpdates.reduce((acc, m) => acc + (m.views || 0), 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        author,
        blogs,
        marketUpdates,
        stats: {
          totalBlogs: blogs.length,
          totalMarketUpdates: marketUpdates.length,
          totalArticles: blogs.length + marketUpdates.length,
          totalViews,
        },
      },
      "Author profile and content fetched successfully"
    )
  );
});

// Send OTP to email for registration verification
const sendRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !email.includes("@")) {
    throw new ApiError(400, "Valid email address is required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "An account is already registered with this email address");
  }

  // Generate 6 digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save to Otp collection (TTL handles 10-minute expiry)
  await Otp.deleteMany({ email: normalizedEmail, type: "registration" });
  await Otp.create({
    email: normalizedEmail,
    otp: code,
    type: "registration",
  });

  // Send HTML Email
  const { sendMail } = await import("../utils/email.service.js");
  const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #1e293b;">
    <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <h2 style="color: #22081f; margin: 0 0 8px 0; font-size: 20px; font-weight: 800;">AEL SafeLPG Bangladesh</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 24px 0;">Official Registration Security Verification</p>
      
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">Hello <strong>${fullName || "Valued User"}</strong>,</p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Thank you for joining the SafeLPG Safety & Awareness Platform. Use the following 6-digit verification code to complete your registration:
      </p>

      <div style="background: #faf8f5; border: 1px dashed #d4a373; padding: 18px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #d4a373; font-family: monospace;">${code}</span>
      </div>

      <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
        This code is valid for 10 minutes. If you did not request this, please disregard this email.
      </p>
    </div>
  </body>
  </html>
  `;

  await sendMail({
    to: normalizedEmail,
    subject: `[SafeLPG] Your Registration Verification Code: ${code}`,
    html,
    text: `Your SafeLPG registration verification code is: ${code}. Valid for 10 minutes.`,
  });

  return res.status(200).json(
    new ApiResponse(200, { email: normalizedEmail }, "Verification code sent to your email")
  );
});

// Verify Registration OTP
const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP code are required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const record = await Otp.findOne({
    email: normalizedEmail,
    otp: otp.trim(),
    type: "registration",
  });

  if (!record) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  record.isVerified = true;
  await record.save();

  return res.status(200).json(
    new ApiResponse(200, { email: normalizedEmail, verified: true }, "Email verified successfully")
  );
});

// Send OTP to email for password reset
const sendForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    throw new ApiError(400, "Valid email address is required");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (!existingUser) {
    throw new ApiError(404, "No account found with this email address");
  }

  // Generate 6 digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Save to Otp collection (TTL handles 10-minute expiry)
  await Otp.deleteMany({ email: normalizedEmail, type: "password_reset" });
  await Otp.create({
    email: normalizedEmail,
    otp: code,
    type: "password_reset",
  });

  // Send HTML Email
  const { sendMail } = await import("../utils/email.service.js");
  const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #1e293b;">
    <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
      <h2 style="color: #22081f; margin: 0 0 8px 0; font-size: 20px; font-weight: 800;">AEL SafeLPG Bangladesh</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 24px 0;">Password Reset Security Code</p>
      
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">Hello <strong>${existingUser.fullName || "User"}</strong>,</p>
      <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        We received a request to reset your password. Use the following 6-digit verification code to reset your password:
      </p>

      <div style="background: #faf8f5; border: 1px dashed #d4a373; padding: 18px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #d4a373; font-family: monospace;">${code}</span>
      </div>

      <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
        This code is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
  </body>
  </html>
  `;

  await sendMail({
    to: normalizedEmail,
    subject: `[SafeLPG] Password Reset Code: ${code}`,
    html,
    text: `Your SafeLPG password reset code is: ${code}. Valid for 10 minutes.`,
  });

  return res.status(200).json(
    new ApiResponse(200, { email: normalizedEmail }, "Password reset code sent to your email")
  );
});

// Reset Password with OTP
const resetPasswordWithOtp = asyncHandler(async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP code, and new password are required");
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const otpRecord = await Otp.findOne({
    email: normalizedEmail,
    otp: otp.trim(),
    type: "password_reset",
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;
  await user.save();

  // Delete the OTP record so it cannot be used again
  await Otp.deleteMany({ email: normalizedEmail, type: "password_reset" });

  return res.status(200).json(
    new ApiResponse(200, {}, "Password has been successfully reset. Please log in with your new password.")
  );
});

export {
  registerUser,
  sendRegistrationOtp,
  verifyRegistrationOtp,
  sendForgotPasswordOtp,
  resetPasswordWithOtp,
  login,
  logout,
  refreshAccessToken,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  getListUsers,
  getPrescribedUsersList,
  getUserByIdForAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getUserByUsername,
  getAuthorPublicProfile,
};

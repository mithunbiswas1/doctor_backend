// ael_backend/src/controllers/subscription.controllers.js

import { Subscription } from "../models/subscription.model.js";
import { SubscriptionPlan } from "../models/subscriptionPlan.model.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Available Subscription Plans from Database
 */
export const getSubscriptionPlans = asyncHandler(async (req, res) => {
  let plans = await SubscriptionPlan.find({ isActive: true }).sort({ order: 1 });

  // Fallback if none exist
  if (!plans || plans.length === 0) {
    plans = await SubscriptionPlan.find().sort({ order: 1 });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, plans, "Subscription plans retrieved successfully"));
});

/**
 * Admin: Get all plans (including inactive)
 */
export const getAdminSubscriptionPlans = asyncHandler(async (req, res) => {
  const plans = await SubscriptionPlan.find().sort({ order: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, plans, "Admin subscription plans retrieved"));
});

/**
 * Admin: Create a new Subscription Plan
 */
export const createSubscriptionPlan = asyncHandler(async (req, res) => {
  const {
    planKey,
    nameEn,
    nameBn,
    taglineEn,
    taglineBn,
    durationDays = 30,
    durationLabelEn,
    durationLabelBn,
    price = 0,
    originalPrice = 0,
    badgeEn,
    badgeBn,
    featuresEn = [],
    featuresBn = [],
    isPopular = false,
    isActive = true,
    order = 0,
  } = req.body;

  if (!planKey || !nameEn || !nameBn) {
    throw new ApiError(400, "Plan key, English name, and Bengali name are required");
  }

  const existing = await SubscriptionPlan.findOne({ planKey: planKey.toLowerCase().trim() });
  if (existing) {
    throw new ApiError(400, "A plan with this key already exists");
  }

  const newPlan = await SubscriptionPlan.create({
    planKey: planKey.toLowerCase().trim(),
    nameEn: nameEn.trim(),
    nameBn: nameBn.trim(),
    taglineEn: taglineEn || "",
    taglineBn: taglineBn || "",
    durationDays: Number(durationDays),
    durationLabelEn: durationLabelEn || `${durationDays} days`,
    durationLabelBn: durationLabelBn || `${durationDays} দিন`,
    price: Number(price),
    originalPrice: Number(originalPrice),
    badgeEn: badgeEn || "",
    badgeBn: badgeBn || "",
    featuresEn: Array.isArray(featuresEn) ? featuresEn : [],
    featuresBn: Array.isArray(featuresBn) ? featuresBn : [],
    isPopular: Boolean(isPopular),
    isActive: Boolean(isActive),
    order: Number(order) || 0,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newPlan, "Subscription plan created successfully"));
});

/**
 * Admin: Update Subscription Plan
 */
export const updateSubscriptionPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (updateData.price !== undefined) updateData.price = Number(updateData.price);
  if (updateData.originalPrice !== undefined) updateData.originalPrice = Number(updateData.originalPrice);
  if (updateData.durationDays !== undefined) updateData.durationDays = Number(updateData.durationDays);

  const plan = await SubscriptionPlan.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  if (!plan) {
    throw new ApiError(404, "Subscription plan not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Subscription plan updated successfully"));
});

/**
 * Admin: Delete Subscription Plan
 */
export const deleteSubscriptionPlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findByIdAndDelete(id);
  if (!plan) {
    throw new ApiError(404, "Subscription plan not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subscription plan deleted successfully"));
});

/**
 * Admin: Get Single Subscription Plan by ID
 */
export const getSubscriptionPlanById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const plan = await SubscriptionPlan.findById(id);
  if (!plan) {
    throw new ApiError(404, "Subscription plan not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, plan, "Subscription plan retrieved successfully"));
});

/**
 * Public/User: Initiate Checkout / Subscribe
 */
export const initiateCheckout = asyncHandler(async (req, res) => {
  const {
    plan: planKey = "monthly",
    paymentMethod = "sslcommerz",
    fullName,
    phone,
    email,
    companyName,
    courseId,
  } = req.body;

  const customerFullName = fullName || req.user?.fullName || "AEL Student";
  const customerPhone = phone || req.user?.phone || "01700000000";

  // Find user to associate with purchase
  let userToUpdate = null;
  if (req.user?._id) {
    userToUpdate = await User.findById(req.user._id);
  }
  if (!userToUpdate && email) {
    userToUpdate = await User.findOne({ email: email.toLowerCase().trim() });
  }
  if (!userToUpdate && customerPhone) {
    userToUpdate = await User.findOne({ phone: customerPhone.trim() });
  }

  let amount = 990;
  let planName = "Monthly Premium";
  let durationDays = 30;
  let course = null;
  let billingCycle = "monthly";

  const now = new Date();
  let startDate = now;
  let expiryDate = new Date();

  if (courseId) {
    course = await Course.findOne({
      $or: [
        { courseId },
        { slug: courseId.toLowerCase() },
        { _id: courseId.match(/^[0-9a-fA-F]{24}$/) ? courseId : null },
      ],
    });
    amount = course?.price || 0;
    planName = course ? `Course: ${course.title}` : "Course Enrollment";
    durationDays = 36500; // 100 years = Lifetime Access
    billingCycle = "lifetime";
    startDate = now;
    expiryDate = new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
  } else {
    const planRecord = await SubscriptionPlan.findOne({ planKey: planKey.toLowerCase().trim() });
    if (planRecord) {
      amount = planRecord.price;
      planName = planRecord.nameEn;
      durationDays = planRecord.durationDays || 30;
    }

    billingCycle =
      durationDays <= 31
        ? "monthly"
        : durationDays <= 185
        ? "half_yearly"
        : durationDays <= 370
        ? "yearly"
        : "lifetime";

    // Cumulative Validity Logic:
    // If user has an active, non-expired subscription, add the new duration to existing expiry!
    // Example: 30 days active + 30 days bought = 60 days total.
    // If expired: start from today ("sedin theke abar X months count hobe").
    const currentExpiry = userToUpdate?.subscription?.expiresAt
      ? new Date(userToUpdate.subscription.expiresAt)
      : null;

    if (currentExpiry && currentExpiry > now) {
      startDate = userToUpdate.subscription.startDate
        ? new Date(userToUpdate.subscription.startDate)
        : now;
      expiryDate = new Date(currentExpiry.getTime() + durationDays * 24 * 60 * 60 * 1000);
    } else {
      startDate = now;
      expiryDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    }
  }

  const vat = 0;
  const grandTotal = amount;
  const transactionId = `TXN-SSL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const subscription = await Subscription.create({
    transactionId,
    plan: courseId ? "course_single" : planKey,
    planName,
    billingCycle,
    amount,
    vat,
    grandTotal,
    paymentMethod,
    paymentGateway: "Mock Instant Gateway (Testing Mode)",
    status: "paid",
    startDate,
    expiryDate,
    customerDetails: {
      fullName: customerFullName,
      phone: customerPhone,
      email: email || req.user?.email || "",
      companyName: companyName || req.user?.companyName || "",
    },
    bankTranId: `BK-${Date.now().toString().slice(-6)}`,
    cardType:
      paymentMethod === "bkash"
        ? "bKash Tokenized"
        : paymentMethod === "nagad"
        ? "Nagad Direct"
        : "VISA / Mastercard",
    userId: userToUpdate?._id || req.user?._id,
    courseId: courseId ? (course?.courseId || courseId) : null,
    instructorId: course?.createdBy || null,
  });

  if (userToUpdate) {
    if (courseId) {
      // Enrolling in a course gives LIFETIME access to this course!
      if (!userToUpdate.enrolledCourses) userToUpdate.enrolledCourses = [];
      const canonicalId = course?.courseId || courseId;
      const exists = userToUpdate.enrolledCourses.find(
        (e) =>
          e.courseId === canonicalId ||
          e.courseId === courseId ||
          (course?.slug && e.courseId === course.slug)
      );
      if (!exists) {
        userToUpdate.enrolledCourses.push({
          courseId: canonicalId,
          enrolledAt: new Date(),
          progressPercent: 0,
          completedLessons: [],
          status: "active",
        });
      }
    } else {
      // Purchasing a subscription plan package from Pricing: role becomes subscriber with all-course access
      userToUpdate.subscription = {
        planKey: planKey.toLowerCase().trim(),
        planName,
        status: "active",
        startDate,
        expiresAt: expiryDate,
        transactionId,
      };
      if (
        userToUpdate.role === "user" ||
        userToUpdate.role === "general_user" ||
        userToUpdate.role === "customer" ||
        !userToUpdate.role
      ) {
        userToUpdate.role = "subscriber";
      }
    }

    await userToUpdate.save();
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        transactionId: subscription.transactionId,
        grandTotal: subscription.grandTotal,
        status: subscription.status,
        planName: subscription.planName,
        expiryDate: subscription.expiryDate,
        invoiceUrl: `/subscriber?invoice=${subscription.transactionId}`,
        user: userToUpdate,
      },
      "Payment processed and access activated successfully!"
    )
  );
});

/**
 * Admin: Manually Assign / Extend Subscription for a User
 */
export const assignUserSubscription = asyncHandler(async (req, res) => {
  const { userId, planKey, durationDays = 30, notes = "" } = req.body;

  if (!userId || !planKey) {
    throw new ApiError(400, "User ID and Plan Key are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const planRecord = await SubscriptionPlan.findOne({ planKey: planKey.toLowerCase() });
  const finalDays = Number(durationDays) || planRecord?.durationDays || 30;
  const planName = planRecord?.nameEn || "Custom Plan";

  const now = new Date();
  let startDate = now;
  let expiresAt;
  const currentExpiry = user.subscription?.expiresAt
    ? new Date(user.subscription.expiresAt)
    : null;

  if (currentExpiry && currentExpiry > now) {
    startDate = user.subscription.startDate ? new Date(user.subscription.startDate) : now;
    expiresAt = new Date(currentExpiry.getTime() + finalDays * 24 * 60 * 60 * 1000);
  } else {
    startDate = now;
    expiresAt = new Date(now.getTime() + finalDays * 24 * 60 * 60 * 1000);
  }

  const transactionId = `ADM-ASSIGN-${Date.now()}`;

  user.subscription = {
    planKey,
    planName,
    status: "active",
    startDate,
    expiresAt,
    transactionId,
  };
  user.role = "subscriber";
  await user.save();

  // Create audit transaction record
  await Subscription.create({
    transactionId,
    plan: planKey,
    planName,
    billingCycle: finalDays === 30 ? "monthly" : finalDays === 180 ? "half_yearly" : "yearly",
    amount: planRecord?.price || 0,
    vat: 0,
    grandTotal: planRecord?.price || 0,
    paymentMethod: "bank_transfer",
    paymentGateway: "Admin Manual Assignment",
    status: "paid",
    startDate,
    expiryDate: expiresAt,
    customerDetails: {
      fullName: user.fullName || user.userName,
      phone: user.phone || "",
      email: user.email || "",
      companyName: notes || "Admin Assigned",
    },
    userId: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user.subscription, "Subscription assigned successfully to user"));
});

/**
 * Admin: Revoke Subscription for a User
 */
export const revokeUserSubscription = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.subscription = {
    planKey: "free",
    planName: "Free / Revoked",
    status: "revoked",
    startDate: user.subscription?.startDate || new Date(),
    expiresAt: new Date(),
    transactionId: user.subscription?.transactionId || null,
  };

  if (user.role === "subscriber") {
    user.role = "user";
  }

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user.subscription, "User subscription revoked successfully"));
});

/**
 * Admin: Get all transactions & subscriptions with revenue stats
 */
export const getAdminSubscriptions = asyncHandler(async (req, res) => {
  const { status, plan, search, page = 1, limit = 20 } = req.query;

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (validPage - 1) * validLimit;

  const filter = {};
  if (status && status !== "all") filter.status = status;
  if (plan && plan !== "all") filter.plan = plan;
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { transactionId: regex },
      { "customerDetails.fullName": regex },
      { "customerDetails.phone": regex },
      { "customerDetails.email": regex },
      { planName: regex },
    ];
  }

  const [subscriptions, total, revenueAgg] = await Promise.all([
    Subscription.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .populate("userId", "fullName userName email phone role subscription"),
    Subscription.countDocuments(filter),
    Subscription.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]),
  ]);

  const activeCount = await Subscription.countDocuments({
    status: "paid",
    expiryDate: { $gt: new Date() },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscriptions,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit) || 1,
        },
        totalRevenue: revenueAgg[0]?.total || 0,
        activeSubscribers: activeCount,
      },
      "Subscriptions and transactions retrieved successfully"
    )
  );
});

/**
 * Admin: Refund transaction
 */
export const refundSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sub = await Subscription.findById(id);
  if (!sub) {
    throw new ApiError(404, "Subscription record not found");
  }

  sub.status = "refunded";
  await sub.save();

  // If user tied to it, expire subscription
  if (sub.userId) {
    const user = await User.findById(sub.userId);
    if (user && user.subscription?.transactionId === sub.transactionId) {
      user.subscription.status = "revoked";
      user.subscription.expiresAt = new Date();
      if (user.role === "subscriber") {
        user.role = "user";
      }
      await user.save();
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, sub, "Transaction marked as refunded"));
});

/**
 * Subscriber/User: Get My Active Subscription Details & Remaining Days
 */
export const getMySubscriptionDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let sub = user.subscription
    ? (user.subscription.toObject ? user.subscription.toObject() : { ...user.subscription })
    : {
        planKey: "free",
        planName: "Free / Newsletter",
        status: "inactive",
        startDate: null,
        expiresAt: null,
        transactionId: null,
      };

  // Check if there is an active paid subscription for this user in DB
  const latestSub = await Subscription.findOne({
    $or: [
      { userId: user._id },
      { "customerDetails.phone": user.phone },
      { "customerDetails.email": user.email },
    ],
    status: "paid",
  }).sort({ createdAt: -1 });

  if (latestSub && (!sub.startDate || sub.planKey === "free" || !sub.transactionId)) {
    sub.planKey = latestSub.plan === "course_single" ? "course_single" : latestSub.plan;
    sub.planName = latestSub.planName;
    sub.status = "active";
    sub.startDate = latestSub.startDate || latestSub.createdAt;
    sub.expiresAt = latestSub.expiryDate;
    sub.transactionId = latestSub.transactionId;

    user.subscription = sub;
    if (
      latestSub.plan !== "course_single" &&
      !["super_admin", "admin", "instructor"].includes(user.role)
    ) {
      user.role = "subscriber";
    }
    await user.save();
  } else if (
    user.role === "subscriber" &&
    (!sub.startDate || sub.planKey === "free" || !sub.expiresAt)
  ) {
    // If user has subscriber role but dates are missing, set standard 30 days active
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    sub.planKey = "monthly";
    sub.planName = "Monthly Premium";
    sub.status = "active";
    sub.startDate = now;
    sub.expiresAt = expiry;
    sub.transactionId = `SUB-ACT-${Date.now().toString().slice(-6)}`;
    user.subscription = sub;
    await user.save();
  }

  const now = new Date();
  const expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;
  const startDate = sub.startDate ? new Date(sub.startDate) : null;

  let remainingDays = null;
  let isExpired = false;
  let isExpiringSoon = false;
  let consumedDays = 0;
  let totalDays = 0;
  let progressPercent = 0;

  if (expiresAt) {
    const diffMs = expiresAt.getTime() - now.getTime();
    remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (remainingDays <= 0) {
      isExpired = true;
      remainingDays = 0;
    } else if (remainingDays <= 7) {
      isExpiringSoon = true;
    }

    if (startDate) {
      totalDays = Math.max(1, Math.ceil((expiresAt.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      consumedDays = Math.min(totalDays, Math.max(0, totalDays - remainingDays));
      progressPercent = Math.min(100, Math.round((consumedDays / totalDays) * 100));
    }
  }

  // Find plan specs
  const planRecord = await SubscriptionPlan.findOne({
    planKey: (sub.planKey || "free").toLowerCase(),
  });

  // Get user's subscription invoices & history
  const userFilters = [{ userId: user._id }];
  if (user.phone) userFilters.push({ "customerDetails.phone": user.phone });
  if (user.email) userFilters.push({ "customerDetails.email": user.email });

  const rawHistory = await Subscription.find({
    $or: userFilters,
  })
    .sort({ createdAt: -1 })
    .limit(100);

  // Also fetch enrolled courses from user.enrolledCourses
  const userEnrollments = user.enrolledCourses || [];
  const enrolledCourseIds = userEnrollments.map((e) => e.courseId);
  const enrolledCoursesData = await Course.find({
    $or: [
      { courseId: { $in: enrolledCourseIds } },
      { slug: { $in: enrolledCourseIds } },
      {
        _id: {
          $in: enrolledCourseIds.filter(
            (id) => typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)
          ),
        },
      },
    ],
  }).select("courseId title titleBn slug price thumbnail duration");

  // Merge enrolled courses into unified history
  const unifiedHistory = rawHistory.map((doc) => {
    const obj = doc.toObject();
    if (obj.plan === "course_single" || obj.billingCycle === "lifetime") {
      obj.type = "course_enrollment";
    } else {
      obj.type = "subscription";
    }
    return obj;
  });

  for (const en of userEnrollments) {
    const courseDoc = enrolledCoursesData.find(
      (c) =>
        c.courseId === en.courseId ||
        c.slug === en.courseId ||
        c._id.toString() === en.courseId
    );
    const courseTitle = courseDoc?.title || `Course ${en.courseId}`;
    const courseTitleBn = courseDoc?.titleBn || courseTitle;
    const existsInHistory = unifiedHistory.some(
      (h) =>
        h.plan === "course_single" &&
        (h.planName?.includes(courseTitle) || h.transactionId?.includes(en.courseId))
    );
    if (!existsInHistory) {
      unifiedHistory.push({
        _id: `enroll-${en.courseId}-${new Date(en.enrolledAt || Date.now()).getTime()}`,
        transactionId: `ENROLL-${en.courseId}`,
        plan: "course_single",
        planName: courseTitle,
        planNameBn: courseTitleBn,
        billingCycle: "lifetime",
        amount: courseDoc?.price || 0,
        grandTotal: courseDoc?.price || 0,
        paymentMethod: courseDoc?.price > 0 ? "sslcommerz" : "free_enroll",
        paymentGateway: courseDoc?.price > 0 ? "SSLCommerz" : "Direct Enrollment",
        status: "paid",
        startDate: en.enrolledAt || new Date(),
        expiryDate: null, // Lifetime Access!
        customerDetails: {
          fullName: user.fullName || user.userName || "Student",
          phone: user.phone || "N/A",
          email: user.email || "",
        },
        type: "course_enrollment",
        courseSlug: courseDoc?.slug || en.courseId,
      });
    }
  }

  // Sort unified history by createdAt / startDate descending
  unifiedHistory.sort((a, b) => {
    const dateA = new Date(a.startDate || a.createdAt || 0);
    const dateB = new Date(b.startDate || b.createdAt || 0);
    return dateB - dateA;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        role: user.role,
        isSubscriber:
          !isExpired && sub.status === "active" && sub.planKey !== "course_single",
        subscription: {
          ...(sub.toObject ? sub.toObject() : sub),
          remainingDays,
          isExpiringSoon,
          isExpired,
          consumedDays,
          totalDays,
          progressPercent,
        },
        planDetails: planRecord || null,
        enrolledCourses: enrolledCoursesData,
        history: unifiedHistory,
      },
      "My subscription details fetched successfully"
    )
  );
});

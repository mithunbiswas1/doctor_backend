// ael_backend/src/controllers/course.controllers.js

import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get list of courses with filtering & pagination
 */
export const getCourses = asyncHandler(async (req, res) => {
  const { category, search, level, priceType, price, pricing } = req.query;

  const filter = { isPublished: true };
  const andConditions = [];

  if (category && category !== "all") {
    filter.category = category;
  }

  if (level && level !== "all") {
    filter.level = level;
  }

  const pType = (priceType || price || pricing || "").toString().trim().toLowerCase();
  if (pType === "free") {
    andConditions.push({
      $or: [
        { price: 0 },
        { price: { $lte: 0 } },
        { price: null },
        { price: { $exists: false } },
      ],
    });
  } else if (pType === "paid" || pType === "premium") {
    andConditions.push({
      price: { $gt: 0 },
    });
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    andConditions.push({
      $or: [
        { title: searchRegex },
        { titleBn: searchRegex },
        { description: searchRegex },
        { descriptionBn: searchRegex },
      ],
    });
  }

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  const courses = await Course.find(filter).sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

/**
 * Public: Get single course details by ID or slug
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course details fetched successfully"));
});

/**
 * Admin / Instructor: Get courses list for management dashboard
 */
export const getAdminCourses = asyncHandler(async (req, res) => {
  const { category, search, priceType } = req.query;
  const user = req.user;

  const filter = {};

  // If user is instructor, strictly limit to their own created courses
  if (user?.role === "instructor") {
    const namePrefix = (user.fullName || "").replace(/\s*\(Instructor\)\s*/i, "").trim();
    filter.$or = [
      { createdBy: user._id },
      { "instructor.name": new RegExp(namePrefix || user.userName, "i") },
      { "instructor.name": user.fullName || user.userName },
    ];
  }

  const andConditions = [];

  if (category && category !== "all") {
    andConditions.push({ category });
  }

  const pType = (priceType || "").toString().trim().toLowerCase();
  if (pType === "free") {
    andConditions.push({
      $or: [
        { price: 0 },
        { price: { $lte: 0 } },
        { price: null },
        { price: { $exists: false } },
      ],
    });
  } else if (pType === "paid" || pType === "premium") {
    andConditions.push({ price: { $gt: 0 } });
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    andConditions.push({
      $or: [
        { title: searchRegex },
        { titleBn: searchRegex },
        { description: searchRegex },
        { descriptionBn: searchRegex },
      ],
    });
  }

  if (andConditions.length > 0) {
    if (filter.$or) {
      filter.$and = andConditions;
    } else {
      andConditions.forEach((cond) => Object.assign(filter, cond));
    }
  }

  const courses = await Course.find(filter)
    .populate("createdBy", "fullName userName email role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Admin courses fetched successfully"));
});

/**
 * Admin / Instructor: Create new course
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, titleBn, description, descriptionBn } = req.body;

  const engTitle = title || titleBn;
  const bnTitle = titleBn || title;

  if (!engTitle) {
    throw new ApiError(400, "Course title is required");
  }

  const generatedSlug = (req.body.slug || engTitle)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

  const courseCount = await Course.countDocuments();
  const nextId = (courseCount + 1).toString();

  const instructorPayload = req.body.instructor || {};
  if (req.user?.role === "instructor") {
    instructorPayload.name =
      instructorPayload.name || req.user.fullName || req.user.userName;
    instructorPayload.role = instructorPayload.role || "Course Instructor";
  }

  const course = await Course.create({
    ...req.body,
    instructor: {
      ...instructorPayload,
    },
    title: engTitle,
    titleBn: bnTitle,
    description: description || descriptionBn || "",
    descriptionBn: descriptionBn || description || "",
    courseId: req.body.courseId || nextId,
    slug: req.body.slug || generatedSlug,
    createdBy: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

/**
 * Admin / Instructor: Update course details or curriculum
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // If user is instructor, verify ownership
  if (user?.role === "instructor") {
    const isOwner =
      course.createdBy && course.createdBy.toString() === user._id.toString();
    const isNamedInstructor =
      course.instructor?.name &&
      (course.instructor.name === user.fullName ||
        course.instructor.name === user.userName);

    if (!isOwner && !isNamedInstructor) {
      throw new ApiError(403, "You can only manage your own courses");
    }
  }

  Object.assign(course, req.body);
  await course.save();

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

/**
 * Admin / Instructor: Delete course
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // If user is instructor, verify ownership
  if (user?.role === "instructor") {
    const isOwner =
      course.createdBy && course.createdBy.toString() === user._id.toString();
    const isNamedInstructor =
      course.instructor?.name &&
      (course.instructor.name === user.fullName ||
        course.instructor.name === user.userName);

    if (!isOwner && !isNamedInstructor) {
      throw new ApiError(403, "You can only delete your own courses");
    }
  }

  await Course.deleteOne({ _id: course._id });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
});

/**
 * Admin / Instructor: Get enrollment and sales history for courses
 * If instructor: strictly shows enrollments of courses owned by this instructor
 */
export const getCourseEnrollmentHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const isInstructor = user?.role === "instructor";

  // Find relevant courses
  let courseFilter = {};
  if (isInstructor) {
    const namePrefix = (user.fullName || "").replace(/\s*\(Instructor\)\s*/i, "").trim();
    courseFilter = {
      $or: [
        { createdBy: user._id },
        { "instructor.name": new RegExp(namePrefix || user.userName, "i") },
        { "instructor.name": user.fullName || user.userName },
      ],
    };
  }

  const courses = await Course.find(courseFilter)
    .select("_id courseId title titleBn price slug createdBy")
    .lean();

  if (isInstructor && courses.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          stats: { totalStudents: 0, totalRevenue: 0, totalPaid: 0, totalFree: 0 },
          enrollments: [],
        },
        "No courses found for instructor"
      )
    );
  }

  const courseIdMap = new Map();
  courses.forEach((c) => {
    courseIdMap.set(c.courseId, c);
    courseIdMap.set(c._id.toString(), c);
    if (c.slug) courseIdMap.set(c.slug, c);
  });

  const targetCourseIds = courses.map((c) => c.courseId);
  const targetCourseObjIds = courses.map((c) => c._id.toString());
  const allTargetCourseKeys = [
    ...new Set([...targetCourseIds, ...targetCourseObjIds]),
  ];

  // 1. Fetch Subscription records for these courses
  const subQuery = {
    $or: [
      { courseId: { $in: allTargetCourseKeys } },
      { planName: { $in: courses.map((c) => `Course: ${c.title}`) } },
    ],
  };

  if (isInstructor) {
    subQuery.$or.push({ instructorId: user._id });
  }

  const subscriptions = await Subscription.find(subQuery)
    .populate("userId", "fullName userName email phone enrolledCourses")
    .sort({ createdAt: -1 })
    .lean();

  // 2. Fetch Users who have enrolled in any of these courses
  const enrolledUsers = await User.find({
    "enrolledCourses.courseId": { $in: allTargetCourseKeys },
  })
    .select("fullName userName email phone enrolledCourses createdAt")
    .lean();

  // Build unified list
  const enrollmentsMap = new Map();

  // Process subscriptions
  subscriptions.forEach((sub) => {
    const matchedCourse =
      courseIdMap.get(sub.courseId) ||
      courses.find((c) => `Course: ${c.title}` === sub.planName);

    if (matchedCourse) {
      const userRef = sub.userId || {};
      const key = `${sub.transactionId || sub._id}`;
      enrollmentsMap.set(key, {
        id: sub._id,
        transactionId: sub.transactionId || `TXN-${sub._id.toString().slice(-6)}`,
        studentName:
          sub.customerDetails?.fullName ||
          userRef.fullName ||
          userRef.userName ||
          "Student",
        studentPhone:
          sub.customerDetails?.phone || userRef.phone || "01XXXXXXXXX",
        studentEmail: sub.customerDetails?.email || userRef.email || "",
        courseId: matchedCourse.courseId,
        courseTitle: matchedCourse.title,
        courseTitleBn: matchedCourse.titleBn,
        courseSlug: matchedCourse.slug,
        amount: Number(sub.grandTotal || sub.amount || matchedCourse.price || 0),
        paymentMethod: sub.paymentMethod || "card",
        paymentGateway: sub.paymentGateway || "Online Payment",
        status: sub.status === "paid" ? "Paid" : "Enrolled",
        enrolledAt: sub.startDate || sub.createdAt || new Date(),
        progressPercent:
          userRef.enrolledCourses?.find(
            (e) =>
              e.courseId === matchedCourse.courseId ||
              e.courseId === matchedCourse._id.toString()
          )?.progressPercent || 0,
      });
    }
  });

  // Process user enrolledCourses that might not have a separate Subscription record
  enrolledUsers.forEach((u) => {
    (u.enrolledCourses || []).forEach((ec) => {
      const matchedCourse = courseIdMap.get(ec.courseId);
      if (matchedCourse) {
        const alreadyInList = Array.from(enrollmentsMap.values()).some(
          (item) =>
            item.studentPhone === u.phone &&
            item.courseId === matchedCourse.courseId
        );

        if (!alreadyInList) {
          const pseudoKey = `ENR-${u._id}-${matchedCourse.courseId}`;
          enrollmentsMap.set(pseudoKey, {
            id: pseudoKey,
            transactionId: `DIRECT-${u._id.toString().slice(-4)}`,
            studentName: u.fullName || u.userName || "Student",
            studentPhone: u.phone || "01XXXXXXXXX",
            studentEmail: u.email || "",
            courseId: matchedCourse.courseId,
            courseTitle: matchedCourse.title,
            courseTitleBn: matchedCourse.titleBn,
            courseSlug: matchedCourse.slug,
            amount: Number(matchedCourse.price || 0),
            paymentMethod: matchedCourse.price > 0 ? "card" : "direct",
            paymentGateway:
              matchedCourse.price > 0 ? "Platform Gateway" : "Direct Enrollment",
            status: ec.status === "completed" ? "Completed" : "Enrolled",
            enrolledAt: ec.enrolledAt || u.createdAt || new Date(),
            progressPercent: ec.progressPercent || 0,
          });
        }
      }
    });
  });

  const enrollmentsList = Array.from(enrollmentsMap.values()).sort(
    (a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)
  );

  const totalStudents = enrollmentsList.length;
  const totalRevenue = enrollmentsList.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );
  const totalPaid = enrollmentsList.filter((e) => e.amount > 0).length;
  const totalFree = totalStudents - totalPaid;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          totalStudents,
          totalRevenue,
          totalPaid,
          totalFree,
        },
        enrollments: enrollmentsList,
      },
      "Course enrollments fetched successfully"
    )
  );
});

/**
 * Subscriber/User: Get all courses user is enrolled in
 */
export const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If user has enrolled courses in their record
  const userEnrollments = user.enrolledCourses || [];
  const enrolledCourseIds = userEnrollments.map((e) => e.courseId).filter(Boolean);

  const isSubscriber =
    user.role === "subscriber" ||
    user.role === "super_admin" ||
    user.role === "admin" ||
    user.role === "instructor" ||
    (user.subscription?.status === "active" &&
      user.subscription?.planKey !== "course_single" &&
      (!user.subscription?.expiresAt ||
        new Date(user.subscription.expiresAt) > new Date()));

  let courses = [];
  if (isSubscriber) {
    // Subscriber with package from pricing gets free access to ALL courses
    courses = await Course.find({ isPublished: true });
  } else if (enrolledCourseIds.length > 0) {
    // General user: ONLY explicitly enrolled courses
    const validObjectIds = enrolledCourseIds.filter(
      (id) => typeof id === "string" && id.match(/^[0-9a-fA-F]{24}$/)
    );
    const validSlugs = enrolledCourseIds.map((id) =>
      typeof id === "string" ? id.toLowerCase() : ""
    );

    courses = await Course.find({
      $or: [
        { courseId: { $in: enrolledCourseIds } },
        { _id: { $in: validObjectIds } },
        { slug: { $in: validSlugs } },
      ],
    });
  } else {
    courses = [];
  }

  const result = courses.map((c) => {
    const enrollment = userEnrollments.find(
      (e) =>
        e.courseId === c.courseId ||
        e.courseId === c._id.toString() ||
        e.courseId === c.slug
    );
    return {
      ...c.toObject(),
      enrollment: enrollment || {
        progressPercent: user.role === "subscriber" ? 35 : 0,
        status: "active",
        enrolledAt: new Date(),
        completedLessons: [],
      },
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Enrolled courses retrieved successfully"));
});

/**
 * Subscriber/User: Enroll in a course
 */
export const enrollInCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    throw new ApiError(400, "courseId is required");
  }

  const course = await Course.findOne({
    $or: [
      { courseId },
      { slug: courseId.toLowerCase() },
      { _id: courseId.match(/^[0-9a-fA-F]{24}$/) ? courseId : null },
    ],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existing = user.enrolledCourses?.find(
    (e) =>
      e.courseId === course.courseId ||
      e.courseId === course._id.toString() ||
      e.courseId === course.slug
  );

  if (!existing) {
    if (!user.enrolledCourses) user.enrolledCourses = [];
    user.enrolledCourses.push({
      courseId: course.courseId,
      progressPercent: 0,
      completedLessons: [],
      status: "active",
      enrolledAt: new Date(),
    });
    await user.save();

    // Also record transaction in Subscription collection for unified purchase history
    const txnId = `ENROLL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const lifetimeExpiry = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
    await Subscription.create({
      transactionId: txnId,
      plan: "course_single",
      planName: `Course: ${course.title}`,
      billingCycle: "lifetime",
      amount: course.price || 0,
      vat: 0,
      grandTotal: course.price || 0,
      paymentMethod: course.price > 0 ? "sslcommerz" : "card",
      paymentGateway: course.price > 0 ? "SSLCommerz" : "Free Direct Enrollment",
      status: "paid",
      startDate: new Date(),
      expiryDate: lifetimeExpiry,
      customerDetails: {
        fullName: user.fullName || user.userName || "Student",
        phone: user.phone || "01700000000",
        email: user.email || "",
      },
      userId: user._id,
      courseId: course.courseId,
      instructorId: course.createdBy || null,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { courseId: course.courseId, enrolled: true },
      "Enrolled successfully"
    )
  );
});

/**
 * Admin: Upload video file directly for course / lesson
 */
export const uploadCourseVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No video file provided");
  }

  // Construct accessible URL path
  const videoUrl = `/public/upload/videos/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        videoUrl,
      },
      "Course video uploaded successfully"
    )
  );
});

/**
 * Admin: Upload image file directly for course thumbnail
 */
export const uploadCourseImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const imageUrl = `/public/upload/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        imageUrl,
      },
      "Course image uploaded successfully"
    )
  );
});

/**
 * Admin: Upload PDF file for course study guide / resource
 */
export const uploadCoursePdf = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No PDF file provided");
  }

  const pdfUrl = `/public/upload/${req.file.filename}`;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        pdfUrl,
      },
      "Course PDF uploaded successfully"
    )
  );
});

/**
 * Subscriber: Update lesson viewing progress (10-second heartbeat & completion)
 */
export const updateCourseProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lessonId, watchedSeconds = 0, isCompleted = false } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const course = await Course.findOne({
    $or: [{ courseId: id }, { slug: id.toLowerCase() }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (!user.enrolledCourses) {
    user.enrolledCourses = [];
  }

  let enrollment = user.enrolledCourses.find(
    (e) => e.courseId === course.courseId || e.courseId === course._id.toString()
  );

  if (!enrollment) {
    enrollment = {
      courseId: course.courseId,
      enrolledAt: new Date(),
      progressPercent: 0,
      completedLessons: [],
      status: "active",
    };
    user.enrolledCourses.push(enrollment);
  }

  const totalLessons =
    course.curriculum?.reduce(
      (acc, mod) => acc + (mod.lessons?.length || 0),
      0
    ) || 1;

  if (lessonId && (isCompleted || watchedSeconds >= 10)) {
    const sLessonId = String(lessonId);
    if (!enrollment.completedLessons.includes(sLessonId)) {
      enrollment.completedLessons.push(sLessonId);
    }
  }

  const completedCount = enrollment.completedLessons.length;
  enrollment.progressPercent = Math.min(
    100,
    Math.round((completedCount / totalLessons) * 100)
  );

  if (enrollment.progressPercent >= 100) {
    enrollment.status = "completed";
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId: course.courseId,
        progressPercent: enrollment.progressPercent,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.progressPercent >= 100,
      },
      "Course progress updated successfully"
    )
  );
});



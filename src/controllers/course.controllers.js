// ael_backend/src/controllers/course.controllers.js

import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get list of courses with filtering & pagination
 */
export const getCourses = asyncHandler(async (req, res) => {
  const { category, search, level, priceType } = req.query;

  const filter = { isPublished: true };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (level && level !== "all") {
    filter.level = level;
  }

  if (priceType === "free") {
    filter.price = 0;
  } else if (priceType === "paid") {
    filter.price = { $gt: 0 };
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { titleBn: searchRegex },
      { description: searchRegex },
      { descriptionBn: searchRegex },
    ];
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
 * Admin: Create new course
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

  const course = await Course.create({
    ...req.body,
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
 * Admin: Update course details or curriculum
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findOne({
    $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  Object.assign(course, req.body);
  await course.save();

  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

/**
 * Admin: Delete course
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findOneAndDelete({
    $or: [{ courseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
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
  const enrolledCourseIds = userEnrollments.map((e) => e.courseId);

  // If user is a subscriber or super_admin and has no explicit enrollments yet, auto-enroll them in courses
  let courses = [];
  if (enrolledCourseIds.length > 0) {
    courses = await Course.find({
      $or: [
        { courseId: { $in: enrolledCourseIds } },
        { _id: { $in: enrolledCourseIds.filter((id) => id.match(/^[0-9a-fA-F]{24}$/)) } },
      ],
    });
  } else if (user.role === "subscriber" || user.role === "super_admin") {
    // Premium subscriber access: all courses accessible
    courses = await Course.find({ isPublished: true });
  }

  const result = courses.map((c) => {
    const enrollment = userEnrollments.find(
      (e) => e.courseId === c.courseId || e.courseId === c._id.toString()
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
    $or: [{ courseId }, { slug: courseId.toLowerCase() }, { _id: courseId.match(/^[0-9a-fA-F]{24}$/) ? courseId : null }],
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existing = user.enrolledCourses?.find(
    (e) => e.courseId === course.courseId || e.courseId === course._id.toString()
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
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { courseId: course.courseId, enrolled: true }, "Enrolled successfully"));
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



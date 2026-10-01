// ael_backend/src/controllers/quiz.controllers.js

import { Quiz } from "../models/quiz.model.js";
import { Certificate } from "../models/certificate.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get quiz for a specific course
 */
export const getQuizByCourseId = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findOne({
    $or: [
      { courseId },
      { slug: courseId.toLowerCase() },
      { _id: courseId.match(/^[0-9a-fA-F]{24}$/) ? courseId : null },
    ],
  });

  const resolvedCourseId = course ? course.courseId : courseId;
  const quiz = await Quiz.findOne({
    $or: [{ courseId: resolvedCourseId }, { courseId }],
  });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found for this course");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz fetched successfully"));
});

/**
 * Submit quiz answers, calculate score, and issue verified certificate if passed
 */
export const submitQuiz = asyncHandler(async (req, res) => {
  const { courseId, selectedAnswers, studentName, studentNameBn } = req.body;

  const course = await Course.findOne({
    $or: [
      { courseId },
      { slug: courseId?.toLowerCase() },
      { _id: courseId?.match(/^[0-9a-fA-F]{24}$/) ? courseId : null },
    ],
  });

  const resolvedCourseId = course ? course.courseId : courseId;
  const quiz = await Quiz.findOne({
    $or: [{ courseId: resolvedCourseId }, { courseId }],
  });
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  let correctCount = 0;
  quiz.questions.forEach((q, idx) => {
    const selectedIdx = selectedAnswers[idx];
    if (selectedIdx !== undefined && q.options[selectedIdx]?.isCorrect) {
      correctCount += 1;
    }
  });

  const totalQuestions = quiz.questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercent >= quiz.passPercentage;

  let issuedCertificate = null;

  if (isPassed) {
    const certId = `CERT-LPG-${courseId}-${Date.now().toString().slice(-4)}`;
    const now = new Date();
    const issueDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const issueDateBn = now.toLocaleDateString("bn-BD");

    issuedCertificate = await Certificate.create({
      certificateId: certId,
      studentName: studentName || req.user?.fullName || "Verified Learner",
      studentNameBn: studentNameBn || req.user?.fullName || "যাচাইকৃত শিক্ষার্থী",
      courseTitle: course?.title || "LPG Safety Certification",
      courseTitleBn: course?.titleBn || "এলপিজি নিরাপত্তা প্রশিক্ষণ",
      issueDate,
      issueDateBn,
      grade: `Pass (${scorePercent}%)`,
      status: "Verified & Valid",
      userId: req.user?._id,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isPassed,
        scorePercent,
        correctCount,
        totalQuestions,
        certificate: issuedCertificate,
      },
      isPassed
        ? "Congratulations! You passed the quiz and your certificate is generated."
        : "Quiz evaluated. Score did not reach pass threshold."
    )
  );
});

/**
 * Admin: Create or update quiz for course
 */
export const saveQuiz = asyncHandler(async (req, res) => {
  const { courseId, title, titleBn, durationMinutes, passPercentage, questions } = req.body;

  if (!courseId || !questions || !Array.isArray(questions)) {
    throw new ApiError(400, "Course ID and questions array are required");
  }

  let quiz = await Quiz.findOne({ courseId });

  if (quiz) {
    quiz.title = title || quiz.title;
    quiz.titleBn = titleBn || quiz.titleBn;
    quiz.durationMinutes = durationMinutes || quiz.durationMinutes;
    quiz.passPercentage = passPercentage || quiz.passPercentage;
    quiz.questions = questions;
    await quiz.save();
  } else {
    quiz = await Quiz.create({
      courseId,
      title: title || "LPG Safety Assessment Quiz",
      titleBn: titleBn || "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
      durationMinutes: durationMinutes || 10,
      passPercentage: passPercentage || 80,
      questions,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz saved successfully"));
});

/**
 * Admin: Get all quizzes
 */
export const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

/**
 * Admin: Delete quiz
 */
export const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findOneAndDelete({
    $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { courseId: id }],
  });
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Quiz deleted successfully"));
});


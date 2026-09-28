// ael_backend/src/models/course.model.js
import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema({
  title: { type: String, required: true },
  titleBn: { type: String, required: true },
  duration: { type: String, default: "10 mins" },
  durationBn: { type: String, default: "১০ মিনিট" },
  videoUrl: { type: String, default: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" },
  notes: { type: String, default: "" },
  notesBn: { type: String, default: "" },
  freePreview: { type: Boolean, default: false },
});

const curriculumModuleSchema = new Schema({
  moduleTitle: { type: String, required: true },
  moduleTitleBn: { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new Schema(
  {
    courseId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    descriptionBn: { type: String, required: true },
    category: { type: String, default: "Consumer Safety" },
    categoryBn: { type: String, default: "ভোক্তা নিরাপত্তা" },
    badge: { type: String, default: "FREE" },
    badgeColor: { type: String, default: "bg-amber-500" },
    audience: { type: String, default: "Consumers & Homemakers" },
    audienceBn: { type: String, default: "ভোক্তা ও গৃহিণী" },
    level: { type: String, default: "Beginner" },
    levelBn: { type: String, default: "প্রাথমিক" },
    duration: { type: String, default: "1h 45m" },
    durationBn: { type: String, default: "১ ঘণ্টা ৪৫ মিনিট" },
    totalLessons: { type: Number, default: 8 },
    totalQuizzes: { type: Number, default: 1 },
    rating: { type: Number, default: 4.9 },
    enrolledCount: { type: String, default: "12,480" },
    price: { type: Number, default: 0 },
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    },
    videoUrl: {
      type: String,
      default: "/sample-course-video.mp4",
    },
    instructor: {
      name: { type: String, default: "Engr. Mahmudul Hasan" },
      nameBn: { type: String, default: "প্রকৌশলী মাহমুদুল হাসান" },
      role: { type: String, default: "Lead Safety Auditor, Ex-DoE" },
      roleBn: { type: String, default: "প্রধান নিরাপত্তা নিরীক্ষক, প্রাক্তন ডিওই" },
      experience: { type: String, default: "15+ Years Industrial Experience" },
      experienceBn: { type: String, default: "১৫+ বছরের শিল্প অভিজ্ঞতা" },
      avatar: {
        type: String,
        default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
      },
    },
    learningPoints: [{ type: String }],
    learningPointsBn: [{ type: String }],
    curriculum: [curriculumModuleSchema],
    isPublished: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);

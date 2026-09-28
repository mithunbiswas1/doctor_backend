// ael_backend/src/models/quiz.model.js
import mongoose, { Schema } from "mongoose";

const quizOptionSchema = new Schema({
  text: { type: String, required: true },
  textBn: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const quizQuestionSchema = new Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  questionBn: { type: String, required: true },
  options: [quizOptionSchema],
  explanation: { type: String, default: "" },
  explanationBn: { type: String, default: "" },
});

const quizSchema = new Schema(
  {
    courseId: { type: String, required: true, unique: true, index: true },
    title: { type: String, default: "LPG Safety Assessment Quiz" },
    titleBn: { type: String, default: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ" },
    durationMinutes: { type: Number, default: 10 },
    passPercentage: { type: Number, default: 80 },
    questions: [quizQuestionSchema],
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);

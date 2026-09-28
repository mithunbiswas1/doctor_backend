// ael_backend/src/scripts/seed_quizzes_courses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "../models/course.model.js";
import { Quiz } from "../models/quiz.model.js";

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ael";

const QUIZZES = [
  {
    courseId: "1",
    title: "LPG Safety for Regular Consumers - Final Assessment",
    titleBn: "সাধারণ গ্রাহকদের জন্য এলপিজি নিরাপত্তা - চূড়ান্ত মূল্যায়ন",
    durationMinutes: 10,
    passPercentage: 80,
    questions: [
      {
        id: 1,
        question: "Is LPG vapor heavier or lighter than atmospheric air?",
        questionBn: "এলপিজি বাষ্প কি বায়ুমণ্ডলের বাতাসের চেয়ে ভারী নাকি হালকা?",
        options: [
          { text: "Lighter than air; it immediately rises to the ceiling", textBn: "বাতাসের চেয়ে হালকা; এটি তৎক্ষণাৎ সিলিংয়ের দিকে উঠে যায়", isCorrect: false },
          { text: "Heavier than air; it settles in low ground depressions and floor corners", textBn: "বাতাসের চেয়ে ভারী; এটি মেঝের খাঁদ ও কোণায় জমা হয়", isCorrect: true },
          { text: "Identical density; it instantly diffuses uniformly without settling", textBn: "একই ঘনত্ব; এটি সমানভাবে চারদিকে ছড়িয়ে পড়ে", isCorrect: false },
          { text: "Depends on whether the cylinder is filled with pure butane", textBn: "সিলিন্ডারে খাঁটি বিউটেন আছে কিনা তার ওপর নির্ভর করে", isCorrect: false },
        ],
        explanation: "LPG vapor is 1.5 to 2.0 times denser than air, meaning it accumulates near floors, drains, and basements in the event of a leak.",
        explanationBn: "এলপিজি বাষ্প বাতাসের চেয়ে ১.৫ থেকে ২.০ গুণ বেশি ভারী, যার কারণে লিকেজ হলে এটি মেঝের কাছে, ড্রেন ও নিচে জমা হয়।",
      },
      {
        id: 2,
        question: "What is the recommended safe method to test for suspected LPG gas leaks around valves or regulators?",
        questionBn: "ভালভ বা রেগুলেটরের চারপাশে সন্দেহজনক গ্যাস লিকেজ পরীক্ষার নিরাপদ ও প্রস্তাবিত পদ্ধতি কোনটি?",
        options: [
          { text: "Lighting a matchstick or candle to observe minor flame flickers", textBn: "ম্যাচের কাঠি বা মোমবাতি জ্বালিয়ে আগুনের শিখা পরীক্ষা করা", isCorrect: false },
          { text: "Applying liquid soap-and-water solution with a sponge and looking for bubbling", textBn: "স্পঞ্জ দিয়ে তরল সাবান-পানির ফেনা লাগিয়ে বুদবুদ সৃষ্টি পর্যবেক্ষণ করা", isCorrect: true },
          { text: "Spraying chemical perfume to neutralize the mercaptan odor", textBn: "গন্ধ দূর করতে রাসায়নিক সুগন্ধি স্প্রে করা", isCorrect: false },
          { text: "Tapping the regulator body with a metal wrench to listen for pitch changes", textBn: "রেগুলেটরে ধাতব রেঞ্জ দিয়ে আঘাত করে শব্দের পরিবর্তন শোনা", isCorrect: false },
        ],
        explanation: "Never use an open flame to detect gas leaks! A soap-and-water solution is safe, non-combustible, and immediately reveals leaks by forming expanding bubbles.",
        explanationBn: "গ্যাস লিকেজ পরীক্ষার জন্য কখনোই খোলা আগুন ব্যবহার করবেন না! সাবান-পানির দ্রবণ নিরাপদ ও অজ্বলনশীল, যা বুদবুদ তৈরি করে অবিলম্বে লিকেজ প্রকাশ করে।",
      },
      {
        id: 3,
        question: "What immediate action should be taken first if you detect a strong gas odor in your home kitchen?",
        questionBn: "ঘরের রান্নাঘরে গ্যাসের তীব্র গন্ধ পেলে সবার প্রথমে তাৎক্ষণিকভাবে কী পদক্ষেপ নেওয়া উচিত?",
        options: [
          { text: "Turn on the electric exhaust fan immediately to vent the room", textBn: "বাতাস বের করার জন্য দ্রুত বৈদ্যুতিক এক্সহস্ট ফ্যান চালু করা", isCorrect: false },
          { text: "Turn off the cylinder regulator switch and open all doors and windows for natural ventilation", textBn: "সিলিন্ডারের রেগুলেটর বন্ধ করা এবং সব দরজা-জানালা খুলে দিয়ে প্রাকৃতিক বায়ু চলাচল নিশ্চিত করা", isCorrect: true },
          { text: "Switch on all kitchen lights to inspect the pipe joints", textBn: "পাইপের সংযোগস্থল দেখার জন্য রান্নাঘরের সব লাইট জ্বালানো", isCorrect: false },
          { text: "Shake the cylinder vigorously to verify the remaining gas level", textBn: "গ্যাসের পরিমাণ দেখতে সিলিন্ডারটি জোরে নাড়াচাড়া করা", isCorrect: false },
        ],
        explanation: "Do NOT touch any electrical switches or exhaust fans because the electrical contact spark can ignite the gas-air mixture. Shut off the regulator and open windows.",
        explanationBn: "কোনো বৈদ্যুতিক সুইচ বা ফ্যানে হাত দেবেন না, কারণ সুইচের অভ্যন্তরীণ স্পার্ক গ্যাস প্রজ্বলিত করতে পারে। রেগুলেটর অফ করে জানালা খুলুন।",
      },
      {
        id: 4,
        question: "How should an LPG cylinder be stored during normal daily operation?",
        questionBn: "দৈনন্দিন সাধারণ ব্যবহারের সময় এলপিজি সিলিন্ডার কীভাবে রাখা উচিত?",
        options: [
          { text: "In a horizontal resting position inside a sealed lower cupboard", textBn: "বন্ধ ক্যাবিনেটের ভেতরে আনুভূমিকভাবে শুইয়ে রাখা", isCorrect: false },
          { text: "Strictly upright on a level floor, in a well-ventilated area away from heat sources", textBn: "তাপের উৎস থেকে দূরে, আলো-বাতাসযুক্ত সমতল মেঝেতে সর্বদা খাড়াভাবে রাখা", isCorrect: true },
          { text: "Suspended off the floor near an electrical water heater", textBn: "বৈদ্যুতিক ওয়াটার হিটারের কাছে মেঝে থেকে ঝুলিয়ে রাখা", isCorrect: false },
          { text: "In an underground pit or floor drainage trench", textBn: "ভূগর্ভস্থ গর্ত বা মেঝের ড্রেনের ভেতরে রাখা", isCorrect: false },
        ],
        explanation: "Cylinders must always be kept strictly vertical and upright so that only vapor—not liquid—reaches the pressure regulator.",
        explanationBn: "সিলিন্ডার সর্বদা সোজা খাড়া রাখা উচিত যাতে তরল নয়, শুধুমাত্র বাষ্পীভূত গ্যাস রেগুলেটরে পৌঁছাতে পারে।",
      },
      {
        id: 5,
        question: "What is the nationwide emergency hotline number in Bangladesh for urgent LPG fire or explosive hazards?",
        questionBn: "বাংলাদেশে এলপিজি অগ্নিকাণ্ড বা জরুরি বিস্ফোরক ঝুঁকির ক্ষেত্রে দেশব্যাপী ২৪/৭ হেল্পলাইন নম্বর কোনটি?",
        options: [
          { text: "16137 (Safe LPG National Emergency Safety Support)", textBn: "১৬১৩৭ (সেইফ এলপিজি জাতীয় জরুরি নিরাপত্তা সেবা)", isCorrect: true },
          { text: "99999 (Private Ambulance Association)", textBn: "৯৯৯৯৯ (বেসরকারি অ্যাম্বুলেন্স অ্যাসোসিয়েশন)", isCorrect: false },
          { text: "100 (Postal Support)", textBn: "১০০ (ডাক সেবা সহায়তা)", isCorrect: false },
          { text: "105 (Railway Inquiry)", textBn: "১০৫ (রেলওয়ে তথ্য অনুসন্ধান)", isCorrect: false },
        ],
        explanation: "The dedicated 24/7 National Emergency LPG Support Hotline is 16137, operational nationwide in partnership with Civil Defense.",
        explanationBn: "সিভিল ডিফেন্সের সাথে অংশীদারিত্বে দেশব্যাপী পরিচালিত এলপিজি জরুরি হেল্পলাইন নম্বর ১৬১৩৭।",
      },
    ],
  },
  {
    courseId: "2",
    title: "LPG Dealer Safety & Regulatory Compliance - Assessment",
    titleBn: "এলপিজি ডিলার নিরাপত্তা ও নিয়ন্ত্রক সম্মতি - মূল্যায়ন পরীক্ষা",
    durationMinutes: 12,
    passPercentage: 80,
    questions: [
      {
        id: 1,
        question: "What is the maximum allowed stacking tier height for full LPG cylinders in a retail depot?",
        questionBn: "খুচরা ডিপোতে ভরা এলপিজি সিলিন্ডার সর্বোচ্চ কয় স্তরে স্তূপীকরণ করার সংবিধিবদ্ধ অনুমতি রয়েছে?",
        options: [
          { text: "Maximum 2 tiers high", textBn: "সর্বোচ্চ ২ স্তর উঁচুতে", isCorrect: true },
          { text: "Up to 5 tiers high", textBn: "সর্বোচ্চ ৫ স্তর উঁচুতে", isCorrect: false },
          { text: "Unlimited if tied with plastic ropes", textBn: "দড়ি দিয়ে বাঁধলে সীমাহীন", isCorrect: false },
          { text: "Only 1 single tier", textBn: "শুধুমাত্র ১ স্তর", isCorrect: false },
        ],
        explanation: "Department of Explosives regulations mandate that filled cylinders must never be stacked more than two tiers high to prevent crushing valve necks.",
        explanationBn: "বিস্ফোরক পরিদপ্তরের আইন অনুসারে ভালভ ক্ষতিসাধন রোধে ভরা সিলিন্ডার ২ স্তরের বেশি স্তূপীকরণ সম্পূর্ণ নিষিদ্ধ।",
      },
      {
        id: 2,
        question: "How far must an authorized retail cylinder stack be kept from open electrical boundary sources?",
        questionBn: "অনুমোদিত সিলিন্ডার মজুত উন্মুক্ত বৈদ্যুতিক সংযোগ ও লাইন থেকে ন্যূনতম কত দূরত্বে থাকতে হবে?",
        options: [
          { text: "At least 3 meters clear distance", textBn: "ন্যূনতম ৩ মিটার নিরাপদ দূরত্ব", isCorrect: true },
          { text: "Directly adjacent to main switchbox", textBn: "সরাসরি মেইন সুইচের সাথে", isCorrect: false },
          { text: "50 centimeters", textBn: "৫০ সেন্টিমিটার", isCorrect: false },
          { text: "No clearance needed if indoors", textBn: "ঘরের ভেতর হলে কোনো দূরত্বের প্রয়োজন নেই", isCorrect: false },
        ],
        explanation: "A minimum buffer zone of 3 meters must be maintained free from electrical wiring or potential spark hazards.",
        explanationBn: "বৈদ্যুতিক তার বা সম্ভাব্য স্পার্ক উৎস থেকে কমপক্ষে ৩ মিটার মুক্ত নিরাপদ দূরত্ব বজায় রাখা বাধ্যতামূলক।",
      },
      {
        id: 3,
        question: "Which fire extinguisher type is mandated by Civil Defense for LPG dealer shops?",
        questionBn: "এলপিজি ডিলার পয়েন্টের জন্য ফায়ার সার্ভিস কর্তৃক কোন ধরণের অগ্নিনির্বাপক যন্ত্র বাধ্যতামূলক?",
        options: [
          { text: "DCP (Dry Chemical Powder) Extinguisher (ABC Type)", textBn: "ডিসিপি (ড্রাই কেমিক্যাল পাউডার) এবিসি টাইপ নির্বাপক", isCorrect: true },
          { text: "Plain pressurized water extinguisher", textBn: "সাধারণ প্রেসারাইজড পানি নির্বাপক", isCorrect: false },
          { text: "Foam blanket only", textBn: "শুধুমাত্র ফোম ব্ল্যাঙ্কেট", isCorrect: false },
          { text: "Wet chemical kitchen spray", textBn: "ওয়েট কেমিক্যাল স্প্রে", isCorrect: false },
        ],
        explanation: "Dry Chemical Powder (DCP) ABC-type extinguishers are required to smother flammable gas (Class C) fires effectively.",
        explanationBn: "দাহ্য গ্যাসীয় (ক্লাস সি) আগুন নিয়ন্ত্রণের জন্য ডিসিপি এবিসি টাইপ নির্বাপক স্থাপন বাধ্যতামূলক।",
      },
      {
        id: 4,
        question: "How should workers handle and move LPG cylinders within the warehouse?",
        questionBn: "গুদামের অভ্যন্তরে কর্মীদের সিলিন্ডার কীভাবে স্থানান্তর ও পরিচালনা করা উচিত?",
        options: [
          { text: "Rolling horizontally on concrete floors", textBn: "মেঝেতে আনুভূমিকভাবে গড়িয়ে নিয়ে যাওয়া", isCorrect: false },
          { text: "Using two-wheeled dedicated rubberized cylinder trolleys", textBn: "দুই চাকার রাবারযুক্ত সিলিন্ডার ট্রলি ব্যবহার করে", isCorrect: true },
          { text: "Throwing between staff members", textBn: "একজনের হাত থেকে অন্যজনে ছুড়ে দেওয়া", isCorrect: false },
          { text: "Dragging by the valve handle", textBn: "ভালভের হাতল ধরে টেনে হিঁচড়ে নেওয়া", isCorrect: false },
        ],
        explanation: "Rolling cylinders on floors damages foot rings and generates static spark hazards. Dedicated trolleys are mandatory.",
        explanationBn: "মেঝেতে সিলিন্ডার গড়ালে ফুট রিং ক্ষতিগ্রস্ত হয় এবং ঘর্ষণে স্পার্কের ঝুঁকি তৈরি হয়। ট্রলি ব্যবহার বাধ্যতামূলক।",
      },
    ],
  },
  {
    courseId: "4",
    title: "High-Pressure Industrial LPG Safety - Certification Exam",
    titleBn: "শিল্পে উচ্চচাপ এলপিজি নিরাপত্তা - সার্টিফিকেশন পরীক্ষা",
    durationMinutes: 15,
    passPercentage: 80,
    questions: [
      {
        id: 1,
        question: "What standard specification must seamless carbon steel piping meet for industrial LPG vapor lines?",
        questionBn: "শিল্পকারখানার এলপিজি বাষ্প পাইপলাইনের জন্য সিমলেস কার্বন স্টিল পাইপ কোন স্পেসিফিকেশন পূরণ করতে হবে?",
        options: [
          { text: "ASTM A106 Grade B (Schedule 80)", textBn: "ASTM A106 গ্রেড বি (শিডিউল ৮০)", isCorrect: true },
          { text: "Thin PVC Sanitary Grade", textBn: "পাতলা পিভিসি স্যানিটারি পাইপ", isCorrect: false },
          { text: "Galvanized sheet iron ducting", textBn: "টিনের শিট ডাক্টিং", isCorrect: false },
          { text: "Flexible garden hose", textBn: "ফ্লেক্সিবল রাবার হোস", isCorrect: false },
        ],
        explanation: "High-pressure industrial LPG lines require ASTM A106 Grade B seamless carbon steel Schedule 80 piping to withstand internal pressure surges.",
        explanationBn: "উচ্চচাপ এলপিজি বাষ্প পরিবহনে অভ্যন্তরীণ প্রেসার সার্জ সহ্য করতে ASTM A106 গ্রেড বি শিডিউল ৮০ পাইপ ব্যবহার সংবিধিবদ্ধ বাধ্যতামূলক।",
      },
      {
        id: 2,
        question: "In hazardous area classification, what defines Zone 1?",
        questionBn: "বিপজ্জনক এলাকা শ্রেণিবিভাগে জোন ১ (Zone 1) বলতে কী বোঝায়?",
        options: [
          { text: "An area where explosive gas atmosphere is likely to occur in normal operation", textBn: "স্বাভাবিক কার্যক্রমে যেখানে বিস্ফোরক গ্যাস পরিবেশ সৃষ্টির সম্ভাবনা থাকে", isCorrect: true },
          { text: "An administrative office where gas never enters", textBn: "প্রশাসনিক অফিস যেখানে গ্যাস কখনই প্রবেশ করে না", isCorrect: false },
          { text: "A residential dining hall", textBn: "আবাসিক খাবার ঘর", isCorrect: false },
          { text: "Continuous explosive atmosphere inside a closed tank", textBn: "ট্যাংকের অভ্যন্তরে সার্বক্ষণিক বিস্ফোরক পরিবেশ (জোন ০)", isCorrect: false },
        ],
        explanation: "Zone 1 is defined as an area where an explosive gas atmosphere is likely to occur in normal operating conditions.",
        explanationBn: "জোন ১ হলো এমন শিল্প এলাকা যেখানে স্বাভাবিক কাজের পরিবেশেই দাহ্য গ্যাসমিশ্রিত আবহাওয়া তৈরি হতে পারে।",
      },
      {
        id: 3,
        question: "What is the function of an Emergency Shutdown Valve (ESDV) on an industrial manifold?",
        questionBn: "শিল্প ম্যানিফোল্ডে ইমার্জেন্সি শাটডাউন ভালভ (ESDV)-এর প্রধান কাজ কী?",
        options: [
          { text: "To automatically isolate gas supply in milliseconds when pressure or leak sensors trigger", textBn: "চাপ বৃদ্ধি বা গ্যাস লিকেজ সেন্সর অ্যাক্টিভেট হলে মিলি-সেকেন্ডে গ্যাস সরবরাহ বিচ্ছিন্ন করা", isCorrect: true },
          { text: "To increase gas flow to higher volume", textBn: "গ্যাসের গতি ও চাপ বহুগুণ বৃদ্ধি করা", isCorrect: false },
          { text: "To heat the LPG vapor", textBn: "এলপিজি বাষ্পকে উত্তপ্ত করা", isCorrect: false },
          { text: "To vent gas continuously into the atmosphere", textBn: "সার্বক্ষণিক বায়ুমণ্ডলে গ্যাস নির্গমন করা", isCorrect: false },
        ],
        explanation: "ESDV units are fail-safe pneumatic or motorized valves designed to automatically isolate bulk gas in the event of an emergency.",
        explanationBn: "ইএসডিভি হলো স্বয়ংক্রিয় ফেইল-সেফ ভালভ যা লিকেজ বা আগুনের সংকেত পেলে সাথে সাথে প্রধান গ্যাস সরবরাহ বন্ধ করে দেয়।",
      },
    ],
  },
];

async function seedQuizzesAndCourses() {
  await mongoose.connect(MONGODB_URL);
  console.log("Connected to MongoDB for Course & Quiz synchronization.");

  // Update Courses to ensure videoUrl is set to direct sample video
  const courses = await Course.find({});
  for (const course of courses) {
    course.videoUrl = "/sample-course-video.mp4";
    // Also update lessons
    if (course.curriculum && course.curriculum.length > 0) {
      course.curriculum.forEach(mod => {
        if (mod.lessons && mod.lessons.length > 0) {
          mod.lessons.forEach(l => {
            l.videoUrl = "/sample-course-video.mp4";
          });
        }
      });
    }
    await course.save();
    console.log(`Updated course ${course.courseId} (${course.title}) with direct videoUrl.`);
  }

  // Seed Quizzes for courses
  for (const qDef of QUIZZES) {
    const existing = await Quiz.findOne({ courseId: qDef.courseId });
    if (existing) {
      existing.title = qDef.title;
      existing.titleBn = qDef.titleBn;
      existing.durationMinutes = qDef.durationMinutes;
      existing.passPercentage = qDef.passPercentage;
      existing.questions = qDef.questions;
      await existing.save();
      console.log(`Updated Quiz for Course ID: ${qDef.courseId}`);
    } else {
      await Quiz.create(qDef);
      console.log(`Created Quiz for Course ID: ${qDef.courseId}`);
    }
  }

  console.log("All courses and quizzes synchronized successfully!");
  await mongoose.disconnect();
}

seedQuizzesAndCourses().catch(console.error);

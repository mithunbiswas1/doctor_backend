// ael_backend/src/db/seedAllData.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Blog } from "../models/blog.model.js";
import { Course } from "../models/course.model.js";
import { Quiz } from "../models/quiz.model.js";
import { Certificate } from "../models/certificate.model.js";
import { DEFAULT_ROLES } from "./seedRoles.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ael";

// Sample initial blogs
const INITIAL_BLOGS = [
  {
    titleEn: "10 Essential LPG Safety Tips for Every Home",
    titleBn: "প্রতিটি পরিবারের জন্য ১০টি অপরিহার্য এলপিজি নিরাপত্তা টিপস",
    slug: "10-essential-lpg-safety-tips-for-every-home",
    category: "seminar",
    categoryBn: "সেমিনার",
    authorEn: "Safe LPG Safety Team",
    authorBn: "সেইফ এলপিজি সেফটি টিম",
    readTimeEn: "5 min read",
    readTimeBn: "৫ মিনিট পাঠ",
    descriptionEn: "Simple yet crucial safety habits to ensure safe usage, leak detection, and maintenance of LPG cylinders at home.",
    descriptionBn: "বাসাবাড়িতে এলপিজি সিলিন্ডারের নিরাপদ ব্যবহার, গ্যাস লিক পরীক্ষা এবং দুর্ঘটনার ঝুঁকি এড়ানোর অপরিহার্য নিয়মাবলী।",
    contentEn: "Always inspect regulator o-rings and hose connections by dabbing a mild soap-water mixture around all joints. Formation of expanding bubbles signals an active gas escape. Never use open flames or matches to detect leaks. Should a leak occur, immediately disengage the regulator valve and ensure cross-ventilation.",
    contentBn: "প্রতিবার সিলিন্ডার পরিবর্তনের পর রেগুলেটরের ও-রিং এবং পাইপের সংযোগস্থলে হালকা সাবান-পানি লাগিয়ে পরীক্ষা করুন। বুদবুদ সৃষ্টি হলে নিশ্চিতভাবে গ্যাস লিক হচ্ছে। কখনোই ম্যাচের কাঠি বা খোলা আগুন দিয়ে লিক পরীক্ষা করবেন না। লিক শনাক্ত হলে অবিলম্বে রেগুলেটর বন্ধ করে দরজা-জানালা খুলে দিন।",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
    tags: ["Safety", "Household", "LPG", "Guidelines"],
    isPublished: true,
  },
  {
    titleEn: "DoE Regulatory Updates: Cylinder Certification & Testing Standards",
    titleBn: "বিস্ফোরক পরিদপ্তরের নীতিমালা: সিলিন্ডার পরীক্ষণ ও রি-টেস্টিং মানদণ্ড",
    slug: "doe-regulatory-updates-cylinder-certification-testing-standards",
    category: "programs_of_association",
    categoryBn: "অ্যাসোসিয়েশনের কার্যক্রম",
    authorEn: "Engr. Mahmudul Hasan",
    authorBn: "প্রকৌশলী মাহমুদুল হাসান",
    readTimeEn: "7 min read",
    readTimeBn: "৭ মিনিট পাঠ",
    descriptionEn: "New directives issued by the Department of Explosives regarding hydro-testing intervals and counterfeit valve crackdowns.",
    descriptionBn: "বিস্ফোরক পরিদপ্তর কর্তৃক ঘোষিত নতুন সিলিন্ডার হাইড্রো-টেস্টিং নিয়মাবলী এবং নকল ভালভ ব্যবহার বন্ধে কঠোর আইন প্রয়োগ।",
    contentEn: "The Department of Explosives (DoE) has mandated 5-year periodic hydro-testing intervals for all welded steel domestic cylinders. Operators must maintain strict digital serial dockets.",
    contentBn: "বিস্ফোরক পরিদপ্তর কর্তৃক সকল ওয়েল্ডেড স্টিল সিলিন্ডারের জন্য ৫ বছর অন্তর বাধ্যতামূলক হাইড্রো-টেস্টিং নিশ্চিত করার নির্দেশ প্রদান করা হয়েছে।",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop",
    tags: ["Regulation", "DoE", "Compliance", "Certification"],
    isPublished: true,
  },
  {
    titleEn: "Commercial LPG Safety Protocols for Restaurants & High-Heat Kitchens",
    titleBn: "রেস্তোরাঁ ও বাণিজ্যিক রান্নাঘরের জন্য নিরাপদ এলপিজি ম্যানিফোল্ড ব্যবহারের নিয়ম",
    slug: "commercial-lpg-safety-protocols-for-restaurants-kitchens",
    category: "seminar",
    categoryBn: "সেমিনার",
    authorEn: "Fire Service & Civil Defense Advisory",
    authorBn: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স পরামর্শক",
    readTimeEn: "6 min read",
    readTimeBn: "৬ মিনিট পাঠ",
    descriptionEn: "A guide for commercial kitchen operators on multi-cylinder manifold systems, automatic shutoff valves, and fire clearance.",
    descriptionBn: "বাণিজ্যিক রান্নাঘরের জন্য গ্যাস ব্যাংকিং বা ম্যানিফোল্ড সিস্টেম, অটোমেটিক শাটঅফ ভালভ এবং আগুন প্রতিরোধ ব্যবস্থার নির্দেশিকা।",
    contentEn: "Commercial food businesses must install external cylinder banks outside dining and kitchen rooms. Automatic gas leak detectors interlinked with solenoid shut-off valves are mandatory.",
    contentBn: "বাণিজ্যিক হোটেল ও রেস্তোরাঁয় রান্নাঘরের অভ্যন্তরে গ্যাস সিলিন্ডার না রেখে ভবনের বাইরে উন্মুক্ত ম্যানিফোল্ড ব্যাংকে স্থাপন করা বাধ্যতামূলক।",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop",
    tags: ["Commercial", "Restaurant", "Manifold", "Fire Safety"],
    isPublished: true,
  },
];

// Initial Courses
const INITIAL_COURSES = [
  {
    courseId: "1",
    title: "LPG Safety for Regular Consumers",
    titleBn: "সাধারণ গ্রাহকদের জন্য এলপিজি নিরাপত্তা",
    slug: "lpg-safety-for-regular-consumers",
    description: "Essential safety guidelines for safe handling, soap-bubble leak testing, kitchen ventilation, and emergency incident response for household LPG users.",
    descriptionBn: "গৃহস্থালি এলপিজি ব্যবহারকারীদের জন্য নিরাপদ হ্যান্ডলিং, সাবান-পানির বুদবুদ লিক টেস্ট, রান্নাঘরের বায়ু চলাচল এবং জরুরি দুর্ঘটনা মোকাবিলার নির্দেশিকা।",
    category: "Consumer Safety",
    categoryBn: "ভোক্তা নিরাপত্তা",
    badge: "FREE",
    badgeColor: "bg-amber-500",
    audience: "Consumers & Homemakers",
    audienceBn: "ভোক্তা ও গৃহিণী",
    level: "Beginner",
    levelBn: "প্রাথমিক",
    duration: "1h 45m",
    durationBn: "১ ঘণ্টা ৪৫ মিনিট",
    totalLessons: 8,
    totalQuizzes: 1,
    rating: 4.9,
    enrolledCount: "12,480",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Engr. Mahmudul Hasan",
      nameBn: "প্রকৌশলী মাহমুদুল হাসান",
      role: "Lead Safety Auditor, Ex-DoE",
      roleBn: "প্রধান নিরাপত্তা নিরীক্ষক, প্রাক্তন ডিওই",
      experience: "15+ Years Industrial Experience",
      experienceBn: "১৫+ বছরের শিল্প অভিজ্ঞতা",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Proper positioning and upright orientation of LPG cylinders in domestic kitchens.",
      "Recognizing defective regulator O-rings and verifying pin connections.",
      "Conducting standard non-flammable soap-solution leak checks safely.",
      "Immediate action sequence when LPG gas odor (ethyl mercaptan) is detected.",
      "Preventing electrical spark ignition (switches, refrigerators, matches).",
      "Selecting certified hoses conforming to BDS/ISO national safety standards.",
    ],
    learningPointsBn: [
      "গৃহস্থালি রান্নাঘরে এলপিজি সিলিন্ডার সর্বদা খাঁড়া ও সঠিক স্থানে স্থাপন করা।",
      "ত্রুটিপূর্ণ রেগুলেটর ও-রিং শনাক্তকরণ এবং পিন সংযোগ যাচাই করা।",
      "সাবান-পানির নিরাপদ দ্রবণ ব্যবহারের মাধ্যমে লিকেজ পরীক্ষা পদ্ধতি।",
      "গ্যাসের তীব্র গন্ধ (ইথাইল মারক্যাপটান) পেলে তাৎক্ষণিক করণীয় পদক্ষেপ।",
      "বৈদ্যুতিক স্পার্ক (সুইচ, রেফ্রিজারেটর, ম্যাচ) থেকে অগ্নিকাণ্ড রোধ করা।",
      "জাতীয় বিডিএস/আইএসও মানসম্মত সার্টিফাইড পাইপ ও হোস নির্বাচন করা।",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Introduction to Liquefied Petroleum Gas (LPG)",
        moduleTitleBn: "মডিউল ১: তরলীকৃত পেট্রোলিয়াম গ্যাস (এলপিজি) পরিচিতি",
        lessons: [
          {
            title: "Physical Properties & Hazards of LPG",
            titleBn: "এলপিজির ভৌত বৈশিষ্ট্য ও সম্ভাব্য ঝুঁকিসমূহ",
            duration: "10 mins",
            durationBn: "১০ মিনিট",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            notes: "LPG is denser than air and settles in low ground areas.",
            notesBn: "এলপিজি বাতাসের চেয়ে ভারী এবং মেঝের নিচু স্থানে জমা হয়।",
            freePreview: true,
          },
          {
            title: "Understanding Cylinder Construction & Valves",
            titleBn: "সিলিন্ডার গঠন ও ভালভ কৌশল পরিচিতি",
            duration: "12 mins",
            durationBn: "১২ মিনিট",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            notes: "All cylinders must have embossed tare weight and hydro-test markings.",
            notesBn: "সকল সিলিন্ডারে সুস্পষ্ট টেয়ার ওজন ও হাইড্রো-টেস্ট সিল থাকা বাধ্যতামূলক।",
            freePreview: true,
          },
        ],
      },
    ],
    isPublished: true,
  },
  {
    courseId: "2",
    title: "LPG Dealer Safety & Regulatory Compliance",
    titleBn: "এলপিজি ডিলার নিরাপত্তা ও নিয়ন্ত্রক সম্মতি",
    slug: "lpg-dealer-safety-regulatory-compliance",
    description: "Operational guidelines for authorized LPG retailers, storage stacking clearances, explosive licensing rules, and fire inspection protocols.",
    descriptionBn: "অনুমোদিত এলপিজি ডিলার ও খুচরা বিক্রেতাদের জন্য গুদামজাতকরণ, বিস্ফোরণ লাইসেন্সিং নীতি এবং ফায়ার সার্ভিসের পরিদর্শন সম্মতি নির্দেশিকা।",
    category: "Dealer & Commercial",
    categoryBn: "ডিলার ও বাণিজ্যিক",
    badge: "PRO",
    badgeColor: "bg-blue-600",
    audience: "Retailers, Distributors & Depot Staff",
    audienceBn: "খুচরা বিক্রেতা, পরিবেশক ও ডিপো কর্মী",
    level: "Intermediate",
    levelBn: "মধ্যবর্তী",
    duration: "2h 30m",
    durationBn: "২ ঘণ্টা ৩০ মিনিট",
    totalLessons: 12,
    totalQuizzes: 1,
    rating: 4.8,
    enrolledCount: "4,210",
    price: 499,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Sharmin Sultana",
      nameBn: "শারমিন সুলতানা",
      role: "LOAB Compliance Director",
      roleBn: "লোয়াব কমপ্লায়েন্স পরিচালক",
      experience: "12+ Years Regulatory Audit",
      experienceBn: "১২+ বছরের নিয়ন্ত্রক নিরীক্ষা অভিজ্ঞতা",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Statutory stacking clearance and maximum cylinder storage limits.",
      "Ventilation standards for dealer retail points.",
      "Department of Explosives (DoE) licensing prerequisites.",
    ],
    learningPointsBn: [
      "সংবিধিবদ্ধ সিলিন্ডার স্তূপীকরণ এবং সর্বোচ্চ সংরক্ষণ সীমা।",
      "ডিলার শপের জন্য বাধ্যতামূলক ভেন্টিলেশন ও নিরাপত্তা মানদণ্ড।",
      "বিস্ফোরক পরিদপ্তরের লাইসেন্স নবায়নের শর্তাবলী।",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Warehouse Storage Layout",
        moduleTitleBn: "মডিউল ১: গুদামজাতকরণ লেআউট ও নিরাপত্তা",
        lessons: [
          {
            title: "Stacking Heights & Separation Distances",
            titleBn: "সিলিন্ডার সংরক্ষণের উচ্চতা ও নিরাপদ দূরত্ব",
            duration: "15 mins",
            durationBn: "১৫ মিনিট",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            notes: "Never stack full cylinders more than 2 high.",
            notesBn: "ভরা সিলিন্ডার কখনোই ২ স্তরের বেশি উঁচুতে রাখবেন না।",
            freePreview: false,
          },
        ],
      },
    ],
    isPublished: true,
  },
  {
    courseId: "4",
    title: "LPG Safety for High-Pressure Industrial Use",
    titleBn: "শিল্পে উচ্চচাপ এলপিজি ব্যবহারের সার্বিক নিরাপত্তা",
    slug: "lpg-safety-for-high-pressure-industrial-use",
    description: "In-depth engineering protocols for industrial manifold systems, bulk storage bullets, vaporizers, and hazardous zone classification.",
    descriptionBn: "শিল্প-কারখানায় ব্যবহৃত উচ্চচাপ গ্যাস পাইপলাইন, ভেপোরাইজার, ভারী স্টোরেজ বুলেট এবং বিপজ্জনক এলাকা পরিচালনার প্রকৌশল পদ্ধতি।",
    category: "Industrial & Engineering",
    categoryBn: "শিল্প ও প্রকৌশল",
    badge: "ADVANCED",
    badgeColor: "bg-purple-600",
    audience: "Factory Engineers, Plant Managers & Technicians",
    audienceBn: "কারখানা প্রকৌশলী, প্ল্যান্ট ম্যানেজার ও টেকনিশিয়ান",
    level: "Advanced",
    levelBn: "উচ্চতর",
    duration: "4h 00m",
    durationBn: "৪ ঘণ্টা ০০ মিনিট",
    totalLessons: 18,
    totalQuizzes: 1,
    rating: 4.95,
    enrolledCount: "1,850",
    price: 999,
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
    instructor: {
      name: "Dr. Kazi Ariful Islam",
      nameBn: "ড. কাজী আরিফুল ইসলাম",
      role: "Industrial Hazard Consultant & Ex-BUET Faculty",
      roleBn: "শিল্প ঝুঁকি বিশেষজ্ঞ ও প্রাক্তন বুয়েট শিক্ষক",
      experience: "20+ Years Petrochemical Safety",
      experienceBn: "২০+ বছরের পেট্রোকেমিক্যাল নিরাপত্তা অভিজ্ঞতা",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    learningPoints: [
      "Hazardous zone classification (Zone 0, 1, and 2).",
      "Vaporizer operation, maintenance, and pressure relief valves.",
      "Emergency automatic manifold shutdown systems.",
    ],
    learningPointsBn: [
      "ঝুঁকিপূর্ণ এলাকা শ্রেণিবিভাগ (জোন ০, ১ এবং ২)।",
      "ভেপোরাইজার পরিচালনা, রক্ষণাবেক্ষণ ও প্রেশার রিলিফ ভালভ পরীক্ষা।",
      "জরুরি স্বয়ংক্রিয় ম্যানিফোল্ড শাটডাউন সিস্টেম।",
    ],
    curriculum: [
      {
        moduleTitle: "Module 1: Industrial Manifolds",
        moduleTitleBn: "মডিউল ১: শিল্প ম্যানিফোল্ড সিস্টেম",
        lessons: [
          {
            title: "Bulk Storage Pressure Dynamics",
            titleBn: "বাল্ক স্টোরেজ চাপ গতিবিদ্যা",
            duration: "20 mins",
            durationBn: "২০ মিনিট",
            videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            notes: "Hydrocarbon vapor density monitoring is mandatory.",
            notesBn: "হাইড্রোকার্বন গ্যাস সেন্সর সার্বক্ষণিক সক্রিয় রাখা বাধ্যতামূলক।",
            freePreview: false,
          },
        ],
      },
    ],
    isPublished: true,
  },
];

// Initial Quiz
const INITIAL_QUIZ = {
  courseId: "1",
  title: "LPG Safety Assessment Quiz",
  titleBn: "এলপিজি নিরাপত্তা মূল্যায়ন কুইজ",
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
};

// Initial Certificates
const INITIAL_CERTIFICATES = [
  {
    certificateId: "CERT-LPG-1-2024",
    studentName: "Mohammad Tanvir Ahmed",
    studentNameBn: "মোহাম্মদ তানভীর আহমেদ",
    courseTitle: "LPG Safety for Regular Consumers",
    courseTitleBn: "সাধারণ ভোক্তাদের জন্য এলপিজি নিরাপত্তা",
    issueDate: "May 20, 2024",
    issueDateBn: "২০ মে, ২০২৪",
    validTill: "Lifetime Validity",
    validTillBn: "আজীবন মেয়াদ",
    grade: "Pass (92%)",
    status: "Verified & Valid",
    authorizedBy: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    issuingAuthority: "Safe LPG in collaboration with Department of Explosives (DoE) & LOAB",
  },
  {
    certificateId: "CERT-LPG-2-2024",
    studentName: "Abdur Rahim Khan",
    studentNameBn: "আব্দুর রহিম খান",
    courseTitle: "LPG Dealer Safety & Regulatory Compliance",
    courseTitleBn: "এলপিজি ডিলার নিরাপত্তা ও নিয়ন্ত্রক সম্মতি",
    issueDate: "May 15, 2024",
    issueDateBn: "১৫ মে, ২০২৪",
    validTill: "May 15, 2027 (3 Years Renewal)",
    validTillBn: "১৫ মে, ২০২৭ (৩ বছর মেয়াদ)",
    grade: "Distinction (96%)",
    status: "Verified & Valid",
    authorizedBy: "Sharmin Sultana (LOAB Compliance)",
    issuingAuthority: "Safe LPG Regulatory Training Division",
  },
  {
    certificateId: "CERT-LPG-4-2024",
    studentName: "Engr. Farhana Yasmin",
    studentNameBn: "প্রকৌশলী ফারহানা ইয়াসমিন",
    courseTitle: "LPG Safety for High-Pressure Industrial Use",
    courseTitleBn: "শিল্পে উচ্চচাপ এলপিজি ব্যবহারের সার্বিক নিরাপত্তা",
    issueDate: "May 08, 2024",
    issueDateBn: "০৮ মে, ২০২৪",
    validTill: "May 08, 2026 (2 Years Industrial Validity)",
    validTillBn: "০৮ মে, ২০২৬ (২ বছর শিল্প মেয়াদ)",
    grade: "Certified Safety Engineer (88%)",
    status: "Verified & Valid",
    authorizedBy: "Dr. Kazi Ariful Islam (BUET / Safety Consultant)",
    issuingAuthority: "Safe LPG Industrial Safety Council",
  },
];

async function seedDatabase() {
  console.log("Connecting to MongoDB at:", MONGODB_URL);
  await mongoose.connect(MONGODB_URL);
  console.log("Connected successfully to MongoDB.");

  // 1. Seed Roles
  console.log("\n--- Seeding Roles ---");
  for (const roleDef of DEFAULT_ROLES) {
    const existing = await Role.findOne({ name: roleDef.name });
    if (!existing) {
      await Role.create(roleDef);
      console.log(`+ Created role: ${roleDef.name}`);
    } else {
      console.log(`= Role exists: ${roleDef.name}`);
    }
  }

  // 2. Seed Test Users
  console.log("\n--- Seeding Users ---");
  const USERS = [
    {
      userName: "superadmin",
      fullName: "AEL Super Admin",
      email: "superadmin@ael.com",
      phone: "01700000001",
      role: "super_admin",
      password: "password123",
    },
    {
      userName: "instructor",
      fullName: "AEL Course Instructor",
      email: "instructor@ael.com",
      phone: "01700000002",
      role: "instructor",
      password: "password123",
    },
    {
      userName: "subscriber",
      fullName: "AEL Enrolled Learner",
      email: "subscriber@ael.com",
      phone: "01700000003",
      role: "subscriber",
      password: "password123",
    },
    {
      userName: "user",
      fullName: "AEL Registered User",
      email: "user@ael.com",
      phone: "01700000004",
      role: "user",
      password: "password123",
    },
  ];

  for (const userDef of USERS) {
    const existing = await User.findOne({
      $or: [{ email: userDef.email }, { phone: userDef.phone }, { userName: userDef.userName }],
    });
    if (!existing) {
      await User.create(userDef);
      console.log(`+ Created user: ${userDef.email} (${userDef.role})`);
    } else {
      console.log(`= User exists: ${userDef.email}`);
    }
  }

  // 3. Seed Blogs
  console.log("\n--- Seeding Blogs ---");
  for (const blogDef of INITIAL_BLOGS) {
    const existing = await Blog.findOne({ slug: blogDef.slug });
    if (!existing) {
      await Blog.create(blogDef);
      console.log(`+ Created blog: ${blogDef.slug}`);
    } else {
      console.log(`= Blog exists: ${blogDef.slug}`);
    }
  }

  // 4. Seed Courses
  console.log("\n--- Seeding Courses ---");
  for (const courseDef of INITIAL_COURSES) {
    const existing = await Course.findOne({ courseId: courseDef.courseId });
    if (!existing) {
      await Course.create(courseDef);
      console.log(`+ Created course: ${courseDef.title}`);
    } else {
      console.log(`= Course exists: ${courseDef.title}`);
    }
  }

  // 5. Seed Quizzes
  console.log("\n--- Seeding Quizzes ---");
  const existingQuiz = await Quiz.findOne({ courseId: INITIAL_QUIZ.courseId });
  if (!existingQuiz) {
    await Quiz.create(INITIAL_QUIZ);
    console.log(`+ Created quiz for course #${INITIAL_QUIZ.courseId}`);
  } else {
    console.log(`= Quiz exists for course #${INITIAL_QUIZ.courseId}`);
  }

  // 6. Seed Certificates
  console.log("\n--- Seeding Certificates ---");
  for (const certDef of INITIAL_CERTIFICATES) {
    const existing = await Certificate.findOne({ certificateId: certDef.certificateId });
    if (!existing) {
      await Certificate.create(certDef);
      console.log(`+ Created certificate: ${certDef.certificateId}`);
    } else {
      console.log(`= Certificate exists: ${certDef.certificateId}`);
    }
  }

  console.log("\nAll collections seeded successfully into MongoDB database 'ael'!");
  await mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});

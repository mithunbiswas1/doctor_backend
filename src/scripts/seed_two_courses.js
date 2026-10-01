// ael_backend/src/scripts/seed_two_courses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "../models/course.model.js";

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ael";

const freeCourse = {
  courseId: "6",
  title: "LPG Home Kitchen Safety & Emergency Leak Protocols",
  titleBn: "রান্নাঘরে এলপিজি সিলিন্ডারের নিরাপদ ব্যবহার ও জরুরি লিকেজ সচেতনতা",
  slug: "lpg-home-kitchen-safety-emergency-protocols",
  description:
    "A free, essential safety training course designed for homeowners, homemakers, and kitchen staff covering basic LPG characteristics, safe stove operation, non-flame leak testing, and emergency actions.",
  descriptionBn:
    "গৃহিণী, সাধারণ ভোক্তা ও রান্নাঘর কর্মীদের জন্য ১০০% ফ্রি ও অত্যাবশ্যকীয় কোর্স। এতে এলপিজি গ্যাসের মৌলিক বৈশিষ্ট্য, চুলা জ্বালানোর সঠিক নিয়ম, আগুন ছাড়া সাবান-পানি দিয়ে লিকেজ পরীক্ষা ও গ্যাস নির্গমনে জরুরি জীবনরক্ষাকারী পদক্ষেপ শেখানো হয়।",
  category: "Consumer Safety",
  categoryBn: "ভোক্তা নিরাপত্তা",
  badge: "FREE",
  badgeColor: "bg-emerald-600",
  audience: "Homemakers, Students & General Consumers",
  audienceBn: "গৃহিণী, শিক্ষার্থী ও সাধারণ ভোক্তা",
  level: "Beginner",
  levelBn: "প্রাথমিক স্তর",
  duration: "45 mins",
  durationBn: "৪৫ মিনিট",
  totalLessons: 4,
  totalQuizzes: 1,
  rating: 4.9,
  enrolledCount: "8,920",
  price: 0,
  imageUrl:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  videoUrl: "/sample-course-video.mp4",
  isPublished: true,
  instructor: {
    name: "Fatema Begum",
    nameBn: "ফাতেমা বেগম",
    role: "Community Safety Instructor, Fire Service Certified",
    roleBn: "কমিউনিটি নিরাপত্তা প্রশিক্ষক, ফায়ার সার্ভিস সনদপ্রাপ্ত",
    experience: "10+ Years Community Outreach",
    experienceBn: "১০+ বছরের সচেতনতামূলক অভিজ্ঞতা",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
  },
  learningPoints: [
    "Understanding LPG heavier-than-air properties & natural ventilation",
    "Proper match-first burner ignition sequence to prevent fireball hazards",
    "Soap-water bubble leak testing at regulator joint and burner hose",
    "Immediate actions during gas smell: never touch electrical switches, open doors/windows",
    "National Emergency Helpline 16137 and quick wet-blanket fire smothering technique",
  ],
  learningPointsBn: [
    "বাতাসের চেয়ে ভারী এলপিজি বাষ্পের ধর্ম ও প্রাকৃতিক বায়ু চলাচলের গুরুত্ব",
    "রান্নাঘরে আগুন বিস্ফোরণ এড়াতে আগে ম্যাচ বা লাইটার জ্বালিয়ে নব ঘোরানোর সঠিক নিয়ম",
    "সাবান-পানির ফেনা দিয়ে রেগুলেটর সংযোগ ও গ্যাস পাইপ পরীক্ষা করার নিরাপদ পদ্ধতি",
    "গ্যাসের তীব্র গন্ধে বিদ্যুৎ সুইচ স্পর্শ না করে দ্রুত দরজা-জানালা খোলার জরুরি প্রটোকল",
    "জরুরি জাতীয় হেল্পলাইন ১৬১৩৭ এবং ভেজা মোটা কম্বল দিয়ে সিলিন্ডারের আগুন নেভানোর উপায়",
  ],
  curriculum: [
    {
      moduleTitle: "Module 1: Safe Installation & Daily Kitchen Precautions",
      moduleTitleBn: "মডিউল ১: নিরাপদ স্থাপন ও দৈনন্দিন রান্নাঘরের সতর্কতা",
      isFree: true,
      lessons: [
        {
          title: "Lesson 1.1: LPG Vapor Characteristics & Upright Positioning",
          titleBn: "পাঠ ১.১: এলপিজি গ্যাসের আচরণ ও সোজা খাড়া রাখার গুরুত্ব",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "LPG is heavier than air. Cylinders must always remain vertical and never kept inside unventilated enclosed cabinets without ground vent holes.",
          notesBn:
            "এলপিজি বাষ্প বাতাসের চেয়ে ভারী হওয়ায় মেঝেতে জমা হয়। তাই সিলিন্ডার কখনোই বদ্ধ কেবিনেটে বায়ু চলাচল ছাড়া রাখা যাবে না এবং সর্বদা সোজা খাড়া রাখতে হবে।",
        },
        {
          title: "Lesson 1.2: Safe Ignition Sequence & Hose Life Monitoring",
          titleBn: "পাঠ ১.২: চুলা জ্বালানোর সঠিক ক্রম ও গ্যাস পাইপের মেয়াদ পর্যবেক্ষণ",
          duration: "10 mins",
          durationBn: "১০ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "Always ignite the lighter FIRST before opening the burner gas valve. Replace rubber hoses every 2 years or if brittle fissures appear.",
          notesBn:
            "সবসময় আগে লাইটার বা ম্যাচ জ্বালিয়ে তারপর চুলার গ্যাস নব ঘুরান। কোনো অবস্থাতেই মেয়াদোত্তীর্ণ বা ফাটা রাবার পাইপ ব্যবহার করবেন না।",
        },
      ],
      quiz: {
        title: "Kitchen Safety Essentials Quiz",
        titleBn: "রান্নাঘরের নিরাপত্তা মূল্যায়ন কুইজ",
        durationMinutes: 10,
        passingScore: 70,
        questions: [
          {
            question: "Where does LPG gas accumulate if a leak occurs in the room?",
            questionBn: "ঘরে এলপিজি গ্যাস লিক হলে তা সাধারণত কোথায় জমা হয়?",
            options: [
              "Near the ceiling because it is lighter than air",
              "Near the floor, pits, and low corners because it is heavier than air",
              "Disperses instantly into the upper atmosphere",
              "Accumulates only inside the stove burner",
            ],
            optionsBn: [
              "সিলিংয়ের কাছে কারণ এটি বাতাসের চেয়ে হালকা",
              "মেঝে ও নিচু কোনায় কারণ এটি বাতাসের চেয়ে ভারী",
              "তাৎক্ষণিকভাবে উপরের বাতাসে মিলিয়ে যায়",
              "শুধুমাত্র চুলার বার্নারের ভেতরে জমা হয়",
            ],
            correctAnswer: 1,
            explanation:
              "LPG vapor is about 1.5 to 2.0 times denser than air, so it sinks and pools at floor level.",
            explanationBn:
              "এলপিজি বাষ্প বাতাসের চেয়ে দেড় থেকে দ্বিগুণ ভারী, তাই লিকেজ হলে তা মেঝের কাছাকাছি জমা হয়।",
          },
          {
            question: "What should you NEVER do if you detect a strong odor of gas?",
            questionBn: "ঘরে তীব্র গ্যাসের গন্ধ পেলে নিচের কোনটি কখনোই করা উচিত নয়?",
            options: [
              "Open windows and doors for ventilation",
              "Turn on electrical switches, exhaust fans, or use mobile torch",
              "Shut off the cylinder regulator switch immediately",
              "Evacuate family members to a safe open space",
            ],
            optionsBn: [
              "বায়ু চলাচলের জন্য দরজা-জানালা খুলে দেওয়া",
              "বৈদ্যুতিক সুইচ, এগজস্ট ফ্যান চালু করা বা মোবাইল ফোনের ফ্ল্যাশলাইট জ্বালানো",
              "তাৎক্ষণিকভাবে সিলিন্ডারের রেগুলেটর বন্ধ করা",
              "পরিবারের সদস্যদের নিরাপদে বাইরে নিয়ে যাওয়া",
            ],
            correctAnswer: 1,
            explanation:
              "Operating electrical switches creates a micro-spark that can instantly ignite the gas-air mixture.",
            explanationBn:
              "বৈদ্যুতিক সুইচ অন বা অফ করলে সূক্ষ্ম স্পার্ক বা স্ফুলিঙ্গ তৈরি হয় যা গ্যাস-বাতাসের মিশ্রণে তাৎক্ষণিক বিস্ফোরণ ঘটাতে পারে।",
          },
          {
            question: "What is the certified and safe method to check for gas leakages?",
            questionBn: "গ্যাস লিকেজ পরীক্ষার অনুমোদিত ও নিরাপদ পদ্ধতি কোনটি?",
            options: [
              "Lighting a matchstick near the regulator",
              "Using a sponge soaked in soap-water solution and looking for bubbles",
              "Sniffing the nozzle with a cigarette lighter",
              "Tapping the metal pipe with a hammer",
            ],
            optionsBn: [
              "রেগুলেটরের পাশে ম্যাচের কাঠি জ্বালিয়ে দেখা",
              "সাবান-পানির ফেনা স্পঞ্জে নিয়ে সংযোগস্থলে লাগিয়ে বুদবুদ পর্যবেক্ষণ করা",
              "লাইটার জ্বেলে গ্যাস নির্গমন পরীক্ষা করা",
              "হাতুড়ি দিয়ে পাইপে আঘাত করে শব্দ শোনা",
            ],
            correctAnswer: 1,
            explanation:
              "Never use open flames. Applying soapy water produces expanding bubbles over any leak point safely.",
            explanationBn:
              "কখনোই খোলা আগুন ব্যবহার করবেন না। সাবান-পানির ফেনা লাগালে লিকেজের স্থানে বুদবুদ সৃষ্টি হয়।",
          },
        ],
      },
    },
    {
      moduleTitle: "Module 2: Emergency Response & Extinguishing Kitchen Gas Fires",
      moduleTitleBn: "মডিউল ২: জরুরি সাড়াদান ও রান্নাঘরের গ্যাস আগুন নিয়ন্ত্রণ",
      isFree: true,
      lessons: [
        {
          title: "Lesson 2.1: Gas Leak Emergency Protocol (Soap-Water Test & Room Venting)",
          titleBn: "পাঠ ২.১: গ্যাস লিকেজ জরুরি প্রটোকল (সাবান-পানি পরীক্ষা ও বায়ু সঞ্চালন)",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "If regulator is hissing or odor is detected, turn off regulator, open all windows, keep calm, do not flick switches, and call fire service helpline.",
          notesBn:
            "হিস হিস শব্দ বা গ্যাসের গন্ধ পেলে সাথে সাথে রেগুলেটর অফ করুন, দরজা জানালা খুলুন এবং ফায়ার সার্ভিসকে খবর দিন।",
        },
        {
          title: "Lesson 2.2: Smothering Fire with Wet Heavy Blanket & 16137 Hotline",
          titleBn: "পাঠ ২.২: ভেজা মোটা কম্বল দিয়ে আগুন নিভানো ও ১৬১৩৭ হটলাইন",
          duration: "13 mins",
          durationBn: "১৩ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "A soaked cotton blanket wraps over cylinder neck cutting oxygen supply safely. Memorize National Emergency 16137.",
          notesBn:
            "ভেজা সুতি কম্বল সিলিন্ডারের মুখে শক্ত করে চেপে ধরলে অক্সিজেনের সরবরাহ বন্ধ হয়ে আগুন নিভে যায়। ১৬১৩৭ জরুরি নম্বর মনে রাখুন।",
        },
      ],
    },
  ],
};

const paidCourse = {
  courseId: "7",
  title: "Industrial LPG Manifold Systems & Explosives Department Safety Compliance",
  titleBn: "শিল্প কারখানায় এলপিজি ম্যানিফোল্ড সিস্টেম ও বিস্ফোরক অধিদপ্তর কমপ্লায়েন্স",
  slug: "industrial-lpg-manifold-explosives-department-compliance",
  description:
    "An advanced professional certification course for plant managers, industrial safety engineers, and commercial kitchen supervisors covering multi-cylinder manifold design, high-pressure piping, DoE storage licensing, and emergency shut-off systems.",
  descriptionBn:
    "শিল্প কারখানা, হোটেল-রেস্তোরাঁ ও বাণিজ্যিক প্রতিষ্ঠানের জন্য একটি উচ্চতর প্রফেশনাল কোর্স। এতে মাল্টি-সিলিন্ডার ম্যানিফোল্ড ডিজাইন, উচ্চচাপ পাইপিং সিস্টেম, বিস্ফোরক অধিদপ্তরের স্টোরেজ লাইসেন্স বিধিমালা, ওপিএসও শাট-অফ ভালভ এবং জাতীয় নিরাপত্তা অডিট কমপ্লায়েন্স শেখানো হয়।",
  category: "Industrial Compliance",
  categoryBn: "শিল্প ও সংবিধিবদ্ধ কমপ্লায়েন্স",
  badge: "PREMIUM",
  badgeColor: "bg-primary",
  audience: "Safety Officers, Factory Engineers & Plant Managers",
  audienceBn: "নিরাপত্তা কর্মকর্তা, কারখানার প্রকৌশলী ও প্ল্যান্ট ম্যানেজার",
  level: "Advanced Professional",
  levelBn: "উচ্চতর পেশাদার",
  duration: "2h 30m",
  durationBn: "২ ঘণ্টা ৩০ মিনিট",
  totalLessons: 6,
  totalQuizzes: 2,
  rating: 4.98,
  enrolledCount: "2,340",
  price: 1500,
  imageUrl:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop",
  videoUrl: "/sample-course-video.mp4",
  isPublished: true,
  instructor: {
    name: "Engr. Tanvir Ahmed",
    nameBn: "প্রকৌশলী তানভীর আহমেদ",
    role: "Senior Process Safety Consultant & Ex-BERC Technical Advisor",
    roleBn: "সিনিয়র প্রসেস সেফটি কনসালট্যান্ট ও প্রাক্তন বিইআরসি কারিগরি উপদেষ্টা",
    experience: "18+ Years Industrial Gas Plant Experience",
    experienceBn: "১৮+ বছরের শিল্প গ্যাস প্ল্যান্ট অভিজ্ঞতা",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  learningPoints: [
    "Design and configuration of dual-bank LPG cylinder manifolds with auto-changeover",
    "Selection of Schedule 40/80 seamless carbon steel pipes and high-pressure valves",
    "Explosives Department statutory guidelines, separation distances & fire clearance",
    "Over-Pressure Shut-Off (OPSO) & Under-Pressure Shut-Off (UPSO) integration",
    "Gas detection telemetry, interlocking solenoid valves & explosion-proof electricals",
    "Preparation of Emergency Response Plans (ERP) and DoE audit dossiers",
  ],
  learningPointsBn: [
    "অটো-চেঞ্জওভার সুবিধাসহ ডুয়েল-ব্যাংক এলপিজি সিলিন্ডার ম্যানিফোল্ড ডিজাইন ও লেআউট",
    "শিডিউল ৪০/৮০ সিমলেস কার্বন স্টিল পাইপ, ফ্লেক্সিবল পিগটেল ও উচ্চচাপ ভালভ নির্বাচন",
    "বিস্ফোরক অধিদপ্তরের সংবিধিবদ্ধ স্টোরেজ লাইসেন্স বিধি, নিরাপত্তা দূরত্ব ও ফায়ার ক্লিয়ারেন্স",
    "ওপিএসও (OPSO) ও ইউপিএসও (UPSO) প্রেসার রেগুলেশন ও সেফটি শাট-অফ ভালভ সংযোজন",
    "গ্যাস ডিটেকশন সেন্সর, ইন্টারলকিং সলিনয়েড ভালভ ও এক্সপ্লোশন-প্রুফ বৈদ্যুতিক সিস্টেম",
    "শিল্প কারখানার জরুরি দুর্যোগ ব্যবস্থাপনা প্ল্যান (ইআরপি) ও অডিট নথি প্রস্তুতি",
  ],
  curriculum: [
    // MODULE 1 (Free Preview)
    {
      moduleTitle: "Module 1: Manifold Architecture & Pressure Regulation Systems",
      moduleTitleBn: "মডিউল ১: ম্যানিফোল্ড স্থাপত্য ও চাপ নিয়ন্ত্রণ ব্যবস্থা",
      isFree: true,
      lessons: [
        {
          title: "Lesson 1.1: Dual-Bank Manifold Layout, Header Design & Pigtails",
          titleBn: "পাঠ ১.১: ডুয়েল-ব্যাংক ম্যানিফোল্ড লেআউট, হেডার পাইপ ও পিগটেল",
          duration: "18 mins",
          durationBn: "১৮ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "Dual-bank manifold headers ensure seamless continuous supply. Copper and stainless steel reinforced pigtails must withstand working pressure above 25 bar.",
          notesBn:
            "ডুয়েল-ব্যাংক ম্যানিফোল্ড হেডার উৎপাদনে অবিচ্ছিন্ন গ্যাস প্রবাহ নিশ্চিত করে। পিগটেলগুলো অবশ্যই ২৫ বারের অধিক কার্যচাপ সহ্যক্ষমতাসম্পন্ন হতে হবে।",
        },
        {
          title: "Lesson 1.2: Dual-Stage Pressure Regulators, OPSO & UPSO Safety Valves",
          titleBn: "পাঠ ১.২: ডুয়েল-স্টেজ প্রেশার রেগুলেটর, ওপিএসও ও ইউপিএসও সেফটি ভালভ",
          duration: "20 mins",
          durationBn: "২০ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "First-stage regulator steps down cylinder pressure from 7 bar to 1.5 bar; second stage lowers it to burner working pressure (typically 30–50 mbar). OPSO protects equipment against dangerous over-pressure surges.",
          notesBn:
            "ফার্স্ট-স্টেজ রেগুলেটর সিলিন্ডার চাপ ৭ বার থেকে ১.৫ বারে কমায়; সেকেন্ড স্টেজ চুলার ওয়ার্কিং প্রেসারে (৩০-৫০ এমবার) নামিয়ে আনে। ওপিএসও ওভার-প্রেশার দুর্ঘটনা রোধ করে।",
        },
      ],
      quiz: {
        title: "Module 1: Manifold Engineering Quiz",
        titleBn: "মডিউল ১: ম্যানিফোল্ড ইঞ্জিনিয়ারিং কুইজ",
        durationMinutes: 15,
        passingScore: 75,
        questions: [
          {
            question: "What is the primary function of an OPSO (Over Pressure Shut-Off) valve?",
            questionBn: "ওপিএসও (OPSO) ভালভের মূল কাজ কী?",
            options: [
              "To increase gas flow during peak burner hours",
              "To automatically trip and cut off gas supply if downstream pressure exceeds preset limits",
              "To filter impurities and moisture from liquid LPG",
              "To reverse gas flow back into spare cylinders",
            ],
            optionsBn: [
              "পিক আওয়ার চলাকালে গ্যাসের প্রবাহ বৃদ্ধি করা",
              "নির্ধারিত সীমার অতিরিক্ত প্রেশার বাড়লে স্বয়ংক্রিয়ভাবে গ্যাস সরবরাহ সম্পূর্ণ বন্ধ করে দেওয়া",
              "তরল গ্যাস থেকে আর্দ্রতা ও ময়লা ফিল্টার করা",
              "অতিরিক্ত গ্যাস রিজার্ভ সিলিন্ডারে ফেরত পাঠানো",
            ],
            correctAnswer: 1,
            explanation:
              "OPSO shuts down supply instantly upon regulator malfunction to protect industrial equipment.",
            explanationBn:
              "রেগুলেটর অকেজো হয়ে অতিরিক্ত চাপ সৃষ্টি হলে ওপিএসও তাৎক্ষণিকভাবে গ্যাস প্রবাহ বন্ধ করে বিস্ফোরণ প্রতিরোধ করে।",
          },
          {
            question: "Which piping specification is standard for high-pressure industrial LPG vapor lines?",
            questionBn: "উচ্চচাপ শিল্প এলপিজি লাইনের জন্য কোন পাইপ স্পেসিফিকেশন অনুমোদিত?",
            options: [
              "Schedule 40 or 80 Seamless Carbon Steel (ASTM A106/A53)",
              "Thin-wall PVC conduit pipes",
              "Cast iron drainage pipe",
              "Aluminum foil flexible ducts",
            ],
            optionsBn: [
              "শিডিউল ৪০ বা ৮০ সিমলেস কার্বন স্টিল পাইপ (ASTM A106/A53)",
              "পাতলা পিভিসি কন্ডুইট পাইপ",
              "কাস্ট আয়রন পাইপ",
              "অ্যালুমিনিয়াম ফয়েল ডাক্ট পাইপ",
            ],
            correctAnswer: 0,
            explanation:
              "Seamless carbon steel pipes designed for high pressure are mandated by Department of Explosives.",
            explanationBn:
              "উচ্চচাপ গ্যাসের জন্য বিস্ফোরক অধিদপ্তর কর্তৃক সিমলেস কার্বন স্টিল পাইপ ব্যবহার বাধ্যতামূলক।",
          },
        ],
      },
    },
    // MODULE 2 (Premium Locked)
    {
      moduleTitle: "Module 2: Department of Explosives Licensing & Statutory Codes",
      moduleTitleBn: "মডিউল ২: বিস্ফোরক অধিদপ্তর লাইসেন্সিং ও সংবিধিবদ্ধ বিধিমালা",
      isFree: false,
      lessons: [
        {
          title: "Lesson 2.1: Statutory Clearance Checklist, Layout Plan & Setback Distances",
          titleBn: "পাঠ ২.১: সরকারি ক্লিয়ারেন্স চেকলিস্ট, লেআউট নকশা ও নিরাপদ দূরত্ব",
          duration: "25 mins",
          durationBn: "২৫ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Clear distances from property boundaries, boiler rooms, and electrical substations must strictly conform to Bangladesh Gas Cylinder Rules.",
          notesBn:
            "বাংলাদেশ গ্যাস সিলিন্ডার বিধিমালা অনুযায়ী বাউন্ডারি ওয়াল, বয়লার রুম ও বৈদ্যুতিক সাবস্টেশন থেকে নিরাপদ দূরত্ব বজায় রাখা সংবিধিবদ্ধ বাধ্যবাধকতা।",
        },
        {
          title: "Lesson 2.2: Gas Leak Telemetry, Explosion-Proof Sensors & Auto Solenoid Interlocks",
          titleBn: "পাঠ ২.২: গ্যাস ডিটেকশন টেলিমেট্রি, ফ্লেমপ্রুফ সেন্সর ও অটো সলিনয়েড ভালভ",
          duration: "22 mins",
          durationBn: "২২ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Catalytic and infrared gas sensors trigger audio-visual alarms at 20% LEL and trip the main emergency slam-shut valve at 40% LEL.",
          notesBn:
            "২০% এলইএল-এ অ্যালার্ম বাজে এবং ৪০% এলইএল-এ মূল ইমার্জেন্সি শাট-অফ সলিনয়েড ভালভ স্বয়ংক্রিয়ভাবে বন্ধ হয়ে কারখানা সুরক্ষিত রাখে।",
        },
      ],
      quiz: {
        title: "Module 2: Regulatory & Audit Compliance Quiz",
        titleBn: "মডিউল ২: রেগুলেটরি ও অডিট কমপ্লায়েন্স কুইজ",
        durationMinutes: 15,
        passingScore: 80,
        questions: [
          {
            question: "At what % Lower Explosive Limit (LEL) should industrial automatic slam-shut valves trip?",
            questionBn: "কত শতাংশ এলইএল (LEL)-এ অটোমেটিক স্ল্যাম-শাট ভালভ সম্পূর্ণ বন্ধ হওয়া উচিত?",
            options: ["100% LEL", "40% LEL", "10% LEL", "90% LEL"],
            optionsBn: ["১০০% এলইএল", "৪০% এলইএল", "১০% এলইএল", "৯০% এলইএল"],
            correctAnswer: 1,
            explanation:
              "International and national codes recommend automatic trip at maximum 40% LEL well before explosive concentration is reached.",
            explanationBn:
              "বিস্ফোরক ঘনত্বের বহু পূর্বেই নিরাপত্তা নিশ্চিত করতে সর্বোচ্চ ৪০% এলইএল-এ সিস্টেম ট্রিপ করা আন্তর্জাতিক স্ট্যান্ডার্ড।",
          },
        ],
      },
    },
    // MODULE 3 (Premium Locked)
    {
      moduleTitle: "Module 3: Fire Suppression, Emergency Response & Audit Dossiers",
      moduleTitleBn: "মডিউল ৩: অগ্নিনির্বাপণ ব্যবস্থা, ইমার্জেন্সি রেসপন্স ও অডিট ডসিয়ার",
      isFree: false,
      lessons: [
        {
          title: "Lesson 3.1: Dry Chemical Powder (DCP) Systems, Deluge Sprinklers & Hose Reels",
          titleBn: "পাঠ ৩.১: ডিসিপি অগ্নি নির্বাপক সিস্টেম, ওয়াটার ডিলিউজ স্প্রিংকলার ও হোজ রিল",
          duration: "20 mins",
          durationBn: "২০ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Class B/C fires require dry chemical powder or high-velocity water sprays for cooling cylinder shells against BLEVE (Boiling Liquid Expanding Vapor Explosion).",
          notesBn:
            "বি ও সি ক্যাটাগরির গ্যাস অগ্নিকাণ্ডে ব্লেভি (BLEVE) বিস্ফোরণ রোধে সিলিন্ডার ঠান্ডা রাখতে হাই-ভেলোসিটি ওয়াটার স্প্রে ও ডিসিপি ব্যবহার আবশ্যক।",
        },
        {
          title: "Lesson 3.2: Preparing Audit Dossiers & Conducting Safety Drills",
          titleBn: "পাঠ ৩.২: অডিট প্রস্তুতি, সেফটি লগবুক মেইনটেন্যান্স ও নিয়মিত ফায়ার ড্রিল",
          duration: "15 mins",
          durationBn: "১৫ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Keep daily pressure inspection logbooks, hydrostatic test certificates, and documented evacuation drill records ready for DoE inspection.",
          notesBn:
            "দৈনিক প্রেশার লগবুক, সিলিন্ডারের হাইড্রোস্ট্যাটিক টেস্ট সার্টিফিকেট ও ফায়ার ড্রিলের রেকর্ড সংরক্ষণ করা কারখানা অডিটের পূর্বশর্ত।",
        },
      ],
    },
  ],
};

async function seedTwoCourses() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URL);
    await mongoose.connect(MONGODB_URL);
    console.log("Connected successfully!");

    // 1. Upsert Free Course
    const freeRes = await Course.findOneAndUpdate(
      { slug: freeCourse.slug },
      { $set: freeCourse },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ Seeded Free Course:", freeRes.courseId, freeRes.title, `(Price: ৳${freeRes.price})`);

    // 2. Upsert Paid Course
    const paidRes = await Course.findOneAndUpdate(
      { slug: paidCourse.slug },
      { $set: paidCourse },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log("✅ Seeded Paid Course:", paidRes.courseId, paidRes.title, `(Price: ৳${paidRes.price})`);

    const totalCourses = await Course.countDocuments();
    console.log(`\n🎉 Total published courses in database now: ${totalCourses}`);

    await mongoose.disconnect();
    console.log("Database disconnected cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    process.exit(1);
  }
}

seedTwoCourses();

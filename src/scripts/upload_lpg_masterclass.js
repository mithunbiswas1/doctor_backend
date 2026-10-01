// ael_backend/src/scripts/upload_lpg_masterclass.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "../models/course.model.js";

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/ael";

const lpgCourseData = {
  courseId: "5",
  title: "Comprehensive LPG Cylinder Safety, Handling & Emergency Response",
  titleBn: "এলপিজি সিলিন্ডার ব্যবহার, হ্যান্ডলিং ও জরুরি নিরাপত্তা",
  slug: "lpg-cylinder-safety-handling-emergency-response",
  description:
    "An authoritative and practical masterclass covering safe installation, daily kitchen handling, leak detection, cylinder inspection, and life-saving emergency fire suppression protocols conforming to Bangladesh standards.",
  descriptionBn:
    "বাংলাদেশ ন্যাশনাল বিল্ডিং কোড ও ফায়ার সার্ভিস মানদণ্ড অনুযায়ী এলপিজি সিলিন্ডারের নিরাপদ স্থাপন, দৈনন্দিন ব্যবহার, লিকেজ পরীক্ষা, সিলিন্ডার পরিদর্শন এবং জীবনরক্ষাকারী অগ্নিনির্বাপণ প্রটোকলের সমন্বয়ে তৈরি একটি পূর্ণাঙ্গ মাস্টারক্লাস।",
  category: "Consumer & Industrial Safety",
  categoryBn: "ভোক্তা ও শিল্প নিরাপত্তা",
  badge: "PREMIUM",
  badgeColor: "bg-amber-600",
  audience: "Consumers, Homemakers & Commercial Operators",
  audienceBn: "ভোক্তা, গৃহিণী ও বাণিজ্যিক অপারেটর",
  level: "All Levels",
  levelBn: "সকল স্তর",
  duration: "1h 45m",
  durationBn: "১ ঘণ্টা ৪৫ মিনিট",
  totalLessons: 6,
  totalQuizzes: 3,
  rating: 4.95,
  enrolledCount: "4,850",
  price: 1200,
  imageUrl:
    "https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=800&auto=format&fit=crop",
  videoUrl: "/sample-course-video.mp4",
  isPublished: true,
  instructor: {
    name: "Engr. Mahmudul Hasan",
    nameBn: "প্রকৌশলী মাহমুদুল হাসান",
    role: "Lead Safety Auditor, Ex-DoE Inspector",
    roleBn: "প্রধান নিরাপত্তা নিরীক্ষক, প্রাক্তন ডিওই",
    experience: "15+ Years Industrial & LPG Experience",
    experienceBn: "১৫+ বছরের শিল্প ও এলপিজি অভিজ্ঞতা",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
  learningPoints: [
    "Safe installation, vertical storage and leak testing of LPG cylinders",
    "Identification of certified valves, O-rings, and approved rubber hoses",
    "Proper burner ignition sequences and hazard avoidance in home kitchens",
    "Detection of gas leaks using soap-water solution without open flame",
    "Emergency shutdown protocols during gas leaks and room ventilation rules",
    "Class B & C fire fighting techniques, wet blanket method and emergency helpline 16137",
  ],
  learningPointsBn: [
    "এলপিজি সিলিন্ডারের নিরাপদ স্থাপন, খাড়াভাবে সংরক্ষণ ও লিকেজ পরীক্ষা",
    "অনুমোদিত ভালভ, ও-রিং এবং গ্যাস পাইপের গুণগত মান যাচাই",
    "রান্নাঘরে চুলা জ্বালানোর সঠিক পদ্ধতি ও অগ্নিঝুঁকি প্রতিরোধ",
    "আগুন ছাড়া কেবল সাবান-পানির ফেনা দিয়ে নিখুঁতভাবে লিকেজ শনাক্তকরণ",
    "গ্যাসের তীব্র গন্ধে বিদ্যুৎ সুইচ স্পর্শ না করে বায়ু চলাচলের জরুরি নিয়মাবলী",
    "ক্লাস বি ও সি আগুন নিয়ন্ত্রণ, ভেজা কম্বল পদ্ধতি এবং ১৬১৩৭ হেল্পলাইন",
  ],
  curriculum: [
    // MODULE 1
    {
      moduleTitle: "Module 1: LPG Fundamentals, Storage & Safe Installation",
      moduleTitleBn: "মডিউল ১: এলপিজি মৌলিক ধারণা, সংরক্ষণ ও নিরাপদ স্থাপন",
      isFree: true, // First module free for preview!
      lessons: [
        {
          title: "Lesson 1.1: Physical Properties of LPG & Safe Upright Storage",
          titleBn: "পাঠ ১.১: এলপিজি গ্যাসের ভৌত বৈশিষ্ট্য ও নিরাপদ খাড়া সংরক্ষণ",
          duration: "12 mins",
          durationBn: "১২ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "LPG vapor is 1.5 to 2.0 times denser than atmospheric air. Because it settles in lower pits and corners, cylinders must ALWAYS be stored strictly vertical and upright in well-ventilated areas.",
          notesBn:
            "এলপিজি বাষ্প বাতাসের চেয়ে ১.৫ থেকে ২.০ গুণ বেশি ভারী। এটি মেঝের খাঁদ ও কোণায় জমা হয়, তাই সিলিন্ডার সর্বদা আলো-বাতাসযুক্ত সমতল স্থানে সোজা খাড়া রাখা আবশ্যক।",
        },
        {
          title: "Lesson 1.2: Regulator Connection, Hose Standards & Soap-Water Leak Testing",
          titleBn: "পাঠ ১.২: রেগুলেটর সংযোগ, অনুমোদিত পাইপ ও সাবান-পানি টেস্ট",
          duration: "15 mins",
          durationBn: "১৫ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: true,
          notes:
            "Never use matches or lighters to test for leaks. Use a sponge dipped in soapy water and observe if bubbles expand around the regulator nozzle or hose clamp.",
          notesBn:
            "গ্যাস লিকেজ দেখার জন্য কখনোই ম্যাচের কাঠি বা আগুন ব্যবহার করবেন না। সাবান-পানির ফেনা স্পঞ্জে নিয়ে রেগুলেটর ও পাইপের সংযোগস্থলে লাগিয়ে বুদবুদ পরীক্ষা করুন।",
        },
      ],
      quiz: {
        title: "Module 1 Assessment Quiz",
        titleBn: "মডিউল ১ মূল্যায়ন কুইজ",
        durationMinutes: 10,
        passingScore: 80,
        questions: [
          {
            question: "Is LPG vapor heavier or lighter than atmospheric air?",
            questionBn: "এলপিজি বাষ্প কি বায়ুমণ্ডলের বাতাসের চেয়ে ভারী নাকি হালকা?",
            options: [
              "Lighter than air; it immediately rises up to the ceiling",
              "Heavier than air; it settles in low ground depressions and floor corners",
              "Identical density; it diffuses uniformly without settling",
              "Depends on whether the cylinder has butane only",
            ],
            optionsBn: [
              "বাতাসের চেয়ে হালকা; এটি তৎক্ষণাৎ সিলিংয়ের দিকে উঠে যায়",
              "বাতাসের চেয়ে ভারী; এটি মেঝের খাঁদ ও কোণায় জমা হয়",
              "একই ঘনত্ব; এটি সমানভাবে চারদিকে ছড়িয়ে পড়ে",
              "সিলিন্ডারে খাঁটি বিউটেন আছে কিনা তার ওপর নির্ভর করে",
            ],
            correctAnswer: 1,
            explanation:
              "LPG vapor is 1.5 to 2.0 times denser than atmospheric air, meaning leaked gas settles near floor level rather than floating upwards.",
            explanationBn:
              "এলপিজি বাষ্প বাতাসের চেয়ে ১.৫ থেকে ২.০ গুণ বেশি ভারী, যার কারণে লিকেজ হলে গ্যাস উপরে না উঠে মেঝের কাছে জমা হয়।",
          },
          {
            question: "What is the recommended safe method to test for suspected gas leaks around valves or regulators?",
            questionBn: "ভালভ বা রেগুলেটরের চারপাশে সন্দেহজনক গ্যাস লিকেজ পরীক্ষার নিরাপদ ও প্রস্তাবিত পদ্ধতি কোনটি?",
            options: [
              "Lighting a matchstick or candle to observe flame flickers",
              "Applying liquid soap-and-water solution with a sponge and looking for bubbling",
              "Spraying chemical perfume to neutralize the odor",
              "Tapping the regulator body with a metal tool to listen for pitch changes",
            ],
            optionsBn: [
              "ম্যাচের কাঠি বা মোমবাতি জ্বালিয়ে আগুনের শিখা পরীক্ষা করা",
              "স্পঞ্জ দিয়ে তরল সাবান-পানির ফেনা লাগিয়ে বুদবুদ সৃষ্টি পর্যবেক্ষণ করা",
              "গন্ধ দূর করতে রাসায়নিক সুগন্ধি স্প্রে করা",
              "রেগুলেটরে ধাতব বস্তু দিয়ে আঘাত করে শব্দের পরিবর্তন শোনা",
            ],
            correctAnswer: 1,
            explanation:
              "Applying soapy water forms visible expanding bubbles over any leak point safely without ignition danger.",
            explanationBn:
              "সাবান-পানির দ্রবণ নিরাপদ ও অজ্বলনশীল; এটি লিকেজ থাকা স্থানে বুদবুদ তৈরি করে তৎক্ষণাৎ লিকেজ শনাক্ত করে।",
          },
          {
            question: "How should an LPG cylinder be positioned during storage and daily usage?",
            questionBn: "সংরক্ষণ ও দৈনন্দিন ব্যবহারের সময় এলপিজি সিলিন্ডার কীভাবে রাখা উচিত?",
            options: [
              "Horizontally inside an airtight lower cabinet",
              "Strictly upright on a level floor, in a well-ventilated area away from heat sources",
              "Suspended off the floor near an electric water heater",
              "In an underground pit or floor drainage trench",
            ],
            optionsBn: [
              "বন্ধ ক্যাবিনেটের ভেতরে আনুভূমিকভাবে শুইয়ে রাখা",
              "তাপের উৎস থেকে দূরে, আলো-বাতাসযুক্ত সমতল মেঝেতে সর্বদা খাড়াভাবে রাখা",
              "বৈদ্যুতিক ওয়াটার হিটারের কাছে মেঝে থেকে ঝুলিয়ে রাখা",
              "ভূগর্ভস্থ গর্ত বা মেঝের ড্রেনের ভেতরে রাখা",
            ],
            correctAnswer: 1,
            explanation:
              "Cylinders must always be kept strictly vertical and upright so that vapor, not liquid, enters the pressure regulator.",
            explanationBn:
              "সিলিন্ডার সর্বদা সোজা খাড়া রাখা উচিত যাতে তরল নয়, শুধুমাত্র বাষ্পীভূত গ্যাস রেগুলেটরে পৌঁছাতে পারে।",
          },
          {
            question: "What is the maximum recommended replacement lifespan of an LPG flexible rubber hose pipe?",
            questionBn: "এলপিজি সুরক্ষামূলক রাবার গ্যাস পাইপ সর্বোচ্চ কত দিন পর পর পরিবর্তন করা উচিত?",
            options: [
              "Every 2 years, or immediately upon noticing any cracks or hardening",
              "Every 10 years regardless of condition",
              "Only when the pipe completely bursts",
              "Never, gas hoses have lifetime durability",
            ],
            optionsBn: [
              "প্রতি ২ বছর পর পর, অথবা ফাটল বা শক্ত হওয়া দেখলে সাথে সাথে",
              "যেকোনো অবস্থায় প্রতি ১০ বছর পর পর",
              "শুধুমাত্র পাইপ পুরোপুরি ফেটে গেলে",
              "কখনোই নয়, গ্যাস পাইপের কোনো মেয়াদ থাকে না",
            ],
            correctAnswer: 0,
            explanation:
              "Safety standards require flexible LPG hose replacement every 2 years or immediately if cracks or hardening appear.",
            explanationBn:
              "নিরাপত্তা মানদণ্ড অনুযায়ী সর্বোচ্চ ২ বছর পর পর অথবা কোনো ফাটল বা ক্ষয় দেখা দিলে তাৎক্ষণিক পাইপ পরিবর্তন করতে হয়।",
          },
          {
            question: "What is the minimum safe horizontal distance recommended between an LPG cylinder and a cooking stove burner?",
            questionBn: "এলপিজি সিলিন্ডার এবং রান্নার চুলার মধ্যে কমপক্ষে কত দূরত্ব বজায় রাখা নিরাপদ?",
            options: [
              "At least 1 meter (approx. 3 feet) away from the burner flame",
              "Directly underneath the active burner flame",
              "Inside a sealed box touching the stove base",
              "0.1 meters directly beside the burner grate",
            ],
            optionsBn: [
              "চুলা ও আগুনের শিখা থেকে কমপক্ষে ১ মিটার (প্রায় ৩ ফুট) দূরে",
              "জ্বলন্ত চুলার ঠিক নিচে সরাসরি স্থাপন করা",
              "চুলার গোড়ায় লাগানো বন্ধ বাক্সের ভেতরে",
              "চুলার পাশে ০.১ মিটার দূরত্বে",
            ],
            correctAnswer: 0,
            explanation:
              "Maintaining at least 1 meter of separation prevents radiant heat transfer to the cylinder body.",
            explanationBn:
              "কমপক্ষে ১ মিটার বা ৩ ফুট দূরত্ব বজায় রাখলে চুলার তাপ সরাসরি সিলিন্ডারের গায়ে পৌঁছাতে পারে না।",
          },
        ],
      },
    },

    // MODULE 2
    {
      moduleTitle: "Module 2: Daily Kitchen Operations, Ventilation & Hazard Prevention",
      moduleTitleBn: "মডিউল ২: রান্নাঘরের দৈনন্দিন ব্যবহার, বায়ু চলাচল ও দুর্ঘটনা প্রতিরোধ",
      isFree: false,
      lessons: [
        {
          title: "Lesson 2.1: Kitchen Ventilation Protocols & Safe Burner Ignition Sequence",
          titleBn: "পাঠ ২.১: রান্নাঘরের বায়ু চলাচল নিশ্চিতকরণ ও চুলা জ্বালানোর সঠিক নিয়ম",
          duration: "14 mins",
          durationBn: "১৪ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Always strike the match or trigger the electronic spark igniter FIRST before turning on the stove burner knob. Always ensure kitchen windows are open.",
          notesBn:
            "চুলা জ্বালানোর সময় সর্বদা আগে ম্যাচের কাঠি বা লাইটার জ্বালিয়ে চুলার কাছে নিন, তারপর চুলার নব ঘোরান। রান্নাঘরের জানালা সর্বদা খোলা রাখুন।",
        },
        {
          title: "Lesson 2.2: Inspecting Valve O-Rings, Cylinder Damage & Hydrostatic Test Dates",
          titleBn: "পাঠ ২.২: ভালভের ও-রিং পরীক্ষা, সিলিন্ডারের ত্রুটি ও টেস্টিং তারিখ যাচাই",
          duration: "16 mins",
          durationBn: "১৬ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Inspect the black rubber O-ring inside the cylinder valve before attaching a regulator. Check the stamped alphanumeric code on the stay plate for the periodic test validity.",
          notesBn:
            "রেগুলেটর লাগানোর আগে সিলিন্ডার ভালভের ভেতরে কালো ও-রিং অক্ষত আছে কিনা দেখুন। সিলিন্ডারের হ্যান্ডেল প্লেটে খোদাই করা টেস্টিং তারিখ যাচাই করুন।",
        },
      ],
      quiz: {
        title: "Module 2 Daily Operations & Hazard Quiz",
        titleBn: "মডিউল ২ দৈনন্দিন ব্যবহার ও ঝুঁকি প্রতিরোধ কুইজ",
        durationMinutes: 10,
        passingScore: 80,
        questions: [
          {
            question: "When lighting a manual gas stove burner, which step must be executed first?",
            questionBn: "ম্যানুয়াল গ্যাস চুলা জ্বালানোর সময় সবার আগে কোনটি করা বাধ্যতামূলক?",
            options: [
              "Strike match / trigger igniter first, then turn the stove burner knob",
              "Open stove burner knob for 30 seconds, then search for matches",
              "Turn on kitchen exhaust fan first",
              "Shake the gas cylinder to build pressure",
            ],
            optionsBn: [
              "আগে দিয়াশলাই বা লাইটার জ্বালিয়ে চুলার কাছে ধরা, তারপর চুলার নব অন করা",
              "চুলার নব ৩০ সেকেন্ড অন রেখে তারপর ম্যাচের কাঠি খোঁজা",
              "প্রথমে রান্নাঘরের এক্সহস্ট ফ্যান চালু করা",
              "গ্যাসের চাপ বাড়াতে সিলিন্ডারটি ভালো করে ঝাঁকানো",
            ],
            correctAnswer: 0,
            explanation:
              "Always have the ignition source ready at the burner prior to releasing gas to prevent dangerous vapor buildup around the stove.",
            explanationBn:
              "গ্যাস নির্গমনের আগেই আগুনের উৎস প্রস্তুত রাখলে চুলার চারিপাশে অনাকাঙ্ক্ষিত গ্যাস জমে হঠাৎ আগুনের হলকা তৈরি হতে পারে না।",
          },
          {
            question: "What critical component inside the cylinder valve neck prevents gas leakage when the regulator is attached?",
            questionBn: "রেগুলেটর লাগানোর পর গ্যাস লিকেজ রোধে সিলিন্ডার ভালভের ভেতরে কোন গুরুত্বপূর্ণ অংশটি কাজ করে?",
            options: [
              "Black synthetic rubber O-ring (gasket)",
              "Threaded plastic spacer",
              "Metal ball bearing",
              "Adhesive glue tape",
            ],
            optionsBn: [
              "কালো রঙের সিন্থেটিক রাবার ও-রিং (গ্যাসকেট)",
              "প্লাস্টিকের থ্রেডেড স্পেসার",
              "ধাতব বল বিয়ারিং",
              "আঠালো গ্লু টেপ",
            ],
            correctAnswer: 0,
            explanation:
              "The internal rubber O-ring creates the airtight compression seal between cylinder valve and regulator nozzle.",
            explanationBn:
              "সিলিন্ডার ভালভের ভেতরের রাবার ও-রিং রেগুলেটর নজলের সাথে বায়ুরোধী কম্প্রেশন সিল তৈরি করে।",
          },
          {
            question: "Why does LPG gas have a distinctive, pungent rotten-cabbage smell?",
            questionBn: "এলপিজি গ্যাসে কেন একটি তীব্র বিশ্রী বা পচা বাঁধাকপির মতো গন্ধ পাওয়া যায়?",
            options: [
              "Natural odor of propane and butane gases",
              "Addition of Ethyl Mercaptan odorant for rapid leak detection",
              "High moisture content in the steel cylinder",
              "Chemical reaction with the stove burner brass",
            ],
            optionsBn: [
              "প্রোপেন ও বিউটেন গ্যাসের প্রাকৃতিক সহজাত গন্ধ",
              "দ্রুত লিকেজ শনাক্ত করতে ইথাইল মারক্যাপটান নামক রাসায়নিক সুগন্ধক মেশানো",
              "স্টিল সিলিন্ডারের মধ্যকার অতিরিক্ত জলীয় বাষ্প",
              "চুলার পিতলের সাথে রাসায়নিক বিক্রিয়া",
            ],
            correctAnswer: 1,
            explanation:
              "Pure LPG is odorless. Ethyl Mercaptan is deliberately blended during bottling so even minor leaks are instantly smelled by humans.",
            explanationBn:
              "বিশুদ্ধ এলপিজি গন্ধহীন। বোতলজাতকরণের সময় এতে ইথাইল মারক্যাপটান যোগ করা হয় যাতে সামান্য লিকেজও মানুষ তৎক্ষণাৎ গন্ধ পেয়ে সতর্ক হতে পারে।",
          },
          {
            question: "If you detect a strong gas odor in the kitchen, why must you NEVER turn on electric switches or exhaust fans?",
            questionBn: "রান্নাঘরে গ্যাসের তীব্র গন্ধ পেলে কেন কখনোই বৈদ্যুতিক সুইচ বা এক্সহস্ট ফ্যান অন করা যাবে না?",
            options: [
              "Electric contact points produce microscopic sparks that can instantly detonate the gas-air mixture",
              "It will blow the gas towards other rooms only",
              "It will trip the main building fuse unnecessarily",
              "Electric switches absorb the gas smell into wiring",
            ],
            optionsBn: [
              "বৈদ্যুতিক সুইচের অভ্যন্তরীণ ক্ষুদ্র স্পার্ক গ্যাসের সাথে মিশে তৎক্ষণাৎ বিস্ফোরণ ঘটাতে পারে",
              "এটি গ্যাসকে শুধুমাত্র অন্যান্য ঘরের দিকে ঠেলে দেবে",
              "এর ফলে ভবনের মেইন ফিউজ অযথা পুড়ে যাবে",
              "বৈদ্যুতিক সুইচ তারের ভেতরে গ্যাসের গন্ধ শোষণ করে ফেলে",
            ],
            correctAnswer: 0,
            explanation:
              "Flipping an electric switch creates a tiny electric arc capable of triggering a violent stoichiometric gas deflagration.",
            explanationBn:
              "বৈদ্যুতিক সুইচ চাপার মুহূর্তে সুইচের ধাতব সংযোগে সূক্ষ্ম স্পার্ক উৎপন্ন হয় যা গ্যাসের বাতাসে তীব্র বিস্ফোরণ ঘটাতে সক্ষম।",
          },
          {
            question: "How can a consumer verify the periodic hydrostatic test validity on an LPG cylinder body?",
            questionBn: "গ্রাহক কীভাবে এলপিজি সিলিন্ডারের গায়ে এর পর্যায়ক্রমিক হাইড্রোস্ট্যাটিক পরীক্ষার মেয়াদ যাচাই করতে পারেন?",
            options: [
              "By checking the embossed alphanumeric quarter and year (e.g. A-28, B-29) on the cylinder stay plate",
              "By measuring the physical weight of the cylinder",
              "By tapping the cylinder with a coin",
              "By checking the color of the paint on the bottom foot ring",
            ],
            optionsBn: [
              "সিলিন্ডারের হ্যান্ডেল প্লেটে খোদাই করা কোয়ার্টার ও সাল (যেমন: A-28, B-29) দেখে",
              "সিলিন্ডারের মোট ওজন পরিমাপ করে",
              "সিলিন্ডারে কয়েন দিয়ে আঘাত করে শব্দ শুনে",
              "নিচের ফুট রিংয়ের রঙের পরিবর্তন দেখে",
            ],
            correctAnswer: 0,
            explanation:
              "The statutory inspection validity is stamped on the collar plate: A/B/C/D represents the quarter (Q1-Q4) and the two digits represent the year.",
            explanationBn:
              "সিলিন্ডারের হ্যান্ডেল প্লেটে কোয়ার্টার ও বছর খোদাই করা থাকে (A: জানু-মার্চ, B: এপ্রি-জুন, C: জুলাই-সেপ্টে, D: অক্টো-ডিসে)।",
          },
        ],
      },
    },

    // MODULE 3
    {
      moduleTitle: "Module 3: Emergency Response, Gas Leak Protocols & Fire Suppression",
      moduleTitleBn: "মডিউল ৩: জরুরি পদক্ষেপ, গ্যাস লিকেজ প্রটোকল ও অগ্নিনির্বাপণ",
      isFree: false,
      lessons: [
        {
          title: "Lesson 3.1: Immediate Actions During Severe Gas Leakage & Evacuation Protocol",
          titleBn: "পাঠ ৩.১: তীব্র গ্যাস লিকেজে তাৎক্ষণিক করণীয় ও নিরাপদ প্রস্থান পদ্ধতি",
          duration: "18 mins",
          durationBn: "১৮ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "Close the regulator switch immediately. Open all doors and windows for natural cross ventilation. Do not touch any electrical switches, phone chargers, or light sources.",
          notesBn:
            "অবিলম্বে রেগুলেটর বন্ধ করুন। সব দরজা-জানালা খুলে প্রাকৃতিক বাতাস চলাচল নিশ্চিত করুন। কোনো বৈদ্যুতিক সুইচ বা মোবাইল চার্জারে হাত দেবেন না।",
        },
        {
          title: "Lesson 3.2: Class B & C Fire Fighting, Wet Blanket Smothering & Emergency Shutoff",
          titleBn: "পাঠ ৩.২: ক্লাস বি ও সি আগুন নিয়ন্ত্রণ, ভেজা কম্বল পদ্ধতি ও জরুরি শাটঅফ",
          duration: "20 mins",
          durationBn: "২০ মিনিট",
          videoUrl: "/sample-course-video.mp4",
          freePreview: false,
          notes:
            "If the cylinder valve catches fire, wrap a wet heavy cotton blanket or jute sack tightly around the cylinder to cut off oxygen and turn off the valve from behind.",
          notesBn:
            "সিলিন্ডারের মুখে আগুন লাগলে একটি ভারী ভেজা সুতি কম্বল বা চটের বস্তা দ্রুত চারপাশ থেকে জড়িয়ে ধরে অক্সিজেনের সরবরাহ বন্ধ করে পেছনের দিক থেকে ভালভ বন্ধ করুন।",
        },
      ],
      quiz: {
        title: "Module 3 Emergency Protocol & Fire Safety Quiz",
        titleBn: "মডিউল ৩ জরুরি সাড়াদান ও অগ্নিনির্বাপণ কুইজ",
        durationMinutes: 10,
        passingScore: 80,
        questions: [
          {
            question: "What is the very first physical action to take upon discovering an unignited gas leak in the kitchen?",
            questionBn: "রান্নাঘরে আগুন না লাগা তীব্র গ্যাস লিকেজ দেখলে সবার প্রথম তাৎক্ষণিক শারীরিক পদক্ষেপ কোনটি?",
            options: [
              "Shut off the cylinder regulator switch and open all doors and windows for cross-ventilation",
              "Turn on the exhaust fan to extract the gas outdoors",
              "Switch on all kitchen lights to find the source of leak",
              "Pour cold tap water on the cylinder body",
            ],
            optionsBn: [
              "সিলিন্ডারের রেগুলেটর বন্ধ করা এবং সব দরজা-জানালা খুলে দিয়ে দ্রুত বায়ু চলাচলের ব্যবস্থা করা",
              "গ্যাস বাইরে বের করার জন্য এক্সহস্ট ফ্যান চালু করা",
              "লিকেজ কোথায় হয়েছে দেখতে রান্নাঘরের লাইট জ্বালানো",
              "সিলিন্ডারের গায়ে ঠান্ডা পানি ঢালা",
            ],
            correctAnswer: 0,
            explanation:
              "Isolating the gas source at the regulator and facilitating natural ventilation eliminates the explosive concentration safely.",
            explanationBn:
              "রেগুলেটর বন্ধ করে গ্যাস সরবরাহ বন্ধ করা এবং জানালা-দরজা খুলে প্রাকৃতিক বায়ু চলাচল নিশ্চিত করাই একমাত্র নিরাপদ প্রাথমিক পদক্ষেপ।",
          },
          {
            question: "Which class of fire extinguisher is specifically certified for flammable gas and electrical fires?",
            questionBn: "কোন ধরনের অগ্নিনির্বাপক যন্ত্র গ্যাস এবং বৈদ্যুতিক অগ্নিকাণ্ড নেভানোর জন্য অনুমোদিত?",
            options: [
              "DCP (Dry Chemical Powder) / ABC Fire Extinguisher",
              "Pressurized Plain Water Extinguisher",
              "Wet Chemical Cooking Oil Extinguisher",
              "Sand buckets only",
            ],
            optionsBn: [
              "ডিসিপি (ড্রাই কেমিক্যাল পাউডার) / এবিসি অগ্নিনির্বাপক যন্ত্র",
              "চাপযুক্ত সাধারণ পানির অগ্নিনির্বাপক",
              "রান্নার তেলের জন্য বিশেষ ওয়েট কেমিক্যাল এক্সটিংগুইশার",
              "শুধুমাত্র বালির বালতি",
            ],
            correctAnswer: 0,
            explanation:
              "DCP (Dry Chemical Powder) is certified for Class B (flammable liquids/gases) and Class C (energized electrical) fires.",
            explanationBn:
              "ডিসিপি (ড্রাই কেমিক্যাল পাউডার) এক্সটিংগুইশার ক্লাস বি (জ্বলনশীল গ্যাস) ও ক্লাস সি (বৈদ্যুতিক আগুন) নেভানোর জন্য আন্তর্জাতিকভাবে স্বীকৃত।",
          },
          {
            question: "What is the scientific principle behind using a wet thick blanket or jute sack to extinguish a cylinder nozzle fire?",
            questionBn: "সিলিন্ডারের মুখে আগুন লাগলে ভেজা মোটা কম্বল বা চটের বস্তা জড়িয়ে আগুন নেভানোর পেছনের বৈজ্ঞানিক নীতিটি কী?",
            options: [
              "Smothering: It cuts off the atmospheric oxygen supply required for combustion",
              "Cooling: It permanently freezes the LPG liquid inside",
              "Chemical neutralization of propane gas molecules",
              "Increasing the gas pressure inside the valve",
            ],
            optionsBn: [
              "স্মাদারিং বা অক্সিজেন বিচ্ছিন্নকরণ: এটি দহনের জন্য প্রয়োজনীয় বাতাসের অক্সিজেন বন্ধ করে দেয়",
              "কুলিং: এটি সিলিন্ডারের ভেতরের তরল গ্যাসকে জমিয়ে দেয়",
              "প্রোপেন অণুর রাসায়নিক নিষ্ক্রিয়করণ ঘটায়",
              "ভালভের ভেতরের গ্যাসের চাপ বহুগুণ বৃদ্ধি করে",
            ],
            correctAnswer: 0,
            explanation:
              "Fire requires fuel, oxygen, and heat. The wet blanket cuts off atmospheric oxygen instantly (smothering), allowing safe valve shutoff.",
            explanationBn:
              "আগুনের জন্য অক্সিজেন অপরিহার্য। ভেজা কম্বল দিয়ে সিলিন্ডারের মুখ ঢাকলে বাতাসের অক্সিজেন সংযোগ তৎক্ষণাৎ বিচ্ছিন্ন হয়ে আগুন নিভে যায়।",
          },
          {
            question: "What is the dedicated 24/7 National Emergency LPG Safety Support Helpline in Bangladesh?",
            questionBn: "বাংলাদেশে এলপিজি অগ্নিকাণ্ড বা জরুরি বিস্ফোরক ঝুঁকির ক্ষেত্রে দেশব্যাপী ২৪/৭ হেল্পলাইন নম্বর কোনটি?",
            options: [
              "16137 (National Emergency Safe LPG Helpline)",
              "99999 (Private Hospital Network)",
              "100 (Postal Department)",
              "105 (Railway General Information)",
            ],
            optionsBn: [
              "১৬১৩৭ (জাতীয় জরুরি নিরাপদ এলপিজি হেল্পলাইন)",
              "৯৯৯৯৯ (বেসরকারি হাসপাতাল নেটওয়ার্ক)",
              "১০০ (ডাক বিভাগ)",
              "১০৫ (রেলওয়ে তথ্য সেবা)",
            ],
            correctAnswer: 0,
            explanation:
              "16137 is the official dedicated round-the-clock emergency support line for LPG gas emergencies across Bangladesh.",
            explanationBn:
              "১৬১৩৭ হলো বাংলাদেশে এলপিজি সংশ্লিষ্ট জরুরি দুর্ঘটনা ও নিরাপত্তার জন্য নির্ধারিত ২৪/৭ ন্যাশনাল হেল্পলাইন।",
          },
          {
            question: "Why must an LPG cylinder never be knocked over or laid down horizontally when there is an active fire?",
            questionBn: "সিলিন্ডারে আগুন লাগাবস্থায় কেন কখনোই এটিকে মাটিতে শুইয়ে বা আনুভূমিক করা যাবে না?",
            options: [
              "Liquid LPG will escape directly instead of vapor, expanding the flame volume by up to 250 times",
              "It will scratch the paint on the cylinder shell",
              "The regulator will become too cold to hold",
              "It will block the kitchen doorway",
            ],
            optionsBn: [
              "বাষ্পের বদলে সরাসরি তরল এলপিজি বের হবে, যা আগুনের শিখাকে ২৫০ গুণ পর্যন্ত ভয়াবহভাবে প্রসারিত করবে",
              "সিলিন্ডারের গায়ের পেইন্টে স্ক্র্যাচ পড়বে",
              "রেগুলেটরটি হাত দিয়ে ধরার জন্য অতিরিক্ত ঠান্ডা হয়ে যাবে",
              "এটি রান্নাঘরের দরজার পথ আটকে দেবে",
            ],
            correctAnswer: 0,
            explanation:
              "Liquid LPG expands approximately 250 times in volume when vaporized. If laid horizontally, liquid discharges, resulting in a catastrophic fireball.",
            explanationBn:
              "তরল এলপিজি গ্যাসে রূপান্তরের সময় প্রায় ২৫০ গুণ প্রসারিত হয়। শুইয়ে দিলে তরল গ্যাস বের হয়ে মুহূর্তেই চারদিকে বিধ্বংসী আগুনের কুণ্ডলী তৈরি করবে।",
          },
        ],
      },
    },
  ],
};

async function uploadLpgCourse() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB at:", MONGODB_URL);

    // Check if course already exists by slug or courseId
    const existing = await Course.findOne({
      $or: [{ courseId: lpgCourseData.courseId }, { slug: lpgCourseData.slug }],
    });

    if (existing) {
      console.log(`Course exists (ID: ${existing.courseId}). Updating course data...`);
      Object.assign(existing, lpgCourseData);
      await existing.save();
      console.log("Successfully updated course:", existing.title);
      console.log("Course ID:", existing.courseId);
      console.log("Slug:", existing.slug);
    } else {
      console.log("Creating new course...");
      const created = await Course.create(lpgCourseData);
      console.log("Successfully created course:", created.title);
      console.log("Course ID:", created.courseId);
      console.log("Slug:", created.slug);
    }

    console.log("\nSummary of Uploaded LPG Course:");
    console.log("- Total Modules:", lpgCourseData.curriculum.length);
    lpgCourseData.curriculum.forEach((m, idx) => {
      console.log(`  • Module ${idx + 1}: ${m.moduleTitle} (isFree: ${m.isFree})`);
      console.log(`    - Video Lessons: ${m.lessons.length}`);
      m.lessons.forEach((l, lIdx) => {
        console.log(`      ${lIdx + 1}. ${l.title} [${l.duration}] -> ${l.videoUrl}`);
      });
      console.log(`    - Quiz: ${m.quiz.title} (${m.quiz.questions.length} questions, passingScore: ${m.quiz.passingScore}%)`);
    });

    await mongoose.disconnect();
    console.log("\nMongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error uploading LPG course:", err);
    process.exit(1);
  }
}

uploadLpgCourse();

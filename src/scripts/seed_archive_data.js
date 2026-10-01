// ael_backend/src/scripts/seed_archive_data.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Archive } from "../models/archive.model.js";

dotenv.config({ path: "./.env" });

const sampleArchives = [
  {
    title: "National Advisory on High-Pressure LPG Cylinder Safe Valve Replacements",
    titleBn: "উচ্চচাপ এলপিজি সিলিন্ডার নিরাপদ ভালভ প্রতিস্থাপন সংক্রান্ত জাতীয় পরামর্শমালা",
    category: "regulatory_circulars",
    referenceNumber: "DOE-CIR-2024-041",
    publishDate: new Date("2024-04-12"),
    summary: "Mandatory DoE safety circular for all licensed LPG operators regarding brass valve testing and scrap protocols.",
    summaryBn: "সকল লাইসেন্সপ্রাপ্ত এলপিজি অপারেটরদের জন্য ব্রাস ভালভ পরীক্ষা ও স্ক্র্যাপ প্রোটোকল সম্পর্কিত বিস্ফোরক পরিদপ্তরের বাধ্যতামূলক নিরাপত্তা সার্কুলার।",
    content: "Official circular issued by Department of Explosives mandating strict adherence to ISO 11118 pressure vessel safety standards.",
    contentBn: "আইএসও ১১১১৮ প্রেশার ভেসেল নিরাপত্তা মান কঠোরভাবে অনুসরণের নির্দেশ দিয়ে বিস্ফোরক অধিদপ্তর কর্তৃক জারি করা সরকারি প্রজ্ঞাপন।",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["DoE", "Circular", "Safety", "Valves"],
    isPublished: true,
  },
  {
    title: "Investigation Report: Mirpur Industrial Plant Incident Review & Remedial Safety Directives",
    titleBn: "তদন্ত প্রতিবেদন: মিরপুর শিল্প কারখানা দুর্ঘটনা পর্যালোচনা ও প্রতিকারমূলক নিরাপত্তা নির্দেশনা",
    category: "incident_news",
    referenceNumber: "AEL-INC-2024-019",
    publishDate: new Date("2024-03-25"),
    summary: "Joint probe committee findings detailing root cause analysis and mandatory installation of automated methane/propane sensors.",
    summaryBn: "যৌথ তদন্ত কমিটির অনুসন্ধান ও মিথেন/প্রোপেন স্বয়ংক্রিয় সেন্সর বাধ্যতামূলক স্থাপনের বিস্তারিত নির্দেশনা।",
    content: "Full incident analysis and preventative recommendations for high-temperature factory manifold installations.",
    contentBn: "উচ্চ-তাপমাত্রা কারখানার ম্যানিফোল্ড স্থাপনের সার্বিক দুর্ঘটনা পর্যালোচনা ও প্রতিরোধমূলক সুপারিশ।",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["Incident", "Investigation", "Sensors"],
    isPublished: true,
  },
  {
    title: "LOAB & Energy Ministry Joint Tripartite Meeting Resolution on Consumer Price Uniformity",
    titleBn: "ভোক্তা পর্যায়ে মূল্য সমতা বজায় রাখা সংক্রান্ত লোয়াব ও জ্বালানি মন্ত্রণালয়ের ত্রিপক্ষীয় সভার সিদ্ধান্ত",
    category: "meeting_updates",
    referenceNumber: "MIN-MTG-2024-88",
    publishDate: new Date("2024-05-02"),
    summary: "Key actionable resolutions from the high-level meeting between LOAB leadership, BERC, and distributor associations.",
    summaryBn: "লোয়াব নেতৃত্ব, বিইআরসি এবং পরিবেশক সমিতির উচ্চপর্যায়ের ত্রিপক্ষীয় বৈঠকের মূল কার্যকর সিদ্ধান্তসমূহ।",
    content: "Minutes of the meeting detailing subsidized freight rates and retail ceiling prices across 64 administrative districts.",
    contentBn: "৬৪টি প্রশাসনিক জেলায় ভর্তুকিযুক্ত পরিবহন হার এবং খুচরা সর্বোচ্চ মূল্যের বিস্তারিত কার্যবিবরণী।",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["Meeting", "BERC", "Pricing", "LOAB"],
    isPublished: true,
  },
  {
    title: "Standard Operating Procedure: Domestic Kitchen LPG Leakage Detection & Emergency Protocol",
    titleBn: "স্ট্যান্ডার্ড অপারেটিং প্রসিডিউর: গৃহস্থালি রান্নাঘরে এলপিজি লিকেজ শনাক্তকরণ ও জরুরি প্রটোকল",
    category: "safety_instructions",
    referenceNumber: "SOP-SAF-2024-007",
    publishDate: new Date("2024-02-18"),
    summary: "Illustrated comprehensive procedural guidelines for housewives, domestic workers, and residential security staff.",
    summaryBn: "গৃহিণী, গৃহকর্মী এবং আবাসিক নিরাপত্তা কর্মীদের জন্য চিত্রিত সমন্বিত পদ্ধতিগত নির্দেশিকা।",
    content: "Comprehensive SOP including step-by-step ventilation protocols, regulator inspection techniques, and emergency hotline contact tree.",
    contentBn: "বায়ুচলাচল প্রোটোকল, রেগুলেটর পরিদর্শন কৌশল এবং জরুরি হটলাইন যোগাযোগ সহ বিশদ এসওপি।",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["Safety", "SOP", "Domestic", "Emergency"],
    isPublished: true,
  },
  {
    title: "Stakeholder Consultation on Regional Cylinder Warehousing and Transport Fire Certification",
    titleBn: "আঞ্চলিক সিলিন্ডার গুদামজাতকরণ এবং পরিবহন অগ্নিনির্বাপণ সার্টিফিকেশন বিষয়ে অংশীজন পরামর্শ",
    category: "stakeholder_updates",
    referenceNumber: "STK-CON-2024-032",
    publishDate: new Date("2024-01-29"),
    summary: "Quarterly consensus report with warehouse owners, freight operators, and Fire Service and Civil Defence (FSCD).",
    summaryBn: "গুদাম মালিক, মালবাহী পরিবহন চালক এবং ফায়ার সার্ভিস ও সিভিল ডিফেন্সের সাথে ত্রৈমাসিক ঐক্যমত প্রতিবেদন।",
    content: "Detailed stakeholder submissions regarding required clearance distances and hydrants for regional LPG storage facilities.",
    contentBn: "আঞ্চলিক এলপিজি স্টোরেজ সুবিধার জন্য প্রয়োজনীয় দূরত্ব এবং হাইড্রেন্ট সংক্রান্ত বিশদ অংশীজন মতামত।",
    documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    tags: ["Stakeholder", "Warehousing", "Fire Safety", "Transport"],
    isPublished: true,
  },
];

async function seedArchives() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ael");
    console.log("Connected to MongoDB for Archive Seeding...");

    for (const item of sampleArchives) {
      await Archive.findOneAndUpdate(
        { referenceNumber: item.referenceNumber },
        item,
        { upsert: true, new: true }
      );
    }

    console.log("Archive data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedArchives();

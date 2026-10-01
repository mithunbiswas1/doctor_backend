// ael_backend/src/scripts/seed_subscription_plans.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { SubscriptionPlan } from "../models/subscriptionPlan.model.js";

dotenv.config();

const INITIAL_PLANS = [
  {
    planKey: "free",
    nameEn: "Free / Newsletter",
    nameBn: "ফ্রি / নিউজলেটার",
    taglineEn: "Essential awareness and basic safety guidelines for all citizens",
    taglineBn: "সকল নাগরিকের জন্য প্রাথমিক সচেতনতা ও নির্দেশিকা",
    durationDays: 0,
    durationLabelEn: "Ongoing",
    durationLabelBn: "আজীবন",
    price: 0,
    originalPrice: 0,
    badgeEn: "Free Forever",
    badgeBn: "সর্বদা ফ্রি",
    featuresEn: [
      "Access to all public Safety Guidelines & FAQs",
      "National Incident registry & inquiry reports viewing",
      "Public blog articles & cylinder maintenance tips",
      "Access to free safety courses",
      "Monthly email newsletter & safety advisories",
    ],
    featuresBn: [
      "সকল সাধারণ নিরাপত্তা নির্দেশিকা ও প্রশ্নোত্তর অ্যাক্সেস",
      "জাতীয় দুর্ঘটনা রেজিস্ট্রি ও তদন্ত রিপোর্ট পরিদর্শন",
      "সাধারণ ব্লগ ও সিলিন্ডার রক্ষণাবেক্ষণ টিপস",
      "ফ্রি নিরাপত্তা কোর্স সমূহে অ্যাক্সেস",
      "মাসিক ইমেইল নিউজলেটার ও জরুরি পরামর্শ",
    ],
    isPopular: false,
    isActive: true,
    order: 1,
  },
  {
    planKey: "monthly",
    nameEn: "Monthly Premium",
    nameBn: "মাসিক প্রিমিয়াম",
    taglineEn: "Complete premium training, official certificates, and circular downloads",
    taglineBn: "সম্পূর্ণ প্রিমিয়াম ট্রেনিং, অফিসিয়াল সার্টিফিকেট ও সার্কুলার ডাউনলোড",
    durationDays: 30,
    durationLabelEn: "30 Days",
    durationLabelBn: "৩০ দিন",
    price: 990,
    originalPrice: 1200,
    badgeEn: "Standard",
    badgeBn: "স্ট্যান্ডার্ড",
    featuresEn: [
      "All features of Free plan",
      "Full free access to all premium certified courses",
      "Verifiable QR-coded digital certificates upon completion",
      "Unrestricted high-resolution PDF circulars & probe downloads",
      "Exclusive premium market telemetry & BERC pricing alerts",
      "Post comments and participate in technical discussions",
    ],
    featuresBn: [
      "ফ্রি প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত",
      "সকল প্রিমিয়াম পেইড কোর্সে সম্পূর্ণ ফ্রি অ্যাক্সেস",
      "কোর্স সমাপনের পর যাচাইযোগ্য কিউআর সার্টিফিকেট",
      "প্রিমিয়াম পিডিএফ সার্কুলার ও তদন্ত রিপোর্ট ডাউনলোড",
      "এক্সক্লুসিভ মার্কেট আপডেট ও বিইআরসি প্রাইসিং বিশ্লেষণ",
      "সকল আর্টিকেলে সরাসরি মন্তব্য ও আলোচনায় অংশগ্রহণ",
    ],
    isPopular: false,
    isActive: true,
    order: 2,
  },
  {
    planKey: "half_yearly",
    nameEn: "Half-Yearly Professional",
    nameBn: "ষাণ্মাসিক প্রফেশনাল",
    taglineEn: "Enhanced training continuity with substantial semi-annual discount",
    taglineBn: "আকর্ষণীয় ছাড়সহ ৬ মাসের ধারাবাহিক প্রফেশনাল প্রশিক্ষণ",
    durationDays: 180,
    durationLabelEn: "180 Days (6 Months)",
    durationLabelBn: "১৮০ দিন (৬ মাস)",
    price: 4990,
    originalPrice: 5940,
    badgeEn: "Best Value",
    badgeBn: "জনপ্রিয় সাশ্রয়ী",
    featuresEn: [
      "All Monthly Premium features included",
      "180 days uninterrupted access to all existing and new courses",
      "Download official regulatory dossiers & inspection forms",
      "Priority customer & technical audit support",
      "Quarterly regulatory compliance digest booklet (Digital)",
    ],
    featuresBn: [
      "মাসিক প্রিমিয়ামের সকল সুযোগ-সুবিধা",
      "১৮০ দিনের নিরবচ্ছিন্ন কোর্স ও সার্টিফিকেট অ্যাক্সেস",
      "অফিসিয়াল ইন্সপেকশন ফরম ও রেগুলেটরি ডসিয়ার ডাউনলোড",
      "অগ্রাধিকার ভিত্তিতে টেকনিক্যাল ও অ্যাকাউন্ট সহায়তা",
      "ত্রৈমাসিক রেগুলেটরি ডাইজেস্ট বুকলেট (ডিজিটাল)",
    ],
    isPopular: true,
    isActive: true,
    order: 3,
  },
  {
    planKey: "yearly",
    nameEn: "Yearly Elite",
    nameBn: "বার্ষিক এলিট",
    taglineEn: "",
    taglineBn: "",
    durationDays: 365,
    durationLabelEn: "365 Days (1 Year)",
    durationLabelBn: "৩৬৫ দিন (১ বছর)",
    price: 8990,
    originalPrice: 11880,
    badgeEn: "Max Savings",
    badgeBn: "সর্বোচ্চ ছাড়",
    featuresEn: [
      "All Half-Yearly features included",
      "Full 365 days VIP access to all masterclasses & certificates",
      "Maximum discount (Over 25% annual savings)",
      "Priority fast-track certificate verification and issuance",
      "Direct consultation hotline with senior safety engineers",
      "Exclusive invitations to annual safety symposiums",
    ],
    featuresBn: [
      "ষাণ্মাসিক প্যাকেজের সকল সুবিধা অন্তর্ভুক্ত",
      "৩৬৫ দিনের জন্য সকল মাস্টারক্লাস ও সার্টিফিকেটে ভিআইপি অ্যাক্সেস",
      "সর্বোচ্চ ২৫%+ বার্ষিক মূল্যে সরাসরি ছাড়",
      "ফাস্ট-ট্র্যাক সার্টিফিকেট যাচাই ও ডাউনলোড সুবিধা",
      "সিনিয়র সেফটি ইঞ্জিনিয়ারদের সাথে ডিরেক্ট হটলাইন পরামর্শ",
      "বার্ষিক নিরাপত্তা সেমিনারে অংশগ্রহণের বিশেষ আমন্ত্রণ",
    ],
    isPopular: false,
    isActive: true,
    order: 4,
  },
  {
    planKey: "professional",
    nameEn: "Dealer / Industry Professional",
    nameBn: "ডিলার / ইন্ডাস্ট্রি প্রফেশনাল",
    taglineEn: "Full enterprise regulatory compliance, bulk data access, and corporate staff licensing",
    taglineBn: "ডিলার ও শিল্পের জন্য পূর্ণাঙ্গ রেগুলেটরি কমপ্লায়েন্স ও প্রাতিষ্ঠানিক লাইসেন্সিং",
    durationDays: 365,
    durationLabelEn: "365 Days (Corporate)",
    durationLabelBn: "৩৬৫ দিন (কর্পোরেট)",
    price: 14990,
    originalPrice: 19990,
    badgeEn: "Enterprise",
    badgeBn: "এন্টারপ্রাইজ",
    featuresEn: [
      "All Yearly Elite features included",
      "Professional DoE & BERC compliance audit modules",
      "Bulk data export & national LPG directory access",
      "Staff safety training portal for up to 5 employees",
      "Commercial dealer authorization display badge",
      "Dedicated corporate relationship manager",
    ],
    featuresBn: [
      "বার্ষিক এলিট প্যাকেজের সকল সুযোগ-সুবিধা",
      "বিস্ফোরক পরিদপ্তর ও বিইআরসি কমপ্লায়েন্স অডিট মডিউল",
      "বাল্ক ডেটা এক্সপোর্ট ও জাতীয় এলপিজি ডিরেক্টরি অ্যাক্সেস",
      "প্রতিষ্ঠানটির ৫ জন কর্মীর জন্য যৌথ ট্রেনিং সুবিধা",
      "বাণিজ্যিক ডিলার অথোরাইজেশন ডিজিটাল ব্যাজ",
      "ডেডিকেটেড কর্পোরেট রিলেশনশিপ ম্যানেজার সহায়তা",
    ],
    isPopular: false,
    isActive: true,
    order: 5,
  },
];

async function seedSubscriptionPlans() {
  try {
    const mongoUri =
      process.env.MONGODB_URL ||
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/ael";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri);

    console.log("Seeding Subscription Plans...");
    for (const plan of INITIAL_PLANS) {
      await SubscriptionPlan.findOneAndUpdate(
        { planKey: plan.planKey },
        { $set: plan },
        { upsert: true, new: true }
      );
      console.log(`✓ Seeded plan: ${plan.nameEn} (৳${plan.price}) [${plan.planKey}]`);
    }

    console.log("✅ All 5 subscription plans seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seedSubscriptionPlans();

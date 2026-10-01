// ael_backend/src/scripts/seed_campaigns_data.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Campaign } from "../models/campaign.model.js";

dotenv.config({ path: "./.env" });

const sampleCampaigns = [
  {
    type: "sms",
    title: "Urgent: Safe Storage Alert for Flood-Affected Districts",
    targetAudience: "dealers",
    messageContent: "সতর্কতা: বন্যা কবলিত এলাকার সকল এলপিজি পরিবেশকদের সিলিন্ডার পানির স্তরের ওপরে নিরাপদ উচ্চতায় রাখার নির্দেশ দেওয়া হচ্ছে। কল ১৬১৩৭।",
    senderId: "SafeLPG-BD",
    recipientCount: 14200,
    characterCount: 118,
    isBanglaUnicode: true,
    status: "completed",
    deliveredCount: 14050,
    operatorBreakdown: { gp: 6800, robi: 4200, banglalink: 2500, teletalk: 550 },
  },
  {
    type: "sms",
    title: "National LPG Price Cap Announcement - May 2024",
    targetAudience: "consumers",
    messageContent: "BERC Notice: Official retail price for 12kg LPG is Tk 1,393 for May. Verify hologram seals before purchasing. Helpline: 16137.",
    senderId: "SafeLPG-BD",
    recipientCount: 88500,
    characterCount: 125,
    isBanglaUnicode: false,
    status: "completed",
    deliveredCount: 87100,
    operatorBreakdown: { gp: 42000, robi: 26000, banglalink: 16000, teletalk: 3100 },
  },
  {
    type: "email",
    title: "Monthly Safety Digest & Mandatory Valve Audit Checklist",
    targetAudience: "dealers",
    subject: "Official Notice: Monthly LPG Safety Digest & Mandatory Dealer Valve Audit",
    messageContent: "Dear Licensed Dealer, Attached is the regulatory safety compliance checklist for Q2. Ensure submission by 25th of this month to avoid licensing penalties.",
    senderId: "audit@safelpg.gov.bd",
    recipientCount: 18500,
    characterCount: 172,
    status: "completed",
    deliveredCount: 18120,
    openedCount: 8240,
    clickedCount: 2950,
  },
  {
    type: "email",
    title: "Invitation: Safe LPG Training Certification Webinar",
    targetAudience: "all_subscribers",
    subject: "Enroll Now: Free Government-Accredited LPG Safety & Handling Certification",
    messageContent: "Welcome to Safe LPG Academy. Start your accredited course online today and earn your verified digital certificate with QR verification.",
    senderId: "academy@safelpg.gov.bd",
    recipientCount: 12400,
    characterCount: 160,
    status: "completed",
    deliveredCount: 12150,
    openedCount: 6100,
    clickedCount: 2150,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ael");
    console.log("Connected to MongoDB for Campaign Seeding...");

    for (const item of sampleCampaigns) {
      await Campaign.findOneAndUpdate({ title: item.title }, item, {
        upsert: true,
        new: true,
      });
    }

    console.log("Campaigns seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();

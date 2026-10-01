// ael_backend/src/scripts/seed_subscriptions_data.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Subscription } from "../models/subscription.model.js";

dotenv.config({ path: "./.env" });

const sampleSubscriptions = [
  {
    transactionId: "TXN-SSL-1716209482-101",
    plan: "dealer",
    planName: "Licensed Dealer",
    billingCycle: "yearly",
    amount: 7990,
    vat: 399,
    grandTotal: 8389,
    paymentMethod: "sslcommerz",
    paymentGateway: "SSLCommerz Bangladesh",
    status: "paid",
    startDate: new Date("2024-05-15"),
    expiryDate: new Date("2025-05-15"),
    customerDetails: {
      fullName: "Md. Aminul Islam",
      phone: "01711223344",
      email: "aminul@meghnalpg.com",
      companyName: "Meghna LPG Distribution",
    },
    bankTranId: "EBL-TRAN-982143",
    cardType: "VISA-EBL (Credit Card)",
  },
  {
    transactionId: "TXN-SSL-1716301140-102",
    plan: "consumer",
    planName: "Household Plus",
    billingCycle: "yearly",
    amount: 1990,
    vat: 100,
    grandTotal: 2090,
    paymentMethod: "bkash",
    paymentGateway: "SSLCommerz Bangladesh",
    status: "paid",
    startDate: new Date("2024-05-18"),
    expiryDate: new Date("2025-05-18"),
    customerDetails: {
      fullName: "Fatema Tuz Zohra",
      phone: "01819876543",
      email: "fatema.zohra@gmail.com",
      companyName: "Uttara Residential",
    },
    bankTranId: "BKASH-998822",
    cardType: "bKash Tokenized Wallet",
  },
  {
    transactionId: "TXN-SSL-1716418820-103",
    plan: "enterprise",
    planName: "Industrial Enterprise",
    billingCycle: "yearly",
    amount: 24990,
    vat: 1250,
    grandTotal: 26240,
    paymentMethod: "card",
    paymentGateway: "SSLCommerz Bangladesh",
    status: "paid",
    startDate: new Date("2024-05-01"),
    expiryDate: new Date("2025-05-01"),
    customerDetails: {
      fullName: "Engr. Kazi Tariqul",
      phone: "01912345678",
      email: "tariqul@apex-fabrics.com",
      companyName: "Apex Fabrics & Industrial Complex",
    },
    bankTranId: "SCB-CORP-443322",
    cardType: "Mastercard Corporate",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ael");
    console.log("Connected to MongoDB for Subscriptions Seeding...");

    for (const item of sampleSubscriptions) {
      await Subscription.findOneAndUpdate(
        { transactionId: item.transactionId },
        item,
        { upsert: true, new: true }
      );
    }

    console.log("Subscriptions seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();

// ael_backend/src/models/subscription.model.js
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      required: true,
      enum: ["consumer", "dealer", "enterprise", "course_single"],
      default: "dealer",
    },
    planName: {
      type: String,
      default: "Licensed Dealer",
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "half_yearly", "yearly", "one_time"],
      default: "yearly",
    },
    amount: {
      type: Number,
      required: true,
    },
    vat: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["sslcommerz", "bkash", "nagad", "card", "bank_transfer"],
      default: "sslcommerz",
    },
    paymentGateway: {
      type: String,
      default: "SSLCommerz Bangladesh",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"],
      default: "paid",
      index: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    customerDetails: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      companyName: { type: String },
    },
    bankTranId: {
      type: String,
      default: "",
    },
    cardType: {
      type: String,
      default: "VISA-EBL / bKash",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);

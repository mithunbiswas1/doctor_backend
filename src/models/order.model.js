// src/models/order.model.js

import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      trim: true,
      // Remove required: true since we generate it in pre-save
    },
    customer: {
      firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    },
    deliveryAddress: {
      addressLine1: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
      },
      addressLine2: {
        type: String,
        trim: true,
        default: "",
      },
      zipCode: {
        type: String,
        required: [true, "ZIP code is required"],
        trim: true,
      },
      deliveryInstructions: {
        type: String,
        trim: true,
        default: "",
      },
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountedPrice: {
          type: Number,
          default: null,
        },
        variationName: {
          type: String,
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderType: {
      type: String,
      enum: ["cart", "buy_now"],
      default: "cart",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${year}${month}${day}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ "customer.email": 1 });
orderSchema.index({ "customer.phone": 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Static methods
orderSchema.statics.getOrdersByUser = function (userId) {
  return this.find({ createdBy: userId }).sort({ createdAt: -1 });
};

orderSchema.statics.getOrdersByStatus = function (status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

export const Order = mongoose.model("Order", orderSchema);

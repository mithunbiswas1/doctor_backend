// src/models/item.model.js

import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    sections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    short_description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    image: {
      type: String,
      default: "default-item.png",
    },
    gallery: {
      type: [String],
      default: [],
    },
    is_veg: {
      type: Boolean,
      default: false,
    },
    is_spicy: {
      type: Boolean,
      default: false,
    },
    preparation_time: {
      type: Number,
      default: 15,
    },
    is_available: {
      type: Boolean,
      default: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Variations (price is now only in variations)
    variations: [
      {
        variation_name: {
          type: String,
          required: true,
        },
        variation_regular_price: {
          type: Number,
          required: true,
          min: 0,
        },
        variation_offer_price: {
          type: Number,
          min: 0,
          default: null,
        },
      },
    ],
    // Features
    features: {
      type: [String],
      default: [],
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

// Pre-save middleware to generate slug
itemSchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Generate SKU if not provided
  if (!this.sku) {
    const prefix = this.category ? await this.getCategoryPrefix() : "ITEM";
    const count = await mongoose.model("Item").countDocuments();
    this.sku = `${prefix}-${String(count + 1).padStart(4, "0")}`;
  }

  next();
});

// Method to get category prefix
itemSchema.methods.getCategoryPrefix = async function () {
  if (!this.category) return "ITEM";
  const category = await mongoose.model("Category").findById(this.category);
  return category ? category.name.substring(0, 4).toUpperCase() : "ITEM";
};

// Virtual for min price (from variations)
itemSchema.virtual("min_price").get(function () {
  if (!this.variations || this.variations.length === 0) return 0;

  let minPrice = Infinity;
  for (const variation of this.variations) {
    const price =
      variation.variation_offer_price !== null &&
      variation.variation_offer_price !== undefined
        ? variation.variation_offer_price
        : variation.variation_regular_price;
    if (price < minPrice) {
      minPrice = price;
    }
  }
  return minPrice === Infinity ? 0 : minPrice;
});

// Virtual for max price (from variations)
itemSchema.virtual("max_price").get(function () {
  if (!this.variations || this.variations.length === 0) return 0;

  let maxPrice = -Infinity;
  for (const variation of this.variations) {
    const price =
      variation.variation_offer_price !== null &&
      variation.variation_offer_price !== undefined
        ? variation.variation_offer_price
        : variation.variation_regular_price;
    if (price > maxPrice) {
      maxPrice = price;
    }
  }
  return maxPrice === -Infinity ? 0 : maxPrice;
});

// Indexes
itemSchema.index({ name: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ sections: 1 });
itemSchema.index({ is_active: 1 });
itemSchema.index({ is_available: 1 });
itemSchema.index({ "variations.variation_regular_price": 1 });
itemSchema.index({ "variations.variation_offer_price": 1 });

// Static methods
itemSchema.statics.getActiveItems = function () {
  return this.find({ is_active: true }).sort({ createdAt: -1 });
};

itemSchema.statics.getItemsByCategory = function (categoryId) {
  return this.find({ category: categoryId, is_active: true }).sort({
    createdAt: -1,
  });
};

itemSchema.statics.getItemsBySection = function (sectionId) {
  return this.find({ sections: sectionId, is_active: true }).sort({
    createdAt: -1,
  });
};

// Instance methods
itemSchema.methods.deactivate = function () {
  this.is_active = false;
  return this.save();
};

itemSchema.methods.activate = function () {
  this.is_active = true;
  return this.save();
};

// Ensure virtuals are included in JSON output
itemSchema.set("toJSON", { virtuals: true });
itemSchema.set("toObject", { virtuals: true });

export const Item = mongoose.model("Item", itemSchema);

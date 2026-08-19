import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    short_description: {
      type: String,
      required: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    thumbnail: {
      type: String,
      default: "default-thumbnail.png",
    },
    banner: {
      type: String,
      default: "default-banner.png",
    },
    gallery: {
      type: [String],
      default: [],
    },
    meta_title: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    meta_description: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    seo_keyword: {
      type: String,
      trim: true,
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    post_date: {
      type: String,
      default: "",
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    published_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate slug if not provided
projectSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Generate meta fields if not provided
  if (!this.meta_title) {
    this.meta_title = this.title;
  }
  if (!this.meta_description) {
    this.meta_description = this.short_description;
  }

  next();
});

// Indexes for better performance
projectSchema.index({ title: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ is_active: 1 });
projectSchema.index({ published_at: -1 });
projectSchema.index({ technologies: 1 });

// Static method to get active projects
projectSchema.statics.getActiveProjects = function () {
  return this.find({ is_active: true }).sort({ published_at: -1 });
};

// Instance method to deactivate project
projectSchema.methods.deactivate = function () {
  this.is_active = false;
  return this.save();
};

// Instance method to activate project
projectSchema.methods.activate = function () {
  this.is_active = true;
  return this.save();
};

// Method to increment views
projectSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

export const Project = mongoose.model("Project", projectSchema);

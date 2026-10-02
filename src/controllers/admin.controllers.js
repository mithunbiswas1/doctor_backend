// src/controllers/admin.controllers.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Course } from "../models/course.model.js";
import { Blog } from "../models/blog.model.js";
import { Setting } from "../models/setting.model.js";
import { Campaign } from "../models/campaign.model.js";
import { Certificate } from "../models/certificate.model.js";
import { ContactMessage } from "../models/contactMessage.model.js";

/**
 * Admin: Get live overview stats and chart analytics for dashboard (100% Real Dynamic Data)
 */
export const getDashboardOverviewStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Core metric counters directly from MongoDB
  const [
    totalUsers,
    activeSubscribers,
    totalCourses,
    totalBlogs,
    totalCampaigns,
    totalCertificates,
    totalMessages,
  ] = await Promise.all([
    User.countDocuments(),
    Subscription.countDocuments({
      status: { $in: ["paid", "active"] },
    }),
    Course.countDocuments(),
    Blog.countDocuments(),
    Campaign.countDocuments(),
    Certificate.countDocuments(),
    ContactMessage.countDocuments(),
  ]);

  // 2. Real Revenue Calculation from Subscriptions
  const revenueAggregation = await Subscription.aggregate([
    { $match: { status: "paid" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        monthlyRevenue: {
          $sum: {
            $cond: [
              { $gte: [{ $ifNull: ["$createdAt", "$startDate"] }, startOfMonth] },
              "$amount",
              0,
            ],
          },
        },
        todayRevenue: {
          $sum: {
            $cond: [
              { $gte: [{ $ifNull: ["$createdAt", "$startDate"] }, startOfToday] },
              "$amount",
              0,
            ],
          },
        },
      },
    },
  ]);

  const revenueStats = revenueAggregation[0] || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
  };

  // 3. Real new registrations today
  const newRegistrationsToday = await User.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  // 4. Real recent transactions from DB
  const recentTransactions = await Subscription.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();

  // 5. Top real courses by enrollment
  const topCourses = await Course.find()
    .select("title titleBn price enrolledStudents rating totalLessons thumbnail")
    .sort({ enrolledStudents: -1, createdAt: -1 })
    .limit(5)
    .lean();

  // 6. Dynamic 6-month historical growth calculated dynamically from DB
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyGrowth = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthLabel = monthNames[d.getMonth()];

    // Count real users created in this month
    const userCount = await User.countDocuments({
      createdAt: { $gte: d, $lt: nextD },
    });

    // Sum real revenue in this month
    const revAgg = await Subscription.aggregate([
      {
        $match: {
          status: "paid",
          $expr: {
            $and: [
              { $gte: [{ $ifNull: ["$createdAt", "$startDate"] }, d] },
              { $lt: [{ $ifNull: ["$createdAt", "$startDate"] }, nextD] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    monthlyGrowth.push({
      month: monthLabel,
      users: userCount,
      revenue: revAgg[0]?.total || 0,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        counters: {
          totalUsers,
          activeSubscribers,
          totalCourses,
          totalBlogs,
          totalCampaigns,
          totalCertificates,
          totalMessages,
          newRegistrationsToday,
          totalRevenue: revenueStats.totalRevenue,
          monthlyRevenue: revenueStats.monthlyRevenue,
          todayRevenue: revenueStats.todayRevenue,
        },
        recentTransactions,
        topCourses,
        monthlyGrowth,
      },
      "Admin dashboard stats retrieved successfully"
    )
  );
});

/**
 * Public: Get public website settings
 */
export const getPublicSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne({ key: "general_settings" });
  if (!settings) {
    settings = await Setting.create({ key: "general_settings" });
  }

  // Strip sensitive credentials for public view
  const publicData = {
    siteName: settings.siteName,
    tagline: settings.tagline,
    siteLogo: settings.siteLogo,
    footerLogo: settings.footerLogo,
    favicon: settings.favicon,
    copyrightText: settings.copyrightText,
    footerAbout: settings.footerAbout,
    siteEmail: settings.siteEmail,
    sitePhone: settings.sitePhone,
    hotlineLabel: settings.hotlineLabel,
    emergencyPhone: settings.emergencyPhone,
    whatsappNumber: settings.whatsappNumber,
    address: settings.address,
    workingHours: settings.workingHours,
    mapEmbedUrl: settings.mapEmbedUrl,
    facebookUrl: settings.facebookUrl,
    twitterUrl: settings.twitterUrl,
    linkedinUrl: settings.linkedinUrl,
    youtubeUrl: settings.youtubeUrl,
    instagramUrl: settings.instagramUrl,
    topbarEnabled: settings.topbarEnabled,
    topbarAnnouncement: settings.topbarAnnouncement,
    topbarAnnouncementUrl: settings.topbarAnnouncementUrl,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
    seoKeywords: settings.seoKeywords,
    metaAuthor: settings.metaAuthor,
    maintenanceMode: settings.maintenanceMode,
    maintenanceNotice: settings.maintenanceNotice,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, publicData, "Public settings retrieved successfully"));
});

/**
 * Admin: Get system settings (All configuration fields)
 */
export const getSystemSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne({ key: "general_settings" });
  if (!settings) {
    settings = await Setting.create({ key: "general_settings" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings retrieved successfully"));
});

/**
 * Admin: Update system settings (Supports JSON or multipart/form-data with logo uploads)
 */
export const updateSystemSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne({ key: "general_settings" });
  if (!settings) {
    settings = await Setting.create({ key: "general_settings" });
  }

  // Handle uploaded images if any
  if (req.files) {
    if (req.files.siteLogo && req.files.siteLogo[0]) {
      settings.siteLogo = `/public/upload/${req.files.siteLogo[0].filename}`;
    }
    if (req.files.footerLogo && req.files.footerLogo[0]) {
      settings.footerLogo = `/public/upload/${req.files.footerLogo[0].filename}`;
    }
    if (req.files.favicon && req.files.favicon[0]) {
      settings.favicon = `/public/upload/${req.files.favicon[0].filename}`;
    }
  }

  const stringFields = [
    "siteName",
    "tagline",
    "siteLogo",
    "footerLogo",
    "favicon",
    "copyrightText",
    "footerAbout",
    "siteEmail",
    "sitePhone",
    "hotlineLabel",
    "emergencyPhone",
    "whatsappNumber",
    "address",
    "workingHours",
    "mapEmbedUrl",
    "facebookUrl",
    "twitterUrl",
    "linkedinUrl",
    "youtubeUrl",
    "instagramUrl",
    "topbarAnnouncement",
    "topbarAnnouncementUrl",
    "seoTitle",
    "seoDescription",
    "seoKeywords",
    "metaAuthor",
    "maintenanceNotice",
    "smsSenderId",
    "smsProvider",
    "smsApiKey",
    "smtpFromName",
    "smtpFromEmail",
    "smtpHost",
    "smtpPort",
  ];

  for (const field of stringFields) {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  }

  const booleanFields = ["topbarEnabled", "maintenanceMode"];
  for (const field of booleanFields) {
    if (req.body[field] !== undefined) {
      settings[field] =
        req.body[field] === true || req.body[field] === "true" || req.body[field] === 1;
    }
  }

  await settings.save();

  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings updated successfully"));
});

/**
 * Admin: Analytics and Reports Export Data
 */
export const getAnalyticsReports = asyncHandler(async (req, res) => {
  const { type = "all", timeRange = "all" } = req.query;

  const [users, transactions, campaigns, courses] = await Promise.all([
    User.find().select("fullName userName email phone role createdAt").lean(),
    Subscription.find().sort({ createdAt: -1 }).lean(),
    Campaign.find().sort({ createdAt: -1 }).lean(),
    Course.find().select("title price enrolledStudents rating").lean(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        transactions,
        campaigns,
        courses,
        summary: {
          totalUsersCount: users.length,
          totalTransactionsCount: transactions.length,
          totalCampaignsCount: campaigns.length,
          totalCoursesCount: courses.length,
        },
      },
      "Analytics report data retrieved successfully"
    )
  );
});

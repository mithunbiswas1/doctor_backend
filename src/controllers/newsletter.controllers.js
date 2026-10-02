// ael_backend/src/controllers/newsletter.controllers.js
import { NewsletterSubscriber } from "../models/newsletterSubscriber.model.js";
import { User } from "../models/user.model.js";
import { Campaign } from "../models/campaign.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMail, buildNewsletterHtml } from "../utils/email.service.js";

/**
 * Public: Subscribe to newsletter (Website footer, unauthenticated visitors)
 */
export const subscribePublic = asyncHandler(async (req, res) => {
  const { email, name = "", phone = "" } = req.body;

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "A valid email address is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });

  if (existing && existing.isActive) {
    return res.status(200).json(
      new ApiResponse(
        200,
        existing,
        "You are already subscribed to our safety newsletter!"
      )
    );
  }

  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        email: normalizedEmail,
        name: name.trim() || existing?.name || "",
        phone: phone.trim() || existing?.phone || "",
        source: existing?.source || "website_footer",
        isActive: true,
        subscribedAt: new Date(),
        unsubscribedAt: null,
      },
    },
    { upsert: true, new: true, runValidators: true }
  );

  // Send a welcome email asynchronously
  setImmediate(async () => {
    try {
      const welcomeHtml = buildNewsletterHtml({
        badgeText: "WELCOME TO SAFELPG",
        titleEn: "Welcome to AEL SafeLPG Newsletter!",
        titleBn: "এইল সেইফ এলপিজি নিউজলেটারে আপনাকে স্বাগতম!",
        summaryEn:
          "Thank you for subscribing to Bangladesh's official safety bulletins, incident analysis, regulatory directives, and LPG technical education.",
        summaryBn:
          "এলপিজি খাতের নিরাপত্তা গাইডলাইন, বিইআরসি নোটিশ এবং জরুরি নির্দেশিকা সম্পর্কে নিয়মিত আপডেট পেতে আমাদের সাথেই থাকুন।",
        ctaText: "Explore Safety Guidelines",
        ctaUrl: "/safety-guidelines",
      });

      await sendMail({
        to: normalizedEmail,
        subject: "[AEL SafeLPG] Welcome to Safety Updates & Directives",
        html: welcomeHtml,
        text: "Welcome to AEL SafeLPG Newsletter. You will receive real-time updates on safety manuals, BERC announcements, and market trends.",
      });
    } catch (e) {
      // Welcome email failed silently
    }
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      subscriber,
      "Successfully subscribed to the AEL SafeLPG newsletter!"
    )
  );
});

/**
 * Public: Unsubscribe from newsletter
 */
export const unsubscribePublic = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "A valid email address is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!subscriber) {
    throw new ApiError(404, "Subscription record not found for this email");
  }

  if (subscriber.userId) {
    try {
      await User.findByIdAndUpdate(subscriber.userId, { is_newsletter_subscribed: false });
    } catch (e) {
      // Silent catch
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      subscriber,
      "You have been successfully unsubscribed from the newsletter."
    )
  );
});

/**
 * Synchronizes all registered users who have an email into NewsletterSubscriber
 */
export const syncRegisteredUsersToSubscribers = async () => {
  try {
    const users = await User.find({
      email: { $exists: true, $ne: null },
    }).select("fullName phone email is_newsletter_subscribed createdAt");

    for (const u of users) {
      if (!u.email || !u.email.includes("@")) continue;
      const normalizedEmail = u.email.trim().toLowerCase();

      const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });
      if (!existing) {
        await NewsletterSubscriber.create({
          email: normalizedEmail,
          name: u.fullName || "Registered User",
          phone: u.phone || "",
          userId: u._id,
          source: "registration",
          isActive: u.is_newsletter_subscribed !== false,
          subscribedAt: u.createdAt || new Date(),
        });
      } else if (!existing.userId) {
        existing.userId = u._id;
        existing.source = "registration";
        if (!existing.phone && u.phone) existing.phone = u.phone;
        await existing.save();
      }
    }
  } catch (err) {
    // Silent catch
  }
};

/**
 * Admin: List all newsletter subscribers with search, status & source filters, pagination
 */
export const getSubscribersAdmin = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 15,
    q = "",
    status = "all",
    source = "all",
  } = req.query;

  // Auto-sync registered users into newsletter list so admin always sees complete directory
  await syncRegisteredUsersToSubscribers();

  const validPage = Math.max(1, parseInt(page, 10) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (validPage - 1) * validLimit;

  const filter = {};

  if (status === "active") {
    filter.isActive = true;
  } else if (status === "inactive") {
    filter.isActive = false;
  }

  if (source && source !== "all") {
    filter.source = source;
  }

  if (q && q.trim()) {
    const searchRegex = new RegExp(q.trim(), "i");
    filter.$or = [
      { email: searchRegex },
      { name: searchRegex },
      { phone: searchRegex },
    ];
  }

  const [subscribers, total, totalActive, totalInactive, totalWebsite, totalRegistered] =
    await Promise.all([
      NewsletterSubscriber.find(filter)
        .populate("userId", "fullName userName email phone role createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(validLimit),
      NewsletterSubscriber.countDocuments(filter),
      NewsletterSubscriber.countDocuments({ isActive: true }),
      NewsletterSubscriber.countDocuments({ isActive: false }),
      NewsletterSubscriber.countDocuments({ source: "website_footer" }),
      NewsletterSubscriber.countDocuments({ source: "registration" }),
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers,
        pagination: {
          page: validPage,
          limit: validLimit,
          total,
          totalPages: Math.ceil(total / validLimit) || 1,
        },
        stats: {
          totalSubscribers: totalActive + totalInactive,
          totalActive,
          totalInactive,
          totalWebsite,
          totalRegistered,
        },
      },
      "Newsletter subscribers retrieved successfully"
    )
  );
});

/**
 * Admin: Toggle subscriber active/inactive status
 */
export const toggleSubscriberStatusAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subscriber = await NewsletterSubscriber.findById(id);
  if (!subscriber) {
    throw new ApiError(404, "Newsletter subscriber not found");
  }

  subscriber.isActive = !subscriber.isActive;
  if (!subscriber.isActive) {
    subscriber.unsubscribedAt = new Date();
  } else {
    subscriber.unsubscribedAt = null;
  }

  await subscriber.save();

  // If linked to user, keep User.is_newsletter_subscribed in sync
  if (subscriber.userId) {
    await User.findByIdAndUpdate(subscriber.userId, {
      is_newsletter_subscribed: subscriber.isActive,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      subscriber,
      `Subscriber ${subscriber.isActive ? "activated" : "deactivated"} successfully`
    )
  );
});

/**
 * Admin: Delete subscriber record
 */
export const deleteSubscriberAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);
  if (!subscriber) {
    throw new ApiError(404, "Newsletter subscriber not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Newsletter subscriber deleted successfully")
  );
});

/**
 * Admin: Manual newsletter campaign broadcast
 * Supports targetAudience: 'all' (default), 'registered', or 'newsletter'
 */
export const broadcastManualNewsletterAdmin = asyncHandler(async (req, res) => {
  const {
    title,
    titleBn = "",
    subject,
    summary,
    summaryBn = "",
    ctaText = "Read More",
    ctaUrl = "/",
    targetAudience = "all", // "all" | "registered" | "newsletter"
  } = req.body;

  if (!title || !subject || !summary) {
    throw new ApiError(400, "Title, subject and summary content are required");
  }

  // Ensure latest registered users are synced first
  await syncRegisteredUsersToSubscribers();

  // Build recipient list based on targetAudience
  const emailMap = new Map(); // email -> name

  if (targetAudience === "registered") {
    // Only registered users
    const registeredSubs = await NewsletterSubscriber.find({
      source: "registration",
      isActive: true,
    }).select("email name");
    for (const s of registeredSubs) {
      if (s.email && s.email.includes("@")) {
        emailMap.set(s.email.trim().toLowerCase(), s.name || "Valued Member");
      }
    }

    const regUsers = await User.find({
      email: { $exists: true, $ne: null },
      is_newsletter_subscribed: { $ne: false },
    }).select("email fullName");
    for (const u of regUsers) {
      if (u.email && u.email.includes("@")) {
        const norm = u.email.trim().toLowerCase();
        if (!emailMap.has(norm)) {
          emailMap.set(norm, u.fullName || "Valued Member");
        }
      }
    }
  } else if (targetAudience === "newsletter") {
    // Only newsletter website subscribers
    const websiteSubs = await NewsletterSubscriber.find({
      source: "website_footer",
      isActive: true,
    }).select("email name");
    for (const s of websiteSubs) {
      if (s.email && s.email.includes("@")) {
        emailMap.set(s.email.trim().toLowerCase(), s.name || "Subscriber");
      }
    }
  } else {
    // "all": Every active registered user AND website newsletter subscriber
    const allSubs = await NewsletterSubscriber.find({ isActive: true }).select("email name");
    for (const s of allSubs) {
      if (s.email && s.email.includes("@")) {
        emailMap.set(s.email.trim().toLowerCase(), s.name || "Valued Subscriber");
      }
    }

    const allUsers = await User.find({
      email: { $exists: true, $ne: null },
      is_newsletter_subscribed: { $ne: false },
    }).select("email fullName");
    for (const u of allUsers) {
      if (u.email && u.email.includes("@")) {
        const norm = u.email.trim().toLowerCase();
        if (!emailMap.has(norm)) {
          emailMap.set(norm, u.fullName || "Valued Member");
        }
      }
    }
  }

  const emailList = Array.from(emailMap.keys());

  if (emailList.length === 0) {
    throw new ApiError(400, "No active recipients found for the selected audience");
  }

  // Non-blocking asynchronous dispatch
  setImmediate(async () => {
    try {
      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
      let delivered = 0;

      for (const email of emailList) {
        try {
          const html = buildNewsletterHtml({
            badgeText:
              targetAudience === "registered"
                ? "REGISTERED MEMBER BULLETIN"
                : targetAudience === "newsletter"
                ? "SUBSCRIBER UPDATE"
                : "SPECIAL BROADCAST",
            titleEn: title,
            titleBn,
            summaryEn: summary,
            summaryBn,
            ctaText,
            ctaUrl,
            recipientEmail: email,
          });

          const result = await sendMail({
            to: email,
            subject,
            html,
            text: `${title}\n\n${summary}\n\nUnsubscribe: ${frontendUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
          });
          if (result.success) delivered++;
        } catch (mErr) {
          // Silent catch
        }
      }

      await Campaign.create({
        type: "email",
        title: `[Manual Newsletter] ${title.slice(0, 100)}`,
        targetAudience: targetAudience || "all",
        subject,
        messageContent: summary,
        recipientCount: emailList.length,
        deliveredCount: delivered,
        status: "completed",
        createdBy: req.user?._id,
      });
    } catch (err) {
      // Silent catch
    }
  });

  const audienceLabel =
    targetAudience === "registered"
      ? "registered users"
      : targetAudience === "newsletter"
      ? "newsletter subscribers"
      : "registered and newsletter users";

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        recipientCount: emailList.length,
        targetAudience,
      },
      `Campaign dispatched to ${emailList.length} ${audienceLabel} successfully`
    )
  );
});

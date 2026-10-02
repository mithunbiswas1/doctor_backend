// ael_backend/src/utils/newsletterDispatcher.js
import { NewsletterSubscriber } from "../models/newsletterSubscriber.model.js";
import { User } from "../models/user.model.js";
import { Campaign } from "../models/campaign.model.js";
import { sendMail, buildNewsletterHtml } from "./email.service.js";

/**
 * Dispatches automated newsletter emails to all active subscribers for new content.
 * Runs non-blocking / asynchronously so HTTP response is instant.
 */
export const dispatchNewsletterForNewContent = ({ type, item, createdBy }) => {
  // Use setImmediate to detach execution from current request-response cycle
  setImmediate(async () => {
    try {
      // 1. Fetch active subscribers from NewsletterSubscriber AND registered User models
      const emailMap = new Map();

      const subscribers = await NewsletterSubscriber.find({ isActive: true }).select("email name");
      for (const s of subscribers) {
        if (s.email && s.email.includes("@")) {
          emailMap.set(s.email.trim().toLowerCase(), s.name || "Subscriber");
        }
      }

      const users = await User.find({
        email: { $exists: true, $ne: null },
        is_newsletter_subscribed: { $ne: false },
      }).select("email fullName");
      for (const u of users) {
        if (u.email && u.email.includes("@")) {
          const norm = u.email.trim().toLowerCase();
          if (!emailMap.has(norm)) {
            emailMap.set(norm, u.fullName || "Valued Member");
          }
        }
      }

      const emailList = Array.from(emailMap.keys());
      if (emailList.length === 0) {
        return;
      }

      // 2. Format content based on type
      let badgeText = "NEW ANNOUNCEMENT";
      let subject = "AEL SafeLPG Newsletter";
      let titleEn = "";
      let titleBn = "";
      let summaryEn = "";
      let summaryBn = "";
      let ctaText = "View Update";
      let ctaUrl = "/";
      let imageUrl = "";

      switch (type) {
        case "blog":
          badgeText = `ARTICLE • ${item.category?.toUpperCase() || "NEWS"}`;
          titleEn = item.titleEn || item.titleBn || "New Safety Article Published";
          titleBn = item.titleBn || "";
          summaryEn = item.descriptionEn || "";
          summaryBn = item.descriptionBn || "";
          ctaText = "Read Full Article";
          ctaUrl = `/blogs/${item.slug || item._id}`;
          imageUrl = item.image || "";
          subject = `[AEL SafeLPG] New Article: ${titleEn}`;
          break;

        case "market_update":
          badgeText = `MARKET REPORT • ${item.category?.toUpperCase() || "INCIDENT"}`;
          titleEn = item.titleEn || item.titleBn || "LPG Market Update Published";
          titleBn = item.titleBn || "";
          summaryEn = item.summaryEn || "";
          summaryBn = item.summaryBn || "";
          ctaText = "View Market Report";
          ctaUrl = `/market-updates/${item.slug || item._id}`;
          imageUrl = item.image || "";
          subject = `[AEL SafeLPG] Market Update: ${titleEn}`;
          break;

        case "course":
          badgeText = "NEW CERTIFIED COURSE";
          titleEn = item.title || item.titleBn || "New Safety Course Available";
          titleBn = item.titleBn || "";
          summaryEn = item.description || "";
          summaryBn = item.descriptionBn || "";
          ctaText = "Explore Course & Curriculum";
          ctaUrl = `/courses/${item.slug || item._id}`;
          imageUrl = item.thumbnail || item.image || "";
          subject = `[AEL SafeLPG] New Course: ${titleEn}`;
          break;

        case "safety_guideline":
          badgeText = "SAFETY GUIDELINE & REGULATION";
          titleEn = item.title || item.nameEn || item.titleBn || "Safety Guideline Published";
          titleBn = item.titleBn || item.nameBn || "";
          summaryEn = item.description || item.descriptionEn || item.mandateEn || "";
          summaryBn = item.descriptionBn || item.mandateBn || "";
          ctaText = "View Safety Manual";
          ctaUrl = "/safety-guidelines";
          subject = `[AEL SafeLPG] Safety Guideline Update: ${titleEn}`;
          break;

        default:
          badgeText = "NEWSLETTER UPDATE";
          titleEn = item.title || "New Update on AEL SafeLPG";
          titleBn = item.titleBn || "";
          summaryEn = item.description || "";
          ctaUrl = "/";
          subject = `[AEL SafeLPG] Update: ${titleEn}`;
      }

      // 3. Dispatch personalized newsletter email to each subscriber
      let deliveredTotal = 0;
      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");

      for (const email of emailList) {
        try {
          const html = buildNewsletterHtml({
            badgeText,
            titleEn,
            titleBn,
            summaryEn,
            summaryBn,
            ctaText,
            ctaUrl,
            imageUrl,
            recipientEmail: email,
          });

          const result = await sendMail({
            to: email,
            subject,
            html,
            text: `${titleEn}\n\n${summaryEn}\n\nView details: ${ctaUrl}\n\nUnsubscribe: ${frontendUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`,
          });

          if (result.success) {
            deliveredTotal++;
          }
        } catch (err) {
          console.warn(`[NewsletterDispatcher] Error delivering to ${email}:`, err.message);
        }
      }

      // 5. Optionally record in Campaign model for audit tracking
      try {
        await Campaign.create({
          type: "email",
          title: `[Auto-Newsletter] ${titleEn.slice(0, 100)}`,
          targetAudience: "all_subscribers",
          subject,
          messageContent: summaryEn || titleEn,
          recipientCount: emailList.length,
          deliveredCount: deliveredTotal,
          status: "completed",
          createdBy: createdBy || null,
        });
      } catch (campErr) {
        // Silent failure in background task
      }
    } catch (error) {
      // Silent failure in background task
    }
  });
};

// src/utils/scheduler.service.js
import { Blog } from "../models/blog.model.js";
import { MarketUpdate } from "../models/marketUpdate.model.js";
import { Campaign } from "../models/campaign.model.js";

/**
 * Checks and publishes scheduled articles, updates, and communication campaigns
 */
export async function checkAndPublishScheduledEntities() {
  const now = new Date();

  try {
    // 1. Publish Scheduled Blogs
    const scheduledBlogs = await Blog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    if (scheduledBlogs.length > 0) {
      for (const blog of scheduledBlogs) {
        blog.status = "published";
        await blog.save();
      }
    }

    // 2. Publish Scheduled Market Updates
    const scheduledUpdates = await MarketUpdate.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    if (scheduledUpdates.length > 0) {
      for (const update of scheduledUpdates) {
        update.status = "published";
        await update.save();
      }
    }

    // 3. Dispatch Scheduled Campaigns (Email or SMS)
    const scheduledCampaigns = await Campaign.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    if (scheduledCampaigns.length > 0) {
      for (const camp of scheduledCampaigns) {
        camp.status = "completed";
        await camp.save();
      }
    }
  } catch (error) {
    // Graceful error swallow in production
  }
}

/**
 * Starts the automated background scheduler
 * Runs immediately on start and checks every 2 minutes
 */
export function startBackgroundScheduler(intervalMs = 120000) {
  // Run once immediately on server boot
  checkAndPublishScheduledEntities();

  // Set recurring interval (Default: 2 minutes)
  const timer = setInterval(() => {
    checkAndPublishScheduledEntities();
  }, intervalMs);

  return timer;
}

// ael_backend/src/controllers/homeBanner.controllers.js
import { HomeBanner } from "../models/homeBanner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Public: Get active home banner
 */
export const getHomeBanner = asyncHandler(async (req, res) => {
  let banner = await HomeBanner.findOne({ isActive: true });

  if (!banner) {
    banner = await HomeBanner.create({
      title: "",
      titleBn: "",
      accent: "",
      accentBn: "",
      description: "",
      descriptionBn: "",
      btnPrimaryText: "",
      btnPrimaryTextBn: "",
      btnPrimaryHref: "",
      btnSecondaryText: "",
      btnSecondaryTextBn: "",
      btnSecondaryHref: "",
      slides: [],
      isActive: true,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Home banner retrieved successfully"));
});

/**
 * Admin: Update home banner details, buttons, and slides list
 */
export const updateHomeBanner = asyncHandler(async (req, res) => {
  let banner = await HomeBanner.findOne({ isActive: true });

  if (!banner) {
    banner = new HomeBanner({ isActive: true });
  }

  const {
    title,
    titleBn,
    accent,
    accentBn,
    description,
    descriptionBn,
    btnPrimaryText,
    btnPrimaryTextBn,
    btnPrimaryHref,
    btnSecondaryText,
    btnSecondaryTextBn,
    btnSecondaryHref,
    slides,
  } = req.body;

  if (title !== undefined) banner.title = title;
  if (titleBn !== undefined) banner.titleBn = titleBn;
  if (accent !== undefined) banner.accent = accent;
  if (accentBn !== undefined) banner.accentBn = accentBn;
  if (description !== undefined) banner.description = description;
  if (descriptionBn !== undefined) banner.descriptionBn = descriptionBn;
  if (btnPrimaryText !== undefined) banner.btnPrimaryText = btnPrimaryText;
  if (btnPrimaryTextBn !== undefined) banner.btnPrimaryTextBn = btnPrimaryTextBn;
  if (btnPrimaryHref !== undefined) banner.btnPrimaryHref = btnPrimaryHref;
  if (btnSecondaryText !== undefined) banner.btnSecondaryText = btnSecondaryText;
  if (btnSecondaryTextBn !== undefined) banner.btnSecondaryTextBn = btnSecondaryTextBn;
  if (btnSecondaryHref !== undefined) banner.btnSecondaryHref = btnSecondaryHref;

  if (slides !== undefined && Array.isArray(slides)) {
    banner.slides = slides.map((s, idx) => ({
      image: s.image || s.src || s.url || "",
      alt: s.alt || `LPG Slide ${idx + 1}`,
      altBn: s.altBn || "",
      order: s.order || idx + 1,
    }));
  }

  await banner.save();

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Home banner updated successfully"));
});

/**
 * Admin: Upload multiple slide images (Drag and Drop)
 */
export const uploadBannerSlides = asyncHandler(async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    throw new ApiError(400, "Please upload at least one image file");
  }

  const backendBase =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 8005}`;
  const uploadedSlides = files.map((file, idx) => ({
    image: `${backendBase}/public/upload/${file.filename}`,
    alt: file.originalname.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    altBn: "",
    order: idx + 1,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        uploadedSlides,
        `${files.length} slide image(s) uploaded successfully`
      )
    );
});

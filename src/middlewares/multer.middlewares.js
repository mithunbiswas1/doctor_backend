// src/middlewares/multer.middlewares.js

import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// __dirname setup for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadFolder = path.join(__dirname, "../../public/upload");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 20 * 1024 * 1024,
    fields: 100,
    parts: 150,
  },
  fileFilter: fileFilter,
});

// Video Storage & Upload for Courses & Lessons
const videoFolder = path.join(__dirname, "../../public/upload/videos");
if (!fs.existsSync(videoFolder)) {
  fs.mkdirSync(videoFolder, { recursive: true });
}

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `video-${Date.now()}-${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

const videoFilter = (req, file, cb) => {
  const allowedExts = /mp4|webm|mkv|mov|ogg|avi/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if (allowedExts.test(ext) || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files (MP4, WebM, MOV, etc.) are allowed!"));
  }
};

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB video file limit
  },
  fileFilter: videoFilter,
});


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/user.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import roleRouter from "./routes/role.routes.js";
import blogRouter from "./routes/blog.routes.js";
import courseRouter from "./routes/course.routes.js";
import quizRouter from "./routes/quiz.routes.js";
import certificateRouter from "./routes/certificate.routes.js";
import pageRouter from "./routes/page.routes.js";
import contactRouter from "./routes/contact.routes.js";
import homeBannerRouter from "./routes/homeBanner.routes.js";

// __dirname setup for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS
const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serve
app.use(
  "/public/upload",
  express.static(path.join(__dirname, "../public/upload"))
);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Crostinin Backend Server is running successfully!");
});

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", aboutRoutes);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/quizzes", quizRouter);
app.use("/api/v1/certificates", certificateRouter);
app.use("/api/v1/pages", pageRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/home-banner", homeBannerRouter);

export { app };

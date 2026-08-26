import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import homeBannerRoutes from "./routes/homeBanner.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import clientMessageRoutes from "./routes/clientMessage.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import prescriptionRouter from "./routes/prescription.routes.js";
import servicesRouter from "./routes/services.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";

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
app.use("/api/v1", blogRouter);
app.use("/api/v1", homeBannerRoutes);
app.use("/api/v1", aboutRoutes);
app.use("/api/v1", settingRoutes);
app.use("/api/v1", clientMessageRoutes);
app.use("/api/v1", testimonialRoutes);
app.use("/api/v1", prescriptionRouter);
app.use("/api/v1", servicesRouter);
app.use("/api/v1", appointmentRouter);

export { app };

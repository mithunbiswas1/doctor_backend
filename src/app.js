import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import projectRouter from "./routes/project.routes.js";
import homeBannerRoutes from "./routes/homeBanner.routes.js";
import homeCompanyRoutes from "./routes/homeCompany.routes.js";
import homeIndustryRoutes from "./routes/homeIndustry.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import clientMessageRoutes from "./routes/clientMessage.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import homeAllianceRouter from "./routes/homeAlliance.routes.js";
import packageRouter from "./routes/package.routes.js";
import categoryRouter from "./routes/category.routes.js";
import itemRouter from "./routes/item.routes.js";
import sectionRouter from "./routes/section.routes.js";
import orderRouter from "./routes/order.routes.js";
import prescriptionRouter from "./routes/prescription.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import serviceRouter from "./routes/service.routes.js";

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
app.use("/api/v1", projectRouter);
app.use("/api/v1", homeBannerRoutes);
app.use("/api/v1", homeCompanyRoutes);
app.use("/api/v1", homeIndustryRoutes);
app.use("/api/v1", aboutRoutes);
app.use("/api/v1", settingRoutes);
app.use("/api/v1", clientMessageRoutes);
app.use("/api/v1", testimonialRoutes);
app.use("/api/v1", homeAllianceRouter);
app.use("/api/v1", packageRouter);
app.use("/api/v1", categoryRouter);
app.use("/api/v1", itemRouter);
app.use("/api/v1", sectionRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", prescriptionRouter);
app.use("/api/v1", appointmentRouter);
app.use("/api/v1", serviceRouter);

export { app };

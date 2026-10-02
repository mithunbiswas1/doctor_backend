import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config();

const PORT = process.env.PORT || 8000;

import { seedDefaultRoles } from "./db/seedRoles.js";
import { startBackgroundScheduler } from "./utils/scheduler.service.js";

connectDB()
  .then(async () => {
    await seedDefaultRoles();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port:${PORT}`);
      startBackgroundScheduler();
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
// server restart trigger

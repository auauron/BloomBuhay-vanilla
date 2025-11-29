// server/src/index.ts
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import motherProfilesRoutes from "./routes/motherProfiles";
import plannerRoutes from "./routes/plannerRoutes";
import aiRoutes from "./routes/aiRoutes";
import journalRoutes from "./routes/journalRoutes";
import healthtrackerRoutes from "./routes/healthtrackerRoutes";
import BBToolsRoutes from "./routes/BBToolsRoutes";

const app = express();
const PORT = process.env.PORT || 3000;


// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// ---------- Routes ----------
app
  .use("/api/auth", authRoutes)
  .use("/api/users", userRoutes)
  .use("/api/mother-profiles", motherProfilesRoutes)
  .use("/api/planner", plannerRoutes)
  .use("/api/journal", journalRoutes)
  .use("/api/healthtracker", healthtrackerRoutes)
  .use("/api/bbtools", BBToolsRoutes)
  .use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BloomBuhay API Server",
    version: "1.0.0",
    status: "running",
  });
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

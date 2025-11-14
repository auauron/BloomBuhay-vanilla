import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import motherProfilesRoutes from "./routes/motherProfiles"; 
import plannerRoutes from "./routes/plannerRoutes"
import journalRoutes from "./routes/journalRoutes"
import healthtrackerRoutes from "./routes/healthtrackerRoutes"
import BBToolsRoutes from "./routes/BBToolsRoutes"

const app = express();
const PORT = process.env.PORT || 3000;

app
  .use(
    cors({
      origin: true,
      credentials: true,
      allowedHeaders:["Content-Type", "Authorization"],
      exposedHeaders: ["Authorization"],
    })
  )
  .use(express.urlencoded({ extended: true, limit: "10mb" }))
  .use(express.json({ limit: "10mb" }));

// api routes
app.use("/api/auth", authRoutes)
.use("/api/users", userRoutes)
.use("/api/mother-profiles", motherProfilesRoutes) 
.use("/api/planner", plannerRoutes)
.use("/api/journal", journalRoutes)
.use("/api/healthtracker", healthtrackerRoutes)
.use("/api/bbtools", BBToolsRoutes)

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BloomBuhay API Server",
    version: "1.0.0",
    status: "running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

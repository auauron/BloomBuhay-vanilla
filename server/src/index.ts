// server/src/index.ts
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import motherProfilesRoutes from "./routes/motherProfiles"; 
import plannerRoutes from "./routes/plannerRoutes"
import aiRoutes from "./routes/aiRoutes";
import journalRoutes from "./routes/journalRoutes"
import healthtrackerRoutes from "./routes/healthtrackerRoutes"
import BBToolsRoutes from "./routes/BBToolsRoutes"

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Your Vite dev server
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.json({ limit: "10mb" }))
app.use("/api/ai", aiRoutes);

// Other API routes
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
  console.log(`CORS enabled for: http://localhost:5173`);
});
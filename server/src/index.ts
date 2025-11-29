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

// ---------- CORS Setup ----------

// Frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://bloombuhay-client.onrender.com",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

// CORS options
const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true, // allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Total-Count"],
};

if (process.env.NODE_ENV === "development") {

  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors(corsOptions));
}

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


  if (process.env.NODE_ENV !== "development") {

  }
});
        
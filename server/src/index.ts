import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import motherProfilesRoutes from "./routes/motherProfiles"; 

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mother-profiles", motherProfilesRoutes); 

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

import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app
  .use(cors({exposedHeaders: ["Authorization"],}))
  .use(express.urlencoded({ extended: true }))
  .use(express.json());

// api routes
app.use("/api/auth", authRoutes).use("/api/users", userRoutes);

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

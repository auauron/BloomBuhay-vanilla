import { User, UserLogin } from "./types/User";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

let database: User[] = [];

const app = express();
const PORT = process.env.PORT || 3000;
const db = new PrismaClient();

app
  .use(
    cors({
      exposedHeaders: ["Authorization"],
    })
  )
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .post("/signup", async (req, res) => {
    const user = req.body as User;
    console.log(user);

    bcrypt
      .hash(user.password, 10)
      .then((hashedPwd) =>
        db.user.create({
          data: {
            ...user,
            password: hashedPwd,
          },
        })
      )
      .then((result) => {
        console.log(result);
        res.json({ success: true });
      })
      .catch((error) => res.json({ success: false, error }));
  })
  .post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const dbUser = await db.user.findUnique({
      where: { username },
    });

    if (!dbUser) {
      return res.json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign({ name: dbUser.firstName }, process.env.API_KEY!, {
      expiresIn: "24h",
    });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.json({ success: true, token, name: dbUser.firstName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
}).get('/getUsers', (req,res) =>{
  db.user.findMany().then((result) => {
    res.json({ success: true, data: result})
  })
  // debug route
}).get("/", (req, res) => {
  res.send("Server is running!");
})
.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
    
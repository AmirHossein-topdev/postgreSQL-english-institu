import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

import userRoutes from "./src/routes/user.routes.js";
import classRoutes from "./src/routes/class.routes.js";
import bookRoutes from "./src/routes/book.routes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

console.log("✅ CORS middleware enabled");

app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/api/users", userRoutes);
app.use("/api/class", classRoutes);
app.use("/api/books", bookRoutes); // تمام درخواست‌های مربوط به کتاب‌ها از این پس کاملاً و درست از درون فایل خودش مدیریت می‌شوند

// =======================
// AUTH ROUTES
// =======================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, employeeCode, password, email, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { employeeCode } });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        employeeCode,
        password: hashed,
        email,
        role: role || "Student",
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { employeeCode, password } = req.body;
    const user = await prisma.user.findUnique({ where: { employeeCode } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => res.send("API is running..."));

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Class routes mounted at /api/class`);
});

// Export prisma برای استفاده در routeها
export { prisma };

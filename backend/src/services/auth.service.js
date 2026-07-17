// backend/src/services/auth.service.js
import prisma from "../lib/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async (data) => {
  const existing = await prisma.user.findUnique({
    where: { employeeCode: data.employeeCode },
  });

  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      employeeCode: data.employeeCode,
      password: hashed,
      role: data.role || "Student",
      email: data.email,
      phone: data.phone || null,
      address: data.address || null,
      birthday: data.birthday || null,
      status: data.status || "ACTIVE",
      profileImage: data.profileImage || "default-avatar.png",
    },
  });

  const token = generateToken(user);

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const loginUser = async (employeeCode, password, role) => {
  console.log("========================================");
  console.log("🔍 LOGIN SERVICE: Start");
  console.log("📌 employeeCode:", employeeCode);
  console.log("📌 role from frontend:", role);
  console.log("========================================");

  // 1️⃣ پیدا کردن کاربر
  const user = await prisma.user.findUnique({
    where: { employeeCode },
    include: {
      teacherProfile: true,
      studentProfile: true,
    },
  });

  if (!user) {
    console.log("❌ User not found");
    throw new Error("کاربر با این شناسه یافت نشد");
  }

  console.log("✅ User found:");
  console.log("📌 User ID:", user.id);
  console.log("📌 User Name:", user.name);
  console.log("📌 User Role in DB:", user.role);
  console.log("📌 User Status:", user.status);
  console.log("========================================");

  // 2️⃣ ✅ بررسی نقش - اینجا باید متوقف شود اگر نقش اشتباه است
  console.log("🔍 Checking role...");

  const roleMap = {
    student: "Student",
    teacher: "Teacher",
    admin: "Admin",
  };
  const expectedRole = roleMap[role];

  console.log("📌 expectedRole from map:", expectedRole);

  if (!expectedRole) {
    console.log("❌ Invalid role!");
    throw new Error("نقش انتخاب شده معتبر نیست");
  }

  // ✅ اینجا شرط اصلی - اگر نقش‌ها مطابقت نداشت، خطا بده
  if (user.role !== expectedRole) {
    console.log("❌❌❌ ROLE MISMATCH!");
    console.log("📌 User role in DB:", user.role);
    console.log("📌 Expected role:", expectedRole);
    console.log("📌 Role from frontend:", role);
    console.log("========================================");

    // ✅ این خطا باید جلوی ورود را بگیرد
    throw new Error(
      `نقش کاربر (${user.role}) با نقش انتخاب شده (${expectedRole}) مطابقت ندارد`,
    );
  }

  console.log("✅ Role matched!");
  console.log("========================================");

  // 3️⃣ بررسی رمز عبور
  console.log("🔍 Checking password...");
  const isMatch = await comparePassword(password, user.password);
  console.log("📌 Password match:", isMatch);

  if (!isMatch) {
    console.log("❌ Password mismatch!");
    throw new Error("رمز عبور اشتباه است");
  }

  console.log("✅ Password matched!");
  console.log("========================================");

  // 4️⃣ بررسی وضعیت کاربر
  console.log("🔍 Checking status...");
  if (user.status !== "ACTIVE") {
    console.log("❌ User is inactive!");
    throw new Error("حساب کاربری غیرفعال است");
  }

  console.log("✅ User is active!");
  console.log("========================================");

  // 5️⃣ تولید توکن
  console.log("🔍 Generating token...");
  const token = generateToken(user);
  console.log("✅ Token generated!");
  console.log("========================================");

  const { password: userPassword, ...userWithoutPassword } = user;

  console.log("✅ LOGIN SERVICE: Success for", user.name);
  console.log("📌 User Role:", user.role);
  console.log("========================================");

  return {
    success: true,
    message: "ورود موفق",
    token,
    user: {
      ...userWithoutPassword,
      profileImage: user.profileImage || "default-avatar.png",
    },
  };
};

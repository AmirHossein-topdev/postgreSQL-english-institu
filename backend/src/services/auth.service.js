// backend\src\services\auth.service.js
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
    },
  });

  const token = generateToken(user);

  return { user, token };
};

export const loginUser = async (employeeCode, password) => {
  const user = await prisma.user.findUnique({
    where: { employeeCode },
  });

  if (!user) throw new Error("User not found");

  console.log("Entered Password:", password);
  console.log("Stored Hash:", user.password);

  const isMatch = await comparePassword(password, user.password);

  console.log({
    employeeCode,
    password,
    hash: user.password,
    isMatch,
  });
  console.log("Password Match:", isMatch);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);

  return { user, token };
};

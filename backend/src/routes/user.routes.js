// backend/routes/user.routes.js
import express from "express";
import bcrypt from "bcryptjs";
import createUploader from "../../middleware/uploader.js";

// Import Prisma instance (singleton)
import prisma from "../lib/prisma.js";

const router = express.Router();

// Middleware
const authMiddleware = (req, res, next) => next(); // بعداً JWT اضافه کنید
const adminMiddleware = (req, res, next) => next(); // بعداً نقش Admin

const userUpload = createUploader("users");

// =======================
// Helper Functions
// =======================

const validateRole = (role) => ["Admin", "Teacher", "Student"].includes(role);

const validateStatus = (status) => ["ACTIVE", "INACTIVE"].includes(status);

const allowedSortFields = ["createdAt", "updatedAt", "name", "employeeCode"];

const sanitizeUser = (user) => {
  const { password, ...sanitized } = user;
  return sanitized;
};
// =======================
// CREATE USER
// =======================
router.post("/", userUpload.single("profileImage"), async (req, res) => {
  try {
    const {
      name,
      employeeCode,
      password,
      email,
      role = "Student",
      phone,
      address,
      status = "ACTIVE",
      birthday,
    } = req.body;

    // Validation
    if (!name?.trim() || !employeeCode?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "نام، کد کارمندی و رمز عبور الزامی است",
      });
    }
    if (!validateRole(role)) {
      return res
        .status(400)
        .json({ success: false, message: "Role نامعتبر است" });
    }
    if (!validateStatus(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Status نامعتبر است" });
    }

    // Check uniqueness
    const [existingCode, existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { employeeCode } }),
      email ? prisma.user.findUnique({ where: { email } }) : null,
    ]);

    if (existingCode)
      return res
        .status(400)
        .json({ success: false, message: "کد کارمندی قبلاً ثبت شده است" });
    if (existingEmail)
      return res
        .status(400)
        .json({ success: false, message: "ایمیل قبلاً ثبت شده است" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        employeeCode: employeeCode.trim(),
        password: hashedPassword,
        email: email?.trim() || null,
        role,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        status,
        birthday: birthday || null,
        profileImage: req.file
          ? `/images/users/${req.file.filename}`
          : "default-avatar.png",
      },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profileImage: true,
        birthday: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "کاربر با موفقیت ایجاد شد",
      data: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "خطای داخلی سرور" });
  }
});

// =======================
// GET ALL USERS - Pagination + Search + Filter + Sort
// =======================
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      role,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.min(100, Math.max(1, parseInt(limit)));

    const skip = (page - 1) * limit;
    search = search.trim();

    // Validate sort
    if (!allowedSortFields.includes(sortBy)) sortBy = "createdAt";
    if (!["asc", "desc"].includes(sortOrder)) sortOrder = "desc";

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { employeeCode: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && validateRole(role) ? { role } : {}),
      ...(status && validateStatus(status) ? { status } : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          employeeCode: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          profileImage: true,
          birthday: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      message: "لیست کاربران دریافت شد",
      data: {
        users,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "خطای داخلی سرور" });
  }
});

// =======================
// GET USER BY EMPLOYEE CODE
// =======================
router.get("/employee/:code", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { employeeCode: req.params.code },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profileImage: true,
        birthday: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "کاربر یافت نشد" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "خطای داخلی سرور" });
  }
});

// =======================
// GET USER BY ID
// =======================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        profileImage: true,
        birthday: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "کاربر یافت نشد" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "خطای داخلی سرور" });
  }
});

// =======================
// ✅ UPDATE USER
// =======================
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  userUpload.single("profileImage"),
  async (req, res) => {
    try {
      const {
        password,
        role,
        status,
        email,
        employeeCode,
        level,
        emergencyPhone,
        specialization,
        hireDate,
        salary,
        ...rest
      } = req.body;

      if (
        Object.keys(rest).length === 0 &&
        !password &&
        !role &&
        !status &&
        !email &&
        !employeeCode &&
        !req.file &&
        !specialization &&
        !hireDate &&
        !salary
      ) {
        return res.status(400).json({
          success: false,
          message: "هیچ فیلدی برای بروزرسانی ارسال نشده است",
        });
      }

      // Enum validation
      if (role && !validateRole(role))
        return res
          .status(400)
          .json({ success: false, message: "Role نامعتبر است" });
      if (status && !validateStatus(status))
        return res
          .status(400)
          .json({ success: false, message: "Status نامعتبر است" });

      const updateData = { ...rest };

      // Handle email uniqueness
      if (email) {
        const existing = await prisma.user.findFirst({
          where: { email, NOT: { id: req.params.id } },
        });
        if (existing)
          return res
            .status(400)
            .json({ success: false, message: "این ایمیل قبلاً ثبت شده است" });
        updateData.email = email.trim();
      }

      // Handle employeeCode uniqueness
      if (employeeCode) {
        const existing = await prisma.user.findFirst({
          where: { employeeCode, NOT: { id: req.params.id } },
        });
        if (existing)
          return res.status(400).json({
            success: false,
            message: "این کد کارمندی قبلاً ثبت شده است",
          });
        updateData.employeeCode = employeeCode.trim();
      }

      if (password?.trim()) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      if (role) updateData.role = role;
      if (status) updateData.status = status;
      if (req.file)
        updateData.profileImage = `/images/users/${req.file.filename}`;

      // ====================== بروزرسانی اصلی User ======================
      const updatedUser = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData,
        select: {
          id: true,
          name: true,
          employeeCode: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          profileImage: true,
          birthday: true,
          address: true,
          createdAt: true,
          updatedAt: true,
          teacherProfile: true, // اضافه شد
        },
      });

      // ====================== بروزرسانی Teacher Profile ======================
      if (
        updatedUser.role === "Teacher" &&
        (specialization || hireDate || salary)
      ) {
        await prisma.teacherProfile.upsert({
          where: { userId: req.params.id },
          update: {
            ...(specialization !== undefined && { specialization }),
            ...(hireDate !== undefined && {
              hireDate: hireDate ? new Date(hireDate) : null,
            }),
            ...(salary !== undefined && {
              salary: salary ? parseFloat(salary) : null,
            }),
          },
          create: {
            userId: req.params.id,
            specialization: specialization || "",
            hireDate: hireDate ? new Date(hireDate) : null,
            salary: salary ? parseFloat(salary) : null,
          },
        });
      }

      // ====================== بروزرسانی Student Profile (همان قبلی) ======================
      if (level || emergencyPhone) {
        await prisma.student.upsert({
          where: { userId: req.params.id },
          update: {
            ...(level && { level }),
            ...(emergencyPhone && { emergencyPhone }),
          },
          create: {
            userId: req.params.id,
            level: level || "A1",
            emergencyPhone: emergencyPhone || null,
          },
        });
      }

      // دریافت اطلاعات کامل بعد از بروزرسانی
      const finalUser = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: {
          teacherProfile: true,
          studentProfile: true, // اگر اسم مدل studentProfile باشد
        },
      });

      res.json({
        success: true,
        message: "کاربر با موفقیت بروزرسانی شد",
        data: finalUser,
      });
    } catch (err) {
      if (err.code === "P2025")
        return res
          .status(404)
          .json({ success: false, message: "کاربر یافت نشد" });
      if (err.code === "P2002")
        return res.status(400).json({
          success: false,
          message: "مقدار تکراری (کد کارمندی یا ایمیل)",
        });

      console.error("Update error:", err);
      res.status(500).json({ success: false, message: "خطای داخلی سرور" });
    }
  },
);
// =======================
// DELETE USER
// =======================
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: "کاربر با موفقیت حذف شد" });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "کاربر یافت نشد" });
    }
    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message:
          "این کاربر به دلیل داشتن رابطه (کلاس، ثبت‌نام و ...) قابل حذف نیست",
      });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "خطای داخلی سرور" });
  }
});

// module.exports = router;
export default router;

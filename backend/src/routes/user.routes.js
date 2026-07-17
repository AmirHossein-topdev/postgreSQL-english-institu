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
      specialization,
      hireDate,
      salary,
      level,
      emergencyPhone,
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

    // Prepare user data with relations
    const userData = {
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
    };

    // Add Teacher profile if role is Teacher
    if (role === "Teacher" && (specialization || hireDate || salary)) {
      userData.teacherProfile = {
        create: {
          specialization: specialization || null,
          hireDate: hireDate ? new Date(hireDate) : null,
          salary: salary ? parseFloat(salary) : null,
        },
      };
    }

    // Add Student profile if role is Student
    if (role === "Student" && (level || emergencyPhone)) {
      userData.studentProfile = {
        create: {
          level: level || "A1",
          emergencyPhone: emergencyPhone || null,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        teacherProfile: true,
        studentProfile: true,
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
        include: {
          teacherProfile: true,
          studentProfile: true,
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
// ✅ ENROLL STUDENT TO CLASS
// =======================
router.patch("/:id/enroll-class", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "classId is required",
      });
    }

    // بررسی وجود دانشجو
    const student = await prisma.user.findFirst({
      where: {
        id: id,
        role: "Student",
        status: "ACTIVE",
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or inactive",
      });
    }

    // بررسی وجود کلاس
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        enrollments: true,
      },
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // بررسی ظرفیت کلاس
    if (classData.enrollments.length >= classData.capacity) {
      return res.status(400).json({
        success: false,
        message: "Class is full",
      });
    }

    // بررسی تکراری نبودن ثبت‌نام
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId: id,
          classId: classId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this class",
      });
    }

    // ثبت‌نام دانشجو در کلاس
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: id,
        classId: classId,
        status: "IN_PROGRESS",
      },
      include: {
        user: {
          include: {
            studentProfile: true,
          },
        },
        class: {
          include: {
            teacher: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Student enrolled successfully",
      data: enrollment,
    });
  } catch (err) {
    console.error("❌ Error enrolling student:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ UN-ENROLL STUDENT FROM CLASS
// =======================
router.patch("/:id/unenroll-class", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;

    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "classId is required",
      });
    }

    // بررسی وجود دانشجو
    const student = await prisma.user.findFirst({
      where: {
        id: id,
        role: "Student",
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // حذف ثبت‌نام
    const result = await prisma.enrollment.deleteMany({
      where: {
        userId: id,
        classId: classId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      message: "Student un-enrolled successfully",
    });
  } catch (err) {
    console.error("❌ Error un-enrolling student:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// GET USER BY EMPLOYEE CODE
// =======================
router.get("/employee/:code", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { employeeCode: req.params.code },
      include: {
        teacherProfile: true,
        studentProfile: true,
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
      include: {
        teacherProfile: true,
        studentProfile: true,
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
        !salary &&
        !level &&
        !emergencyPhone
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
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      });

      // ====================== بروزرسانی Teacher Profile ======================
      if (
        updatedUser.role === "Teacher" &&
        (specialization !== undefined ||
          hireDate !== undefined ||
          salary !== undefined)
      ) {
        await prisma.teacher.upsert({
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
            specialization: specialization || null,
            hireDate: hireDate ? new Date(hireDate) : null,
            salary: salary ? parseFloat(salary) : null,
          },
        });
      }

      // ====================== بروزرسانی Student Profile ======================
      if (
        updatedUser.role === "Student" &&
        (level !== undefined || emergencyPhone !== undefined)
      ) {
        await prisma.student.upsert({
          where: { userId: req.params.id },
          update: {
            ...(level !== undefined && { level }),
            ...(emergencyPhone !== undefined && { emergencyPhone }),
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
          studentProfile: true,
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

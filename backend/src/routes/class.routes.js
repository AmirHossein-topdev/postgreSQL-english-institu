// src/routes/class.routes.js

import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Middleware موقت - در پروژه واقعی باید جایگزین شود
const authMiddleware = (req, res, next) => {
  // در اینجا می‌توانید احراز هویت واقعی را پیاده‌سازی کنید
  // فعلاً یک کاربر تستی برای توسعه
  req.user = { id: "test-admin-id", role: "Admin" };
  next();
};

const roleMiddleware = (roles) => (req, res, next) => {
  // در اینجا بررسی نقش کاربر
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Insufficient permissions.",
    });
  }
  next();
};

// =======================
// ✅ CREATE: ایجاد کلاس جدید توسط مدیر
// =======================
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const {
        name,
        level,
        teacherId,
        studentIds,
        term,
        tuition,
        schedule,
        room,
        status,
        startDate,
        endDate,
        capacity,
        totalSessions,
        description,
      } = req.body;

      // اعتبارسنجی ورودی‌ها
      if (!name || !term) {
        return res.status(400).json({
          success: false,
          message: "Name and term are required fields",
        });
      }

      // بررسی وجود استاد
      if (teacherId) {
        const teacher = await prisma.user.findFirst({
          where: {
            id: teacherId,
            role: "Teacher",
            status: "ACTIVE",
          },
        });
        if (!teacher) {
          return res.status(400).json({
            success: false,
            message: "Teacher not found or not active",
          });
        }
      }

      // بررسی وجود دانشجوها (اختیاری)
      if (studentIds && studentIds.length > 0) {
        const students = await prisma.user.findMany({
          where: {
            id: { in: studentIds },
            role: "Student",
            status: "ACTIVE",
          },
        });
        if (students.length !== studentIds.length) {
          return res.status(400).json({
            success: false,
            message: "Some students not found or inactive",
          });
        }
      }

      // ایجاد کلاس جدید
      const newClass = await prisma.class.create({
        data: {
          name,
          level: level || "A1",
          teacherId: teacherId || null,
          term,
          tuition: tuition ? parseFloat(tuition) : 0,
          schedule: schedule || "",
          room: room || "",
          status: status || "UNDER_REGISTRATION",
          createdById: req.user?.id,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          capacity: capacity || 10,
          totalSessions: totalSessions || 12,
          description: description || "",
          isConfirmed: false,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
              email: true,
              phone: true,
            },
          },
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  employeeCode: true,
                },
              },
            },
          },
        },
      });

      // افزودن دانشجویان به Enrollment
      if (studentIds && studentIds.length > 0) {
        await prisma.enrollment.createMany({
          data: studentIds.map((studentId) => ({
            userId: studentId,
            classId: newClass.id,
            status: "IN_PROGRESS",
          })),
          skipDuplicates: true,
        });

        // دریافت مجدد کلاس با اطلاعات به‌روز
        const updatedClass = await prisma.class.findUnique({
          where: { id: newClass.id },
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                employeeCode: true,
                email: true,
                phone: true,
              },
            },
            enrollments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    employeeCode: true,
                  },
                },
              },
            },
          },
        });

        return res.status(201).json({
          success: true,
          data: updatedClass,
        });
      }

      res.status(201).json({ success: true, data: newClass });
    } catch (err) {
      console.error("❌ Error creating class:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
);

// =======================
// ✅ UPDATE: آپدیت کلاس
// =======================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const {
        name,
        level,
        teacherId,
        term,
        tuition,
        schedule,
        room,
        status,
        startDate,
        endDate,
        capacity,
        totalSessions,
        description,
        isConfirmed,
        studentIds,
      } = req.body;

      const existingClass = await prisma.class.findUnique({
        where: { id: req.params.id },
        include: {
          enrollments: true,
        },
      });

      if (!existingClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      }

      // بررسی وجود استاد
      if (teacherId) {
        const teacher = await prisma.user.findFirst({
          where: {
            id: teacherId,
            role: "Teacher",
            status: "ACTIVE",
          },
        });
        if (!teacher) {
          return res.status(400).json({
            success: false,
            message: "Teacher not found or not active",
          });
        }
      }

      // آماده‌سازی داده‌های به‌روزرسانی
      const updateData = {
        name,
        level,
        teacherId,
        term,
        tuition: tuition !== undefined ? parseFloat(tuition) : undefined,
        schedule,
        room,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        capacity,
        totalSessions,
        description,
        isConfirmed: isConfirmed !== undefined ? isConfirmed : undefined,
      };

      // حذف فیلدهای undefined
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key],
      );

      // به‌روزرسانی کلاس
      const updatedClass = await prisma.class.update({
        where: { id: req.params.id },
        data: updateData,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
              email: true,
              phone: true,
            },
          },
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  employeeCode: true,
                },
              },
            },
          },
        },
      });

      // مدیریت دانشجوها (در صورت ارسال studentIds)
      if (studentIds && Array.isArray(studentIds)) {
        // بررسی وجود دانشجوها
        if (studentIds.length > 0) {
          const students = await prisma.user.findMany({
            where: {
              id: { in: studentIds },
              role: "Student",
              status: "ACTIVE",
            },
          });

          if (students.length !== studentIds.length) {
            return res.status(400).json({
              success: false,
              message: "Some students not found or inactive",
            });
          }
        }

        // حذف enrollment های قبلی
        await prisma.enrollment.deleteMany({
          where: { classId: req.params.id },
        });

        // ایجاد enrollment جدید
        if (studentIds.length > 0) {
          await prisma.enrollment.createMany({
            data: studentIds.map((studentId) => ({
              userId: studentId,
              classId: req.params.id,
              status: "IN_PROGRESS",
            })),
            skipDuplicates: true,
          });
        }

        // دریافت مجدد کلاس با اطلاعات به‌روز
        const finalClass = await prisma.class.findUnique({
          where: { id: req.params.id },
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                employeeCode: true,
                email: true,
                phone: true,
              },
            },
            enrollments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    employeeCode: true,
                  },
                },
              },
            },
          },
        });

        return res.json({ success: true, data: finalClass });
      }

      res.json({ success: true, data: updatedClass });
    } catch (err) {
      console.error("❌ Error updating class:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
);

// =======================
// ✅ READ: دریافت کلاس با ID
// =======================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const classData = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
            phone: true,
            email: true,
            teacherProfile: {
              select: {
                specialization: true,
                hireDate: true,
                salary: true,
                resume: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                employeeCode: true,
                phone: true,
                email: true,
                studentProfile: {
                  select: {
                    level: true,
                    emergencyPhone: true,
                    registeredDate: true,
                  },
                },
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
            email: true,
          },
        },
        sessions: {
          orderBy: {
            sessionNumber: "asc",
          },
        },
      },
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({ success: true, data: classData });
  } catch (err) {
    console.error("❌ Error fetching class:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ DELETE: حذف کلاس
// =======================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      // ابتدا بررسی وجود کلاس
      const classExists = await prisma.class.findUnique({
        where: { id: req.params.id },
      });

      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      }

      // حذف کلاس (cascade حذف enrollments و sessions را انجام می‌دهد)
      await prisma.class.delete({
        where: { id: req.params.id },
      });

      res.json({
        success: true,
        message: "Class deleted successfully",
      });
    } catch (err) {
      console.error("❌ Error deleting class:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
);

// =======================
// ✅ ADD STUDENT: افزودن دانشجو به کلاس
// =======================
router.post(
  "/:id/add-student",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { studentId } = req.body;

      if (!studentId) {
        return res.status(400).json({
          success: false,
          message: "Student ID is required",
        });
      }

      // بررسی وجود کلاس
      const classData = await prisma.class.findUnique({
        where: { id: req.params.id },
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

      // بررسی وجود دانشجو
      const student = await prisma.user.findFirst({
        where: {
          id: studentId,
          role: "Student",
          status: "ACTIVE",
        },
      });

      if (!student) {
        return res.status(400).json({
          success: false,
          message: "Student not found or inactive",
        });
      }

      // بررسی تکراری نبودن
      const existing = await prisma.enrollment.findUnique({
        where: {
          userId_classId: {
            userId: studentId,
            classId: req.params.id,
          },
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Student already enrolled in this class",
        });
      }

      // افزودن دانشجو
      await prisma.enrollment.create({
        data: {
          userId: studentId,
          classId: req.params.id,
          status: "IN_PROGRESS",
        },
      });

      // دریافت اطلاعات به‌روز
      const updatedClass = await prisma.class.findUnique({
        where: { id: req.params.id },
        include: {
          teacher: {
            select: {
              name: true,
              employeeCode: true,
            },
          },
          enrollments: {
            include: {
              user: {
                select: {
                  name: true,
                  employeeCode: true,
                },
              },
            },
          },
        },
      });

      res.json({
        success: true,
        data: updatedClass,
        message: "Student added successfully",
      });
    } catch (err) {
      console.error("❌ Error adding student to class:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
);

// =======================
// ✅ REMOVE STUDENT: حذف دانشجو از کلاس
// =======================
router.delete(
  "/:id/remove-student/:studentId",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { id, studentId } = req.params;

      // بررسی وجود کلاس
      const classExists = await prisma.class.findUnique({
        where: { id },
      });

      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      }

      // حذف enrollment
      const result = await prisma.enrollment.deleteMany({
        where: {
          classId: id,
          userId: studentId,
        },
      });

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found in this class",
        });
      }

      res.json({
        success: true,
        message: "Student removed successfully",
      });
    } catch (err) {
      console.error("❌ Error removing student from class:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
);

// =======================
// ✅ LIST: لیست کلاس‌ها با فیلتر و pagination
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      status,
      level,
      term,
      isConfirmed,
      teacherId,
      page = 1,
      limit = 10,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // ساخت شرط‌های جستجو
    const where = {};

    if (status) where.status = status;
    if (level) where.level = level;
    if (term) where.term = term;
    if (isConfirmed !== undefined) {
      where.isConfirmed = isConfirmed === "true";
    }
    if (teacherId) where.teacherId = teacherId;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { term: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { room: { contains: search, mode: "insensitive" } },
      ];
    }

    // ایجاد orderBy با توجه به فیلدهای موجود در مدل
    const orderBy = {};

    // بررسی اینکه فیلد مرتب‌سازی در مدل وجود دارد
    const validSortFields = [
      "id",
      "name",
      "level",
      "teacherId",
      "term",
      "tuition",
      "schedule",
      "room",
      "status",
      "createdById",
      "isConfirmed",
      "confirmedAt",
      "startDate",
      "endDate",
      "capacity",
      "totalSessions",
      "description",
    ];

    // اگر فیلد مرتب‌سازی معتبر نیست، از پیش‌فرض استفاده کن
    const sortField = validSortFields.includes(sortBy) ? sortBy : "startDate";
    orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc";

    // دریافت کلاس‌ها با pagination
    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
              email: true,
              phone: true,
            },
          },
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  employeeCode: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.class.count({ where }),
    ]);

    res.json({
      success: true,
      data: classes,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching classes:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ GET STUDENTS: دریافت دانشجویان یک کلاس
// =======================
router.get("/:id/students", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                employeeCode: true,
                email: true,
                phone: true,
                studentProfile: {
                  select: {
                    level: true,
                    emergencyPhone: true,
                    registeredDate: true,
                  },
                },
              },
            },
          },
          orderBy: {
            enrollDate: "desc",
          },
        },
      },
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      data: classData.enrollments.map((enrollment) => ({
        ...enrollment.user,
        enrollDate: enrollment.enrollDate,
        status: enrollment.status,
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching class students:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;

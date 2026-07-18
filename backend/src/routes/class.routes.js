// src/routes/class.routes.js

import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect, authorize } from "../../middleware/authMiddleware.js"; // ✅ ایمپورت درست

const router = express.Router();
const prisma = new PrismaClient();

// =======================
// ✅ CREATE: ایجاد کلاس جدید توسط مدیر
// =======================
router.post("/", protect(["Admin"]), async (req, res) => {
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
        message: "نام و ترم الزامی است",
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
          message: "استاد مورد نظر یافت نشد یا غیرفعال است",
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
          message: "برخی از دانشجویان یافت نشدند یا غیرفعال هستند",
        });
      }
    }

    // بررسی وجود کاربر ایجادکننده
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "احراز هویت ناموفق. لطفاً دوباره لاگین کنید.",
      });
    }

    console.log("🔍 req.user:", req.user);
    console.log("🔍 req.user?.id:", req.user?.id);

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
        createdById: req.user.id,
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
        message: "کلاس با موفقیت ایجاد شد",
        data: updatedClass,
      });
    }

    res.status(201).json({
      success: true,
      message: "کلاس با موفقیت ایجاد شد",
      data: newClass,
    });
  } catch (err) {
    console.error("❌ Error creating class:", err);

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "مشکل در ارتباط با کاربر ایجادکننده. لطفاً دوباره لاگین کنید.",
      });
    }

    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "کلاس با این مشخصات قبلاً ثبت شده است",
      });
    }

    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ UPDATE: آپدیت کلاس
// =======================
router.put("/:id", protect(["Admin"]), async (req, res) => { // ✅ اصلاح شد
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
        message: "کلاس یافت نشد",
      });
    }

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
          message: "استاد یافت نشد یا غیرفعال است",
        });
      }
    }

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

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

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

    if (studentIds && Array.isArray(studentIds)) {
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
            message: "برخی از دانشجویان یافت نشدند یا غیرفعال هستند",
          });
        }
      }

      await prisma.enrollment.deleteMany({
        where: { classId: req.params.id },
      });

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
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ READ: دریافت کلاس با ID
// =======================
router.get("/:id", protect(), async (req, res) => { // ✅ اصلاح شد
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
        message: "کلاس یافت نشد",
      });
    }

    res.json({ success: true, data: classData });
  } catch (err) {
    console.error("❌ Error fetching class:", err);
    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ DELETE: حذف کلاس
// =======================
router.delete("/:id", protect(["Admin"]), async (req, res) => { // ✅ اصلاح شد
  try {
    const classExists = await prisma.class.findUnique({
      where: { id: req.params.id },
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "کلاس یافت نشد",
      });
    }

    await prisma.class.delete({
      where: { id: req.params.id },
    });

    res.json({
      success: true,
      message: "کلاس با موفقیت حذف شد",
    });
  } catch (err) {
    console.error("❌ Error deleting class:", err);
    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ GET CLASSES BY STUDENT
// =======================
router.get("/student/:studentId", protect(), async (req, res) => { // ✅ اصلاح شد
  try {
    const { studentId } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        class: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                employeeCode: true,
                email: true,
                phone: true,
                teacherProfile: true,
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
        },
      },
      orderBy: { enrollDate: "desc" },
    });

    const classes = enrollments.map((enrollment) => enrollment.class);

    res.json({
      success: true,
      data: classes,
    });
  } catch (err) {
    console.error("❌ Error fetching student classes:", err);
    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
    });
  }
});

// =======================
// ✅ GET CLASSES BY TEACHER
// =======================
router.get("/teacher/:teacherId", protect(), async (req, res) => { // ✅ اصلاح شد
  try {
    const { teacherId } = req.params;

    const classes = await prisma.class.findMany({
      where: { teacherId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            employeeCode: true,
            email: true,
            phone: true,
            teacherProfile: true,
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
      orderBy: { startDate: "desc" },
    });

    res.json({
      success: true,
      data: classes,
    });
  } catch (err) {
    console.error("❌ Error fetching teacher classes:", err);
    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
    });
  }
});

// =======================
// ✅ ADD STUDENT: افزودن دانشجو به کلاس
// =======================
router.post("/:id/add-student", protect(["Admin"]), async (req, res) => { // ✅ اصلاح شد
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "شناسه دانشجو الزامی است",
      });
    }

    const classData = await prisma.class.findUnique({
      where: { id: req.params.id },
      include: {
        enrollments: true,
      },
    });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "کلاس یافت نشد",
      });
    }

    if (classData.enrollments.length >= classData.capacity) {
      return res.status(400).json({
        success: false,
        message: "ظرفیت کلاس تکمیل شده است",
      });
    }

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
        message: "دانشجو یافت نشد یا غیرفعال است",
      });
    }

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
        message: "دانشجو قبلاً در این کلاس ثبت‌نام شده است",
      });
    }

    await prisma.enrollment.create({
      data: {
        userId: studentId,
        classId: req.params.id,
        status: "IN_PROGRESS",
      },
    });

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
      message: "دانشجو با موفقیت اضافه شد",
    });
  } catch (err) {
    console.error("❌ Error adding student to class:", err);
    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ REMOVE STUDENT: حذف دانشجو از کلاس
// =======================
router.delete("/:id/remove-student/:studentId", protect(["Admin"]), async (req, res) => { // ✅ اصلاح شد
  try {
    const { id, studentId } = req.params;

    const classExists = await prisma.class.findUnique({
      where: { id },
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "کلاس یافت نشد",
      });
    }

    const result = await prisma.enrollment.deleteMany({
      where: {
        classId: id,
        userId: studentId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: "دانشجو در این کلاس یافت نشد",
      });
    }

    res.json({
      success: true,
      message: "دانشجو با موفقیت حذف شد",
    });
  } catch (err) {
    console.error("❌ Error removing student from class:", err);
    res.status(500).json({
      success: false,
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ LIST: لیست کلاس‌ها با فیلتر و pagination
// =======================
router.get("/", protect(), async (req, res) => { // ✅ اصلاح شد
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

    const orderBy = {};

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

    const sortField = validSortFields.includes(sortBy) ? sortBy : "startDate";
    orderBy[sortField] = sortOrder === "asc" ? "asc" : "desc";

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
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// =======================
// ✅ GET STUDENTS: دریافت دانشجویان یک کلاس
// =======================
router.get("/:id/students", protect(), async (req, res) => { // ✅ اصلاح شد
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
        message: "کلاس یافت نشد",
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
      message: "خطای داخلی سرور",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

export default router;
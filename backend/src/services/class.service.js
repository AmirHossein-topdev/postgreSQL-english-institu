// backend/services/class.service.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ClassService {
  // =====================================
  // ✅ ایجاد کلاس جدید
  // =====================================
  async createClass(data) {
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
        createdById,
        startDate,
        endDate,
        capacity,
        totalSessions,
        description,
        studentIds,
      } = data;

      // بررسی وجود استاد
      if (teacherId) {
        const teacher = await prisma.user.findFirst({
          where: {
            id: teacherId,
            role: "Teacher",
            status: "ACTIVE",
          },
        });
        if (!teacher) throw new Error("Teacher not found or not active");
      }

      // بررسی وجود دانشجوها
      if (studentIds && studentIds.length > 0) {
        const students = await prisma.user.findMany({
          where: {
            id: { in: studentIds },
            role: "Student",
            status: "ACTIVE",
          },
        });
        if (students.length !== studentIds.length) {
          throw new Error("Some students not found or inactive");
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
          createdById: createdById,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          capacity: capacity || 10,
          totalSessions: totalSessions || 12,
          description: description || "",
          isConfirmed: false,
        },
        include: {
          teacher: true,
          enrollments: {
            include: {
              user: true,
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
        return await prisma.class.findUnique({
          where: { id: newClass.id },
          include: {
            teacher: true,
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        });
      }

      return newClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ آپدیت کلاس
  // =====================================
  async updateClass(id, data) {
    try {
      const {
        name,
        level,
        teacherId,
        term,
        tuition,
        schedule,
        room,
        startDate,
        endDate,
        capacity,
        totalSessions,
        description,
        status,
        isConfirmed,
      } = data;

      const existingClass = await prisma.class.findUnique({
        where: { id },
      });
      if (!existingClass) throw new Error("Class not found");

      // بررسی وجود استاد
      if (teacherId) {
        const teacher = await prisma.user.findFirst({
          where: {
            id: teacherId,
            role: "Teacher",
            status: "ACTIVE",
          },
        });
        if (!teacher) throw new Error("Teacher not found or not active");
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

      const updatedClass = await prisma.class.update({
        where: { id },
        data: updateData,
        include: {
          teacher: true,
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!updatedClass) throw new Error("Class not found");
      return updatedClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ دریافت کلاس با ID
  // =====================================
  async getClassById(id) {
    try {
      const classData = await prisma.class.findUnique({
        where: { id },
        include: {
          teacher: {
            include: {
              teacherProfile: true,
            },
          },
          enrollments: {
            include: {
              user: {
                include: {
                  studentProfile: true,
                },
              },
            },
          },
          createdBy: true,
          sessions: {
            orderBy: {
              sessionNumber: "asc",
            },
          },
        },
      });

      if (!classData) throw new Error("Class not found");
      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ حذف کلاس
  // =====================================
  async deleteClass(id) {
    try {
      const deletedClass = await prisma.class.delete({
        where: { id },
      });
      if (!deletedClass) throw new Error("Class not found");
      return deletedClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ افزودن دانشجو به کلاس
  // =====================================
  async addStudentToClass(classId, studentId) {
    try {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          enrollments: true,
        },
      });
      if (!classData) throw new Error("Class not found");

      // بررسی وجود دانشجو
      const student = await prisma.user.findFirst({
        where: {
          id: studentId,
          role: "Student",
          status: "ACTIVE",
        },
      });
      if (!student) throw new Error("Student not found or inactive");

      // بررسی ظرفیت
      if (classData.enrollments.length >= classData.capacity) {
        throw new Error("Class capacity is full");
      }

      // بررسی تکراری نبودن
      const existing = await prisma.enrollment.findUnique({
        where: {
          userId_classId: {
            userId: studentId,
            classId: classId,
          },
        },
      });
      if (existing) {
        throw new Error("Student already enrolled in this class");
      }

      // افزودن دانشجو
      await prisma.enrollment.create({
        data: {
          userId: studentId,
          classId: classId,
          status: "IN_PROGRESS",
        },
      });

      return await this.getClassById(classId);
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ حذف دانشجو از کلاس
  // =====================================
  async removeStudentFromClass(classId, studentId) {
    try {
      const result = await prisma.enrollment.deleteMany({
        where: {
          classId: classId,
          userId: studentId,
        },
      });

      if (result.count === 0) {
        throw new Error("Student not found in this class");
      }

      return await this.getClassById(classId);
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ افزودن چند دانشجو به کلاس
  // =====================================
  async addMultipleStudentsToClass(classId, studentIds) {
    try {
      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        throw new Error("Please provide an array of student IDs");
      }

      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          enrollments: true,
        },
      });
      if (!classData) throw new Error("Class not found");

      // بررسی وجود دانشجوها
      const students = await prisma.user.findMany({
        where: {
          id: { in: studentIds },
          role: "Student",
          status: "ACTIVE",
        },
      });
      if (students.length !== studentIds.length) {
        throw new Error("Some students not found or inactive");
      }

      // بررسی ظرفیت
      const existingEnrollments = await prisma.enrollment.findMany({
        where: {
          classId: classId,
          userId: { in: studentIds },
        },
      });

      const existingIds = existingEnrollments.map((e) => e.userId);
      const newStudents = studentIds.filter((id) => !existingIds.includes(id));

      if (
        classData.enrollments.length + newStudents.length >
        classData.capacity
      ) {
        throw new Error("Adding these students would exceed class capacity");
      }

      // افزودن دانشجویان جدید
      if (newStudents.length > 0) {
        await prisma.enrollment.createMany({
          data: newStudents.map((studentId) => ({
            userId: studentId,
            classId: classId,
            status: "IN_PROGRESS",
          })),
          skipDuplicates: true,
        });
      }

      return await this.getClassById(classId);
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تأیید نهایی کلاس توسط مدیر
  // =====================================
  async confirmClass(classId, adminId) {
    try {
      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: {
          isConfirmed: true,
          confirmedAt: new Date(),
          status: "ACTIVE",
        },
        include: {
          teacher: true,
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!updatedClass) throw new Error("Class not found");
      return updatedClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لغو کلاس
  // =====================================
  async cancelClass(classId) {
    try {
      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: {
          status: "CANCELED",
          isConfirmed: false,
        },
        include: {
          teacher: true,
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!updatedClass) throw new Error("Class not found");
      return updatedClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تکمیل کلاس
  // =====================================
  async completeClass(classId) {
    try {
      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: {
          status: "COMPLETED",
        },
        include: {
          teacher: true,
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!updatedClass) throw new Error("Class not found");
      return updatedClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تغییر وضعیت کلاس
  // =====================================
  async changeClassStatus(classId, status) {
    try {
      const validStatuses = [
        "UNDER_REGISTRATION",
        "ACTIVE",
        "COMPLETED",
        "CANCELED",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: { status },
        include: {
          teacher: true,
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!updatedClass) throw new Error("Class not found");
      return updatedClass;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های فعال
  // =====================================
  async listActiveClasses() {
    try {
      const classes = await prisma.class.findMany({
        where: {
          status: "ACTIVE",
          isConfirmed: true,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
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
        orderBy: {
          startDate: "asc",
        },
      });
      return classes;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های تأیید نشده
  // =====================================
  async listUnconfirmedClasses() {
    try {
      const classes = await prisma.class.findMany({
        where: {
          isConfirmed: false,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
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
        orderBy: {
          createdAt: "desc",
        },
      });
      return classes;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های یک استاد خاص
  // =====================================
  async getClassesByTeacher(teacherId) {
    try {
      const teacher = await prisma.user.findFirst({
        where: {
          id: teacherId,
          role: "Teacher",
        },
      });
      if (!teacher) throw new Error("Teacher not found");

      const classes = await prisma.class.findMany({
        where: {
          teacherId: teacherId,
        },
        include: {
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
        orderBy: {
          startDate: "desc",
        },
      });
      return classes;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های یک دانشجو خاص
  // =====================================
  async getClassesByStudent(studentId) {
    try {
      const student = await prisma.user.findFirst({
        where: {
          id: studentId,
          role: "Student",
        },
      });
      if (!student) throw new Error("Student not found");

      const enrollments = await prisma.enrollment.findMany({
        where: {
          userId: studentId,
        },
        include: {
          class: {
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                  employeeCode: true,
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
        orderBy: {
          enrollDate: "desc",
        },
      });

      return enrollments.map((e) => e.class);
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های یک ترم خاص
  // =====================================
  async getClassesByTerm(termName) {
    try {
      const classes = await prisma.class.findMany({
        where: {
          term: termName,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
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
        orderBy: {
          startDate: "asc",
        },
      });
      return classes;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های یک سطح خاص
  // =====================================
  async getClassesByLevel(level) {
    try {
      const validLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
      if (!validLevels.includes(level)) {
        throw new Error("Invalid level");
      }

      const classes = await prisma.class.findMany({
        where: {
          level: level,
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              employeeCode: true,
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
        orderBy: {
          startDate: "asc",
        },
      });
      return classes;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌ها با فیلتر و صفحه‌بندی
  // =====================================
  async listAllClasses({
    page = 1,
    limit = 10,
    status,
    level,
    term,
    isConfirmed,
    search,
    teacherId,
  }) {
    try {
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;
      if (level) where.level = level;
      if (term) where.term = term;
      if (isConfirmed !== undefined) where.isConfirmed = isConfirmed;
      if (teacherId) where.teacherId = teacherId;

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { term: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { room: { contains: search, mode: "insensitive" } },
        ];
      }

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
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.class.count({ where }),
      ]);

      return {
        classes,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ آمار کلاس‌ها برای داشبورد
  // =====================================
  async getClassStats() {
    try {
      const [
        totalClasses,
        activeClasses,
        pendingClasses,
        completedClasses,
        canceledClasses,
        classesByLevel,
        totalEnrollments,
      ] = await Promise.all([
        prisma.class.count(),
        prisma.class.count({
          where: {
            status: "ACTIVE",
            isConfirmed: true,
          },
        }),
        prisma.class.count({
          where: {
            isConfirmed: false,
          },
        }),
        prisma.class.count({
          where: {
            status: "COMPLETED",
          },
        }),
        prisma.class.count({
          where: {
            status: "CANCELED",
          },
        }),
        prisma.class.groupBy({
          by: ["level"],
          _count: true,
        }),
        prisma.enrollment.count(),
      ]);

      const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
      const classCountByLevel = {};
      for (const level of levels) {
        const found = classesByLevel.find((item) => item.level === level);
        classCountByLevel[level] = found ? found._count : 0;
      }

      return {
        totalClasses,
        activeClasses,
        pendingClasses,
        completedClasses,
        canceledClasses,
        classesByLevel: classCountByLevel,
        totalEnrollments,
        averageStudentsPerClass:
          totalClasses > 0 ? (totalEnrollments / totalClasses).toFixed(2) : 0,
      };
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ افزودن جلسه به کلاس
  // =====================================
  async addSessionToClass(classId, sessionData) {
    try {
      const { sessionNumber, date, topic } = sessionData;

      const classExists = await prisma.class.findUnique({
        where: { id: classId },
      });
      if (!classExists) throw new Error("Class not found");

      // بررسی تکراری نبودن شماره جلسه
      const existingSession = await prisma.classSession.findUnique({
        where: {
          classId_sessionNumber: {
            classId: classId,
            sessionNumber: sessionNumber,
          },
        },
      });
      if (existingSession) {
        throw new Error("Session number already exists");
      }

      const newSession = await prisma.classSession.create({
        data: {
          classId: classId,
          sessionNumber: sessionNumber,
          date: new Date(date),
          topic: topic || "",
          isCompleted: false,
        },
      });

      return await this.getClassById(classId);
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تکمیل جلسه
  // =====================================
  async completeSession(classId, sessionNumber) {
    try {
      const updatedSession = await prisma.classSession.update({
        where: {
          classId_sessionNumber: {
            classId: classId,
            sessionNumber: sessionNumber,
          },
        },
        data: {
          isCompleted: true,
        },
      });

      if (!updatedSession) throw new Error("Session not found");

      return await this.getClassById(classId);
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ دریافت لیست دانشجوهای یک کلاس
  // =====================================
  async getClassStudents(classId) {
    try {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          enrollments: {
            include: {
              user: {
                include: {
                  studentProfile: true,
                },
              },
            },
            orderBy: {
              enrollDate: "desc",
            },
          },
        },
      });

      if (!classData) throw new Error("Class not found");

      return classData.enrollments.map((enrollment) => ({
        ...enrollment.user,
        enrollDate: enrollment.enrollDate,
        status: enrollment.status,
      }));
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ دریافت تعداد دانشجویان کلاس
  // =====================================
  async getClassStudentsCount(classId) {
    try {
      const count = await prisma.enrollment.count({
        where: {
          classId: classId,
        },
      });
      return count;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ بررسی ظرفیت کلاس
  // =====================================
  async checkClassCapacity(classId) {
    try {
      const classData = await prisma.class.findUnique({
        where: { id: classId },
        include: {
          enrollments: true,
        },
      });
      if (!classData) throw new Error("Class not found");

      const currentStudents = classData.enrollments.length;
      const remainingSeats = classData.capacity - currentStudents;

      return {
        hasCapacity: remainingSeats > 0,
        remainingSeats: remainingSeats,
        currentStudents: currentStudents,
        capacity: classData.capacity,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ClassService();

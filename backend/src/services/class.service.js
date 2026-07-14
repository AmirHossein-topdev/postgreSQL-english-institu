// backend/services/class.service.js
const Class = require("../model/Class");
const User = require("../model/User");

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
        studentIds,
        term,
        tuition,
        schedule,
        room,
        status,
        createdBy,
        startDate,
        endDate,
        capacity,
        totalSessions,
        description,
      } = data;

      // بررسی وجود استاد
      if (teacherId) {
        const teacher = await User.findOne({ _id: teacherId, role: "Teacher" });
        if (!teacher) throw new Error("Teacher not found or invalid role");
      }

      // بررسی وجود دانشجوها
      if (studentIds && studentIds.length > 0) {
        const students = await User.find({
          _id: { $in: studentIds },
          role: "Student",
        });
        if (students.length !== studentIds.length) {
          throw new Error("Some students not found or invalid role");
        }
      }

      const newClass = new Class({
        name,
        level: level || "A1",
        teacherId,
        studentIds: studentIds || [],
        term,
        tuition: tuition || 0,
        schedule,
        room,
        status: status || "در حال ثبت‌نام",
        createdBy,
        startDate,
        endDate,
        capacity: capacity || 10,
        totalSessions: totalSessions || 12,
        description,
        isConfirmed: false,
      });

      await newClass.save();
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
      } = data;

      const existingClass = await Class.findById(id);
      if (!existingClass) throw new Error("Class not found");

      // بررسی وجود استاد
      if (teacherId) {
        const teacher = await User.findOne({ _id: teacherId, role: "Teacher" });
        if (!teacher) throw new Error("Teacher not found or invalid role");
      }

      const updatedClass = await Class.findByIdAndUpdate(
        id,
        {
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
        },
        { new: true, runValidators: true },
      );

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
      const classData = await Class.findById(id)
        .populate("teacherId", "name employeeCode phone email specialization")
        .populate(
          "studentIds",
          "name employeeCode phone email level emergencyPhone",
        )
        .populate("createdBy", "name employeeCode");

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
      const deletedClass = await Class.findByIdAndDelete(id);
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
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      // بررسی وجود دانشجو
      const student = await User.findOne({ _id: studentId, role: "Student" });
      if (!student) throw new Error("Student not found or invalid role");

      // بررسی ظرفیت
      if (!classData.hasCapacity()) {
        throw new Error("Class capacity is full");
      }

      // بررسی تکراری نبودن
      if (classData.studentIds.includes(studentId)) {
        throw new Error("Student already enrolled in this class");
      }

      classData.studentIds.push(studentId);
      await classData.save();

      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ حذف دانشجو از کلاس
  // =====================================
  async removeStudentFromClass(classId, studentId) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      classData.studentIds = classData.studentIds.filter(
        (id) => id.toString() !== studentId.toString(),
      );
      await classData.save();

      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ افزودن چند دانشجو به کلاس
  // =====================================
  async addMultipleStudentsToClass(classId, studentIds) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        throw new Error("Please provide an array of student IDs");
      }

      // بررسی وجود دانشجوها
      const students = await User.find({
        _id: { $in: studentIds },
        role: "Student",
      });
      if (students.length !== studentIds.length) {
        throw new Error("Some students not found or invalid role");
      }

      // بررسی ظرفیت
      if (
        classData.studentIds.length + studentIds.length >
        classData.capacity
      ) {
        throw new Error("Adding these students would exceed class capacity");
      }

      // افزودن دانشجوهای جدید (بدون تکراری)
      const newStudents = studentIds.filter(
        (id) => !classData.studentIds.includes(id),
      );
      classData.studentIds.push(...newStudents);
      await classData.save();

      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تأیید نهایی کلاس توسط مدیر
  // =====================================
  async confirmClass(classId, adminId) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      await classData.confirm(adminId);
      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لغو کلاس
  // =====================================
  async cancelClass(classId) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      await classData.cancel();
      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تکمیل کلاس
  // =====================================
  async completeClass(classId) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      await classData.complete();
      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تغییر وضعیت کلاس
  // =====================================
  async changeClassStatus(classId, status) {
    try {
      const validStatuses = ["در حال ثبت‌نام", "فعال", "تکمیل شده", "لغو شده"];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      const classData = await Class.findByIdAndUpdate(
        classId,
        { status },
        { new: true },
      );
      if (!classData) throw new Error("Class not found");

      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های فعال
  // =====================================
  async listActiveClasses() {
    try {
      const classes = await Class.findActiveClasses()
        .populate("teacherId", "name employeeCode")
        .populate("studentIds", "name employeeCode");
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
      const classes = await Class.findUnconfirmedClasses()
        .populate("teacherId", "name employeeCode")
        .populate("createdBy", "name employeeCode");
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
      const teacher = await User.findOne({ _id: teacherId, role: "Teacher" });
      if (!teacher) throw new Error("Teacher not found");

      const classes = await Class.findByTeacher(teacherId).populate(
        "studentIds",
        "name employeeCode",
      );
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
      const student = await User.findOne({ _id: studentId, role: "Student" });
      if (!student) throw new Error("Student not found");

      const classes = await Class.findByStudent(studentId).populate(
        "teacherId",
        "name employeeCode",
      );
      return classes;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ لیست کلاس‌های یک ترم خاص
  // =====================================
  async getClassesByTerm(termName) {
    try {
      const classes = await Class.findByTerm(termName)
        .populate("teacherId", "name employeeCode")
        .populate("studentIds", "name employeeCode");
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

      const classes = await Class.findByLevel(level)
        .populate("teacherId", "name employeeCode")
        .populate("studentIds", "name employeeCode");
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
  }) {
    try {
      const query = {};
      if (status) query.status = status;
      if (level) query.level = level;
      if (term) query.term = term;
      if (isConfirmed !== undefined) query.isConfirmed = isConfirmed;

      const classes = await Class.find(query)
        .populate("teacherId", "name employeeCode")
        .populate("studentIds", "name employeeCode")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Class.countDocuments(query);

      return { classes, total, page, limit };
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ آمار کلاس‌ها برای داشبورد
  // =====================================
  async getClassStats() {
    try {
      const totalClasses = await Class.countDocuments();
      const activeClasses = await Class.countDocuments({
        status: "فعال",
        isConfirmed: true,
      });
      const pendingClasses = await Class.countDocuments({ isConfirmed: false });
      const completedClasses = await Class.countDocuments({
        status: "تکمیل شده",
      });
      const canceledClasses = await Class.countDocuments({ status: "لغو شده" });

      // آمار بر اساس سطح
      const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
      const classesByLevel = {};
      for (const level of levels) {
        classesByLevel[level] = await Class.countDocuments({ level });
      }

      // مجموع دانشجوهای ثبت‌نام شده در کل کلاس‌ها
      const allClasses = await Class.find();
      let totalEnrollments = 0;
      for (const classData of allClasses) {
        totalEnrollments += classData.studentIds.length;
      }

      return {
        totalClasses,
        activeClasses,
        pendingClasses,
        completedClasses,
        canceledClasses,
        classesByLevel,
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
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      // بررسی تکراری نبودن شماره جلسه
      const existingSession = classData.sessions.find(
        (s) => s.sessionNumber === sessionNumber,
      );
      if (existingSession) {
        throw new Error("Session number already exists");
      }

      classData.sessions.push({
        sessionNumber,
        date,
        topic,
        isCompleted: false,
      });

      await classData.save();
      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ تکمیل جلسه
  // =====================================
  async completeSession(classId, sessionNumber) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      const session = classData.sessions.find(
        (s) => s.sessionNumber === sessionNumber,
      );
      if (!session) throw new Error("Session not found");

      session.isCompleted = true;
      await classData.save();

      return classData;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ دریافت لیست دانشجوهای یک کلاس
  // =====================================
  async getClassStudents(classId) {
    try {
      const classData = await Class.findById(classId).populate(
        "studentIds",
        "name employeeCode phone email level emergencyPhone status",
      );

      if (!classData) throw new Error("Class not found");
      return classData.studentIds;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ بررسی ظرفیت کلاس
  // =====================================
  async checkClassCapacity(classId) {
    try {
      const classData = await Class.findById(classId);
      if (!classData) throw new Error("Class not found");

      return {
        hasCapacity: classData.hasCapacity(),
        remainingSeats: classData.getRemainingSeats(),
        currentStudents: classData.studentIds.length,
        capacity: classData.capacity,
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ClassService();

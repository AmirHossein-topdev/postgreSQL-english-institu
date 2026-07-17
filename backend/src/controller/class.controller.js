// backend/controllers/class.controller.js
const ClassService = require("../services/class.service");
const UserService = require("../services/user.service");

class ClassController {
  // =======================
  // ✅ ایجاد کلاس جدید توسط مدیر
  // =======================
  async createClass(req, res) {
    try {
      const classData = {
        name: req.body.name,
        level: req.body.level,
        teacherId: req.body.teacherId,
        term: req.body.term,
        tuition: req.body.tuition,
        schedule: req.body.schedule,
        room: req.body.room,
        status: req.body.status || "UNDER_REGISTRATION",
        createdById: req.user.id, // از توکن احراز هویت گرفته میشه
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        capacity: req.body.capacity || 10,
        totalSessions: req.body.totalSessions || 12,
        description: req.body.description,
      };

      const newClass = await ClassService.createClass(classData);
      res.status(201).json({ success: true, data: newClass });
    } catch (err) {
      console.error("=== CREATE CLASS ERROR ===", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ آپدیت کلاس
  // =======================
  async updateClass(req, res) {
    try {
      const updatedClass = await ClassService.updateClass(
        req.params.id,
        req.body,
      );
      res.json({ success: true, data: updatedClass });
    } catch (err) {
      console.error("=== UPDATE CLASS ERROR ===", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کلاس با ID
  // =======================
  async getClassById(req, res) {
    try {
      const classData = await ClassService.getClassById(req.params.id);
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ حذف کلاس
  // =======================
  async deleteClass(req, res) {
    try {
      const deletedClass = await ClassService.deleteClass(req.params.id);
      res.json({ success: true, data: deletedClass });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ افزودن دانشجو به کلاس
  // =======================
  async addStudentToClass(req, res) {
    try {
      const { studentId } = req.body;
      const classData = await ClassService.addStudentToClass(
        req.params.id,
        studentId,
      );
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ حذف دانشجو از کلاس
  // =======================
  async removeStudentFromClass(req, res) {
    try {
      const { studentId } = req.body;
      const classData = await ClassService.removeStudentFromClass(
        req.params.id,
        studentId,
      );
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ افزودن چند دانشجو به کلاس (انتخاب گروهی)
  // =======================
  async addMultipleStudentsToClass(req, res) {
    try {
      const { studentIds } = req.body;
      const classData = await ClassService.addMultipleStudentsToClass(
        req.params.id,
        studentIds,
      );
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تأیید نهایی کلاس توسط مدیر
  // =======================
  async confirmClass(req, res) {
    try {
      const classData = await ClassService.confirmClass(
        req.params.id,
        req.user.id,
      );
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لغو کلاس
  // =======================
  async cancelClass(req, res) {
    try {
      const classData = await ClassService.cancelClass(req.params.id);
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تکمیل کلاس
  // =======================
  async completeClass(req, res) {
    try {
      const classData = await ClassService.completeClass(req.params.id);
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تغییر وضعیت کلاس
  // =======================
  async changeClassStatus(req, res) {
    try {
      const { status } = req.body;
      const classData = await ClassService.changeClassStatus(
        req.params.id,
        status,
      );
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌های فعال
  // =======================
  async listActiveClasses(req, res) {
    try {
      const classes = await ClassService.listActiveClasses();
      res.json({ success: true, data: classes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌های تأیید نشده (نیاز به تأیید مدیر)
  // =======================
  async listUnconfirmedClasses(req, res) {
    try {
      const classes = await ClassService.listUnconfirmedClasses();
      res.json({ success: true, data: classes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌های یک استاد خاص
  // =======================
  async getClassesByTeacher(req, res) {
    try {
      const { teacherId } = req.params;
      const classes = await ClassService.getClassesByTeacher(teacherId);
      res.json({ success: true, data: classes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌های یک دانشجو خاص
  // =======================
  async getClassesByStudent(req, res) {
    try {
      const { studentId } = req.params;
      const classes = await ClassService.getClassesByStudent(studentId);
      res.json({ success: true, data: classes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌های یک ترم خاص
  // =======================
  async getClassesByTerm(req, res) {
    try {
      const { term } = req.params;
      const classes = await ClassService.getClassesByTerm(term);
      res.json({ success: true, data: classes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌های یک سطح خاص
  // =======================
  async getClassesByLevel(req, res) {
    try {
      const { level } = req.params;
      const classes = await ClassService.getClassesByLevel(level);
      res.json({ success: true, data: classes });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کلاس‌ها با فیلتر و صفحه‌بندی
  // =======================
  async listAllClasses(req, res) {
    try {
      const { page, limit, status, level, term, isConfirmed } = req.query;
      const result = await ClassService.listAllClasses({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
        level,
        term,
        isConfirmed:
          isConfirmed === "true"
            ? true
            : isConfirmed === "false"
              ? false
              : undefined,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت آمار کلاس‌ها (برای داشبورد)
  // =======================
  async getClassStats(req, res) {
    try {
      const stats = await ClassService.getClassStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ افزودن جلسه به کلاس
  // =======================
  async addSessionToClass(req, res) {
    try {
      const { sessionNumber, date, topic } = req.body;
      const classData = await ClassService.addSessionToClass(req.params.id, {
        sessionNumber,
        date,
        topic,
      });
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تکمیل جلسه
  // =======================
  async completeSession(req, res) {
    try {
      const { sessionNumber } = req.body;
      const classData = await ClassService.completeSession(
        req.params.id,
        sessionNumber,
      );
      res.json({ success: true, data: classData });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت لیست دانشجوهای یک کلاس
  // =======================
  async getClassStudents(req, res) {
    try {
      const students = await ClassService.getClassStudents(req.params.id);
      res.json({ success: true, data: students });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ بررسی ظرفیت کلاس
  // =======================
  async checkClassCapacity(req, res) {
    try {
      const classData = await ClassService.getClassById(req.params.id);
      const currentStudents = await ClassService.getClassStudentsCount(
        req.params.id,
      );
      const remainingSeats = classData.capacity - currentStudents;
      const hasCapacity = remainingSeats > 0;

      res.json({
        success: true,
        data: {
          hasCapacity,
          remainingSeats,
          currentStudents,
          capacity: classData.capacity,
        },
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ClassController();

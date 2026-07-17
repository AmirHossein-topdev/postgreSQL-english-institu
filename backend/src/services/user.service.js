// backend/services/user.service.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

class UserService {
  // =====================================
  // ✅ ایجاد کاربر جدید با ذخیره ایمیل + عکس + تاریخ تولد + نقش
  // =====================================
  async createUser(data) {
    try {
      const {
        name,
        employeeCode,
        password,
        email,
        phone,
        role = "Student",
        address,
        status = "ACTIVE",
        profileImage,
        birthday,
        specialization,
        hireDate,
        salary,
        level,
        emergencyPhone,
      } = data;

      // بررسی یکتا بودن کد کارمند
      const exist = await prisma.user.findUnique({
        where: { employeeCode },
      });
      if (exist) throw new Error("Employee code already exists");

      // بررسی یکتا بودن ایمیل (اگر داده شده)
      if (email) {
        const emailExist = await prisma.user.findUnique({
          where: { email },
        });
        if (emailExist) throw new Error("Email already exists");
      }

      // آماده‌سازی داده‌های User
      const userData = {
        name,
        employeeCode,
        email,
        phone,
        password,
        role,
        address,
        status,
        profileImage: profileImage || "default-avatar.png",
        birthday,
      };

      // اگر نقش Teacher است و فیلدهای تخصصی دارد
      if (role === "Teacher" && (specialization || hireDate || salary)) {
        userData.teacherProfile = {
          create: {
            specialization: specialization || null,
            hireDate: hireDate ? new Date(hireDate) : null,
            salary: salary ? parseFloat(salary) : null,
          },
        };
      }

      // اگر نقش Student است و فیلدهای تخصصی دارد
      if (role === "Student" && (level || emergencyPhone)) {
        userData.studentProfile = {
          create: {
            level: level || "A1",
            emergencyPhone: emergencyPhone || null,
          },
        };
      }

      const user = await prisma.user.create({
        data: userData,
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ آپدیت کاربر + آپلود تصویر جدید + هش پسورد جدید
  // =====================================
  async updateUser(id, data) {
    try {
      // هش پسورد در صورت وجود
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      // جدا کردن فیلدهای Teacher
      const teacherData = {};
      if (data.specialization !== undefined)
        teacherData.specialization = data.specialization;
      if (data.hireDate !== undefined)
        teacherData.hireDate = data.hireDate ? new Date(data.hireDate) : null;
      if (data.salary !== undefined)
        teacherData.salary = data.salary ? parseFloat(data.salary) : null;

      // جدا کردن فیلدهای Student
      const studentData = {};
      if (data.level !== undefined) studentData.level = data.level;
      if (data.emergencyPhone !== undefined)
        studentData.emergencyPhone = data.emergencyPhone;

      // حذف فیلدهای اضافی از data اصلی
      delete data.specialization;
      delete data.hireDate;
      delete data.salary;
      delete data.level;
      delete data.emergencyPhone;
      delete data.teacherProfile;
      delete data.studentProfile;

      // آپدیت User
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...data,
          // آپدیت Teacher اگر فیلدهای آن وجود داشته باشد
          teacherProfile:
            Object.keys(teacherData).length > 0
              ? {
                  upsert: {
                    create: teacherData,
                    update: teacherData,
                  },
                }
              : undefined,
          // آپدیت Student اگر فیلدهای آن وجود داشته باشد
          studentProfile:
            Object.keys(studentData).length > 0
              ? {
                  upsert: {
                    create: studentData,
                    update: studentData,
                  },
                }
              : undefined,
        },
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      });

      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    } catch (err) {
      throw err;
    }
  }

  // =====================================
  // ✅ دریافت کاربر با employeeCode
  // =====================================
  async getUserByEmployeeCode(code) {
    const user = await prisma.user.findUnique({
      where: { employeeCode: code },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  // =====================================
  // ✅ دریافت کاربر با ID
  // =====================================
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  // =====================================
  // ✅ حذف کاربر
  // =====================================
  async deleteUser(id) {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    if (!deletedUser) throw new Error("User not found");
    return deletedUser;
  }

  // =====================================
  // ✅ بررسی پسورد
  // =====================================
  async verifyPassword(user, password) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");
    return true;
  }

  // =====================================
  // ✅ تولید توکن ریست پسورد
  // =====================================
  async generatePasswordResetToken(user) {
    const token = crypto.randomBytes(32).toString("hex");

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 ساعت اعتبار
      },
    });

    return token;
  }

  // =====================================
  // ✅ گرفتن کاربر با توکن ریست پسورد
  // =====================================
  async getUserByResetToken(token) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new Error("Invalid or expired token");
    return user;
  }

  // =====================================
  // ✅ ریست پسورد
  // =====================================
  async resetPassword(user, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return updatedUser;
  }

  // =====================================
  // ✅ تغییر وضعیت کاربر
  // =====================================
  async changeUserStatus(id, status) {
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      throw new Error("Invalid status. Must be ACTIVE or INACTIVE");
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      include: {
        teacherProfile: true,
        studentProfile: true,
      },
    });

    if (!user) throw new Error("User not found");
    return user;
  }

  // =====================================
  // ✅ لیست کاربران با فیلتر و صفحه‌بندی + فیلتر بر اساس نقش
  // =====================================
  async listUsers({ page = 1, limit = 10, status, role }) {
    const where = {};
    if (status) where.status = status;
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          teacherProfile: true,
          studentProfile: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }
}

module.exports = new UserService();

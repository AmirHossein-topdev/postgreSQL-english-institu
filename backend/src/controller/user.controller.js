// backend/controller/user.controller.js
const UserService = require("../services/user.service");
const bcrypt = require("bcryptjs");

class UserController {
  // =======================
  // ✅ ایجاد کاربر با عکس و رول مستقیم
  // =======================
  async createUser(req, res) {
    try {
      console.log("========== ALL FIELDS ==========");
      console.log("req.body.name:", req.body.name);
      console.log("req.body.phone:", req.body.phone);
      console.log("req.body.salary:", req.body.salary);
      console.log("req.body.specialization:", req.body.specialization);
      console.log("req.body.hireDate:", req.body.hireDate);
      console.log("req.body.level:", req.body.level);
      console.log("req.body.emergencyPhone:", req.body.emergencyPhone);
      console.log("================================");

      const userData = {
        name: req.body.name,
        employeeCode: req.body.employeeCode,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role || "Student",
        phone: req.body.phone,
        address: req.body.address,
        status: req.body.status ? req.body.status.toUpperCase() : "ACTIVE",
        profileImage: req.file
          ? `/uploads/users/${req.file.filename}`
          : "default-avatar.png",
        birthday: req.body.birthday,
        // فیلدهای اضافی برای استاد
        specialization: req.body.specialization,
        hireDate: req.body.hireDate ? new Date(req.body.hireDate) : null,
        salary: req.body.salary ? parseFloat(req.body.salary) : null,
        // فیلدهای اضافی برای دانشجو
        level: req.body.level || "A1",
        emergencyPhone: req.body.emergencyPhone,
      };

      console.log("📦 userData قبل از ارسال به سرویس:", userData);

      // هش کردن پسورد در صورت وجود
      if (userData.password && userData.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      const user = await UserService.createUser(userData);
      console.log("✅ کاربر ایجاد شده:", user);

      res.status(201).json({ success: true, data: user });
    } catch (err) {
      console.error("=== CREATE USER ERROR ===", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ آپدیت کاربر با امکان تغییر تصویر و رول مستقیم
  // =======================
  async updateUser(req, res) {
    try {
      // آپلود تصویر
      if (req.file) {
        req.body.profileImage = `/uploads/users/${req.file.filename}`;
      }

      // هش کردن پسورد در صورت داده شدن
      if (req.body.password && req.body.password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } else {
        delete req.body.password;
      }

      // تبدیل status به uppercase اگر وجود داشته باشد
      if (req.body.status) {
        req.body.status = req.body.status.toUpperCase();
      }

      // تبدیل hireDate به Date اگر وجود داشته باشد
      if (req.body.hireDate) {
        req.body.hireDate = new Date(req.body.hireDate);
      }

      // تبدیل salary به Number اگر وجود داشته باشد
      if (req.body.salary) {
        req.body.salary = parseFloat(req.body.salary);
      }

      const updatedUser = await UserService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: updatedUser });
    } catch (err) {
      console.error("=== UPDATE USER ERROR ===", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کاربر با employeeCode
  // =======================
  async getUserByEmployeeCode(req, res) {
    try {
      const user = await UserService.getUserByEmployeeCode(req.params.code);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کاربر با ID
  // =======================
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ حذف کاربر
  // =======================
  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      res.json({ success: true, data: deletedUser });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ بررسی پسورد کاربر
  // =======================
  async verifyPassword(req, res) {
    try {
      const { password } = req.body;
      const user = await UserService.getUserById(req.params.id);
      await UserService.verifyPassword(user, password);
      res.json({ success: true, message: "Password is correct" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تولید توکن ریست رمز عبور
  // =======================
  async generatePasswordResetToken(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      const token = await UserService.generatePasswordResetToken(user);
      res.json({ success: true, token });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ ریست پسورد با توکن
  // =======================
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const user = await UserService.getUserByResetToken(token);
      await UserService.resetPassword(user, newPassword);
      res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تغییر وضعیت کاربر
  // =======================
  async changeUserStatus(req, res) {
    try {
      const status = req.body.status.toUpperCase();
      if (!["ACTIVE", "INACTIVE"].includes(status)) {
        throw new Error("Invalid status. Must be ACTIVE or INACTIVE");
      }
      const user = await UserService.changeUserStatus(req.params.id, status);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کاربران با فیلتر و صفحه‌بندی
  // =======================
  async listUsers(req, res) {
    try {
      const { page, limit, status, role } = req.query;
      const result = await UserService.listUsers({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status: status ? status.toUpperCase() : undefined,
        role,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new UserController();

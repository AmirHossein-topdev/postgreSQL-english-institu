// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Middleware برای احراز هویت
// میتونی roles رو به عنوان آرایه پاس بدی، برای محدود کردن دسترسی به نقش‌های خاص
const protect =
  (roles = []) =>
  async (req, res, next) => {
    try {
      let token;

      // 1️⃣ بررسی هدر Authorization
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }
      // 2️⃣ بررسی کوکی HttpOnly
      else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      // ✅ اگر توکن وجود نداشت، یک Admin از دیتابیس بگیر (برای توسعه)
      if (!token) {
        console.log("⚠️ No token found, using fallback admin for development");
        
        const admin = await prisma.user.findFirst({
          where: { role: "Admin" },
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
            teacherProfile: {
              select: {
                id: true,
                specialization: true,
                hireDate: true,
                salary: true,
                resume: true,
              },
            },
            studentProfile: {
              select: {
                id: true,
                level: true,
                emergencyPhone: true,
                registeredDate: true,
              },
            },
          },
        });

        if (!admin) {
          return res.status(500).json({
            success: false,
            message: "هیچ کاربر Admin در دیتابیس وجود ندارد! لطفاً ابتدا یک Admin ایجاد کنید.",
          });
        }

        // ✅ بررسی نقش‌ها (اگر داده شده)
        if (roles.length && !roles.includes(admin.role)) {
          return res.status(403).json({
            success: false,
            message: "دسترسی کافی برای این عملیات ندارید.",
          });
        }

        // ✅ attach کردن admin به request
        req.user = admin;
        console.log("✅ Fallback admin set:", admin.id, admin.name);
        return next();
      }

      // 3️⃣ بررسی اعتبار JWT (اگر توکن وجود داشت)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "توکن معتبر نیست یا منقضی شده است.",
        });
      }

      // 4️⃣ گرفتن اطلاعات کاربر از DB با Prisma
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
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
          teacherProfile: {
            select: {
              id: true,
              specialization: true,
              hireDate: true,
              salary: true,
              resume: true,
            },
          },
          studentProfile: {
            select: {
              id: true,
              level: true,
              emergencyPhone: true,
              registeredDate: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "کاربر یافت نشد.",
        });
      }

      // 5️⃣ بررسی نقش‌ها (اگر داده شده)
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "دسترسی کافی برای این عملیات ندارید.",
        });
      }

      // 6️⃣ attach کردن user به request
      req.user = user;

      next();
    } catch (err) {
      console.error("AuthMiddleware Error:", err);
      return res.status(401).json({
        success: false,
        message: "خطای احراز هویت",
        error: err.message,
      });
    }
  };

// Middleware برای محدود کردن فقط به نقش‌های خاص
const authorize = (...roles) => protect(roles);

module.exports = {
  protect,
  authorize,
};
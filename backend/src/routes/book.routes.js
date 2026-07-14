// backend/routes/book.routes.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createUploader = require("../../middleware/uploader");

const authMiddleware = (req, res, next) => next();
const roleMiddleware = (roles) => (req, res, next) => next();

const bookUpload = createUploader("books");

// ==========================================
// 1️⃣ روت‌های استاتیک و خاص (باید بالاتر باشند)
// ==========================================

// ✅ GET STATS: آمار کتاب‌ها
router.get(
  "/stats/dashboard",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const [
        totalBooks,
        availableBooks,
        lowStockBooks,
        outOfStockBooks,
        categories,
        allBooks,
      ] = await Promise.all([
        prisma.book.count(),
        prisma.book.count({
          where: {
            status: "AVAILABLE",
            stock: { gt: 0 },
          },
        }),
        prisma.book.count({
          where: {
            stock: { lt: 5, gt: 0 },
          },
        }),
        prisma.book.count({
          where: { stock: 0 },
        }),
        prisma.book.findMany({
          select: { category: true },
          distinct: ["category"],
        }),
        prisma.book.findMany(),
      ]);

      const totalStock = allBooks.reduce(
        (sum, book) => sum + (book.stock || 0),
        0,
      );
      const totalValue = allBooks.reduce(
        (sum, book) => sum + (parseFloat(book.price) || 0) * (book.stock || 0),
        0,
      );

      const levels = ["A1", "A2", "B1", "B2", "C1", "C2", "All"];
      const booksByLevel = {};
      for (const level of levels) {
        booksByLevel[level] = await prisma.book.count({ where: { level } });
      }

      res.json({
        success: true,
        stats: {
          totalBooks,
          availableBooks,
          lowStockBooks,
          outOfStockBooks,
          totalStock,
          totalValue,
          categoriesCount: categories.length,
          booksByLevel,
        },
      });
    } catch (err) {
      console.error("❌ Error fetching book stats:", err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// ✅ GET CATEGORIES: دریافت همه دسته‌بندی‌ها
router.get("/categories/all", authMiddleware, async (req, res) => {
  try {
    const categories = await prisma.book.findMany({
      select: { category: true },
      distinct: ["category"],
    });
    res.json({ success: true, categories: categories.map((c) => c.category) });
  } catch (err) {
    console.error("❌ Error fetching categories:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ GET AVAILABLE: دریافت کتاب‌های موجود
router.get("/available/list", authMiddleware, async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        stock: { gt: 0 },
        status: "AVAILABLE",
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, books });
  } catch (err) {
    console.error("❌ Error fetching available books:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ SEARCH BOOKS: جستجوی کتاب‌ها
router.get("/search/query", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const books = await prisma.book.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
        status: "AVAILABLE",
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, books });
  } catch (err) {
    console.error("❌ Error searching books:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ LIST BOOKS: لیست کتاب‌ها با فیلتر و صفحه‌بندی
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { page, limit, category, level, language, status, search } =
      req.query;
    const where = {};

    if (category) where.category = category;
    if (level) where.level = level;
    if (language) where.language = language;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    res.json({
      success: true,
      books,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("❌ Error listing books:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ==========================================
// 2️⃣ روت‌های کراد پایه (CREATE)
// ==========================================

// ✅ CREATE: ایجاد کتاب جدید
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Admin"]),
  bookUpload.single("img"),
  async (req, res) => {
    try {
      const {
        productId,
        category,
        name,
        level,
        price,
        stock,
        description,
        language,
        status,
      } = req.body;

      const existProductId = await prisma.book.findUnique({
        where: { productId: parseInt(productId) },
      });
      if (existProductId) {
        return res
          .status(400)
          .json({ success: false, message: "Product ID already exists" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Please upload book image" });
      }

      const img = `/books/${req.file.filename}`;

      const newBook = await prisma.book.create({
        data: {
          productId: parseInt(productId),
          category,
          name,
          level: level || "All",
          price: parseFloat(price),
          img,
          stock: stock ? parseInt(stock) : 0,
          description: description || "",
          language: language || "Persian",
          status: status || "AVAILABLE",
        },
      });

      res.status(201).json({ success: true, data: newBook });
    } catch (err) {
      console.error("❌ Error creating book:", err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// ==========================================
// 3️⃣ روت‌های دارای پارامترهای خاص (مثل /category/:category)
// ==========================================

// ✅ GET BY PRODUCT ID: دریافت کتاب با productId (داینامیک خاص)
router.get("/product/:productId", authMiddleware, async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { productId: parseInt(req.params.productId) },
    });
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.json({ success: true, book });
  } catch (err) {
    console.error("❌ Error fetching book by productId:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ GET BY CATEGORY: دریافت کتاب‌های یک دسته‌بندی
// این روت باید پایین‌تر از /categories/all باشد تا کلمه all با نام دسته‌بندی اشتباه گرفته نشود.
router.get("/category/:category", authMiddleware, async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        category: req.params.category,
        status: "AVAILABLE",
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, books });
  } catch (err) {
    console.error("❌ Error fetching books by category:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ GET BY LEVEL: دریافت کتاب‌های یک سطح
router.get("/level/:level", authMiddleware, async (req, res) => {
  try {
    const validLevels = ["A1", "A2", "B1", "B2", "C1", "C2", "All"];
    if (!validLevels.includes(req.params.level)) {
      return res.status(400).json({ message: "Invalid level" });
    }

    const books = await prisma.book.findMany({
      where: {
        level: req.params.level,
        status: "AVAILABLE",
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, books });
  } catch (err) {
    console.error("❌ Error fetching books by level:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4️⃣ روت‌های عمومی‌تر داینامیک (عمومی‌ترین روت‌ها در انتهای فایل)
// ==========================================

// ✅ READ: دریافت کتاب با ID (UUID)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
    });
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.json({ success: true, book });
  } catch (err) {
    console.error("❌ Error fetching book:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ✅ UPDATE: آپدیت کتاب
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  bookUpload.single("img"),
  async (req, res) => {
    try {
      const { productId, ...updateData } = req.body;

      if (productId) {
        const existProductId = await prisma.book.findFirst({
          where: {
            productId: parseInt(productId),
            NOT: { id: req.params.id },
          },
        });
        if (existProductId) {
          return res
            .status(400)
            .json({ success: false, message: "Product ID already exists" });
        }
        updateData.productId = parseInt(productId);
      }

      if (req.file) {
        updateData.img = `/books/${req.file.filename}`;
      }

      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.stock) updateData.stock = parseInt(updateData.stock);

      const updatedBook = await prisma.book.update({
        where: { id: req.params.id },
        data: updateData,
      });

      res.json({ success: true, data: updatedBook });
    } catch (err) {
      console.error("❌ Error updating book:", err.message);
      if (err.code === "P2025") {
        return res
          .status(404)
          .json({ success: false, message: "Book not found" });
      }
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// ✅ PATCH STATUS: تغییر وضعیت کتاب
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      if (!["AVAILABLE", "UNAVAILABLE"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedBook = await prisma.book.update({
        where: { id: req.params.id },
        data: { status },
      });

      res.json({ success: true, book: updatedBook });
    } catch (err) {
      console.error("❌ Error updating book status:", err.message);
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// ✅ PATCH STOCK: تغییر موجودی کتاب
router.patch(
  "/:id/stock",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      const { stock } = req.body;
      if (stock === undefined || stock < 0) {
        return res.status(400).json({ message: "Invalid stock quantity" });
      }

      const updatedBook = await prisma.book.update({
        where: { id: req.params.id },
        data: { stock: parseInt(stock) },
      });

      res.json({ success: true, book: updatedBook });
    } catch (err) {
      console.error("❌ Error updating book stock:", err.message);
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

// ✅ DELETE: حذف کتاب
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  async (req, res) => {
    try {
      await prisma.book.delete({
        where: { id: req.params.id },
      });
      res.json({ success: true, message: "Book deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting book:", err.message);
      if (err.code === "P2025") {
        return res.status(404).json({ message: "Book not found" });
      }
      res.status(400).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;

// backend/controllers/book.controller.js
const BookService = require("../services/book.service");

class BookController {
  // =======================
  // ✅ ایجاد کتاب جدید
  // =======================
  async createBook(req, res) {
    try {
      const bookData = {
        productId: req.body.productId,
        category: req.body.category,
        name: req.body.name,
        level: req.body.level || "All",
        price: req.body.price,
        img: req.body.img,
        stock: req.body.stock || 0,
        description: req.body.description,
        language: req.body.language || "Persian",
        status: req.body.status || "available",
      };

      const book = await BookService.createBook(bookData);
      res.status(201).json({ success: true, data: book });
    } catch (err) {
      console.error("=== CREATE BOOK ERROR ===", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ آپدیت کتاب
  // =======================
  async updateBook(req, res) {
    try {
      const updatedBook = await BookService.updateBook(req.params.id, req.body);
      res.json({ success: true, data: updatedBook });
    } catch (err) {
      console.error("=== UPDATE BOOK ERROR ===", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کتاب با ID
  // =======================
  async getBookById(req, res) {
    try {
      const book = await BookService.getBookById(req.params.id);
      res.json({ success: true, data: book });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کتاب با productId
  // =======================
  async getBookByProductId(req, res) {
    try {
      const book = await BookService.getBookByProductId(req.params.productId);
      res.json({ success: true, data: book });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ حذف کتاب
  // =======================
  async deleteBook(req, res) {
    try {
      const deletedBook = await BookService.deleteBook(req.params.id);
      res.json({ success: true, data: deletedBook });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تغییر وضعیت کتاب (available/unavailable)
  // =======================
  async changeBookStatus(req, res) {
    try {
      const book = await BookService.changeBookStatus(
        req.params.id,
        req.body.status,
      );
      res.json({ success: true, data: book });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ تغییر موجودی کتاب
  // =======================
  async updateBookStock(req, res) {
    try {
      const { stock } = req.body;
      const book = await BookService.updateBookStock(req.params.id, stock);
      res.json({ success: true, data: book });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ لیست کتاب‌ها با فیلتر و صفحه‌بندی
  // =======================
  async listBooks(req, res) {
    try {
      const { page, limit, category, level, language, status, search } =
        req.query;
      const result = await BookService.listBooks({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        category,
        level,
        language,
        status,
        search,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت تمام دسته‌بندی‌های کتاب
  // =======================
  async getCategories(req, res) {
    try {
      const categories = await BookService.getCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کتاب‌های یک دسته‌بندی خاص
  // =======================
  async getBooksByCategory(req, res) {
    try {
      const books = await BookService.getBooksByCategory(req.params.category);
      res.json({ success: true, data: books });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کتاب‌های یک سطح خاص
  // =======================
  async getBooksByLevel(req, res) {
    try {
      const books = await BookService.getBooksByLevel(req.params.level);
      res.json({ success: true, data: books });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت کتاب‌های موجود (stock > 0)
  // =======================
  async getAvailableBooks(req, res) {
    try {
      const books = await BookService.getAvailableBooks();
      res.json({ success: true, data: books });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ جستجوی کتاب بر اساس نام یا نویسنده
  // =======================
  async searchBooks(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res
          .status(400)
          .json({ success: false, message: "Search query is required" });
      }
      const books = await BookService.searchBooks(q);
      res.json({ success: true, data: books });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // =======================
  // ✅ دریافت آمار کتاب‌ها (برای داشبورد)
  // =======================
  async getBookStats(req, res) {
    try {
      const stats = await BookService.getBookStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new BookController();

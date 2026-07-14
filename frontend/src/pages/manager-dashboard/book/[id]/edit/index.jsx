"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../layout";
import {
  Upload,
  CheckCircle,
  XCircle,
  BookOpen,
  DollarSign,
  Package,
  AlignLeft,
  Globe,
} from "lucide-react";
import Swal from "sweetalert2";

const CATEGORY_OPTIONS = [
  { value: "IELTS", label: "آیلتس (IELTS)" },
  { value: "TOEFL", label: "تافل (TOEFL)" },
  { value: "Conversation", label: "مکالمه (Conversation)" },
  { value: "Grammar", label: "گرامر (Grammar)" },
  { value: "Vocabulary", label: "لغات (Vocabulary)" },
  { value: "Listening", label: "لیسنینگ (Listening)" },
  { value: "Reading", label: "ریدینگ (Reading)" },
  { value: "Writing", label: "رایتینگ (Writing)" },
  { value: "Kids", label: "کودکان (Kids)" },
  { value: "General", label: "عمومی (General)" },
];

const LEVEL_OPTIONS = [
  { value: "A1", label: "A1 (مبتدی)" },
  { value: "A2", label: "A2 (مقدماتی)" },
  { value: "B1", label: "B1 (متوسط 1)" },
  { value: "B2", label: "B2 (متوسط 2)" },
  { value: "C1", label: "C1 (پیشرفته)" },
  { value: "C2", label: "C2 (عالی)" },
  { value: "All", label: "همه سطوح" },
];

const LANGUAGE_OPTIONS = [
  { value: "Persian", label: "فارسی" },
  { value: "English", label: "انگلیسی" },
  { value: "French", label: "فرانسوی" },
  { value: "German", label: "آلمانی" },
  { value: "Arabic", label: "عربی" },
];

export default function EditBookPage() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    productId: "",
    category: "",
    name: "",
    level: "All",
    price: "",
    stock: "",
    description: "",
    language: "English",
    status: "AVAILABLE",
    img: null,
  });

  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        // اصلاح آدرس از /api/book/ به /api/books/ برای هماهنگی با بک‌اند
        const res = await fetch(`http://localhost:5000/api/books/${id}`);
        const result = await res.json();
        const book = result.data || result.book;

        if (book) {
          setFormData({
            productId: book.productId || "",
            category: book.category || "",
            name: book.name || "",
            level: book.level || "All",
            price: book.price || "",
            stock: book.stock || "",
            description: book.description || "",
            language: book.language || "English",
            status: book.status || "AVAILABLE",
            img: null,
          });

          if (book.img) {
            // اصلاح مسیر نمایش تصویر بر اساس آدرس‌دهی استاتیک آپلودر بک‌اند
            setPreviewImg(`http://localhost:5000${book.img}`);
          }
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "خطا!",
          text: "مشکلی در دریافت اطلاعات کتاب رخ داد",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#ef4444",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, img: file }));
        setPreviewImg(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("productId", formData.productId);
      data.append("category", formData.category);
      data.append("name", formData.name);
      data.append("level", formData.level);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description || "");
      data.append("language", formData.language);
      data.append("status", formData.status);
      if (formData.img) {
        data.append("img", formData.img);
      }

      // اصلاح آدرس متد PUT به /api/books/
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "موفقیت!",
          text: "کتاب با موفقیت ویرایش شد.",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "باشه",
        });
        window.location.href = "/manager-dashboard/book";
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: error.message || "مشکلی در ویرایش کتاب رخ داد",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <BookOpen size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری اطلاعات کتاب...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-[2.5rem] border border-blue-500/20 shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-blue-500/20">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              ویرایش{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                کتاب
              </span>
            </h1>
            <p className="text-gray-500 text-xs font-bold mt-2 flex items-center gap-2">
              <BookOpen size={14} className="text-blue-400" />
              ویرایش اطلاعات کتاب در فروشگاه آموزشی
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          <div className="bg-[#1a1f2e] p-6 lg:p-10 rounded-3xl border border-blue-500/20 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* کد محصول */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Package size={16} className="text-blue-400" />
                  کد محصول <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={(e) => {
                    const numbersOnly = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      productId: numbersOnly,
                    }));
                  }}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                  placeholder="مثال: ۱۰۱"
                />
              </div>

              {/* دسته‌بندی */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <BookOpen size={16} className="text-blue-400" />
                  دسته‌بندی <span className="text-red-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="">انتخاب دسته‌بندی...</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* نام کتاب */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <BookOpen size={16} className="text-blue-400" />
                  نام کتاب <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                  placeholder="مثال: Cambridge IELTS 18 Academic"
                />
              </div>

              {/* سطح */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <BookOpen size={16} className="text-blue-400" />
                  سطح کتاب
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* زبان */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Globe size={16} className="text-blue-400" />
                  زبان کتاب
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* قیمت */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <DollarSign size={16} className="text-blue-400" />
                  قیمت (تومان) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="price"
                    value={
                      formData.price
                        ? Number(formData.price).toLocaleString()
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, price: rawValue }));
                    }}
                    required
                    className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 pl-16 focus:outline-none focus:border-blue-400 text-left"
                    placeholder="مثال: ۴۵۰۰۰۰"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">
                    تومان
                  </span>
                </div>
              </div>

              {/* موجودی */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Package size={16} className="text-blue-400" />
                  تعداد موجودی <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="stock"
                  value={formData.stock}
                  onChange={(e) => {
                    const numbersOnly = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, stock: numbersOnly }));
                  }}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                  placeholder="مثال: ۱۵"
                />
              </div>

              {/* توضیحات */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <AlignLeft size={16} className="text-blue-400" />
                  توضیحات کتاب
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400 resize-y"
                  placeholder="توضیحات کامل کتاب..."
                />
              </div>

              {/* تصویر کتاب */}
              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Upload size={16} className="text-blue-400" />
                  تصویر جلد کتاب
                </label>

                {previewImg && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-2">تصویر فعلی:</p>
                    <img
                      src={previewImg}
                      alt="Current"
                      className="w-32 h-32 object-cover rounded-xl border border-blue-500/20"
                    />
                  </div>
                )}

                <div className="relative">
                  <input
                    type="file"
                    name="img"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex justify-between items-center bg-[#0F1420] border border-blue-500/20 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 transition-all">
                    <span className="text-gray-300 text-sm">
                      {formData.img
                        ? formData.img.name
                        : "تصویر فعلی حفظ می‌شود (اختیاری)"}
                    </span>
                    <Upload size={18} className="text-blue-400" />
                  </div>
                </div>
              </div>

              {/* وضعیت */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <CheckCircle size={16} className="text-blue-400" />
                  وضعیت کتاب
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, status: "AVAILABLE" }))
                    }
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                      formData.status === "AVAILABLE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                        : "bg-transparent text-gray-500 border-blue-500/20 hover:border-blue-400"
                    }`}
                  >
                    موجود (Available)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({ ...p, status: "UNAVAILABLE" }))
                    }
                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                      formData.status === "UNAVAILABLE"
                        ? "bg-red-500/20 text-red-400 border-red-500/50"
                        : "bg-transparent text-gray-500 border-blue-500/20 hover:border-blue-400"
                    }`}
                  >
                    ناموجود (Unavailable)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* دکمه ارسال */}
          <div className="flex justify-center pb-10">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? "در حال ذخیره تغییرات..." : "ذخیره تغییرات"}
                {!loading && <BookOpen size={22} />}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

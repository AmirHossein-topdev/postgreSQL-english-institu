// frontend/src/pages/manager-dashboard/teachers/[id]/edit/index.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../layout";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaBirthdayCake } from "react-icons/fa";
import { MdDriveFolderUpload } from "react-icons/md";
import Swal from "sweetalert2";
import {
  Eye,
  EyeOff,
  User,
  Hash,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Calendar,
  AlertCircle,
  Award,
  Briefcase,
  DollarSign,
  Trash2,
} from "lucide-react";

const SPECIALIZATION_OPTIONS = [
  { value: "IELTS", label: "آیلتس (IELTS)" },
  { value: "TOEFL", label: "تافل (TOEFL)" },
  { value: "Conversation", label: "مکالمه (Conversation)" },
  { value: "Grammar", label: "گرامر (Grammar)" },
  { value: "Vocabulary", label: "لغات (Vocabulary)" },
  { value: "Reading", label: "ریدینگ (Reading)" },
  { value: "Writing", label: "رایتینگ (Writing)" },
  { value: "Listening", label: "لیسنینگ (Listening)" },
  { value: "Kids", label: "کودکان (Kids)" },
  { value: "General", label: "زبان عمومی (General)" },
];

export default function EditTeacherPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    hireDate: "",
    salary: "",
    birthday: "",
    status: "ACTIVE",
    profileImage: null, // فایل جدید
  });

  const [previewOld, setPreviewOld] = useState("");
  const [previewNew, setPreviewNew] = useState("");
  const [oldImageName, setOldImageName] = useState("");

  // Load data from API
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const result = await res.json();
        const user = result?.data || result?.user || result;

        console.log("📚 TEACHER RAW DATA:", user);

        if (user) {
          const teacherProfile = user.teacherProfile || {};

          setFormData({
            name: user.name || "",
            employeeCode: user.employeeCode || "",
            password: "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            specialization: teacherProfile.specialization || "",
            hireDate: teacherProfile.hireDate
              ? new Date(teacherProfile.hireDate).toISOString().split("T")[0]
              : "",
            salary: teacherProfile.salary || "",
            birthday: user.birthday || "",
            status: user.status || "ACTIVE",
            profileImage: null,
          });

          // تنظیم preview عکس فعلی
          if (user.profileImage && user.profileImage !== "default-avatar.png") {
            setPreviewOld(`http://localhost:5000/uploads/${user.profileImage}`);
            setOldImageName(user.profileImage);
          } else {
            setPreviewOld("");
            setOldImageName("");
          }
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching teacher:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else if (name === "salary") {
      const numbersOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // بررسی حجم فایل (حداکثر ۲ مگابایت)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "حجم فایل زیاد است!",
        text: "حداکثر حجم مجاز ۲ مگابایت است.",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
      e.target.value = "";
      return;
    }

    // بررسی نوع فایل
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "فرمت فایل نامعتبر!",
        text: "فقط فرمت‌های JPG, PNG, WEBP, GIF مجاز هستند.",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
      e.target.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, profileImage: file }));
    setPreviewNew(URL.createObjectURL(file));
  };

  const handleRemoveNewImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
    setPreviewNew("");
    // ریست کردن input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ استفاده از FormData برای ارسال فایل
      const formDataToSend = new FormData();

      // اضافه کردن فیلدهای متنی
      formDataToSend.append("name", formData.name);
      formDataToSend.append("employeeCode", formData.employeeCode);
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("birthday", formData.birthday || "");
      formDataToSend.append("status", formData.status);
      formDataToSend.append("specialization", formData.specialization || "");
      
      if (formData.hireDate) {
        formDataToSend.append("hireDate", new Date(formData.hireDate).toISOString());
      }
      
      if (formData.salary) {
        formDataToSend.append("salary", formData.salary);
      }

      // ✅ اضافه کردن رمز عبور جدید (اگه وارد شده)
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      // ✅ اضافه کردن فایل عکس (اگه انتخاب شده)
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
        console.log("📸 New image attached:", formData.profileImage.name);
      }

      // ✅ برای دیباگ - نمایش محتوای FormData
      console.log("📤 Sending FormData:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // ✅ ارسال با FormData - بدون Content-Type (مرورگر خودش تنظیم میکنه)
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          // ❌ DON'T set Content-Type here - browser will set it with boundary
          // ✅ فقط توکن رو ارسال کن
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo"))?.accessToken || ""}`,
        },
        body: formDataToSend,
      });

      const result = await response.json();
      console.log("📥 Server response:", result);

      if (response.ok && result.success) {
        // نمایش پیام موفقیت
        await Swal.fire({
          icon: "success",
          title: "موفقیت! 🎉",
          text: "اطلاعات استاد با موفقیت به‌روزرسانی شد.",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "باشه",
        });

        // ریدایرکت به لیست اساتید
        window.location.href = "/manager-dashboard/teachers";
      } else {
        throw new Error(result.message || "خطا در به‌روزرسانی");
      }
    } catch (err) {
      console.error("❌ Update teacher error:", err);

      let errorMessage = err.message || "مشکلی در ویرایش استاد رخ داد";

      // نمایش خطاهای خاص
      if (err.message?.includes("duplicate")) {
        errorMessage = "این کد عضویت یا ایمیل قبلاً ثبت شده است!";
      } else if (err.message?.includes("validation")) {
        errorMessage = "لطفاً همه فیلدهای ضروری را به درستی پر کنید.";
      }

      Swal.fire({
        icon: "error",
        title: "خطا! ❌",
        text: errorMessage,
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <GraduationCap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری اطلاعات...
        </div>
      </DashboardLayout>
    );

  if (isError)
    return (
      <DashboardLayout>
        <div className="text-red-400 text-center py-10 bg-[#1a1f2e] rounded-2xl m-10 p-10 border border-red-500/20">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          خطا در دریافت اطلاعات استاد
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-[2.5rem] border border-blue-500/20 shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-blue-500/20">
          <Link
            href="/manager-dashboard/teachers"
            className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
          >
            <FaArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              ویرایش{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                استاد
              </span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1">
              Edit Teacher Information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
          <div className="bg-[#1a1f2e] p-6 lg:p-10 rounded-3xl border border-blue-500/20 shadow-inner">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نام کامل */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <User size={16} className="text-blue-400" /> نام و نام
                  خانوادگی
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="مثال: احمد رضایی"
                />
              </div>

              {/* کد عضویت */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Hash size={16} className="text-blue-400" /> کد عضویت
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="کد ۱۰ رقمی"
                />
              </div>

              {/* رمز عبور */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <ShieldCheck size={16} className="text-blue-400" /> رمز عبور
                  جدید
                  <span className="text-gray-500 text-[9px]">(اختیاری)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                    placeholder="در صورت تمایل رمز جدید وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* تخصص */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Award size={16} className="text-blue-400" /> تخصص
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#1a1f2e]">
                    انتخاب تخصص...
                  </option>
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <option
                      key={spec.value}
                      value={spec.value}
                      className="bg-[#1a1f2e]"
                    >
                      {spec.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* شماره تماس */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Phone size={16} className="text-blue-400" /> شماره تماس
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                />
              </div>

              {/* ایمیل */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Mail size={16} className="text-blue-400" /> پست الکترونیک
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* تاریخ استخدام */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Briefcase size={16} className="text-blue-400" /> تاریخ
                  استخدام
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                />
              </div>

              {/* حقوق */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <DollarSign size={16} className="text-blue-400" /> حقوق پایه
                  (تومان)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="salary"
                    value={
                      formData.salary
                        ? Number(formData.salary).toLocaleString()
                        : ""
                    }
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, salary: rawValue }));
                    }}
                    className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 pl-16 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all text-left"
                    placeholder="مثال: ۱۵۰۰۰۰۰۰"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">
                    تومان
                  </span>
                </div>
              </div>

              {/* تاریخ تولد */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Calendar size={16} className="text-blue-400" /> تاریخ تولد
                </label>
                <input
                  type="text"
                  name="birthday"
                  value={formData.birthday}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9/]/g, "");
                    if (value.length === 4 || value.length === 7) {
                      if (!value.endsWith("/")) {
                        value += "/";
                      }
                    }
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    setFormData((prev) => ({ ...prev, birthday: value }));
                  }}
                  placeholder="۱۳۷۰/۰۸/۲۲"
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all font-mono"
                />
              </div>

              {/* آدرس */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <MapPin size={16} className="text-blue-400" /> آدرس
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="آدرس کامل"
                />
              </div>

              {/* تصویر پروفایل - بخش اصلاح‌شده */}
              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <MdDriveFolderUpload size={16} className="text-blue-400" />{" "}
                  تصویر پروفایل
                </label>

                <div className="p-6 bg-[#0F1420] border-2 border-dashed border-blue-500/30 rounded-3xl">
                  {/* نمایش عکس فعلی و جدید */}
                  <div className="flex flex-wrap items-center gap-6 mb-4">
                    {/* عکس فعلی */}
                    {previewOld && (
                      <div className="relative">
                        <p className="text-gray-500 text-xs mb-1 text-center">
                          عکس فعلی
                        </p>
                        <img
                          src={previewOld}
                          className="w-24 h-24 rounded-xl object-cover border-2 border-blue-500/30"
                          alt="Current"
                        />
                      </div>
                    )}

                    {/* فلش اگه هر دو عکس وجود دارن */}
                    {previewOld && previewNew && (
                      <div className="text-blue-400 text-2xl font-bold">→</div>
                    )}

                    {/* پیش‌نمایش عکس جدید */}
                    {previewNew && (
                      <div className="relative">
                        <p className="text-gray-500 text-xs mb-1 text-center">
                          عکس جدید
                        </p>
                        <img
                          src={previewNew}
                          className="w-24 h-24 rounded-xl object-cover border-2 border-green-500/30"
                          alt="Preview"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveNewImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    {/* placeholder اگه هیچ عکسی نیست */}
                    {!previewOld && !previewNew && (
                      <div className="flex items-center justify-center w-24 h-24 bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-600">
                        <User size={32} className="text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* دکمه انتخاب فایل */}
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-all font-black text-xs uppercase shadow-lg shadow-blue-500/25">
                      <MdDriveFolderUpload size={16} /> انتخاب فایل جدید
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <span className="text-gray-500 text-xs italic">
                      (فرمت‌های مجاز: JPG, PNG, WEBP - حداکثر ۲ مگابایت)
                    </span>

                    {previewNew && (
                      <button
                        type="button"
                        onClick={handleRemoveNewImage}
                        className="text-red-400 hover:text-red-300 text-sm font-bold underline transition-all"
                      >
                        حذف عکس جدید
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* وضعیت */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <CheckCircle2 size={16} className="text-blue-400" /> وضعیت
                  حساب
                </label>
                <div className="flex gap-4">
                  {[
                    {
                      value: "ACTIVE",
                      label: "فعال (Active)",
                      color: "emerald",
                    },
                    {
                      value: "INACTIVE",
                      label: "غیرفعال (Inactive)",
                      color: "gray",
                    },
                  ].map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, status: status.value }))
                      }
                      className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                        formData.status === status.value
                          ? status.color === "emerald"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                            : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                          : "bg-transparent text-gray-500 border-blue-500/20 hover:border-blue-400"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* دکمه ارسال */}
          <div className="flex justify-center pb-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    ذخیره تغییرات
                    <FaSave size={22} />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
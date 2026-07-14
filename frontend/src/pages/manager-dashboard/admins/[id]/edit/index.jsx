// frontend/src/pages/manager-dashboard/admins/[id]/edit/index.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../redux/features/userApi";
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
} from "lucide-react";

export default function EditAdminPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    status: "ACTIVE",
    profileImage: null,
  });

  const [previewOld, setPreviewOld] = useState("");
  const [previewNew, setPreviewNew] = useState("");
  const [uploading, setUploading] = useState(false);

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

        console.log("ADMIN RAW DATA:", user);

        if (user) {
          setAdminData(user);

          setFormData({
            name: user.name || "",
            employeeCode: user.employeeCode || "",
            password: "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            birthday: user.birthday || "",
            status: user.status || "ACTIVE",
            profileImage: null,
          });

          setPreviewOld(
            user.profileImage && user.profileImage !== "default-avatar.png"
              ? `http://localhost:5000/uploads/${user.profileImage}`
              : "",
          );
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profileImage: file }));
    setPreviewNew(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // ✅ استفاده از FormData برای آپلود عکس
      const formDataToSend = new FormData();

      // فیلدهای متنی
      formDataToSend.append("name", formData.name);
      formDataToSend.append("employeeCode", formData.employeeCode);
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("birthday", formData.birthday || "");
      formDataToSend.append("status", formData.status);

      // رمز عبور (اختیاری)
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      // ✅ عکس (اگر انتخاب شده باشد)
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      // لاگ برای دیباگ
      console.log("📤 Sending FormData:");
      for (let pair of formDataToSend.entries()) {
        if (pair[0] === "profileImage") {
          console.log(pair[0], ":", pair[1].name, pair[1].size, "bytes");
        } else {
          console.log(pair[0], ":", pair[1]);
        }
      }

      // ✅ ارسال با FormData (نه JSON)
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        body: formDataToSend, // ✅ FormData
        // ❌ بدون Content-Type! مرورگر خودش تنظیم میکنه
      });

      const result = await response.json();
      console.log("📥 Server response:", result);

      if (response.ok && result.success) {
        Swal.fire({
          icon: "success",
          title: "موفقیت!",
          text: "اطلاعات مدیر با موفقیت به‌روزرسانی شد.",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "باشه",
        }).then(() => {
          window.location.href = "/manager-dashboard/admins";
        });
      } else {
        throw new Error(result.message || "خطا در به‌روزرسانی");
      }
    } catch (err) {
      console.error("Update admin error:", err);

      let errorMessage = err.message || "مشکلی در ویرایش مدیر رخ داد";

      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: errorMessage,
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setUploading(false);
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
          خطا در دریافت اطلاعات مدیر
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
            href="/manager-dashboard/admins"
            className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
          >
            <FaArrowLeft size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              ویرایش{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                مدیر
              </span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1">
              Edit Admin Information
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

              {/* کد عضویت / کد ملی */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Hash size={16} className="text-blue-400" /> کد عضویت / کد ملی
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
                    onKeyDown={(e) => {
                      const isPersian = /[\u0600-\u06FF]/.test(e.key);
                      if (isPersian) {
                        e.preventDefault();
                      }
                    }}
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
                  onKeyDown={(e) => {
                    const isPersian = /[\u0600-\u06FF]/.test(e.key);
                    if (isPersian) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="example@email.com"
                />
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

              {/* تصویر پروفایل */}
              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <MdDriveFolderUpload size={16} className="text-blue-400" />{" "}
                  تصویر پروفایل
                </label>

                {/* عکس فعلی */}
                {previewOld && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-2">عکس فعلی:</p>
                    <img
                      src={previewOld}
                      className="w-24 h-24 rounded-xl object-cover border border-blue-500/20"
                      alt="Current"
                    />
                  </div>
                )}

                {/* پیش‌نمایش عکس جدید */}
                {previewNew && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-2">
                      پیش‌نمایش عکس جدید:
                    </p>
                    <img
                      src={previewNew}
                      className="w-24 h-24 rounded-xl object-cover border border-blue-500/20"
                      alt="Preview"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-6 p-4 bg-[#0F1420] border-2 border-dashed border-blue-500/30 rounded-3xl">
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-all font-black text-xs uppercase shadow-lg shadow-blue-500/25">
                    <MdDriveFolderUpload size={16} /> انتخاب فایل
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-500 text-xs italic">
                    (فرمت‌های مجاز: JPG, PNG - حداکثر ۲ مگابایت)
                  </span>
                </div>
              </div>

              {/* وضعیت حساب */}
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

          {/* دکمه ارسال نهایی */}
          <div className="flex justify-center pb-10">
            <button
              type="submit"
              disabled={uploading}
              className="group relative w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {uploading ? "در حال آپلود..." : "ذخیره تغییرات"}
                {!uploading && <FaSave size={22} />}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

// frontend/src/pages/manager-dashboard/students/[id]/edit/index.jsx

"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardLayout from "../../../layout";
import { useRouter } from "next/router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  UserPlus,
  Image as ImageIcon,
  ShieldCheck,
  User,
  Hash,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  GraduationCap,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../../../redux/features/userApi";

const LEVEL_OPTIONS = [
  { value: "A1", label: "مبتدی (A1)" },
  { value: "A2", label: "مقدماتی (A2)" },
  { value: "B1", label: "متوسط ۱ (B1)" },
  { value: "B2", label: "متوسط ۲ (B2)" },
  { value: "C1", label: "پیشرفته (C1)" },
  { value: "C2", label: "عالی / مسلط (C2)" },
];

export default function EditStudentPage() {
  const router = useRouter();
  const { id } = router.query;

  const [isReady, setIsReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewOld, setPreviewOld] = useState("");
  const [previewNew, setPreviewNew] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    level: "A1",
    emergencyPhone: "",
    birthday: "",
    profileImage: null,
    status: "ACTIVE",
  });

  const { data, isLoading, isError } = useGetUserByIdQuery(id, { skip: !id });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (id) {
      setIsReady(true);
    }
  }, [id]);

  // پر کردن فرم با داده‌های جدید از Prisma
  useEffect(() => {
    if (data?.data || data) {
      const user = data?.data || data;

      setFormData({
        name: user.name ?? "",
        employeeCode: user.employeeCode ?? "",
        password: "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        level: user.level ?? "A1",
        emergencyPhone: user.emergencyPhone ?? "",
        birthday: user.birthday ?? "",
        profileImage: null,
        status: user.status ?? "ACTIVE",
      });

      setPreviewOld(user.profileImage ?? "");
    }
  }, [data]);

  if (!isReady || !id || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <GraduationCap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری اطلاعات...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-red-400 text-center py-10 bg-[#1a1f2e] rounded-2xl m-10 p-10 border border-red-500/20">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          خطا در دریافت اطلاعات زبان‌آموز
        </div>
      </DashboardLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "emergencyPhone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else if (name === "employeeCode") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
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

    if (formData.password && formData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "خطا در ثبت اطلاعات",
        text: "رمز عبور باید حداقل ۶ کاراکتر باشد",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("employeeCode", formData.employeeCode);
      form.append("role", "Student");
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("level", formData.level);
      form.append("emergencyPhone", formData.emergencyPhone);
      form.append("birthday", formData.birthday);
      form.append("status", formData.status);

      if (formData.password) {
        form.append("password", formData.password);
      }
      if (formData.profileImage instanceof File) {
        form.append("profileImage", formData.profileImage);
      }

      await updateUser({ id, formData: form }).unwrap();

      Swal.fire({
        icon: "success",
        title: "ویرایش با موفقیت انجام شد",
        text: "اطلاعات زبان‌آموز به روز رسانی گردید",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "باشه",
      }).then(() => {
        window.location.href = "/manager-dashboard/students";
      });
    } catch (err) {
      console.error("Update student error:", err);
      Swal.fire({
        icon: "error",
        title: "خطا در ویرایش اطلاعات",
        text: err?.data?.message || "لطفاً ورودی‌ها را بررسی کنید",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-[2.5rem] border border-blue-500/20 shadow-2xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-blue-500/20">
          <Link
            href="/manager-dashboard/students"
            className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
          >
            <ArrowRight size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              ویرایش{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                زبان‌آموز
              </span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1">
              Edit Student Information
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
                  placeholder="مثال: مهدی حسینی"
                />
              </div>

              {/* کد عضویت */}
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

              {/* سطح زبانی */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <GraduationCap size={16} className="text-blue-400" /> سطح
                  زبانی
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all cursor-pointer"
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option
                      key={level.value}
                      value={level.value}
                      className="bg-[#1a1f2e]"
                    >
                      {level.label}
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

              {/* شماره ضروری */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <AlertCircle size={16} className="text-blue-400" /> شماره تماس
                  ضروری
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="شماره والدین یا مسئول"
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
                    if (value.length === 4 || value.length === 7) value += "/";
                    if (value.length > 10) value = value.slice(0, 10);
                    setFormData((prev) => ({ ...prev, birthday: value }));
                  }}
                  placeholder="۱۳۸۳/۰۶/۱۵"
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none font-mono"
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
                  <ImageIcon size={16} className="text-blue-400" /> تصویر
                  پروفایل
                </label>
                <div className="flex flex-wrap items-center gap-6 p-4 bg-[#0F1420] border-2 border-dashed border-blue-500/30 rounded-3xl">
                  <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-all font-black text-xs uppercase shadow-lg shadow-blue-500/25">
                    <UserPlus size={16} /> انتخاب فایل
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {previewNew ? (
                    <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-2xl border border-blue-500/20">
                      <img
                        src={previewNew}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-blue-400"
                      />
                      <span className="text-xs text-gray-300 max-w-[150px] truncate">
                        {formData.profileImage?.name || "عکس جدید"}
                      </span>
                    </div>
                  ) : previewOld ? (
                    <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-2xl border border-blue-500/20">
                      <img
                        src={`http://localhost:5000/uploads${previewOld}`}
                        alt="Current"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-blue-400"
                      />
                      <span className="text-xs text-gray-400">عکس فعلی</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs italic">
                      عکسی انتخاب نشده است (فرمت‌های مجاز: JPG, PNG)
                    </span>
                  )}
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
              disabled={isUpdating}
              className="group relative w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isUpdating ? "در حال ذخیره تغییرات..." : "ذخیره تغییرات"}
                {!isUpdating && <UserPlus size={22} />}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

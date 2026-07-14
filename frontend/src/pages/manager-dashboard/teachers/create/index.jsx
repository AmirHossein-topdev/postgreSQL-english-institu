"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import { useCreateUserMutation } from "../../../../redux/features/userApi";
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
  Award,
  Briefcase,
  DollarSign,
  FileText,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../../layout";
import { useRouter } from "next/router";

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

export default function CreateTeacherPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
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
    profileImage: null,
    status: "ACTIVE",
  });

  const [createUser, { isLoading }] = useCreateUserMutation();

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
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // اعتبارسنجی کد ملی
    if (formData.employeeCode.length < 10) {
      Swal.fire({
        icon: "error",
        title: "خطا در ثبت اطلاعات",
        text: "کد عضویت / کد ملی باید حداقل ۱۰ رقم باشد",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // اعتبارسنجی رمز عبور
    if (formData.password.length < 6) {
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

    // اعتبارسنجی تخصص
    if (!formData.specialization) {
      Swal.fire({
        icon: "error",
        title: "خطا در ثبت اطلاعات",
        text: "لطفاً تخصص استاد را انتخاب کنید",
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
      form.append("password", formData.password);
      form.append("role", "Teacher");
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("specialization", formData.specialization);
      form.append("hireDate", formData.hireDate);
      form.append("salary", formData.salary);
      form.append("birthday", formData.birthday);
      form.append("status", formData.status);
      if (formData.profileImage) {
        form.append("profileImage", formData.profileImage);
      }

      // ✅ لاگ کامل محتویات FormData
      console.log("=== FormData Contents ===");
      for (let pair of form.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      await createUser(form).unwrap();

      Swal.fire({
        icon: "success",
        title: "استاد جدید ثبت شد!",
        text: "اطلاعات با موفقیت در سیستم ذخیره گردید.",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "فهمیدم",
      }).then(() => {
        router.push("/manager-dashboard/teachers");
      });
    } catch (err) {
      console.error("Create teacher error:", err);
      Swal.fire({
        icon: "error",
        title: "خطا در ثبت اطلاعات",
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
            href="/manager-dashboard/teachers"
            className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
          >
            <ArrowRight size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              ثبت{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                استاد جدید
              </span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1">
              New Teacher Registration
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
                  onChange={(e) => {
                    const numbersOnly = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 15);
                    setFormData((prev) => ({
                      ...prev,
                      employeeCode: numbersOnly,
                    }));
                  }}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                  placeholder="کد ۱۰ رقمی"
                />
              </div>

              {/* رمز عبور */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <ShieldCheck size={16} className="text-blue-400" /> رمز عبور
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    onKeyDown={(e) => {
                      const isPersian = /[\u0600-\u06FF]/.test(e.key);
                      if (isPersian) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                    placeholder="حداقل ۶ کاراکتر"
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

              {/* تخصص استاد */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Award size={16} className="text-blue-400" /> تخصص استاد
                  <span className="text-red-400">*</span>
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
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

              {/* تاریخ استخدام */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
                  <Briefcase size={16} className="text-blue-400" /> تاریخ
                  استخدام
                </label>
                <input
                  type="text"
                  name="hireDate"
                  value={formData.hireDate}
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
                    setFormData((prev) => ({ ...prev, hireDate: value }));
                  }}
                  placeholder="۱۴۰۴/۰۱/۱۵"
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all font-mono"
                />
              </div>

              {/* حقوق پایه */}
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
                  placeholder="۱۳۸۳/۰۶/۱۵"
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

                  {formData.profileImage ? (
                    <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-2xl border border-blue-500/20">
                      <img
                        src={URL.createObjectURL(formData.profileImage)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-blue-400"
                      />
                      <span className="text-xs text-gray-300 max-w-[150px] truncate">
                        {formData.profileImage.name}
                      </span>
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
              disabled={isLoading}
              className="group relative w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? "در حال ثبت اطلاعات..." : "ثبت نام استاد جدید"}
                {!isLoading && <UserPlus size={22} />}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

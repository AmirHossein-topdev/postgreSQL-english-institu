// frontend/src/pages/teacher-dashboard/profile/edit/index.jsx

"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardLayout from "../../layout";
import { useRouter } from "next/router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  User,
  Hash,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  UserPlus,
  Briefcase,
  Calendar,
  Award,
  DollarSign,
  GraduationCap,
} from "lucide-react";

import {
  useListUsersQuery,
  useUpdateUserMutation,
} from "../../../../redux/features/userApi";

export default function EditMyProfilePage() {
  const router = useRouter();

  const { data, isLoading, isError } = useListUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // گرفتن کاربر جاری از sessionStorage
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [previewOld, setPreviewOld] = useState("");
  const [previewNew, setPreviewNew] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    password: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    level: "",
    salary: "",
    birthday: "",
    hireDate: "",
    profileImage: null,
  });

  // گرفتن currentUser از sessionStorage
  useEffect(() => {
    const currentUserRaw = sessionStorage.getItem("currentUser");
    if (currentUserRaw) {
      const currentUser = JSON.parse(currentUserRaw);
      setCurrentUserId(currentUser._id);
    }
  }, []);

  /* ---------- Prefill with data from sessionStorage ---------- */
  useEffect(() => {
    if (!data || !currentUserId) return;

    // پیدا کردن کاربر جاری در لیست کاربران
    const usersList = Array.isArray(data) ? data : data?.users || [];
    const currentUser = usersList.find((u) => u._id === currentUserId);

    if (currentUser) {
      setUser(currentUser);

      setFormData({
        name: currentUser.name ?? "",
        employeeCode: currentUser.employeeCode ?? "",
        password: "",
        role: currentUser.role ?? "",
        email: currentUser.email ?? "",
        phone: currentUser.phone ?? "",
        address: currentUser.address ?? "",
        specialization: currentUser.specialization ?? "",
        level: currentUser.level ?? "",
        salary: currentUser.salary?.toString() ?? "",
        birthday: currentUser.birthday ?? "",
        hireDate: currentUser.hireDate ?? "",
        profileImage: null,
      });

      // تنظیم پیش‌نمایش عکس فعلی
      if (currentUser.profileImage) {
        setPreviewOld(
          `http://localhost:7000/uploads/${currentUser.profileImage}`,
        );
      } else {
        setPreviewOld("");
      }
    }
  }, [data, currentUserId]);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 11);
      setFormData((p) => ({ ...p, [name]: numbersOnly }));
    } else if (name === "salary") {
      const numbersOnly = value.replace(/\D/g, "");
      setFormData((p) => ({ ...p, [name]: numbersOnly }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // اعتبارسنجی حجم فایل (حداکثر ۲ مگابایت)
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "حجم فایل نباید بیشتر از ۲ مگابایت باشد",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // اعتبارسنجی نوع فایل
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "فرمت فایل باید JPG یا PNG باشد",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setFormData((p) => ({ ...p, profileImage: file }));
    setPreviewNew(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "اطلاعات کاربر یافت نشد",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      const form = new FormData();

      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("address", formData.address);
      form.append("specialization", formData.specialization);
      form.append("level", formData.level);
      form.append("salary", formData.salary);
      form.append("birthday", formData.birthday);
      form.append("hireDate", formData.hireDate);
      form.append("role", formData.role);

      if (formData.password) {
        form.append("password", formData.password);
      }
      if (formData.profileImage instanceof File) {
        form.append("profileImage", formData.profileImage);
      }

      const result = await updateUser({
        id: user._id,
        formData: form,
      }).unwrap();

      // به‌روزرسانی sessionStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialization: formData.specialization,
        level: formData.level,
        salary: formData.salary,
        birthday: formData.birthday,
        hireDate: formData.hireDate,
      };

      sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "پروفایل با موفقیت بروزرسانی شد",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "باشه",
      }).then(() => {
        router.push("/student-dashboard/profile");
      });
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "خطا در ذخیره اطلاعات",
        text: err?.data?.message || "مشکلی رخ داد",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  /* ---------- Guards ---------- */
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <GraduationCap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری اطلاعات...
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !user) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-red-500">
          خطا در دریافت اطلاعات کاربر
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
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-blue-500/20">
          <Link
            href="/teacher-dashboard/profile"
            className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
          >
            <ArrowRight size={24} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase">
              ویرایش <span className="text-blue-400">پروفایل</span>
            </h2>
            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase mt-1">
              Edit My Profile
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-[#1a1f2e] p-6 lg:p-10 rounded-3xl border border-blue-500/20 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* نام کامل */}
            <div className="space-y-2">
              <Label icon={User} text="نام و نام خانوادگی" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                placeholder="نام و نام خانوادگی"
              />
            </div>

            {/* کد عضویت - غیرقابل ویرایش */}
            <div className="space-y-2">
              <Label icon={Hash} text="کد عضویت / کد ملی" />
              <input
                type="text"
                value={formData.employeeCode}
                disabled
                className="w-full bg-[#0F1420] border border-gray-700 text-gray-500 rounded-2xl p-4 cursor-not-allowed"
              />
            </div>

            {/* رمز عبور جدید */}
            <div className="space-y-2 relative">
              <Label icon={ShieldCheck} text="رمز عبور جدید" />
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
              <p className="text-gray-500 text-[9px]">
                * رمز عبور جدید حداقل ۶ کاراکتر
              </p>
            </div>

            {/* نقش کاربری - غیرقابل ویرایش */}
            <div className="space-y-2">
              <Label icon={UserPlus} text="نقش کاربری" />
              <input
                type="text"
                value={formData.role === "Teacher" ? "استاد" : formData.role}
                disabled
                className="w-full bg-[#0F1420] border border-gray-700 text-gray-500 rounded-2xl p-4 cursor-not-allowed"
              />
            </div>

            {/* سطح */}
            <div className="space-y-2">
              <Label icon={GraduationCap} text="سطح" />
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
              >
                <option value="">انتخاب سطح...</option>
                <option value="A1">A1 (مبتدی)</option>
                <option value="A2">A2 (مقدماتی)</option>
                <option value="B1">B1 (متوسط ۱)</option>
                <option value="B2">B2 (متوسط ۲)</option>
                <option value="C1">C1 (پیشرفته)</option>
                <option value="C2">C2 (عالی / مسلط)</option>
              </select>
            </div>

            {/* شماره تماس */}
            <div className="space-y-2">
              <Label icon={Phone} text="شماره تماس" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                dir="ltr"
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              />
            </div>

            {/* ایمیل */}
            <div className="space-y-2">
              <Label icon={Mail} text="ایمیل" />
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
              <Label icon={Calendar} text="تاریخ تولد" />
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
                  setFormData((p) => ({ ...p, birthday: value }));
                }}
                placeholder="۱۳۷۰/۰۸/۲۲"
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all font-mono"
              />
            </div>

            {/* آدرس */}
            <div className="space-y-2 md:col-span-2">
              <Label icon={MapPin} text="آدرس" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-2xl p-4 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 outline-none transition-all"
                placeholder="آدرس کامل"
              />
            </div>
          </div>

          {/* تصویر پروفایل */}
          <div className="md:col-span-2 space-y-4">
            <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
              <ImageIcon size={16} className="text-blue-400" /> تصویر پروفایل
            </label>
            <div className="flex flex-wrap items-center gap-6 p-6 bg-[#0F1420] border-2 border-dashed border-blue-500/30 rounded-3xl">
              <label className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer transition-all font-black text-xs uppercase shadow-lg shadow-blue-500/25">
                <UserPlus size={16} /> انتخاب فایل
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {previewNew ? (
                <div className="flex items-center gap-3 bg-[#1a1f2e] p-2 rounded-2xl border border-blue-500/30">
                  <img
                    src={previewNew}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-xl border-2 border-blue-400"
                  />
                  <span className="text-xs text-gray-300 max-w-[150px] truncate">
                    عکس جدید
                  </span>
                </div>
              ) : previewOld ? (
                <div className="flex items-center gap-3 bg-[#1a1f2e] p-2 rounded-2xl border border-blue-500/30">
                  <img
                    src={previewOld}
                    alt="Current"
                    className="w-16 h-16 object-cover rounded-xl border border-blue-500/30"
                  />
                  <span className="text-xs text-gray-300">عکس فعلی</span>
                </div>
              ) : (
                <span className="text-gray-500 text-xs italic">
                  عکسی انتخاب نشده است (فرمت‌های مجاز: JPG، JPEG، PNG - حداکثر
                  حجم: ۲ مگابایت)
                </span>
              )}
            </div>
          </div>

          {/* دکمه ذخیره */}
          <button
            type="submit"
            disabled={isUpdating}
            className="group relative w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isUpdating ? "در حال ذخیره تغییرات..." : "ذخیره تغییرات"}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

/* ---------- Small Components ---------- */

function Label({ icon: Icon, text }) {
  return (
    <label className="flex items-center gap-2 text-gray-400 font-bold text-sm mr-2">
      <Icon size={16} className="text-blue-400" />
      {text}
    </label>
  );
}

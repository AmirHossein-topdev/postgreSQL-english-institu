// frontend/src/components/forms/AdminLoginForm.jsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";

import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff, BookOpen, User, Lock, Loader2 } from "lucide-react";

import { notifyError, notifySuccess } from "@/utils/toast";
import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import ErrorMsg from "../common/error-msg";

// نقش‌های API به کلیدهای فرانت
const ROLE_MAP = {
  Student: "student",
  Teacher: "teacher",
  Admin: "admin",
};

// مسیر ریدایرکت بر اساس نقش واقعی کاربر
const getRedirectPath = (role) => {
  const roleMap = {
    student: "/student-dashboard",
    teacher: "/teacher-dashboard",
    admin: "/manager-dashboard",
  };
  return roleMap[role] || "/";
};

export default function UnifiedLoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  const schema = Yup.object({
    employeeCode: Yup.string()
      .required("شناسه ورود الزامی است")
      .matches(/^[0-9]{4,15}$/, "فرمت شناسه نامعتبر است"),
    password: Yup.string()
      .required("رمز عبور الزامی است")
      .min(6, "حداقل ۶ کاراکتر"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!captchaValue) {
      notifyError("تأیید کپچا الزامی است");
      return;
    }

    setIsLoading(true);
    setShowOverlay(true);

    try {
      const response = await loginUser({
        employeeCode: data.employeeCode,
        password: data.password,
      }).unwrap();

      console.log("✅ Login response:", response);

      const user = response.user;
      if (!user) {
        notifyError("اطلاعات کاربر دریافت نشد");
        setIsLoading(false);
        setShowOverlay(false);
        return;
      }

      // ✅ دریافت توکن از پاسخ
      const token = response.token;

      const userRole = user.role;
      const normalizedRole = ROLE_MAP[userRole] || "student";

      const safeUser = {
        id: user.id || user._id,
        name: user.name,
        role: normalizedRole,
        profileImage: user.profileImage,
        email: user.email,
        employeeCode: user.employeeCode,
      };

      // ✅ ذخیره در sessionStorage برای استفاده در صفحات
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));

      // ✅ ذخیره توکن در localStorage برای baseApi
      localStorage.setItem("userInfo", JSON.stringify({
        accessToken: token,
        user: safeUser,
      }));

      // ✅ همچنین در sessionStorage برای دسترسی آسان‌تر
      sessionStorage.setItem("userInfo", JSON.stringify({
        accessToken: token,
        user: safeUser,
      }));

      console.log("✅ Token saved to localStorage and sessionStorage");

      const redirectPath = getRedirectPath(normalizedRole);

      // نمایش پیام موفقیت
      notifySuccess(`ورود موفق | ${user.name}`);

      // بعد از 1.5 ثانیه ریدایرکت کن
      setTimeout(() => {
        router.replace(redirectPath);
      }, 1500);
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "ورود ناموفق";
      notifyError(errorMessage);
      console.error("Login error:", err);
      setIsLoading(false);
      setShowOverlay(false);
    }
  };

  return (
    <>
      {/* Overlay با اسپینر و پس‌زمینه بلر - فقط در حالت لودینگ و قبل از موفقیت */}
      {showOverlay && isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-[#0a1628]/90 border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
            </div>
            <p className="text-white font-bold text-lg animate-pulse">
              در حال ورود به سامانه...
            </p>
            <p className="text-gray-400 text-sm">لطفاً چند لحظه صبر کنید</p>
          </div>
        </div>
      )}

      <div
        className="min-h-screen flex items-center justify-center px-4 relative"
        dir="rtl"
      >
        <div className="w-full max-w-md bg-gradient-to-br from-[#0a1628] to-[#0d1b2a] border border-gray-800 rounded-[2.5rem] shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black italic text-white">
              آموزشگاه <span className="text-blue-400">زبان</span>
            </h1>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-2">
              سامانه مدیریت هوشمند آموزشگاه
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <div className="relative">
                <User
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  {...register("employeeCode")}
                  placeholder="شناسه ورود"
                  onChange={(e) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/[\u0600-\u06FF]/g, "");
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#0f1115] border border-gray-800 rounded-xl py-4 px-12 text-white font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <ErrorMsg msg={errors.employeeCode?.message} />
            </div>

            <div>
              <div className="relative">
                <Lock
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="رمز عبور"
                  onChange={(e) => {
                    const value = e.target.value;
                    e.target.value = value.replace(/[\u0600-\u06FF]/g, "");
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#0f1115] border border-gray-800 rounded-xl py-4 px-12 text-white font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  disabled={isLoading}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 transition-colors disabled:opacity-50"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <ErrorMsg msg={errors.password?.message} />
            </div>

            {/* CAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LdnLyAsAAAAANcQ13SwbVVzuOhdHmjmbDiyGnkK"
                onChange={(val) => setCaptchaValue(val)}
                hl="fa"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 rounded-xl font-black italic text-white transition-all
                bg-gradient-to-r from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-blue-500/30
                active:scale-95
                flex items-center justify-center gap-3
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  در حال احراز هویت...
                </>
              ) : (
                "ورود به سامانه"
              )}
            </button>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                سیستم مدیریت هوشمند آموزشگاه زبان
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
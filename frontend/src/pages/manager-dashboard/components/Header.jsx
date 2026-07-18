// frontend/src/pages/trainers-dashboard/components/Header.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Link from "next/link";

import {
  Menu,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  ChevronDown,
  User,
  Edit,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  Users,
  Home,
  BarChart3,
  Clock,
} from "lucide-react";

import { useListUsersQuery } from "@/redux/features/userApi";

export default function Header({ onOpenSidebar }) {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();

  const { data, isLoading, isError } = useListUsersQuery();

  const [user, setUser] = useState(null);

  // بستن منو هنگام کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // خواندن currentUser از sessionStorage و مطابقت با دیتای API
  useEffect(() => {
    if (!data) return;

    try {
      const currentUserRaw = sessionStorage.getItem("currentUser");
      if (!currentUserRaw) return;

      const currentUser = JSON.parse(currentUserRaw);
      const userId = currentUser.id || currentUser._id;

      if (!userId) return;

      const usersList = data?.data?.users || data?.users || data || [];

      if (!Array.isArray(usersList) || usersList.length === 0) return;

      const foundUser = usersList.find(
        (u) => u.id === userId || u._id === userId,
      );

      if (foundUser) {
        setUser(foundUser);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, [data]);

  const displayName = user?.name || "کاربر مهمان";
  const displayRole = user?.role || "کاربر";
  const isActive = user?.status === "ACTIVE";
  const displayEmail = user?.email || "—";
  const displayEmployeeCode = user?.employeeCode || "—";
  const displayPhone = user?.phone || "—";
  const displayBirthday = user?.birthday || "—";

  // تشخیص مسیر فعلی برای هایلایت
  const currentPath = router.pathname;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "خروج از حساب",
      text: "آیا مطمئن هستید که می‌خواهید خارج شوید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، خارج شو",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#50A2FF",
      cancelButtonColor: "#374151",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      sessionStorage.clear();
      router.replace("/");
    }
  };

  // تعیین عنوان پنل بر اساس نقش
  const getPanelTitle = () => {
    const roleMap = {
      Admin: "مدیریت",
      Teacher: "اساتید",
      Student: "دانشجویان",
    };
    return roleMap[displayRole] || displayRole;
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 mb-3 py-3 sm:py-4 bg-[#1a1d23]/80 backdrop-blur-xl border border-gray-800 rounded-[2rem] sticky top-4 z-50 shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:border-blue-400/30 hover:shadow-blue-500/10">
      {/* سمت چپ: کنترل موبایل و تایتل سیستم */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2.5 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-black rounded-xl hover:scale-95 transition-transform shadow-lg shadow-blue-500/25"
          aria-label="Menu"
        >
          <Menu size={18} strokeWidth={3} />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <h2 className="text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] opacity-50 leading-none">
              Command Center
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="hidden md:block text-lg sm:text-xl font-black italic text-white uppercase tracking-tighter">
              پنل <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                {getPanelTitle()}
              </span>
            </span>
            {isActive && (
              <span className="hidden lg:inline-block text-[8px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                آنلاین
              </span>
            )}
          </div>
        </div>
      </div>

      {/* سمت راست: نوتیفیکیشن و پروفایل */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {/* Quick Actions - مخفی در موبایل */}
        <div className="hidden md:flex items-center gap-2">
          <button className="p-2 bg-gray-800/30 text-gray-500 hover:text-blue-400 hover:bg-gray-800/60 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-blue-500/20">
            <BarChart3 size={16} />
          </button>
          <button className="p-2 bg-gray-800/30 text-gray-500 hover:text-blue-400 hover:bg-gray-800/60 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-blue-500/20">
            <Calendar size={16} />
          </button>
        </div>

        {/* نوتیفیکیشن‌های سیستمی */}
        <div className="relative">
          <button className="p-2.5 sm:p-3 bg-gray-800/40 text-gray-400 hover:text-blue-400 hover:bg-gray-800/70 rounded-xl transition-all relative group border border-gray-700/50 hover:border-blue-500/30">
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* بخش پروفایل */}
        <div ref={profileRef} className="relative">
          <div
            className="flex items-center gap-2 sm:gap-4 p-0.5 sm:p-1 pr-2 sm:pr-4 bg-gray-900/80 border border-gray-700/60 rounded-full cursor-pointer hover:border-blue-400/60 transition-all group shadow-lg hover:shadow-blue-500/10"
            onClick={() => setShowProfileInfo((s) => !s)}
          >
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-white font-black text-xs sm:text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                {displayName}
              </span>
              <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-end">
                {displayRole}{" "}
                <ShieldCheck size={10} className="text-blue-400" />
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              {user?.profileImage && user.profileImage !== "default-avatar.png" ? (
                <Image
                  src={
                    user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `http://localhost:5000/uploads/${user.profileImage}`
                  }
                  width={44}
                  height={44}
                  alt={displayName}
                  className="rounded-full border-2 border-blue-400 relative z-10 grayscale-[40%] group-hover:grayscale-0 transition-all duration-500 object-cover w-10 h-10 sm:w-12 sm:h-12"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-black text-base sm:text-xl relative z-10">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div
                className={`absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-[#1a1d23] z-20 ${
                  isActive ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-gray-500"
                }`}
                title={isActive ? "فعال" : "غیرفعال"}
              />
            </div>

            <ChevronDown
              size={14}
              className={`text-gray-500 transition-transform duration-300 ${
                showProfileInfo ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* دراپ‌دان منو - طراحی حرفه‌ای */}
          {showProfileInfo && (
            <div className="absolute left-0 lg:left-0 mt-3 bg-[#1a1d23] border border-gray-700/60 p-2 rounded-2xl shadow-2xl shadow-black/50 w-64 sm:w-72 animate-in fade-in slide-in-from-top-2 duration-200 z-50 backdrop-blur-xl bg-[#1a1d23]/95">
              {/* هدر پروفایل */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user?.profileImage && user.profileImage !== "default-avatar.png" ? (
                      <Image
                        src={
                          user.profileImage.startsWith("http")
                            ? user.profileImage
                            : `http://localhost:5000/uploads/${user.profileImage}`
                        }
                        width={44}
                        height={44}
                        alt={displayName}
                        className="rounded-full border-2 border-blue-400 object-cover w-11 h-11"
                        unoptimized
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-black text-lg">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a1d23] ${
                        isActive ? "bg-emerald-400" : "bg-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-sm">{displayName}</p>
                    <p className="text-[10px] text-gray-400">{displayRole}</p>
                  </div>
                </div>
              </div>

              {/* لینک‌های سریع */}
              <div className="grid grid-cols-2 gap-1.5 px-1 mb-2">
                <Link
                  href="/manager-dashboard"
                  className="flex items-center justify-center gap-2 p-2.5 text-[10px] font-bold text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                >
                  <Home size={14} />
                  داشبورد
                </Link>
                <Link
                  href="/manager-dashboard/class"
                  className="flex items-center justify-center gap-2 p-2.5 text-[10px] font-bold text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                >
                  <BookOpen size={14} />
                  کلاس‌ها
                </Link>
                <Link
                  href="/manager-dashboard/students"
                  className="flex items-center justify-center gap-2 p-2.5 text-[10px] font-bold text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                >
                  <Users size={14} />
                  دانشجویان
                </Link>
                <Link
                  href="/manager-dashboard/schedule"
                  className="flex items-center justify-center gap-2 p-2.5 text-[10px] font-bold text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-500/20"
                >
                  <Clock size={14} />
                  برنامه
                </Link>
              </div>

              <div className="border-t border-gray-700/50 my-1"></div>

              {/* منوی اصلی */}
              <div className="space-y-0.5 px-1">
                <Link
                  href="/manager-dashboard/admins"
                  className="w-full flex items-center justify-end gap-3 p-2.5 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-all text-sm font-bold italic group"
                >
                  <span>مشاهده پروفایل</span>
                  <User size={16} className="group-hover:scale-110 transition-transform" />
                </Link>

                <Link
                  href={`/manager-dashboard/profile/${user?.id || user?._id}/edit`}
                  className="w-full flex items-center justify-end gap-3 p-2.5 text-gray-400 hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-all text-sm font-bold italic group"
                >
                  <span>ویرایش اطلاعات</span>
                  <Edit size={16} className="group-hover:scale-110 transition-transform" />
                </Link>

                

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-end gap-3 p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold italic group border border-transparent hover:border-red-500/20"
                >
                  <span>خروج از حساب</span>
                  <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* اطلاعات کاربری */}
              <div className="mt-2 pt-3 border-t border-gray-700/50 px-2">
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="bg-gray-800/30 p-2 rounded-lg">
                    <p className="text-gray-500">ایمیل</p>
                    <p className="text-white font-bold truncate">{displayEmail}</p>
                  </div>
                  <div className="bg-gray-800/30 p-2 rounded-lg">
                    <p className="text-gray-500">کد عضویت</p>
                    <p className="text-white font-bold">{displayEmployeeCode}</p>
                  </div>
                  <div className="bg-gray-800/30 p-2 rounded-lg col-span-2">
                    <p className="text-gray-500">تاریخ تولد</p>
                    <p className="text-white font-bold">{displayBirthday}</p>
                  </div>
                </div>
              </div>

              {/* وضعیت سیستم */}
              <div className="mt-2 pt-2 border-t border-gray-700/50 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                    سیستم فعال
                  </span>
                </div>
                <span className="text-[8px] text-gray-600">
                  v2.0.0
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
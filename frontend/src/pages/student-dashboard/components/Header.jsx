"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Menu,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useListUsersQuery } from "@/redux/features/userApi";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Header({ onOpenSidebar }) {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const profileRef = useRef(null);

  const { data, isLoading, isError } = useListUsersQuery();

  const [user, setUser] = useState(null);

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

      // ✅ استخراج کاربران از ساختار درست
      const usersList = data?.data?.users || data?.users || data || [];

      if (!Array.isArray(usersList) || usersList.length === 0) return;

      // ✅ پیدا کردن کاربر با مطابقت id
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

  const router = useRouter();

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

  return (
    <header className="flex items-center justify-between px-6 mb-3 py-4 bg-[#1a1d23]/50 backdrop-blur-md border border-gray-800 rounded-[2rem] sticky top-4 z-50 shadow-2xl transition-all duration-500 hover:border-blue-400/30">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-3 bg-blue-400 text-black rounded-xl hover:scale-95 transition-transform"
          aria-label="Menu"
        >
          <Menu size={20} strokeWidth={3} />
        </button>

        <div className="flex flex-col">
          <h2 className="text-white text-xs font-black uppercase tracking-[0.3em] opacity-50 leading-none">
            Command Center
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="hidden md:block text-xl font-black italic text-white uppercase tracking-tighter">
              پنل <span className="text-blue-400">کاربر</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        <div className="relative hidden sm:block">
          <button className="p-3 bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-2xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div ref={profileRef} className="relative">
          <div
            className="flex items-center gap-4 p-1 pr-20 bg-gray-900/80 border border-gray-800 rounded-full cursor-pointer hover:border-blue-400/50 transition-all group shadow-lg"
            onClick={() => setShowProfileInfo((s) => !s)}
          >
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-white font-black italic text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                {displayName}
              </span>
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-end">
                {displayRole}{" "}
                <ShieldCheck size={10} className="text-blue-400" />
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>

              {user?.profileImage &&
              user.profileImage !== "default-avatar.png" ? (
                <Image
                  src={
                    user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `http://localhost:5000/uploads/${user.profileImage}`
                  }
                  width={64}
                  height={64}
                  alt={displayName}
                  className="rounded-full border-2 border-blue-400 relative z-10 grayscale-[50%] group-hover:grayscale-0 transition-all object-cover w-12 h-12"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-black text-xl">
                  {displayName.charAt(0)}
                </div>
              )}

              <div
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1a1d23] z-20 ${
                  isActive ? "bg-green-500" : "bg-gray-500"
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

          {showProfileInfo && (
            <div className="absolute left-0 lg:right-0 mt-4 bg-[#1a1d23] border border-gray-800 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-64 animate-in fade-in zoom-in duration-200 z-50">
              <div className="p-3 border-b border-gray-800 mb-2">
                <p className="text-gray-500 text-[9px] uppercase font-black tracking-widest mb-1">
                  وضعیت عملیاتی
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`${
                      isActive ? "text-green-400" : "text-gray-400"
                    } font-bold uppercase italic`}
                  >
                    {isActive ? "فعال" : "غیرفعال"}
                  </span>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase italic">
                    <Zap size={12} /> Ready for Training
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <Link
                  href="/student-dashboard/profile"
                  className="w-full flex items-center justify-end gap-3 p-3 text-gray-400 hover:bg-blue-400 hover:text-black rounded-xl transition-all text-sm font-bold italic"
                >
                  مشاهده پروفایل
                </Link>

                <Link
                  href={`/student-dashboard/profile/${user.id}/edit`}
                  className="w-full flex items-center justify-end gap-3 p-3 text-gray-400 hover:bg-blue-400 hover:text-black rounded-xl transition-all text-sm font-bold italic"
                >
                  ویرایش اطلاعات
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-end gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-bold italic border border-transparent hover:border-red-400/20"
                >
                  خروج از حساب
                </button>

                <div className="pt-2 border-t border-gray-800">
                  <p className="text-[11px] text-gray-500">
                    ایمیل:{" "}
                    <span className="text-white text-[11px] font-bold">
                      {user?.email || "—"}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    کد عضویت:{" "}
                    <span className="text-white text-[11px] font-bold">
                      {user?.employeeCode || "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

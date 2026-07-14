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
import { useListUsersQuery } from "@/redux/features/userApi"; // استفاده از الگوی پروژه
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function Header({ onOpenSidebar }) {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const profileRef = useRef(null);

  // گرفتن اطلاعات کاربر از redux hook (فقط به‌عنوان fallback)
  const { data, isLoading, isError } = useListUsersQuery();

  // حالت محلی برای نگهداری کاربری که از sessionStorage و API گرفته شده
  const [apiUser, setApiUser] = useState(null);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- جدید: خواندن currentUser از sessionStorage و فراخوانی API ----------
  useEffect(() => {
    const ac = new AbortController();

    async function loadUserFromSessionAndApi() {
      setApiError(false);
      setApiUser(null);

      try {
        if (typeof window === "undefined") return;

        const currentUserRaw = sessionStorage.getItem("currentUser");
        const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

        // اگر currentUser و _id موجود باشد، تلاش کن اطلاعات کامل کاربر را از API بگیری
        if (currentUser && currentUser._id) {
          try {
            // ابتدا تلاش کن endpoint تک‌کاربر را بزنیم (اگر سرور این مسیر را پشتیبانی کند)
            const singleRes = await fetch(
              `http://localhost:7000/api/users/${currentUser._id}`,
              { signal: ac.signal },
            );

            if (singleRes.ok) {
              const singleJson = await singleRes.json();
              // احتمال‌های مختلف پاسخ را پوشش دهیم
              if (singleJson.user) {
                setApiUser(singleJson.user);
                return;
              } else if (singleJson._id) {
                setApiUser(singleJson);
                return;
              } else if (Array.isArray(singleJson.users)) {
                const found = singleJson.users.find(
                  (u) => u._id === currentUser._id,
                );
                if (found) {
                  setApiUser(found);
                  return;
                }
              }
              // اگر پاسخ تک‌کاربر معنی‌دار نبود، ادامه می‌دهیم و لیست را می‌گیریم
            }
          } catch (err) {
            if (err.name === "AbortError") return;
            // ادامه به مرحله‌ی fallback
          }

          // fallback: گرفتن لیست کاربران و فیلتر کردن بر اساس id
          try {
            const listRes = await fetch("http://localhost:7000/api/users", {
              signal: ac.signal,
            });
            if (listRes.ok) {
              const listJson = await listRes.json();
              if (listJson && Array.isArray(listJson.users)) {
                const found = listJson.users.find(
                  (u) => u._id === currentUser._id,
                );
                if (found) {
                  setApiUser(found);
                  return;
                }
              } else if (Array.isArray(listJson)) {
                const found = listJson.find((u) => u._id === currentUser._id);
                if (found) {
                  setApiUser(found);
                  return;
                }
              }
            }
            // اگر هیچ‌کدام پیدا نشد، apiUser خاموش می‌ماند و از fallback داخلی استفاده می‌کنیم
          } catch (err) {
            if (err.name !== "AbortError") {
              console.error("Error fetching users list:", err);
              setApiError(true);
            }
          }
        } else {
          // currentUser در sessionStorage موجود نیست؛ ما apiUser را null نگه می‌داریم تا fallback از redux استفاده شود
          setApiUser(null);
        }
      } catch (outerErr) {
        if (outerErr.name !== "AbortError") {
          console.error("Unexpected error loading user:", outerErr);
          setApiError(true);
        }
      }
    }

    loadUserFromSessionAndApi();

    return () => ac.abort();
  }, []);

  // کاربر نهایی: اولویت با apiUser (sessionStorage -> API)، در غیر این صورت fallback روی داده‌ی redux
  const user =
    apiUser ?? (Array.isArray(data) && data.length > 0 ? data[0] : null);

  const displayName = user?.name || "کاربر مهمان";
  const displayRole =
    typeof user?.role === "string" ? user.role : user?.role?.name || "کاربر";
  const isActive = user?.status === "active";

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
      cancelButtonColor: "#374151", // خاکستری
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // 🔥 پاک کردن کل sessionStorage
      sessionStorage.clear();

      // (اختیاری) اگر localStorage هم داری
      // localStorage.clear();

      // ریدایرکت امن به صفحه اصلی
      router.replace("/");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 mb-3 py-4 bg-[#1a1d23]/50 backdrop-blur-md border border-gray-800 rounded-[2rem] sticky top-4 z-50 shadow-2xl transition-all duration-500 hover:border-blue-400/30">
      {/* سمت چپ: کنترل موبایل و تایتل سیستم */}
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

      {/* سمت راست: نوتیفیکیشن و پروفایل */}
      <div className="flex items-center gap-4 lg:gap-8">
        {/* نوتیفیکیشن */}
        <div className="relative hidden sm:block">
          <button className="p-3 bg-gray-800/50 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-2xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* بخش پروفایل داینامیک */}
        <div ref={profileRef} className="relative">
          <div
            className="flex items-center gap-4 p-1 pr-4 bg-gray-900/80 border border-gray-800 rounded-full cursor-pointer hover:border-blue-400/50 transition-all group shadow-lg"
            onClick={() => setShowProfileInfo((s) => !s)}
          >
            {/* اطلاعات متنی (نمایش در حالت بزرگ‌تر) */}
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-white font-black italic text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                {displayName}
              </span>
              <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1 justify-end">
                {displayRole}{" "}
                <ShieldCheck size={10} className="text-blue-400" />
              </span>
            </div>

            {/* آواتار */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>

              {user?.profileImage ? (
                <Image
                  src={`http://localhost:7000/uploads/${user.profileImage}`}
                  width={64}
                  height={1}
                  alt={displayName}
                  className="rounded-full border-2 border-blue-400 relative z-10 grayscale-[50%] group-hover:grayscale-0 transition-all"
                  unoptimized
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-black">
                  {displayName.charAt(0)}
                </div>
              )}

              {/* وضعیت آنلاین/آفلاین کوچک */}
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

          {/* دراپ‌دان منو */}
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
                  href="/users-dashboard/profile"
                  className="w-full flex items-center justify-end gap-3 p-3 text-gray-400 hover:bg-blue-400 hover:text-black rounded-xl transition-all text-sm font-bold italic"
                >
                  مشاهده پروفایل
                </Link>

                <Link
                  href="/users-dashboard/profile/edit"
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
                      {" "}
                      {user?.email || "—"}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    کد عضویت:{" "}
                    <span className="text-white text-[11px] font-bold">
                      {" "}
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

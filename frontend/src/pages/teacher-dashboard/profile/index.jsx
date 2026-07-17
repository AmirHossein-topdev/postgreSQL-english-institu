"use client";

import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  Lock,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../layout";
import { FaLevelUpAlt } from "react-icons/fa";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const ac = new AbortController();

    async function fetchUser() {
      setIsLoading(true);
      setIsError(false);

      try {
        // تلاش برای خواندن currentUser از sessionStorage
        const currentUserRaw =
          typeof window !== "undefined"
            ? sessionStorage.getItem("currentUser")
            : null;
        const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

        let res, json;

        if (currentUser && currentUser.id) {
          // ✅ تغییر: از id به جای _id استفاده کن (Prisma از id استفاده می‌کند)
          try {
            res = await fetch(
              `http://localhost:5000/api/users/${currentUser.id}`,
              { signal: ac.signal },
            );
            json = await res.json();

            if (json) {
              if (json.data) {
                // ✅ ساختار پاسخ Prisma: { success: true, data: { ...user } }
                setUser(json.data);
              } else if (json.id) {
                setUser(json);
              } else if (Array.isArray(json.users)) {
                const found = json.users.find((u) => u.id === currentUser.id);
                setUser(found ?? null);
              } else {
                throw new Error("Unexpected single-user response");
              }
            }
          } catch (err) {
            // اگر endpoint تک‌کاربر خطا داد یا در دسترس نبود، از لیست استفاده کن و جستجو کن
            if (err.name !== "AbortError") {
              const listRes = await fetch("http://localhost:5000/api/users", {
                signal: ac.signal,
              });
              const listJson = await listRes.json();

              // ✅ سازگاری با ساختار Prisma: { success: true, data: { users: [], pagination: {} } }
              const usersList =
                listJson?.data?.users || listJson?.users || listJson || [];

              if (Array.isArray(usersList)) {
                const found = usersList.find((u) => u.id === currentUser.id);
                setUser(found ?? null);
              } else {
                setUser(null);
              }
            }
          }
        } else {
          // اگر currentUser در sessionStorage نبود → بعنوان fallback اولین کاربر از لیست را نمایش بده
          const listRes = await fetch("http://localhost:5000/api/users", {
            signal: ac.signal,
          });
          const listJson = await listRes.json();

          // ✅ سازگاری با ساختار Prisma
          const usersList =
            listJson?.data?.users || listJson?.users || listJson || [];

          if (Array.isArray(usersList) && usersList.length) {
            setUser(usersList[0]);
          } else {
            setUser(null);
          }
        }

        setIsError(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch user failed:", error);
          setIsError(true);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();

    return () => ac.abort();
  }, []);

  // حالت‌ها
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-blue-400 font-black animate-pulse">
          <Zap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری پروفایل...
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-red-500 font-black">
          {isError
            ? "خطا در دریافت اطلاعات کاربر"
            : "هیچ کاربری برای نمایش پیدا نشد"}
        </div>
      </DashboardLayout>
    );
  }

  // ✅ تغییر: status در Prisma "ACTIVE" یا "INACTIVE" است
  const isActive = user.status === "ACTIVE";

  // ✅ دریافت level از teacherProfile (اگر کاربر teacher باشد)
  const userLevel = user.teacherProfile?.level || user.level || "—";

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-[2.5rem] border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            href="/teacher-dashboard"
            className="p-3 bg-gray-800 text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl"
          >
            <ArrowRight size={22} />
          </Link>

          <div>
            <h2 className="text-3xl font-black text-white italic uppercase">
              پروفایل <span className="text-blue-400">من</span>
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
              My Profile
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="max-w-3xl mx-auto bg-[#1a1d23] border border-gray-800 rounded-3xl p-6 shadow-2xl">
          {/* Top */}
          <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-gray-800 pb-6 mb-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-transparent flex items-center justify-center overflow-hidden shadow-lg">
                {user.profileImage &&
                user.profileImage !== "default-avatar.png" ? (
                  <img
                    src={`http://localhost:5000/uploads${user.profileImage}`}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-400 text-4xl font-black">
                    {user.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              {/* Status Indicator */}
              <span
                className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-4 border-[#1a1d23] ${
                  isActive
                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                    : "bg-gray-500"
                }`}
              />
            </div>

            <div className="text-center sm:text-right">
              <h3 className="text-2xl font-black text-white">
                {user.name || "—"}
              </h3>

              <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                {user.role || "User"}
              </p>

              <span
                className={`inline-block mt-3 px-4 py-1 rounded-lg text-[11px] font-bold uppercase ${
                  isActive
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <Info icon={User} label="کد عضویت" value={user.employeeCode} />
            <Info icon={Phone} label="شماره تماس" value={user.phone} />
            <Info icon={MapPin} label="آدرس" value={user.address} />
            <Info icon={ShieldCheck} label="نقش" value={user.role} />
            <Info icon={FaLevelUpAlt} label="سطح" value={userLevel} />
            <Info
              icon={Calendar}
              label="تاریخ عضویت"
              value={
                user.createdAt
                  ? moment(user.createdAt).format("jYYYY/jMM/jDD")
                  : "-"
              }
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href={`/teacher-dashboard/profile/${user.id}/edit`}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-600 text-black py-4 rounded-2xl font-black transition-all"
            >
              <Lock size={18} />
              تغییر رمز عبور/ ویرایش اطلاعات
              <Edit3 size={18} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- Component ---------- */

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
      <Icon size={18} className="text-blue-400" />
      <span>
        {label}: {value || "—"}
      </span>
    </div>
  );
}

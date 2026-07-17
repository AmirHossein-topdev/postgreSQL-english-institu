"use client";

import React, { useState } from "react";
import { useGetclasssQuery } from "@/redux/features/classApi";
import Swal from "sweetalert2";

import Link from "next/link";
import {
  Dumbbell,
  Wrench,
  AlertTriangle,
  Plus,
  BarChart3,
  Zap,
  ShieldCheck,
  History,
  TrendingDown,
  Info,
  Link as LinkIcon,
  Edit3,
  Trash2,
  Search,
  GraduationCap,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  Users,
  XCircle,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import DashboardLayout from "../layout";

// داده‌های وضعیت کلاس‌ها
const classStatusData = [
  { name: "در حال ثبت‌نام", value: 40, color: "#3b82f6" },
  { name: "فعال", value: 35, color: "#10b981" },
  { name: "تکمیل شده", value: 20, color: "#8b5cf6" },
  { name: "لغو شده", value: 5, color: "#ef4444" },
];

export default function classPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: classs = [],
    isLoading,
    isError,
    refetch,
  } = useGetclasssQuery();

  // normalize و map کردن به آرایه inventory مورد استفاده در جدول
  const inventory = React.useMemo(() => {
    // ✅ اصلاح: بررسی دقیق ساختار داده
    let items = [];

    if (Array.isArray(classs)) {
      items = classs;
    } else if (classs?.data) {
      if (Array.isArray(classs.data)) {
        items = classs.data;
      } else if (Array.isArray(classs.data?.classes)) {
        items = classs.data.classes;
      } else if (classs.data?.users) {
        // اگر داده به صورت users برگشته
        items = classs.data.users || [];
      } else {
        items = [];
      }
    } else {
      items = [];
    }

    return items.map((item) => ({
      id:
        item.id ||
        item._id?.toString() ||
        Math.random().toString(36).slice(2, 9),
      name: item.name || "—",
      level: item.level || "—",
      term: item.term || "—",
      teacherName: item.teacher?.name || item.teacherId?.name || "نامشخص",
      studentsCount:
        item.enrollments?.length ||
        item.studentIds?.length ||
        item.students?.length ||
        0,
      capacity: item.capacity || 0,
      schedule: item.schedule || "—",
      room: item.room || "—",
      tuition: item.tuition || 0,
      status: item.status || "در حال ثبت‌نام",
      isConfirmed: item.isConfirmed || false,
      startDate: item.startDate
        ? new Date(item.startDate).toLocaleDateString("fa-IR")
        : "—",
      endDate: item.endDate
        ? new Date(item.endDate).toLocaleDateString("fa-IR")
        : "—",
      totalSessions: item.totalSessions || 0,
      description: item.description || "—",
      createdBy: item.createdBy?.name || item.createdBy || "—",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("fa-IR")
        : "—",
    }));
  }, [classs]);

  // فیلتر کردن بر اساس جستجو
  const filteredInventory = React.useMemo(() => {
    if (!searchTerm.trim()) return inventory;

    const searchLower = searchTerm.toLowerCase().trim();
    return inventory.filter((item) => {
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.level?.toLowerCase().includes(searchLower) ||
        item.term?.toLowerCase().includes(searchLower) ||
        item.teacherName?.toLowerCase().includes(searchLower) ||
        item.status?.toLowerCase().includes(searchLower) ||
        item.schedule?.toLowerCase().includes(searchLower)
      );
    });
  }, [inventory, searchTerm]);

  // آمار برای نمودار
  const getStatusStats = () => {
    const total = filteredInventory.length;
    if (total === 0) return classStatusData;

    const statusMap = {
      "در حال ثبت‌نام": 0,
      فعال: 0,
      "تکمیل شده": 0,
      "لغو شده": 0,
      UNDER_REGISTRATION: 0,
      ACTIVE: 0,
      COMPLETED: 0,
      CANCELED: 0,
    };

    // نقشه وضعیت‌های انگلیسی به فارسی
    const statusMapToPersian = {
      UNDER_REGISTRATION: "در حال ثبت‌نام",
      ACTIVE: "فعال",
      COMPLETED: "تکمیل شده",
      CANCELED: "لغو شده",
    };

    filteredInventory.forEach((item) => {
      let status = item.status;
      // اگر وضعیت انگلیسی است، به فارسی تبدیل کن
      if (statusMapToPersian[status]) {
        status = statusMapToPersian[status];
      }
      if (statusMap[status] !== undefined) {
        statusMap[status]++;
      }
    });

    return [
      {
        name: "در حال ثبت‌نام",
        value: Math.round((statusMap["در حال ثبت‌نام"] / total) * 100) || 0,
        color: "#3b82f6",
      },
      {
        name: "فعال",
        value: Math.round((statusMap["فعال"] / total) * 100) || 0,
        color: "#10b981",
      },
      {
        name: "تکمیل شده",
        value: Math.round((statusMap["تکمیل شده"] / total) * 100) || 0,
        color: "#8b5cf6",
      },
      {
        name: "لغو شده",
        value: Math.round((statusMap["لغو شده"] / total) * 100) || 0,
        color: "#ef4444",
      },
    ];
  };

  const stats = {
    total: filteredInventory.length,
    active: filteredInventory.filter(
      (c) => c.status === "فعال" || c.status === "ACTIVE",
    ).length,
    registering: filteredInventory.filter(
      (c) => c.status === "در حال ثبت‌نام" || c.status === "UNDER_REGISTRATION",
    ).length,
    completed: filteredInventory.filter(
      (c) => c.status === "تکمیل شده" || c.status === "COMPLETED",
    ).length,
    canceled: filteredInventory.filter(
      (c) => c.status === "لغو شده" || c.status === "CANCELED",
    ).length,
    totalStudents: filteredInventory.reduce(
      (sum, c) => sum + (c.studentsCount || 0),
      0,
    ),
    totalTuition: filteredInventory.reduce(
      (sum, c) => sum + (parseFloat(c.tuition) || 0),
      0,
    ),
  };

  const handleDelete = async (id, className) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: `کلاس "${className || id}" حذف خواهد شد!`,
      icon: "warning",
      background: "#1a1f2e",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "انصراف",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/class/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "حذف شد!",
          text: "کلاس با موفقیت حذف گردید.",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: err.message || "مشکلی در حذف کلاس رخ داد",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const getStatusBadge = (status) => {
    // تبدیل وضعیت انگلیسی به فارسی برای نمایش
    const statusMap = {
      UNDER_REGISTRATION: "در حال ثبت‌نام",
      ACTIVE: "فعال",
      COMPLETED: "تکمیل شده",
      CANCELED: "لغو شده",
    };

    const displayStatus = statusMap[status] || status;

    switch (displayStatus) {
      case "فعال":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "در حال ثبت‌نام":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "تکمیل شده":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "لغو شده":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      UNDER_REGISTRATION: "در حال ثبت‌نام",
      ACTIVE: "فعال",
      COMPLETED: "تکمیل شده",
      CANCELED: "لغو شده",
    };
    const displayStatus = statusMap[status] || status;

    switch (displayStatus) {
      case "فعال":
        return <CheckCircle size={10} />;
      case "در حال ثبت‌نام":
        return <Users size={10} />;
      case "تکمیل شده":
        return <GraduationCap size={10} />;
      case "لغو شده":
        return <XCircle size={10} />;
      default:
        return null;
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      UNDER_REGISTRATION: "در حال ثبت‌نام",
      ACTIVE: "فعال",
      COMPLETED: "تکمیل شده",
      CANCELED: "لغو شده",
    };
    return statusMap[status] || status;
  };

  const formatNumber = (num) => {
    if (!num) return "۰";
    const n = Number(num);
    if (n >= 1_000_000_000_000) {
      return (n / 1_000_000_000_000).toFixed(1) + " تریلیون";
    }
    if (n >= 1_000_000_000) {
      return (n / 1_000_000_000).toFixed(1) + " میلیارد";
    }
    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(1) + " میلیون";
    }
    if (n >= 1_000) {
      return (n / 1_000).toFixed(1) + " هزار";
    }
    return n.toLocaleString();
  };

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen rounded-4xl bg-[#0F1420]"
        dir="rtl"
      >
        {/* Header - مدیریت کلاس‌ها */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-blue-500/20">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
              مدیریت{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                کلاس‌های آموزشی
              </span>
            </h1>
            <p className="text-gray-500 text-xs font-bold mt-3 flex items-center gap-2">
              <GraduationCap size={14} className="text-blue-400" />
              CLASS MANAGEMENT & STUDENT ENROLLMENT SYSTEM
            </p>
          </div>

          <Link
            href="/manager-dashboard/class/create"
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
          >
            <Plus size={20} />
            ایجاد کلاس جدید
          </Link>
        </div>

        {/* Top Analytics - آمار کلاس‌ها */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-blue-500/20 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            <div className="h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getStatusStats()}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getStatusStats().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#1a1f2e",
                      borderColor: "#3b82f6",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-black italic text-lg mb-4 uppercase tracking-tighter">
                وضعیت کلاس‌ها
              </h3>
              {getStatusStats().map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-400 text-xs font-bold">
                    {item.name}:
                  </span>
                  <span className="text-white text-xs font-black">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <GraduationCap className="text-blue-400" size={28} />
                  </div>
                </div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  کلاس‌های فعال
                </p>
                <h3 className="text-3xl font-black text-white italic mt-1">
                  {stats.active}
                  <span className="text-sm font-normal text-gray-400 tracking-normal mr-2">
                    کلاس
                  </span>
                </h3>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            </div>

            <div className="bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-blue-500/20 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl">
                    <Users className="text-purple-400" size={28} />
                  </div>
                </div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  تعداد زبان‌آموزان
                </p>
                <h3 className="text-3xl font-black text-white italic mt-1">
                  {stats.totalStudents}
                  <span className="text-sm font-normal text-gray-400 tracking-normal mr-2">
                    نفر
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* کارت‌های آماری اضافی */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase">
              کل کلاس‌ها
            </p>
            <p className="text-2xl font-black text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase">
              در حال ثبت‌نام
            </p>
            <p className="text-2xl font-black text-blue-400 mt-1">
              {stats.registering}
            </p>
          </div>
          <div className="bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase">
              تکمیل شده
            </p>
            <p className="text-2xl font-black text-purple-400 mt-1">
              {stats.completed}
            </p>
          </div>
          <div className="bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20 text-center">
            <p className="text-gray-500 text-[10px] font-bold uppercase">
              شهریه کل
            </p>
            <p className="text-lg font-black text-green-400 mt-1">
              {formatNumber(stats.totalTuition)} ت
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative group">
          <input
            type="text"
            placeholder="جستجو بر اساس نام کلاس، سطح، ترم، استاد یا وضعیت..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1f2e] border border-blue-500/20 text-white rounded-2xl p-4 pr-12 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
            size={20}
          />
        </div>

        {/* اگر در حال لود است */}
        {isLoading && (
          <div className="text-white p-6 text-center bg-[#1a1f2e] rounded-2xl">
            در حال بارگذاری داده‌ها...
          </div>
        )}

        {/* اگر خطا وجود دارد */}
        {isError && (
          <div className="text-red-400 p-6 text-center bg-[#1a1f2e] rounded-2xl">
            خطا در دریافت داده‌ها — دوباره تلاش کنید یا صفحه را رفرش کنید.
            <button
              onClick={() => refetch()}
              className="mr-2 text-sm bg-blue-500 text-white px-3 py-1 rounded-xl"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* Classes Table - لیست کلاس‌های آموزشی */}
        <div className="bg-[#1a1f2e] rounded-[2.5rem] border border-blue-500/20 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-blue-500/20 bg-blue-500/5 flex justify-between items-center">
            <h3 className="text-white font-black italic uppercase tracking-widest text-sm flex items-center gap-3">
              <GraduationCap className="text-blue-400" size={20} /> لیست
              کلاس‌های آموزشی مجموعه
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-blue-400 transition-colors">
                <History size={18} />
              </button>
              <button className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-blue-400 transition-colors">
                <BarChart3 size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-blue-500/10 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-blue-500/20">
                <tr>
                  <th className="p-6">نام کلاس / استاد</th>
                  <th className="p-6">سطح / ترم</th>
                  <th className="p-6">زمان / مکان</th>
                  <th className="p-6">دانشجو / ظرفیت</th>
                  <th className="p-6">تاریخ شروع</th>
                  <th className="p-6 text-center">وضعیت</th>
                  <th className="p-6 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/10 font-bold">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-20 text-gray-500 font-bold italic text-xl"
                    >
                      <GraduationCap
                        size={48}
                        className="mx-auto mb-4 opacity-30"
                      />
                      ⚠️ هیچ کلاسی با این مشخصات یافت نشد
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-500/5 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 group-hover:border-blue-400/50 transition-all">
                            <GraduationCap size={22} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {item.teacherName}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-xs font-bold">
                            {item.level}
                          </span>
                          <span className="text-[9px] text-gray-500">
                            {item.term}
                          </span>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-gray-300 text-xs">
                            <Clock size={12} className="text-blue-400" />
                            <span>{item.schedule}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                            <MapPin size={10} />
                            <span> {item.room}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-white font-bold">
                              {item.studentsCount}
                            </span>
                            <span className="text-gray-500">
                              /{item.capacity}
                            </span>
                          </div>
                          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                              style={{
                                width: `${item.capacity > 0 ? (item.studentsCount / item.capacity) * 100 : 0}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-gray-400 text-xs text-center">
                        {item.startDate}
                      </td>

                      <td className="p-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusBadge(item.status)}`}
                        >
                          {getStatusIcon(item.status)}
                          {getStatusDisplay(item.status)}
                        </span>
                      </td>

                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/manager-dashboard/class/${item.id}/edit`}
                            className="p-2 bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-2 bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center gap-2 text-gray-600 bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20">
          <AlertTriangle size={14} className="text-yellow-400" />
          <p className="text-[10px] font-bold uppercase tracking-widest italic text-gray-400">
            گزارش سیستم: {stats.registering} کلاس در وضعیت ثبت‌نام و{" "}
            {stats.active} کلاس فعال در حال برگزاری هستند.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useGetclasssQuery } from "@/redux/features/classApi";
import { useListUsersQuery } from "@/redux/features/userApi";
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
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import DashboardLayout from "../layout";

// تابع کمکی برای استخراج اطلاعات از schedule
const parseSchedule = (schedule) => {
  if (!schedule || typeof schedule !== "string") return null;

  // تشخیص روزهای فرد/زوج
  const isOdd = schedule.includes("فرد");
  const isEven = schedule.includes("زوج");

  // استخراج روزهای هفته
  const dayMap = {
    شنبه: "Saturday",
    یکشنبه: "Sunday",
    دوشنبه: "Monday",
    سه‌شنبه: "Tuesday",
    چهارشنبه: "Wednesday",
    پنجشنبه: "Thursday",
    جمعه: "Friday",
  };

  let days = [];
  Object.keys(dayMap).forEach((faDay) => {
    if (schedule.includes(faDay)) {
      days.push(dayMap[faDay]);
    }
  });

  // استخراج ساعت (فرمت: "21:00 - 22:00")
  const timeMatch = schedule.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
  let timeFrom = null;
  let timeTo = null;

  if (timeMatch) {
    timeFrom = timeMatch[1];
    timeTo = timeMatch[2];
  }

  return {
    isOdd,
    isEven,
    days,
    timeFrom,
    timeTo,
    hasDay: days.length > 0,
    hasTime: timeFrom && timeTo,
  };
};

export default function ClassPage() {
  // State های اصلی
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("startDate_desc");
  const [showStats, setShowStats] = useState(false);
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterTeacher, setFilterTeacher] = useState("ALL");
  const [filterDay, setFilterDay] = useState("ALL");
  const [filterTime, setFilterTime] = useState("ALL");
  const [filterTimeFrom, setFilterTimeFrom] = useState("");
  const [filterTimeTo, setFilterTimeTo] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // دریافت داده‌ها
  const {
    data: classs = [],
    isLoading,
    isError,
    refetch,
  } = useGetclasssQuery();

  const { data: usersData, isLoading: usersLoading } = useListUsersQuery();

  // استخراج لیست مدرسین از usersData
  const teachers = useMemo(() => {
    const raw = usersData?.data?.users || usersData?.users || usersData || [];
    return Array.isArray(raw) ? raw : [];
  }, [usersData]);

  // نرمال‌سازی کلاس‌ها و اعمال فیلترهای اولیه (وضعیت، جستجو و مرتب‌سازی)
  const normalizedClasses = useMemo(() => {
    let items = [];

    if (Array.isArray(classs)) {
      items = classs;
    } else if (classs?.data) {
      if (Array.isArray(classs.data)) {
        items = classs.data;
      } else if (Array.isArray(classs.data?.classes)) {
        items = classs.data.classes;
      } else {
        items = [];
      }
    } else {
      items = [];
    }

    // فیلتر وضعیت
    let filtered = items.filter((c) => {
      if (filterStatus === "ALL") return true;
      // تبدیل وضعیت انگلیسی به فارسی برای مقایسه
      const statusMap = {
        UNDER_REGISTRATION: "در حال ثبت‌نام",
        ACTIVE: "فعال",
        COMPLETED: "تکمیل شده",
        CANCELED: "لغو شده",
      };
      const displayStatus = statusMap[c.status] || c.status;
      if (filterStatus === "ACTIVE") return displayStatus === "فعال";
      if (filterStatus === "UNDER_REGISTRATION")
        return displayStatus === "در حال ثبت‌نام";
      if (filterStatus === "COMPLETED") return displayStatus === "تکمیل شده";
      if (filterStatus === "CANCELED") return displayStatus === "لغو شده";
      return true;
    });

    // جستجو
    filtered = filtered.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.term?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.schedule?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // مرتب‌سازی
    filtered.sort((a, b) => {
      if (sortBy === "startDate_desc") {
        return new Date(b.startDate) - new Date(a.startDate);
      }
      if (sortBy === "startDate_asc") {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      if (sortBy === "name_asc") {
        return a.name?.localeCompare(b.name);
      }
      if (sortBy === "name_desc") {
        return b.name?.localeCompare(a.name);
      }
      if (sortBy === "students_desc") {
        return (b.enrollments?.length || 0) - (a.enrollments?.length || 0);
      }
      if (sortBy === "students_asc") {
        return (a.enrollments?.length || 0) - (b.enrollments?.length || 0);
      }
      if (sortBy === "price_desc") {
        return (b.tuition || 0) - (a.tuition || 0);
      }
      if (sortBy === "price_asc") {
        return (a.tuition || 0) - (b.tuition || 0);
      }
      return 0;
    });

    return filtered.map((item) => ({
      id: item.id || item._id?.toString() || Math.random().toString(36).slice(2, 9),
      name: item.name || "—",
      level: item.level || "—",
      term: item.term || "—",
      teacherName: item.teacher?.name || item.teacherId?.name || "نامشخص",
      teacherId: item.teacherId || item.teacher?.id || null,
      studentsCount: item.enrollments?.length || item.studentIds?.length || item.students?.length || 0,
      capacity: item.capacity || 0,
      schedule: item.schedule || "—",
      room: item.room || "—",
      tuition: item.tuition || 0,
      status: item.status || "در حال ثبت‌نام",
      isConfirmed: item.isConfirmed || false,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : null,
      startDateFa: item.startDate ? new Date(item.startDate).toLocaleDateString("fa-IR") : "—",
      endDate: item.endDate ? new Date(item.endDate).toLocaleDateString("fa-IR") : "—",
      totalSessions: item.totalSessions || 0,
      description: item.description || "—",
      createdBy: item.createdBy?.name || item.createdBy || "—",
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString("fa-IR") : "—",
      raw: item,
    }));
  }, [classs, searchTerm, filterStatus, sortBy]);

  // اعمال فیلترهای پیشرفته (سطح، مدرس، روز، زمان، قیمت، تاریخ)
  const filteredClasses = useMemo(() => {
    let result = [...normalizedClasses];

    // فیلتر سطح
    if (filterLevel !== "ALL") {
      result = result.filter((c) => c.level === filterLevel);
    }

    // فیلتر مدرس
    if (filterTeacher !== "ALL") {
      result = result.filter(
        (c) => c.teacherId === filterTeacher || c.raw?.teacherId === filterTeacher
      );
    }

    // فیلتر روز (با پشتیبانی از فرد/زوج)
    if (filterDay !== "ALL") {
      result = result.filter((c) => {
        const parsed = parseSchedule(c.schedule);
        if (!parsed) return false;

        if (filterDay === "ODD") {
          return parsed.isOdd === true;
        }
        if (filterDay === "EVEN") {
          return parsed.isEven === true;
        }
        // روزهای هفته
        return parsed.days.includes(filterDay);
      });
    }

    // فیلتر بازه زمانی (از select با گزینه‌های دقیق)
    if (filterTime !== "ALL") {
      const [filterFrom, filterTo] = filterTime.split("-");
      result = result.filter((c) => {
        const parsed = parseSchedule(c.schedule);
        if (!parsed || !parsed.timeFrom || !parsed.timeTo) return false;

        const classFrom = parsed.timeFrom;
        const classTo = parsed.timeTo;

        return classFrom >= filterFrom && classTo <= filterTo;
      });
    }

    // فیلتر ساعت دقیق (از ساعت)
    if (filterTimeFrom) {
      result = result.filter((c) => {
        const parsed = parseSchedule(c.schedule);
        if (!parsed || !parsed.timeFrom) return false;
        return parsed.timeFrom >= filterTimeFrom;
      });
    }

    // فیلتر ساعت دقیق (تا ساعت)
    if (filterTimeTo) {
      result = result.filter((c) => {
        const parsed = parseSchedule(c.schedule);
        if (!parsed || !parsed.timeTo) return false;
        return parsed.timeTo <= filterTimeTo;
      });
    }

    // فیلتر محدوده شهریه
    if (priceRange.min) {
      result = result.filter((c) => c.tuition >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter((c) => c.tuition <= parseInt(priceRange.max));
    }

    // فیلتر تاریخ
    if (filterDateFrom) {
      result = result.filter(
        (c) => c.startDate && new Date(c.startDate) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      result = result.filter(
        (c) => c.startDate && new Date(c.startDate) <= new Date(filterDateTo)
      );
    }

    return result;
  }, [
    normalizedClasses,
    filterLevel,
    filterTeacher,
    filterDay,
    filterTime,
    filterTimeFrom,
    filterTimeTo,
    priceRange,
    filterDateFrom,
    filterDateTo,
  ]);

  // محاسبه آمار بر اساس filteredClasses
  const stats = useMemo(() => {
    const total = filteredClasses.length;
    const active = filteredClasses.filter(
      (c) => c.status === "فعال" || c.status === "ACTIVE"
    ).length;
    const registering = filteredClasses.filter(
      (c) => c.status === "در حال ثبت‌نام" || c.status === "UNDER_REGISTRATION"
    ).length;
    const completed = filteredClasses.filter(
      (c) => c.status === "تکمیل شده" || c.status === "COMPLETED"
    ).length;
    const canceled = filteredClasses.filter(
      (c) => c.status === "لغو شده" || c.status === "CANCELED"
    ).length;
    const totalStudents = filteredClasses.reduce(
      (sum, c) => sum + (c.studentsCount || 0),
      0
    );
    const totalTuition = filteredClasses.reduce(
      (sum, c) => sum + (parseFloat(c.tuition) || 0),
      0
    );

    return {
      total,
      active,
      registering,
      completed,
      canceled,
      totalStudents,
      totalTuition,
      avgStudents: total > 0 ? Math.round(totalStudents / total) : 0,
    };
  }, [filteredClasses]);

  // داده‌های نمودار وضعیت
  const getStatusStats = () => {
    const total = filteredClasses.length;
    if (total === 0) {
      return [
        { name: "در حال ثبت‌نام", value: 0, color: "#3b82f6" },
        { name: "فعال", value: 0, color: "#10b981" },
        { name: "تکمیل شده", value: 0, color: "#8b5cf6" },
        { name: "لغو شده", value: 0, color: "#ef4444" },
      ];
    }

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

    const statusMapToPersian = {
      UNDER_REGISTRATION: "در حال ثبت‌نام",
      ACTIVE: "فعال",
      COMPLETED: "تکمیل شده",
      CANCELED: "لغو شده",
    };

    filteredClasses.forEach((item) => {
      let status = item.status;
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

  // ریست کامل همه فیلترها
  const resetAllFilters = () => {
    setSearchTerm("");
    setFilterStatus("ALL");
    setSortBy("startDate_desc");
    setFilterLevel("ALL");
    setFilterTeacher("ALL");
    setFilterDay("ALL");
    setFilterTime("ALL");
    setFilterTimeFrom("");
    setFilterTimeTo("");
    setPriceRange({ min: "", max: "" });
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  if (isLoading || usersLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <Zap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 min-h-screen rounded-4xl bg-[#0F1420]" dir="rtl">
        {/* Header */}
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

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-xl text-gray-400 hover:text-blue-400 transition-all flex items-center gap-2"
            >
              <BarChart3 size={16} />
              <span className="text-xs">آمار</span>
            </button>
            <button
              onClick={() => refetch()}
              className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-xl text-gray-400 hover:text-blue-400 transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span className="text-xs">بروزرسانی</span>
            </button>
            <div className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-2xl">
              <p className="text-[10px] text-gray-500 font-bold uppercase">تعداد کلاس‌ها</p>
              <p className="text-white font-black text-xl text-center">{filteredClasses?.length || 0}</p>
            </div>
            <Link
              href="/manager-dashboard/class/create"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 text-sm"
            >
              <Plus size={16} />
              ایجاد کلاس
            </Link>
          </div>
        </div>

        {/* آمار پیشرفته (با دکمه showStats) */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">کل کلاس‌ها</p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-emerald-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">فعال</p>
              <p className="text-2xl font-black text-emerald-400">{stats.active}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">در حال ثبت‌نام</p>
              <p className="text-2xl font-black text-blue-400">{stats.registering}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-purple-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">تکمیل شده</p>
              <p className="text-2xl font-black text-purple-400">{stats.completed}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-red-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">لغو شده</p>
              <p className="text-2xl font-black text-red-400">{stats.canceled}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-yellow-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">کل دانشجویان</p>
              <p className="text-2xl font-black text-yellow-400">{stats.totalStudents}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-emerald-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">میانگین دانشجو</p>
              <p className="text-2xl font-black text-emerald-400">{stats.avgStudents}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-green-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">کل شهریه</p>
              <p className="text-xl font-black text-green-400">{formatNumber(stats.totalTuition)} ت</p>
            </div>
          </div>
        )}

        {/* فیلترها و مرتب‌سازی */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
          {/* دکمه‌های فیلتر سریع */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: "ALL", label: "📋 همه", color: "blue" },
              { value: "ACTIVE", label: "✅ فعال", color: "emerald" },
              { value: "UNDER_REGISTRATION", label: "📝 در حال ثبت‌نام", color: "amber" },
              { value: "COMPLETED", label: "🎯 تکمیل شده", color: "purple" },
              { value: "CANCELED", label: "❌ لغو شده", color: "red" },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-black transition-all ${
                  filterStatus === status.value
                    ? `bg-${status.color}-500/20 text-${status.color}-400 border border-${status.color}-500/50 shadow-lg shadow-${status.color}-500/10`
                    : "bg-[#1a1f2e] text-gray-500 border border-blue-500/20 hover:border-blue-400 hover:text-gray-300"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px h-8 bg-blue-500/20 mx-2"></div>

          {/* مرتب‌سازی */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1a1f2e] border border-blue-500/20 text-white rounded-xl px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
            >
              <optgroup label="📅 بر اساس تاریخ">
                <option value="startDate_desc">🆕 جدیدترین</option>
                <option value="startDate_asc">📅 قدیمی‌ترین</option>
              </optgroup>
              <optgroup label="💰 بر اساس شهریه">
                <option value="price_desc">💎 بیشترین شهریه</option>
                <option value="price_asc">💵 کمترین شهریه</option>
              </optgroup>
              <optgroup label="👥 بر اساس تعداد">
                <option value="students_desc">📈 بیشترین دانشجو</option>
                <option value="students_asc">📉 کمترین دانشجو</option>
              </optgroup>
              <optgroup label="📝 سایر">
                <option value="name_asc">🔤 الفبا (صعودی)</option>
                <option value="name_desc">🔤 الفبا (نزولی)</option>
              </optgroup>
            </select>

            <button
              onClick={resetAllFilters}
              className="bg-[#1a1f2e] border border-red-500/20 text-gray-400 hover:text-red-400 hover:border-red-500/50 rounded-xl px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>🔄</span> ریست
            </button>
          </div>
        </div>

        {/* فیلترهای پیشرفته */}
        <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* فیلتر سطح */}
            <div>
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                🎯 سطح زبانی
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                <option value="ALL">📚 همه سطوح</option>
                <option value="A1" className="text-emerald-400">🟢 A1 - مبتدی (مقدماتی)</option>
                <option value="A2" className="text-emerald-300">🟢 A2 - مبتدی (متوسط)</option>
                <option value="B1" className="text-yellow-400">🟡 B1 - متوسط (مقدماتی)</option>
                <option value="B2" className="text-yellow-300">🟡 B2 - متوسط (پیشرفته)</option>
                <option value="C1" className="text-red-400">🔴 C1 - پیشرفته</option>
                <option value="C2" className="text-red-300">🔴 C2 - مسلط (Native)</option>
                <option value="IELTS" className="text-purple-400">🟣 IELTS (آیلتس)</option>
                <option value="TOEFL" className="text-purple-300">🟣 TOEFL (تافل)</option>
                <option value="Conversation" className="text-blue-400">🔵 مکالمه (Conversation)</option>
                <option value="Grammar" className="text-blue-300">🔵 گرامر (Grammar)</option>
                <option value="Vocabulary" className="text-cyan-400">🔵 لغات (Vocabulary)</option>
                <option value="Reading" className="text-indigo-400">🔵 ریدینگ (Reading)</option>
                <option value="Writing" className="text-indigo-300">🔵 رایتینگ (Writing)</option>
                <option value="Listening" className="text-sky-400">🔵 لیسنینگ (Listening)</option>
                <option value="Kids" className="text-pink-400">🩷 کودکان (Kids)</option>
                <option value="General" className="text-gray-400">⚪ زبان عمومی (General)</option>
              </select>
            </div>

            {/* فیلتر مدرس */}
            <div>
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                👨‍🏫 مدرس
              </label>
              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                <option value="ALL">همه مدرسین</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id || teacher._id} value={teacher.id || teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* فیلتر روز هفته */}
            <div>
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                📅 روز هفته
              </label>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                <option value="ALL">همه روزها</option>
                <option value="Saturday">شنبه</option>
                <option value="Sunday">یکشنبه</option>
                <option value="Monday">دوشنبه</option>
                <option value="Tuesday">سه‌شنبه</option>
                <option value="Wednesday">چهارشنبه</option>
                <option value="Thursday">پنجشنبه</option>
                <option value="Friday">جمعه</option>
                <option value="ODD">📅 روزهای فرد</option>
                <option value="EVEN">📅 روزهای زوج</option>
              </select>
            </div>

            {/* فیلتر بازه زمانی */}
            <div>
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                ⏰ بازه زمانی
              </label>
              <select
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all cursor-pointer"
              >
                <option value="ALL">⏰ همه زمان‌ها</option>
                <optgroup label="🌅 صبح">
                  <option value="06:00-08:00">۶ - ۸ صبح</option>
                  <option value="08:00-10:00">۸ - ۱۰ صبح</option>
                  <option value="10:00-12:00">۱۰ - ۱۲ صبح</option>
                </optgroup>
                <optgroup label="🌞 ظهر">
                  <option value="12:00-14:00">۱۲ - ۲ ظهر</option>
                  <option value="14:00-16:00">۲ - ۴ بعدازظهر</option>
                </optgroup>
                <optgroup label="🌆 عصر">
                  <option value="16:00-18:00">۴ - ۶ عصر</option>
                  <option value="18:00-20:00">۶ - ۸ عصر</option>
                </optgroup>
                <optgroup label="🌙 شب">
                  <option value="20:00-22:00">۸ - ۱۰ شب</option>
                  <option value="22:00-00:00">۱۰ شب - ۱۲ نیمه‌شب</option>
                </optgroup>
              </select>
            </div>

            {/* فیلتر ساعت دقیق */}
            <div className="col-span-2">
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                ⏱️ ساعت دقیق
              </label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[9px] font-bold">از</span>
                  <input
                    type="time"
                    value={filterTimeFrom}
                    onChange={(e) => setFilterTimeFrom(e.target.value)}
                    className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 pr-8 text-xs focus:outline-none focus:border-blue-400 transition-all"
                    dir="ltr"
                  />
                </div>
                <span className="text-gray-500 text-xs font-bold">تا</span>
                <div className="relative w-full">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[9px] font-bold">تا</span>
                  <input
                    type="time"
                    value={filterTimeTo}
                    onChange={(e) => setFilterTimeTo(e.target.value)}
                    className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 pr-8 text-xs focus:outline-none focus:border-blue-400 transition-all"
                    dir="ltr"
                  />
                </div>
                <button
                  onClick={() => { setFilterTimeFrom(""); setFilterTimeTo(""); }}
                  className="text-gray-500 hover:text-red-400 text-xs font-bold transition-all p-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* محدوده شهریه و تاریخ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-blue-500/20">
            <div className="col-span-2">
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                💰 محدوده شهریه (تومان)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="۰"
                  value={priceRange.min ? Number(priceRange.min).toLocaleString("en-US") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setPriceRange((prev) => ({ ...prev, min: raw }));
                  }}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all text-left"
                  dir="ltr"
                />
                <span className="text-gray-500 text-xs font-bold">تا</span>
                <input
                  type="text"
                  placeholder="۰"
                  value={priceRange.max ? Number(priceRange.max).toLocaleString("en-US") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setPriceRange((prev) => ({ ...prev, max: raw }));
                  }}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all text-left"
                  dir="ltr"
                />
                <button
                  onClick={() => setPriceRange({ min: "", max: "" })}
                  className="text-gray-500 hover:text-red-400 text-xs font-bold transition-all p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                📆 از تاریخ
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                📆 تا تاریخ
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* تعداد نتایج و تگ‌های فیلتر فعال */}
          <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-blue-500/20">
            <div className="text-gray-500 text-xs font-bold">
              <span className="text-blue-400 text-base">{filteredClasses.length}</span> کلاس یافت شد
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filterStatus !== "ALL" && (
                <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {filterStatus}
                  <button onClick={() => setFilterStatus("ALL")} className="hover:text-red-400">×</button>
                </span>
              )}
              {filterLevel !== "ALL" && (
                <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {filterLevel}
                  <button onClick={() => setFilterLevel("ALL")} className="hover:text-red-400">×</button>
                </span>
              )}
              {filterTeacher !== "ALL" && (
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {teachers.find(t => t.id === filterTeacher || t._id === filterTeacher)?.name || filterTeacher}
                  <button onClick={() => setFilterTeacher("ALL")} className="hover:text-red-400">×</button>
                </span>
              )}
              {filterDay !== "ALL" && (
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {filterDay === "ODD" ? "روزهای فرد" : filterDay === "EVEN" ? "روزهای زوج" : filterDay}
                  <button onClick={() => setFilterDay("ALL")} className="hover:text-red-400">×</button>
                </span>
              )}
              {(priceRange.min || priceRange.max) && (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  {priceRange.min || "۰"} - {priceRange.max || "∞"} تومان
                  <button onClick={() => setPriceRange({ min: "", max: "" })} className="hover:text-red-400">×</button>
                </span>
              )}
              {filterDateFrom && (
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  از {new Date(filterDateFrom).toLocaleDateString("fa-IR")}
                  <button onClick={() => setFilterDateFrom("")} className="hover:text-red-400">×</button>
                </span>
              )}
              {filterDateTo && (
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  تا {new Date(filterDateTo).toLocaleDateString("fa-IR")}
                  <button onClick={() => setFilterDateTo("")} className="hover:text-red-400">×</button>
                </span>
              )}
            </div>
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
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
        </div>

        {/* Table */}
        <div className="bg-[#1a1f2e] rounded-[2.5rem] border border-blue-500/20 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-blue-500/20 bg-blue-500/5 flex justify-between items-center">
            <h3 className="text-white font-black italic uppercase tracking-widest text-sm flex items-center gap-3">
              <GraduationCap className="text-blue-400" size={20} /> لیست کلاس‌های آموزشی مجموعه
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
                {filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-20 text-gray-500 font-bold italic text-xl">
                      <GraduationCap size={48} className="mx-auto mb-4 opacity-30" />
                      ⚠️ هیچ کلاسی با این مشخصات یافت نشد
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-500/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 group-hover:border-blue-400/50 transition-all">
                            <GraduationCap size={22} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{item.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{item.teacherName}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-xs font-bold">{item.level}</span>
                          <span className="text-[9px] text-gray-500">{item.term}</span>
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
                            <span className="text-white font-bold">{item.studentsCount}</span>
                            <span className="text-gray-500">/{item.capacity}</span>
                          </div>
                          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                              style={{ width: `${item.capacity > 0 ? (item.studentsCount / item.capacity) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-gray-400 text-xs text-center">{item.startDateFa}</td>

                      <td className="p-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusBadge(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {getStatusDisplay(item.status)}
                        </span>
                      </td>

                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/manager-dashboard/class/${item.id}/edit`} className="p-2 bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-all">
                            <Edit3 size={16} />
                          </Link>
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 bg-gray-800 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
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
            گزارش سیستم: {stats.registering} کلاس در وضعیت ثبت‌نام و {stats.active} کلاس فعال در حال برگزاری هستند.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
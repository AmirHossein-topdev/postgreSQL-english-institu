"use client";

import React, { useState, useMemo } from "react";
import {
  useListUsersQuery,
  useDeleteUserMutation,
} from "../../../redux/features/userApi";
import {
  useGetClassesByTeacherQuery,
  useGetClassStudentsQuery,
} from "../../../redux/features/classApi";
import moment from "moment-jalaali";
import {
  Edit3,
  Trash2,
  Search,
  ArrowRight,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  Zap,
  GraduationCap,
  Users,
  Clock,
  MapPin as MapPinIcon,
  DollarSign,
  CheckCircle,
  XCircle,
  BookOpen,
  FileText,
  BarChart3,
  Filter,
  Download,
  Printer,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  TrendingUp,
  UserCheck,
  UserX,
  CalendarDays,
  Clock as ClockIcon,
  MessageSquare,
  Mail,
  Eye,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../layout";
import Swal from "sweetalert2";

// کامپوننت کارت کلاس با امکانات بیشتر
const ClassCard = ({ classItem, isSelected, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    ACTIVE: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10",
    UNDER_REGISTRATION: "text-blue-400 border-blue-400/20 bg-blue-500/10",
    COMPLETED: "text-purple-400 border-purple-400/20 bg-purple-500/10",
    CANCELED: "text-red-400 border-red-400/20 bg-red-500/10",
  };

  const statusMap = {
    ACTIVE: "فعال",
    UNDER_REGISTRATION: "در حال ثبت‌نام",
    COMPLETED: "تکمیل شده",
    CANCELED: "لغو شده",
  };

  const progressPercent =
    classItem.capacity > 0
      ? Math.round((classItem.studentsCount / classItem.capacity) * 100)
      : 0;

  return (
    <div
      onClick={() => onClick(classItem)}
      className={`bg-[#1a1f2e] p-5 rounded-2xl border transition-all cursor-pointer group ${
        isSelected
          ? "border-blue-400 bg-blue-500/5 shadow-lg shadow-blue-500/20"
          : "border-blue-500/20 hover:border-blue-400/60"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
            <GraduationCap size={20} />
          </div>
          <div>
            <h4 className="text-white font-black text-base">
              {classItem.name}
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                سطح {classItem.level}
              </span>
              <span className="text-[9px] font-black text-gray-500">
                {classItem.term}
              </span>
              {classItem.isConfirmed && (
                <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  ✓ تأیید شده
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[9px] font-black px-2 py-1 rounded-full border ${statusColors[classItem.status]}`}
          >
            {statusMap[classItem.status] || classItem.status}
          </span>
          <span className="text-[8px] text-gray-500">
            {new Date(classItem.createdAt).toLocaleDateString("fa-IR")}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-[12px] text-gray-400">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-blue-400" />
          <span>{classItem.schedule}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPinIcon size={12} className="text-blue-400" />
          <span>اتاق {classItem.room}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} className="text-blue-400" />
          <span>
            تعداد دانشجو: {classItem.studentsCount} / {classItem.capacity}
          </span>
          <div className="flex-1 max-w-[80px]">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className="text-[9px] text-gray-500">{progressPercent}%</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={12} className="text-emerald-400" />
          <span>
            شهریه: {Number(classItem.tuition).toLocaleString("en-US")} تومان
          </span>
        </div>
      </div>

      {/* بخش expand */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="mt-3 text-[10px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
      >
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isExpanded ? "بستن جزئیات" : "مشاهده جزئیات بیشتر"}
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-blue-500/10 space-y-2 text-[11px] text-gray-400">
          <div className="flex justify-between">
            <span>تعداد جلسات:</span>
            <span className="text-white font-bold">
              {classItem.totalSessions || 0}
            </span>
          </div>
          {classItem.description && (
            <div>
              <span>توضیحات:</span>
              <p className="text-gray-300 text-[10px] mt-1">
                {classItem.description}
              </p>
            </div>
          )}
          <div className="flex gap-4 mt-2">
            <button className="text-[9px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-500/30 transition">
              گزارش کلاس
            </button>
            <button className="text-[9px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full hover:bg-emerald-500/30 transition">
              حضور و غیاب
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// کامپوننت کارت دانشجو با امکانات بیشتر
const StudentCard = ({ student, onAttendanceToggle, isPresent }) => {
  const [attendanceStatus, setAttendanceStatus] = React.useState(isPresent);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);

  const handleAttendance = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAttendanceStatus(!attendanceStatus);

      Swal.fire({
        title: !attendanceStatus ? "✅ حضور ثبت شد" : "❌ غیبت ثبت شد",
        text: `${student.name} ${!attendanceStatus ? "حاضر" : "غایب"} اعلام شد`,
        icon: "success",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      if (onAttendanceToggle) {
        onAttendanceToggle(student.id || student._id, !attendanceStatus);
      }
    } catch (error) {
      console.error("خطا در ثبت حضور:", error);
      Swal.fire({
        title: "خطا!",
        text: "مشکلی در ثبت حضور به وجود آمد",
        icon: "error",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20 hover:border-blue-400/60 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30 overflow-hidden">
          {student.profileImage &&
          student.profileImage !== "default-avatar.png" ? (
            <img
              src={
                student.profileImage.startsWith("http")
                  ? student.profileImage
                  : `http://localhost:5000${student.profileImage}`
              }
              alt={student.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-lg font-black">
              {student.name?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-black text-sm">{student.name}</h4>
              <p className="text-gray-500 text-[9px] mt-0.5">
                کد: {student.employeeCode}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                {student.studentProfile?.level || student.level || "نامشخص"}
              </span>
              <span className="text-[8px] text-gray-500">
                ثبت‌نام:{" "}
                {student.enrollDate
                  ? new Date(student.enrollDate).toLocaleDateString("fa-IR")
                  : "—"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <Phone size={10} /> {student.phone || "بدون شماره"}
            </span>
            <span className="flex items-center gap-1">
              <Mail size={10} /> {student.email || "بدون ایمیل"}
            </span>
            {student.studentProfile?.emergencyPhone && (
              <span className="flex items-center gap-1 text-yellow-400">
                <ShieldCheck size={10} />{" "}
                {student.studentProfile.emergencyPhone}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleAttendance}
            disabled={isSubmitting}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all transform hover:scale-105 ${
              attendanceStatus
                ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 hover:bg-emerald-500/30"
                : "bg-red-500/20 border border-red-400/50 text-red-400 hover:bg-red-500/30"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed animate-pulse" : ""}`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : attendanceStatus ? (
              <CheckCircle size={24} />
            ) : (
              <XCircle size={24} />
            )}
          </button>
          <button
            onClick={() => setShowContact(!showContact)}
            className="text-[8px] text-gray-500 hover:text-blue-400 transition"
          >
            {showContact ? "بستن" : "تماس"}
          </button>
        </div>
      </div>

      {showContact && (
        <div className="mt-3 pt-3 border-t border-blue-500/10 grid grid-cols-2 gap-2 text-[10px]">
          <a
            href={`tel:${student.phone}`}
            className="bg-blue-500/20 text-blue-400 text-center py-1.5 rounded-lg hover:bg-blue-500/30 transition"
          >
            تماس تلفنی
          </a>
          <a
            href={`mailto:${student.email}`}
            className="bg-purple-500/20 text-purple-400 text-center py-1.5 rounded-lg hover:bg-purple-500/30 transition"
          >
            ارسال ایمیل
          </a>
        </div>
      )}
    </div>
  );
};

export default function TeacherClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("startDate_desc");
  const [showStats, setShowStats] = useState(false);
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterTeacher, setFilterTeacher] = useState("ALL");
  const [filterDay, setFilterDay] = useState("ALL");
  const [filterTime, setFilterTime] = useState("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [filterTimeFrom, setFilterTimeFrom] = useState("");
  const [filterTimeTo, setFilterTimeTo] = useState("");

  React.useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === "teacher" || user.role === "Teacher") {
          setCurrentTeacher(user);
        }
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  }, []);

  const teacherId = currentTeacher?.id || currentTeacher?._id;

  const {
    data: teacherClasses = [],
    isLoading: classesLoading,
    refetch: refetchClasses,
  } = useGetClassesByTeacherQuery(teacherId, {
    skip: !teacherId,
  });

  const {
    data: classStudents = [],
    isLoading: studentsLoading,
    refetch: refetchStudents,
  } = useGetClassStudentsQuery(selectedClass?.id || selectedClass?._id, {
    skip: !selectedClass?.id && !selectedClass?._id,
  });

  // استخراج لیست مدرسین از usersData
  const teachers = useMemo(() => {
    const raw = usersData?.data?.users || usersData?.users || usersData || [];
    return Array.isArray(raw) ? raw : [];
  }, [usersData]);

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
  };

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

  // نرمال‌سازی کلاس‌ها و اعمال فیلترهای اولیه (وضعیت، جستجو و مرتب‌سازی)
  const normalizedClasses = useMemo(() => {
    let items = [];
    if (Array.isArray(teacherClasses)) {
      items = teacherClasses;
    } else if (teacherClasses?.data && Array.isArray(teacherClasses.data)) {
      items = teacherClasses.data;
    } else if (
      teacherClasses?.classes &&
      Array.isArray(teacherClasses.classes)
    ) {
      items = teacherClasses.classes;
    }

    // فیلتر وضعیت
    let filtered = items.filter((c) => {
      if (filterStatus === "ALL") return true;
      return c.status === filterStatus;
    });

    // جستجو
    filtered = filtered.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.term?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // مرتب‌سازی (پیش‌فرض)
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

    return filtered.map((cls) => ({
      ...cls,
      studentsCount: cls.enrollments?.length || cls.studentIds?.length || 0,
    }));
  }, [teacherClasses, searchTerm, filterStatus, sortBy]);

  // اعمال فیلترهای پیشرفته (سطح، مدرس، روز، زمان، قیمت، تاریخ) روی normalizedClasses
  // اعمال فیلترهای پیشرفته (سطح، مدرس، روز، زمان، قیمت، تاریخ) روی normalizedClasses
  const filteredClasses = useMemo(() => {
    let result = [...normalizedClasses];

    // فیلتر سطح
    if (filterLevel !== "ALL") {
      result = result.filter((c) => c.level === filterLevel);
    }

    // فیلتر مدرس
    if (filterTeacher !== "ALL") {
      result = result.filter(
        (c) => c.teacherId === filterTeacher || c.teacher === filterTeacher,
      );
    }

    // ✅ فیلتر روز (با پشتیبانی از فرد/زوج)
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

    // ✅ فیلتر بازه زمانی (از select با گزینه‌های دقیق)
    if (filterTime !== "ALL") {
      const [filterFrom, filterTo] = filterTime.split("-");
      result = result.filter((c) => {
        const parsed = parseSchedule(c.schedule);
        if (!parsed || !parsed.timeFrom || !parsed.timeTo) return false;

        const classFrom = parsed.timeFrom;
        const classTo = parsed.timeTo;

        // بررسی تداخل زمانی (کلاس در بازه انتخاب‌شده قرار دارد)
        return classFrom >= filterFrom && classTo <= filterTo;
      });
    }

    // ✅ فیلتر ساعت دقیق (از ساعت)
    if (filterTimeFrom) {
      result = result.filter((c) => {
        const parsed = parseSchedule(c.schedule);
        if (!parsed || !parsed.timeFrom) return false;
        return parsed.timeFrom >= filterTimeFrom;
      });
    }

    // ✅ فیلتر ساعت دقیق (تا ساعت)
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
        (c) => new Date(c.startDate) >= new Date(filterDateFrom),
      );
    }
    if (filterDateTo) {
      result = result.filter(
        (c) => new Date(c.startDate) <= new Date(filterDateTo),
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

  const normalizedStudents = useMemo(() => {
    let items = [];
    if (Array.isArray(classStudents)) {
      items = classStudents;
    } else if (classStudents?.data && Array.isArray(classStudents.data)) {
      items = classStudents.data;
    } else if (
      classStudents?.students &&
      Array.isArray(classStudents.students)
    ) {
      items = classStudents.students;
    }

    return items.map((student) => ({
      ...student,
      studentProfile: student.studentProfile || null,
    }));
  }, [classStudents]);

  // محاسبه آمار
  const stats = useMemo(() => {
    const total = filteredClasses.length;
    const active = filteredClasses.filter((c) => c.status === "ACTIVE").length;
    const registering = filteredClasses.filter(
      (c) => c.status === "UNDER_REGISTRATION",
    ).length;
    const completed = filteredClasses.filter(
      (c) => c.status === "COMPLETED",
    ).length;
    const totalStudents = filteredClasses.reduce(
      (sum, c) => sum + (c.studentsCount || 0),
      0,
    );
    const totalTuition = filteredClasses.reduce(
      (sum, c) => sum + Number(c.tuition || 0),
      0,
    );
    const avgStudents = total > 0 ? Math.round(totalStudents / total) : 0;

    return {
      total,
      active,
      registering,
      completed,
      totalStudents,
      totalTuition,
      avgStudents,
    };
  }, [filteredClasses]);

  if (usersLoading || classesLoading) {
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
      <div
        className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-4xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-blue-500/20">
          <div className="flex items-center gap-4">
            <Link
              href="/teacher-dashboard"
              className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
            >
              <ArrowRight size={24} />
            </Link>
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                مدیریت{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                  کلاس‌های من
                </span>
              </h2>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                {currentTeacher?.name} - لیست کلاس‌ها و دانشجویان
              </p>
            </div>
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
              onClick={() => refetchClasses()}
              className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-xl text-gray-400 hover:text-blue-400 transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span className="text-xs">بروزرسانی</span>
            </button>
            <div className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-2xl">
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                تعداد کلاس‌ها
              </p>
              <p className="text-white font-black text-xl text-center">
                {filteredClasses?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* آمار */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                کل کلاس‌ها
              </p>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-emerald-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                فعال
              </p>
              <p className="text-2xl font-black text-emerald-400">
                {stats.active}
              </p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                در حال ثبت‌نام
              </p>
              <p className="text-2xl font-black text-blue-400">
                {stats.registering}
              </p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-purple-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                تکمیل شده
              </p>
              <p className="text-2xl font-black text-purple-400">
                {stats.completed}
              </p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-yellow-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                کل دانشجویان
              </p>
              <p className="text-2xl font-black text-yellow-400">
                {stats.totalStudents}
              </p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-emerald-500/20 text-center">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                میانگین دانشجو
              </p>
              <p className="text-2xl font-black text-emerald-400">
                {stats.avgStudents}
              </p>
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-green-500/20 text-center col-span-2">
              <p className="text-gray-500 text-[10px] font-bold uppercase">
                کل شهریه
              </p>
              <p className="text-2xl font-black text-green-400">
                {stats.totalTuition.toLocaleString("en-US")} تومان
              </p>
            </div>
          </div>
        )}

        {/* دو ستون اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ستون راست - لیست کلاس‌ها */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-white font-black italic flex items-center gap-2 text-lg">
                <GraduationCap className="text-blue-400" size={22} />
                کلاس‌های من
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-[10px] font-bold">
                  {filteredClasses?.length} کلاس
                </span>
              </div>
            </div>

            {/* فیلترها و مرتب‌سازی پیشرفته */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
              {/* دکمه‌های فیلتر سریع */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: "ALL", label: "📋 همه", color: "blue" },
                  { value: "ACTIVE", label: "✅ فعال", color: "emerald" },
                  {
                    value: "UNDER_REGISTRATION",
                    label: "📝 در حال ثبت‌نام",
                    color: "amber",
                  },
                  {
                    value: "COMPLETED",
                    label: "🎯 تکمیل شده",
                    color: "purple",
                  },
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

              {/* جداکننده */}
              <div className="hidden md:block w-px h-8 bg-blue-500/20 mx-2"></div>

              {/* مرتب‌سازی پیشرفته */}
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

                {/* دکمه حذف فیلترها */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("ALL");
                    setSortBy("startDate_desc");
                    setFilterLevel("ALL");
                    setFilterTeacher("ALL");
                    setFilterDay("ALL");
                    setFilterTime("ALL");
                    setPriceRange({ min: "", max: "" });
                    setFilterDateFrom("");
                    setFilterDateTo("");
                  }}
                  className="bg-[#1a1f2e] border border-red-500/20 text-gray-400 hover:text-red-400 hover:border-red-500/50 rounded-xl px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span>🔄</span> ریست
                </button>
              </div>
            </div>

            {/* فیلترهای پیشرفته (قابل باز و بسته شدن) */}
            <div className="bg-[#1a1f2e]/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4 mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* فیلتر سطح (بر اساس CEFR با توضیحات کامل) */}
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

                    {/* سطح مبتدی */}
                    <option value="A1" className="text-emerald-400">
                      🟢 A1 - مبتدی (مقدماتی)
                    </option>
                    <option value="A2" className="text-emerald-300">
                      🟢 A2 - مبتدی (متوسط)
                    </option>

                    {/* سطح متوسط */}
                    <option value="B1" className="text-yellow-400">
                      🟡 B1 - متوسط (مقدماتی)
                    </option>
                    <option value="B2" className="text-yellow-300">
                      🟡 B2 - متوسط (پیشرفته)
                    </option>

                    {/* سطح پیشرفته */}
                    <option value="C1" className="text-red-400">
                      🔴 C1 - پیشرفته
                    </option>
                    <option value="C2" className="text-red-300">
                      🔴 C2 - مسلط (Native)
                    </option>

                    {/* سطوح تخصصی (اختیاری) */}
                    <option value="IELTS" className="text-purple-400">
                      🟣 IELTS (آیلتس)
                    </option>
                    <option value="TOEFL" className="text-purple-300">
                      🟣 TOEFL (تافل)
                    </option>
                    <option value="Conversation" className="text-blue-400">
                      🔵 مکالمه (Conversation)
                    </option>
                    <option value="Grammar" className="text-blue-300">
                      🔵 گرامر (Grammar)
                    </option>
                    <option value="Vocabulary" className="text-cyan-400">
                      🔵 لغات (Vocabulary)
                    </option>
                    <option value="Reading" className="text-indigo-400">
                      🔵 ریدینگ (Reading)
                    </option>
                    <option value="Writing" className="text-indigo-300">
                      🔵 رایتینگ (Writing)
                    </option>
                    <option value="Listening" className="text-sky-400">
                      🔵 لیسنینگ (Listening)
                    </option>
                    <option value="Kids" className="text-pink-400">
                      🩷 کودکان (Kids)
                    </option>
                    <option value="General" className="text-gray-400">
                      ⚪ زبان عمومی (General)
                    </option>
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
                      <option
                        key={teacher.id || teacher._id}
                        value={teacher.id || teacher._id}
                      >
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* فیلتر روز هفته (با گزینه‌های فرد و زوج) */}
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

                {/* فیلتر زمان (با گزینه‌های دقیق‌تر) */}
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

                {/* فیلتر ساعت دقیق (شروع و پایان) */}
                <div className="col-span-2">
                  <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                    ⏱️ ساعت دقیق
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[9px] font-bold">
                        از
                      </span>
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
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[9px] font-bold">
                        تا
                      </span>
                      <input
                        type="time"
                        value={filterTimeTo}
                        onChange={(e) => setFilterTimeTo(e.target.value)}
                        className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 pr-8 text-xs focus:outline-none focus:border-blue-400 transition-all"
                        dir="ltr"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setFilterTimeFrom("");
                        setFilterTimeTo("");
                      }}
                      className="text-gray-500 hover:text-red-400 text-xs font-bold transition-all p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* فیلتر محدوده شهریه */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-blue-500/20">
                <div className="col-span-2">
                  <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">
                    💰 محدوده شهریه (تومان)
                  </label>
                  <div className="flex items-center gap-2">
                    {/* ورودی از (با فرمت هزارگان) */}
                    <input
                      type="text"
                      placeholder="۰"
                      value={
                        priceRange.min
                          ? Number(priceRange.min).toLocaleString("en-US")
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setPriceRange((prev) => ({ ...prev, min: raw }));
                      }}
                      className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all text-left"
                      dir="ltr"
                    />

                    <span className="text-gray-500 text-xs font-bold">تا</span>

                    {/* ورودی تا (با فرمت هزارگان) */}
                    <input
                      type="text"
                      placeholder="۰"
                      value={
                        priceRange.max
                          ? Number(priceRange.max).toLocaleString("en-US")
                          : ""
                      }
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setPriceRange((prev) => ({ ...prev, max: raw }));
                      }}
                      className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition-all text-left"
                      dir="ltr"
                    />

                    {/* دکمه پاک کردن */}
                    <button
                      onClick={() => setPriceRange({ min: "", max: "" })}
                      className="text-gray-500 hover:text-red-400 text-xs font-bold transition-all p-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>

              {/* تعداد نتایج و فیلترهای فعال */}
              <div className="flex flex-wrap items-center justify-between mt-4 pt-3 border-t border-blue-500/20">
                <div className="text-gray-500 text-xs font-bold">
                  <span className="text-blue-400 text-base">
                    {filteredClasses.length}
                  </span>{" "}
                  کلاس یافت شد
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filterStatus !== "ALL" && (
                    <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      {filterStatus}
                      <button
                        onClick={() => setFilterStatus("ALL")}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterLevel !== "ALL" && (
                    <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      {filterLevel}
                      <button
                        onClick={() => setFilterLevel("ALL")}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterTeacher !== "ALL" && (
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      {teachers.find(
                        (t) =>
                          t.id === filterTeacher || t._id === filterTeacher,
                      )?.name || filterTeacher}
                      <button
                        onClick={() => setFilterTeacher("ALL")}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {(priceRange.min || priceRange.max) && (
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      {priceRange.min || "۰"} - {priceRange.max || "∞"} تومان
                      <button
                        onClick={() => setPriceRange({ min: "", max: "" })}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterDateFrom && (
                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      از {new Date(filterDateFrom).toLocaleDateString("fa-IR")}
                      <button
                        onClick={() => setFilterDateFrom("")}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filterDateTo && (
                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      تا {new Date(filterDateTo).toLocaleDateString("fa-IR")}
                      <button
                        onClick={() => setFilterDateTo("")}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <input
                type="text"
                placeholder="جستجو در کلاس‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a1f2e] border border-blue-500/20 text-white rounded-xl p-3 pr-10 text-sm focus:outline-none focus:border-blue-400 transition-all"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={16}
              />
            </div>

            {/* لیست کلاس‌ها */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredClasses?.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                  <GraduationCap
                    size={48}
                    className="mx-auto text-gray-600 mb-3"
                  />
                  <p className="text-gray-500 font-bold">
                    {searchTerm ||
                    filterStatus !== "ALL" ||
                    filterLevel !== "ALL" ||
                    filterTeacher !== "ALL" ||
                    filterDay !== "ALL" ||
                    filterTime !== "ALL" ||
                    priceRange.min ||
                    priceRange.max ||
                    filterDateFrom ||
                    filterDateTo
                      ? "کلاسی با این مشخصات یافت نشد"
                      : "هیچ کلاسی برای شما یافت نشد"}
                  </p>
                  {(searchTerm ||
                    filterStatus !== "ALL" ||
                    filterLevel !== "ALL" ||
                    filterTeacher !== "ALL" ||
                    filterDay !== "ALL" ||
                    filterTime !== "ALL" ||
                    priceRange.min ||
                    priceRange.max ||
                    filterDateFrom ||
                    filterDateTo) && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("ALL");
                        setFilterLevel("ALL");
                        setFilterTeacher("ALL");
                        setFilterDay("ALL");
                        setFilterTime("ALL");
                        setPriceRange({ min: "", max: "" });
                        setFilterDateFrom("");
                        setFilterDateTo("");
                      }}
                      className="text-xs text-blue-400 mt-2 hover:underline"
                    >
                      پاک کردن همه فیلترها
                    </button>
                  )}
                </div>
              ) : (
                filteredClasses.map((classItem) => (
                  <ClassCard
                    key={classItem.id || classItem._id}
                    classItem={classItem}
                    isSelected={
                      selectedClass?.id === classItem.id ||
                      selectedClass?._id === classItem._id
                    }
                    onClick={handleClassClick}
                  />
                ))
              )}
            </div>
          </div>

          {/* ستون چپ - لیست دانشجویان کلاس انتخاب شده */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black italic flex items-center gap-2 text-lg">
                <Users className="text-blue-400" size={22} />
                دانشجویان کلاس
              </h3>
              {selectedClass && (
                <span className="text-gray-500 text-[10px] font-bold">
                  {normalizedStudents?.length || 0} / {selectedClass.capacity}{" "}
                  نفر
                </span>
              )}
            </div>

            {!selectedClass ? (
              <div className="text-center py-32 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                <BookOpen size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500 font-bold italic">
                  از سمت راست یک کلاس را انتخاب کنید
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  برای مشاهده لیست دانشجویان
                </p>
              </div>
            ) : studentsLoading ? (
              <div className="flex items-center justify-center py-32 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                <div className="animate-pulse text-blue-400">
                  در حال بارگذاری...
                </div>
              </div>
            ) : normalizedStudents?.length === 0 ? (
              <div className="text-center py-32 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                <Users size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500 font-bold italic">
                  هیچ دانشجویی در این کلاس ثبت نشده است
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {/* هدر کلاس انتخاب شده */}
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 p-4 rounded-xl border border-blue-500/20 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-black">
                      {selectedClass.name}
                    </h4>
                    <div className="flex gap-2">
                      <button className="text-[9px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full hover:bg-blue-500/30 transition">
                        <Download size={12} className="inline ml-1" />
                        خروجی
                      </button>
                      <button className="text-[9px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full hover:bg-emerald-500/30 transition">
                        <Printer size={12} className="inline ml-1" />
                        چاپ
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-gray-400">
                    <span>سطح: {selectedClass.level}</span>
                    <span>ترم: {selectedClass.term}</span>
                    <span>زمان: {selectedClass.schedule}</span>
                    <span>اتاق: {selectedClass.room}</span>
                  </div>
                </div>

                {/* لیست دانشجوها */}
                {normalizedStudents.map((student) => (
                  <StudentCard
                    key={student.id || student._id}
                    student={student}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CSS for custom scrollbar */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1a1f2e;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 10px;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}

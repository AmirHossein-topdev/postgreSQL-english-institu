"use client";

import React, { useState, useEffect } from "react";
import {
  useListUsersQuery,
  useDeleteUserMutation,
} from "../../../redux/features/userApi";
import {
  useGetClassesByStudentQuery,
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
  Award,
  User,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../layout";
import Swal from "sweetalert2";

// کامپوننت کارت کلاس
const ClassCard = ({ classItem, isSelected, onClick }) => {
  const statusColors = {
    فعال: "text-emerald-400 border-emerald-400/20 bg-emerald-500/10",
    "در حال ثبت‌نام": "text-blue-400 border-blue-400/20 bg-blue-500/10",
    "تکمیل شده": "text-purple-400 border-purple-400/20 bg-purple-500/10",
    "لغو شده": "text-red-400 border-red-400/20 bg-red-500/10",
  };

  return (
    <div
      onClick={() => onClick(classItem)}
      className={`bg-[#1a1f2e] p-5 rounded-2xl border transition-all cursor-pointer group  ${
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
            <div className="flex gap-2 mt-1">
              <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                سطح {classItem.level}
              </span>
              <span className="text-[9px] font-black text-gray-500">
                {classItem.term}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`text-[9px] font-black px-2 py-1 rounded-full border ${statusColors[classItem.status]}`}
        >
          {classItem.status}
        </span>
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
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={12} className="text-emerald-400" />
          <span>شهریه: {classItem.tuition?.toLocaleString()} تومان</span>
        </div>
      </div>
    </div>
  );
};

// کامپوننت کارت استاد
const TeacherCard = ({ teacher }) => {
  return (
    <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20 hover:border-blue-400/60 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-blue-400">
          {teacher.profileImage ? (
            <img
              src={`http://localhost:7000/uploads/${teacher.profileImage}`}
              alt={teacher.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-lg font-black">
              {teacher.name?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-black text-sm">{teacher.name}</h4>
              <p className="text-gray-500 text-[9px] mt-0.5">
                کد: {teacher.employeeCode}
              </p>
            </div>
            <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {teacher.specialization || "مدرس زبان"}
            </span>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-gray-500">
            <span>{teacher.phone || "بدون شماره"}</span>
            <span>{teacher.email || "بدون ایمیل"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function StudentClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery();

  // گرفتن اطلاعات دانشجو لاگین شده از sessionStorage
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("currentUser");
      console.log("📦 storedUser:", storedUser);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("👤 user:", user);
        console.log("🎭 user.role:", user.role);
        if (user.role === "student") {
          setCurrentStudent(user);
          console.log("✅ دانشجو ست شد:", user.name);
        } else {
          console.log("❌ نقش کاربر student نیست:", user.role);
        }
      } else {
        console.log("❌ storedUser وجود ندارد");
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  }, []);

  // گرفتن کلاس‌های دانشجو جاری (با استفاده از studentIds)
  const {
    data: studentClasses = [],
    isLoading: classesLoading,
    refetch: refetchClasses,
    error: classesError,
  } = useGetClassesByStudentQuery(currentStudent?._id, {
    skip: !currentStudent?._id,
  });

  // نرمالایز کردن داده کلاس‌ها
  const classes = React.useMemo(() => {
    let items = [];
    if (Array.isArray(studentClasses)) {
      items = studentClasses;
    } else if (studentClasses?.data && Array.isArray(studentClasses.data)) {
      items = studentClasses.data;
    } else if (
      studentClasses?.classes &&
      Array.isArray(studentClasses.classes)
    ) {
      items = studentClasses.classes;
    }

    console.log("📚 کلاس‌های دانشجو:", items);
    return items.map((cls) => ({
      ...cls,
      studentsCount: cls.studentIds?.length || 0,
    }));
  }, [studentClasses]);

  // گرفتن اطلاعات استاد کلاس انتخاب شده
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    if (selectedClass?.teacherId) {
      const teacherId =
        typeof selectedClass.teacherId === "object"
          ? selectedClass.teacherId._id
          : selectedClass.teacherId;

      const fetchTeacher = async () => {
        try {
          const response = await fetch(
            `http://localhost:7000/api/users/${teacherId}`,
          );
          const data = await response.json();
          setSelectedTeacher(data.user || data.data);
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      };
      fetchTeacher();
    } else {
      setSelectedTeacher(null);
    }
  }, [selectedClass]);

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
  };

  // لاگ‌های دیباگ
  console.log("====================================");
  console.log("🔍 currentStudent:", currentStudent);
  console.log("🔍 currentStudent?._id:", currentStudent?._id);
  console.log("🔍 studentClasses:", studentClasses);
  console.log("🔍 classes پردازش شده:", classes);
  console.log("🔍 تعداد کلاس‌ها:", classes.length);
  console.log("====================================");

  if (usersLoading || classesLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <Zap size={48} className="mb-4 animate-bounce" />
          در حال بارگذاری کلاس‌های شما...
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
              href="/student-dashboard"
              className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
            >
              <ArrowRight size={24} />
            </Link>
            <div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                  کلاس‌های من
                </span>
              </h2>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                {currentStudent?.name || "دانشجو"} - لیست کلاس‌های ثبت‌نامی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetchClasses()}
              className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-xl text-gray-400 hover:text-blue-400 transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span className="text-xs">بروزرسانی</span>
            </button>
            <div className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-2xl">
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                تعداد کلاس‌های من
              </p>
              <p className="text-white font-black text-xl text-center">
                {classes?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* دو ستون اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ستون راست - لیست کلاس‌ها */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black italic flex items-center gap-2 text-lg">
                <GraduationCap className="text-blue-400" size={22} />
                کلاس‌های ثبت‌نامی من
              </h3>
              <span className="text-gray-500 text-[10px] font-bold">
                {classes?.length} کلاس
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative group mb-4">
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
              {classes?.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                  <GraduationCap
                    size={48}
                    className="mx-auto text-gray-600 mb-3"
                  />
                  <p className="text-gray-500 font-bold">
                    {currentStudent
                      ? "هیچ کلاسی برای شما یافت نشد"
                      : "لطفاً وارد حساب کاربری خود شوید"}
                  </p>
                  {classesError && (
                    <p className="text-red-400 text-xs mt-2">
                      خطا در دریافت اطلاعات: {JSON.stringify(classesError)}
                    </p>
                  )}
                </div>
              ) : (
                classes
                  .filter(
                    (c) =>
                      !searchTerm ||
                      c.name?.includes(searchTerm) ||
                      c.level?.includes(searchTerm) ||
                      c.term?.includes(searchTerm),
                  )
                  .map((classItem) => (
                    <ClassCard
                      key={classItem._id}
                      classItem={classItem}
                      isSelected={selectedClass?._id === classItem._id}
                      onClick={handleClassClick}
                    />
                  ))
              )}
            </div>
          </div>

          {/* ستون چپ - جزئیات کلاس انتخاب شده */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black italic flex items-center gap-2 text-lg">
                <BookOpen className="text-blue-400" size={22} />
                جزئیات کلاس
              </h3>
            </div>

            {!selectedClass ? (
              <div className="text-center py-32 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                <BookOpen size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500 font-bold italic">
                  از سمت راست یک کلاس را انتخاب کنید
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  برای مشاهده جزئیات کامل
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {/* هدر کلاس انتخاب شده */}
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 p-5 rounded-xl border border-blue-500/20">
                  <h3 className="text-white font-black text-xl mb-2">
                    {selectedClass.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-3 text-[11px]">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                      سطح {selectedClass.level}
                    </span>
                    <span className="bg-gray-800/50 text-gray-400 px-3 py-1 rounded-full">
                      {selectedClass.term}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        selectedClass.status === "فعال"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : selectedClass.status === "در حال ثبت‌نام"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {selectedClass.status}
                    </span>
                  </div>
                </div>

                {/* اطلاعات استاد */}
                <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={16} className="text-blue-400" />
                    <h4 className="text-white font-black text-sm">مدرس کلاس</h4>
                  </div>
                  {selectedTeacher ? (
                    <TeacherCard teacher={selectedTeacher} />
                  ) : (
                    <div className="animate-pulse text-gray-500 text-sm p-4 text-center">
                      بارگذاری اطلاعات استاد...
                    </div>
                  )}
                </div>

                {/* زمان و مکان */}
                <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} className="text-blue-400" />
                    <h4 className="text-white font-black text-sm">
                      زمان و مکان برگزاری
                    </h4>
                  </div>
                  <div className="space-y-2 text-[13px] text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ساعت برگزاری:</span>
                      <span className="font-bold">
                        {selectedClass.schedule}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">مکان:</span>
                      <span className="font-bold">
                        اتاق {selectedClass.room}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">تاریخ شروع:</span>
                      <span className="font-bold">
                        {selectedClass.startDate
                          ? new Date(
                              selectedClass.startDate,
                            ).toLocaleDateString("fa-IR")
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">تاریخ پایان:</span>
                      <span className="font-bold">
                        {selectedClass.endDate
                          ? new Date(selectedClass.endDate).toLocaleDateString(
                              "fa-IR",
                            )
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* آمار کلاس */}
                <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={16} className="text-blue-400" />
                    <h4 className="text-white font-black text-sm">آمار کلاس</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="text-gray-500">تعداد دانشجویان:</span>
                        <span className="text-white font-bold">
                          {selectedClass.studentsCount} /{" "}
                          {selectedClass.capacity}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{
                            width: `${(selectedClass.studentsCount / selectedClass.capacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-500">تعداد جلسات:</span>
                      <span className="text-white font-bold">
                        {selectedClass.totalSessions || 0} جلسه
                      </span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-500">شهریه کلاس:</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedClass.tuition?.toLocaleString()} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* توضیحات */}
                {selectedClass.description && (
                  <div className="bg-[#1a1f2e] p-4 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={16} className="text-blue-400" />
                      <h4 className="text-white font-black text-sm">
                        توضیحات کلاس
                      </h4>
                    </div>
                    <p className="text-gray-400 text-[12px] leading-relaxed">
                      {selectedClass.description}
                    </p>
                  </div>
                )}

                {/* دکمه‌های اقدام */}
                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/student-dashboard/attendance?class=${selectedClass._id}`}
                    className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-center font-bold py-3 rounded-xl transition-all border border-blue-500/30"
                  >
                    مشاهده حضور و غیاب
                  </Link>
                  <Link
                    href={`/student-dashboard/grades?class=${selectedClass._id}`}
                    className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-center font-bold py-3 rounded-xl transition-all border border-purple-500/30"
                  >
                    مشاهده نمرات
                  </Link>
                </div>
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

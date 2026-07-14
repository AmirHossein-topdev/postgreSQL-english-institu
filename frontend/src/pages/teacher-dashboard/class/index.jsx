"use client";

import React, { useState } from "react";
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

// کامپوننت کارت دانشجو
const StudentCard = ({ student, onAttendanceToggle, isPresent }) => {
  const [attendanceStatus, setAttendanceStatus] = React.useState(isPresent);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAttendance = async () => {
    setIsSubmitting(true);
    try {
      // درخواست به API برای ثبت حضور/غیاب
      // const response = await updateAttendance({ studentId: student._id, status: !attendanceStatus });

      // شبیه‌سازی درخواست
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAttendanceStatus(!attendanceStatus);

      // نمایش پیام موفقیت
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
        onAttendanceToggle(student._id, !attendanceStatus);
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
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/30">
          {student.profileImage ? (
            <img
              src={student.profileImage}
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
            <span className="text-[8px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {student.level || "نامشخص"}
            </span>
          </div>
          <div className="flex gap-3 mt-2 text-[10px] text-gray-500">
            <span>{student.phone || "بدون شماره"}</span>
            <span>{student.email || "بدون ایمیل"}</span>
          </div>
        </div>

        {/* دکمه حضور/غیاب */}
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
      </div>
    </div>
  );
};

export default function TeacherClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  // گرفتن اطلاعات استاد لاگین شده از sessionStorage
  const [currentTeacher, setCurrentTeacher] = useState(null);

  React.useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("currentUser");
      console.log("📦 storedUser:", storedUser);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log("👤 user:", user);
        console.log("🎭 user.role:", user.role);
        if (user.role === "Teacher") {
          // ✅ درست: "teacher" با حروف کوچک
          setCurrentTeacher(user);
          console.log("✅ استاد ست شد:", user.name);
        } else {
          console.log("❌ نقش کاربر teacher نیست:", user.role);
        }
      } else {
        console.log("❌ storedUser وجود ندارد");
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  }, []);

  // گرفتن کلاس‌های استاد جاری
  const {
    data: teacherClasses = [],
    isLoading: classesLoading,
    refetch: refetchClasses,
  } = useGetClassesByTeacherQuery(currentTeacher?._id, {
    skip: !currentTeacher?._id,
  });

  // گرفتن دانشجوهای کلاس انتخاب شده
  const {
    data: classStudents = [],
    isLoading: studentsLoading,
    refetch: refetchStudents,
  } = useGetClassStudentsQuery(selectedClass?._id, {
    skip: !selectedClass?._id,
  });

  const teachers = Array.isArray(usersData)
    ? usersData.filter((u) => u.role === "Teacher")
    : [];

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
  };
  // داخل کامپوننت، بعد از useGetClassesByTeacherQuery

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

          <div className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-2xl">
            <p className="text-[10px] text-gray-500 font-bold uppercase">
              تعداد کلاس‌های فعال
            </p>
            <p className="text-white font-black text-xl text-center">
              {teacherClasses?.length || 0}
            </p>
          </div>
        </div>

        {/* دو ستون اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ستون راست - لیست کلاس‌ها */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black italic flex items-center gap-2 text-lg">
                <GraduationCap className="text-blue-400" size={22} />
                کلاس‌های من
              </h3>
              <span className="text-gray-500 text-[10px] font-bold">
                {teacherClasses?.length} کلاس
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
              {teacherClasses?.length === 0 ? (
                <div className="text-center py-20 bg-[#1a1f2e] rounded-2xl border border-blue-500/20">
                  <GraduationCap
                    size={48}
                    className="mx-auto text-gray-600 mb-3"
                  />
                  <p className="text-gray-500 font-bold">
                    هیچ کلاسی برای شما یافت نشد
                  </p>
                </div>
              ) : (
                teacherClasses
                  .filter(
                    (c) =>
                      c.name.includes(searchTerm) ||
                      c.level.includes(searchTerm),
                  )
                  .map((classItem) => (
                    <ClassCard
                      key={classItem._id}
                      classItem={{
                        ...classItem,
                        studentsCount: classItem.studentIds?.length || 0,
                      }}
                      isSelected={selectedClass?._id === classItem._id}
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
                  {classStudents?.length || 0} / {selectedClass.capacity} نفر
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
            ) : classStudents?.length === 0 ? (
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
                  <h4 className="text-white font-black">
                    {selectedClass.name}
                  </h4>
                  <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-gray-400">
                    <span>سطح: {selectedClass.level}</span>
                    <span>ترم: {selectedClass.term}</span>
                    <span>زمان: {selectedClass.schedule}</span>
                    <span>اتاق: {selectedClass.room}</span>
                  </div>
                </div>

                {/* لیست دانشجوها */}
                {classStudents.map((student) => (
                  <StudentCard key={student._id} student={student} />
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

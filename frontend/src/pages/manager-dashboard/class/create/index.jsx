"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layout";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { useListUsersQuery } from "../../../../redux/features/userApi";
import {
  useGetclasssQuery,
  useCreateClassMutation,
} from "../../../../redux/features/classApi";
import Link from "next/link";

// لیست روزهای هفته
const weekDays = [
  { value: "Saturday", label: "شنبه", fa: "شنبه" },
  { value: "Sunday", label: "یکشنبه", fa: "یکشنبه" },
  { value: "Monday", label: "دوشنبه", fa: "دوشنبه" },
  { value: "Tuesday", label: "سه‌شنبه", fa: "سه‌شنبه" },
  { value: "Wednesday", label: "چهارشنبه", fa: "چهارشنبه" },
  { value: "Thursday", label: "پنجشنبه", fa: "پنجشنبه" },
  { value: "Friday", label: "جمعه", fa: "جمعه" },
  { value: "Odd", label: "فرد", fa: "روزای فرد" },
  { value: "Even", label: "زوج", fa: "روزای زوج" },
];

// ساعات پیشنهادی
const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export default function CreateClassFromStudentsPage() {
  const router = useRouter();

  // Step 1: انتخاب دانشجوها
  const [step, setStep] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Step 2: انتخاب استاد و تنظیم زمان
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  // Step 3: اطلاعات کلاس
  const [className, setClassName] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [term, setTerm] = useState("تابستان ۱۴۰۴");
  const [room, setRoom] = useState("");
  const [tuition, setTuition] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // گرفتن دیتا
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery({
    limit: 200,
  });
  const { data: classesData, refetch: refetchClasses } = useGetclasssQuery();
  const [createClass] = useCreateClassMutation();

  // فیلتر دانشجوهایی که کلاس ندارند
  const allStudents =
    usersData?.users?.filter((u) => u.role === "Student") || [];

  const studentsWithoutClass = allStudents.filter((student) => {
    return !student.enrollments || student.enrollments.length === 0;
  });

  // فیلتر اساتید
  const teachers = usersData?.users?.filter((u) => u.role === "Teacher") || [];

  // جستجو در دانشجوها
  const filteredStudents = studentsWithoutClass.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // تابع برای تیک زدن دانشجو
  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  // تابع برای انتخاب همه
  const selectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id || s._id));
    }
  };

  // تابع برای ادامه به مرحله بعد
  const handleNextStep = () => {
    if (step === 1 && selectedStudents.length === 0) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "لطفاً حداقل یک زبان‌آموز را انتخاب کنید",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }
    if (
      step === 2 &&
      (!selectedTeacher ||
        !selectedDay ||
        !selectedStartTime ||
        !selectedEndTime)
    ) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "لطفاً استاد، روز و ساعت کلاس را مشخص کنید",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }
    setStep(step + 1);
  };

  // تابع برای ثبت نهایی کلاس
  // قسمت handleSubmit را به این شکل تغییر دهید

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "لطفاً نام کلاس را وارد کنید",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const adminData = sessionStorage.getItem("currentUser");
      const admin = adminData ? JSON.parse(adminData) : null;

      const scheduleString = `${weekDays.find((d) => d.value === selectedDay)?.fa || selectedDay} ${selectedStartTime} - ${selectedEndTime}`;

      const classData = {
        name: className,
        level: selectedLevel,
        teacherId: selectedTeacher,
        studentIds: selectedStudents,
        term: term,
        tuition: parseInt(tuition) || 0,
        schedule: scheduleString,
        room: room,
        status: "UNDER_REGISTRATION",
        createdById: admin?.id || admin?._id || null,
        capacity: capacity,
        description: description,
      };

      // 1. ایجاد کلاس
      const result = await createClass(classData).unwrap();

      if (result.success) {
        const newClassId =
          result.data?.id || result.data?._id || result.data?.data?.id;

        // 2. به‌روزرسانی enrolledClasses برای هر دانشجو با Promise.all
        if (newClassId && selectedStudents.length > 0) {
          const updatePromises = selectedStudents.map(async (studentId) => {
            try {
              const updateResponse = await fetch(
                `http://localhost:5000/api/users/${studentId}/enroll-class`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ classId: newClassId }),
                },
              );
              const updateResult = await updateResponse.json();
              console.log(`✅ دانشجو ${studentId} به روز شد:`, updateResult);
              return updateResult;
            } catch (updateErr) {
              console.error(
                `خطا در به‌روزرسانی دانشجو ${studentId}:`,
                updateErr,
              );
              throw updateErr; // اگر یکی failed شود، کل عملیات fail شود
            }
          });

          await Promise.all(updatePromises);
          console.log("✅ همه دانشجوها با موفقیت به روز شدند");
        }

        await Swal.fire({
          icon: "success",
          title: "کلاس با موفقیت ایجاد شد!",
          text: `${selectedStudents.length} زبان‌آموز به این کلاس اضافه شدند.`,
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        }).then(() => {
          window.location.href = "/manager-dashboard/class";
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("Create class error:", err);
      Swal.fire({
        icon: "error",
        title: "خطا در ایجاد کلاس",
        text: err.message || "لطفاً دوباره تلاش کنید",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (usersLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-black animate-pulse">
          <Loader2 size={48} className="mb-4 animate-spin" />
          در حال بارگذاری اطلاعات...
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
              href="/manager-dashboard/class"
              className="p-3 bg-[#1a1f2e] text-blue-400 hover:bg-blue-400 hover:text-black transition-all rounded-xl border border-blue-500/20"
            >
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                ایجاد{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                  کلاس جدید
                </span>
              </h1>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                ثبت کلاس با انتخاب زبان‌آموزان و استاد
              </p>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`px-4 py-2 rounded-xl text-sm font-bold ${step >= 1 ? "bg-blue-500 text-white" : "bg-[#1a1f2e] text-gray-500"}`}
            >
              ۱. انتخاب دانشجو
            </div>
            <div
              className={`px-4 py-2 rounded-xl text-sm font-bold ${step >= 2 ? "bg-blue-500 text-white" : "bg-[#1a1f2e] text-gray-500"}`}
            >
              ۲. انتخاب استاد و زمان
            </div>
            <div
              className={`px-4 py-2 rounded-xl text-sm font-bold ${step >= 3 ? "bg-blue-500 text-white" : "bg-[#1a1f2e] text-gray-500"}`}
            >
              ۳. تکمیل اطلاعات
            </div>
          </div>
        </div>

        {/* Step 1: انتخاب دانشجوها */}
        {step === 1 && (
          <div className="bg-[#1a1f2e] rounded-3xl border border-blue-500/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                <Users className="text-blue-400" size={24} />
                زبان‌آموزانی که کلاس ندارند
                <span className="text-sm text-gray-500">
                  ({studentsWithoutClass.length} نفر)
                </span>
              </h2>
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-500/30 transition"
              >
                {selectedStudents.length === filteredStudents.length
                  ? "لغو انتخاب همه"
                  : "انتخاب همه"}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا کد عضویت..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 pr-10 focus:outline-none focus:border-blue-400"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2">
              {filteredStudents.length === 0 ? (
                <div className="col-span-3 text-center py-20 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 opacity-30" />
                  <p>هیچ زبان‌آموزی یافت نشد</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student._id || student.id}
                    onClick={() => toggleStudent(student._id || student.id)}
                    className={`bg-[#0F1420] border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedStudents.includes(student._id || student.id)
                        ? "border-blue-400 bg-blue-500/10"
                        : "border-blue-500/20 hover:border-blue-400/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {student.name}
                          </p>
                          <p className="text-gray-500 text-[10px]">
                            کد: {student.employeeCode}
                          </p>
                        </div>
                      </div>
                      {selectedStudents.includes(student._id || student.id) ? (
                        <CheckCircle2 className="text-emerald-400" size={22} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                      )}
                    </div>
                    <div className="mt-2 text-[11px] text-gray-500">
                      <p>
                        سطح:{" "}
                        {student.level ||
                          student.studentProfile?.level ||
                          "نامشخص"}
                      </p>
                      <p>شماره: {student.phone || "—"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-blue-500/20">
              <div className="text-gray-400 text-sm">
                <span className="font-bold text-blue-400">
                  {selectedStudents.length}
                </span>{" "}
                نفر انتخاب شده
              </div>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition"
              >
                ادامه
              </button>
            </div>
          </div>
        )}

        {/* Step 2: انتخاب استاد و زمان */}
        {step === 2 && (
          <div className="bg-[#1a1f2e] rounded-3xl border border-blue-500/20 p-6">
            <h2 className="text-white font-black text-xl flex items-center gap-2 mb-6">
              <Calendar className="text-blue-400" size={24} />
              اطلاعات کلاس
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* انتخاب استاد */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-400" />
                  استاد کلاس <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="">انتخاب استاد...</option>
                  {teachers.map((teacher) => (
                    <option
                      key={teacher._id || teacher.id}
                      value={teacher._id || teacher.id}
                    >
                      {teacher.name} -{" "}
                      {teacher.specialization ||
                        teacher.teacherProfile?.specialization ||
                        "بدون تخصص"}
                    </option>
                  ))}
                </select>
              </div>

              {/* روز هفته */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  روز برگزاری <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="">انتخاب روز...</option>
                  {weekDays.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.fa}
                    </option>
                  ))}
                </select>
              </div>

              {/* ساعت شروع */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <Clock size={16} className="text-blue-400" />
                  ساعت شروع <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedStartTime}
                  onChange={(e) => setSelectedStartTime(e.target.value)}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="">انتخاب ساعت شروع...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* ساعت پایان */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <Clock size={16} className="text-blue-400" />
                  ساعت پایان <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedEndTime}
                  onChange={(e) => setSelectedEndTime(e.target.value)}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="">انتخاب ساعت پایان...</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* شماره کلاس/اتاق */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <MapPin size={16} className="text-blue-400" />
                  شماره اتاق/کلاس <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="مثال: ۱۰۴"
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* ترم */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  ترم آموزشی
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="بهار ۱۴۰۴">بهار ۱۴۰۴</option>
                  <option value="تابستان ۱۴۰۴">تابستان ۱۴۰۴</option>
                  <option value="پاییز ۱۴۰۴">پاییز ۱۴۰۴</option>
                  <option value="زمستان ۱۴۰۴">زمستان ۱۴۰۴</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-blue-500/20">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition"
              >
                قبلی
              </button>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition"
              >
                ادامه
              </button>
            </div>
          </div>
        )}

        {/* Step 3: تکمیل اطلاعات */}
        {step === 3 && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#1a1f2e] rounded-3xl border border-blue-500/20 p-6"
          >
            <h2 className="text-white font-black text-xl flex items-center gap-2 mb-6">
              <GraduationCap className="text-blue-400" size={24} />
              تکمیل اطلاعات کلاس
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* نام کلاس */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-400" />
                  نام کلاس <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="مثال: کلاس آیلتس C1 - ترم تابستان"
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* سطح کلاس */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold">
                  سطح کلاس
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="A1">A1 (مبتدی)</option>
                  <option value="A2">A2 (مقدماتی)</option>
                  <option value="B1">B1 (متوسط ۱)</option>
                  <option value="B2">B2 (متوسط ۲)</option>
                  <option value="C1">C1 (پیشرفته)</option>
                  <option value="C2">C2 (عالی)</option>
                </select>
              </div>

              {/* ظرفیت کلاس */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold">
                  ظرفیت کلاس
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  min={selectedStudents.length}
                  max={50}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                />
                <p className="text-gray-500 text-[10px]">
                  حداقل: {selectedStudents.length} نفر (تعداد دانشجویان انتخاب
                  شده)
                </p>
              </div>

              {/* شهریه */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold">
                  شهریه کلاس (تومان)
                </label>
                <input
                  type="text"
                  value={tuition ? Number(tuition).toLocaleString() : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setTuition(rawValue);
                  }}
                  placeholder="مثال: ۳,۵۰۰,۰۰۰"
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400 text-left"
                />
              </div>

              {/* توضیحات */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-400 text-sm font-bold">
                  توضیحات کلاس
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="توضیحات اضافی درباره کلاس..."
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* خلاصه انتخاب‌ها */}
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h3 className="text-blue-400 font-bold mb-3">
                خلاصه اطلاعات کلاس
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">تعداد دانشجویان:</span>{" "}
                  <span className="text-white font-bold">
                    {selectedStudents.length} نفر
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">استاد:</span>{" "}
                  <span className="text-white">
                    {teachers.find((t) => (t._id || t.id) === selectedTeacher)
                      ?.name || "نامشخص"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">زمان برگزاری:</span>{" "}
                  <span className="text-white">
                    {weekDays.find((d) => d.value === selectedDay)?.fa}{" "}
                    {selectedStartTime} - {selectedEndTime}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">اتاق:</span>{" "}
                  <span className="text-white">{room}</span>
                </div>
                <div>
                  <span className="text-gray-500">ترم:</span>{" "}
                  <span className="text-white">{term}</span>
                </div>
                <div>
                  <span className="text-gray-500">سطح:</span>{" "}
                  <span className="text-white">{selectedLevel}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-blue-500/20">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition"
              >
                قبلی
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition disabled:opacity-50"
              >
                {isSubmitting ? "در حال ایجاد..." : "ایجاد کلاس"}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

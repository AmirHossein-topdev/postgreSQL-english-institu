// frontend/src/pages/manager-dashboard/class/[id]/edit/index.jsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../layout";
import Swal from "sweetalert2";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ChevronLeft,
  Loader2,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import { useListUsersQuery } from "../../../../../redux/features/userApi";
import {
  useGetClassByIdQuery,
  useUpdateClassMutation,
} from "../../../../../redux/features/classApi";

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

// وضعیت‌های کلاس
const statusOptions = [
  {
    value: "UNDER_REGISTRATION",
    label: "در حال ثبت‌نام",
    color: "text-blue-400",
  },
  { value: "ACTIVE", label: "فعال", color: "text-emerald-400" },
  { value: "COMPLETED", label: "تکمیل شده", color: "text-purple-400" },
  { value: "CANCELED", label: "لغو شده", color: "text-red-400" },
];

export default function EditClassPage() {
  const router = useRouter();
  const { id } = router.query;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: "B1",
    teacherId: "",
    term: "",
    tuition: "",
    schedule: "",
    room: "",
    status: "UNDER_REGISTRATION",
    capacity: 10,
    description: "",
    isConfirmed: false,
  });

  // دریافت داده‌ها
  const { data: usersData, isLoading: usersLoading } = useListUsersQuery({
    limit: 100,
  });

  const {
    data: classData,
    isLoading: classLoading,
    refetch,
  } = useGetClassByIdQuery(id, { skip: !id });

  // هوک آپدیت کلاس
  const [updateClass] = useUpdateClassMutation();

  // اساتید و دانشجویان (فیلتر بر اساس status ACTIVE)
  const teachers =
    usersData?.users?.filter(
      (u) => u.role === "Teacher" && u.status === "ACTIVE",
    ) || [];

  const students =
    usersData?.users?.filter(
      (u) => u.role === "Student" && u.status === "ACTIVE",
    ) || [];

  // دانشجویان انتخاب شده
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // state برای زمان‌ها
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  // استخراج روز و ساعت از schedule
  const extractScheduleParts = (schedule) => {
    if (!schedule) return { day: "", startTime: "", endTime: "" };

    const regex = /^(.+?)\s+(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/;
    const parts = schedule.match(regex);

    if (parts) {
      let dayInPersian = parts[1].trim();
      const startTime = parts[2];
      const endTime = parts[3];

      return {
        day: dayInPersian,
        startTime: startTime,
        endTime: endTime,
      };
    }

    return { day: "", startTime: "", endTime: "" };
  };

  // بارگذاری اطلاعات کلاس
  useEffect(() => {
    // ✅ اصلاح: classData خودش آبجکت کلاس است، نه classData.data
    if (classData) {
      const classItem = classData;

      const studentIds =
        classItem.enrollments?.map(
          (enrollment) => enrollment.user?.id || enrollment.userId,
        ) || [];

      let statusValue = classItem.status || "UNDER_REGISTRATION";

      setFormData({
        name: classItem.name || "",
        level: classItem.level || "B1",
        teacherId: classItem.teacher?.id || classItem.teacherId || "",
        term: classItem.term || "",
        tuition: classItem.tuition || "",
        schedule: classItem.schedule || "",
        room: classItem.room || "",
        status: statusValue,
        capacity: classItem.capacity || 10,
        description: classItem.description || "",
        isConfirmed: classItem.isConfirmed || false,
      });

      setSelectedStudents(studentIds);

      const { day, startTime, endTime } = extractScheduleParts(
        classItem.schedule,
      );

      setSelectedDay(day);
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
    }
  }, [classData]);

  // به‌روزرسانی schedule هنگام تغییر روز یا ساعت
  useEffect(() => {
    if (selectedDay && selectedStartTime && selectedEndTime) {
      const newSchedule = `${selectedDay} ${selectedStartTime} - ${selectedEndTime}`;
      setFormData((prev) => ({
        ...prev,
        schedule: newSchedule,
      }));
    }
  }, [selectedDay, selectedStartTime, selectedEndTime]);

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
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  // فیلتر دانشجویان بر اساس جستجو
  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        level: formData.level,
        teacherId: formData.teacherId,
        studentIds: selectedStudents,
        term: formData.term,
        tuition: parseInt(formData.tuition) || 0,
        schedule: formData.schedule,
        room: formData.room,
        status: formData.status,
        capacity: parseInt(formData.capacity),
        description: formData.description,
        isConfirmed: formData.isConfirmed,
      };

      const response = await fetch(`http://localhost:5000/api/class/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Swal.fire({
          icon: "success",
          title: "موفقیت!",
          text: "اطلاعات کلاس با موفقیت به‌روزرسانی شد.",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
          confirmButtonText: "باشه",
        }).then(() => {
          window.location.href = "/manager-dashboard/class";
        });
      } else {
        throw new Error(result.message || "خطا در به‌روزرسانی کلاس");
      }
    } catch (err) {
      console.error("❌ Update class error:", err);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: err.message || "مشکلی در به‌روزرسانی کلاس رخ داد",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (usersLoading || classLoading) {
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
                ویرایش{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                  کلاس
                </span>
              </h1>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">
                {formData.name} - ویرایش اطلاعات کلاس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {formData.isConfirmed ? (
              <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold">
                <CheckCircle size={16} />
                تأیید شده
              </span>
            ) : (
              <span className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-xl text-sm font-bold">
                <XCircle size={16} />
                در انتظار تأیید
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* اطلاعات اصلی کلاس */}
          <div className="bg-[#1a1f2e] rounded-3xl border border-blue-500/20 p-6">
            <h2 className="text-white font-black text-xl flex items-center gap-2 mb-6">
              <GraduationCap className="text-blue-400" size={24} />
              اطلاعات اصلی کلاس
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                  placeholder="مثال: کلاس آیلتس C1 - ترم تابستان"
                />
              </div>

              {/* سطح کلاس */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold">
                  سطح کلاس
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
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

              {/* استاد کلاس */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <User size={16} className="text-blue-400" />
                  استاد کلاس <span className="text-red-400">*</span>
                </label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  <option value="">انتخاب استاد...</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} -{" "}
                      {teacher.teacherProfile?.specialization || "بدون تخصص"}
                    </option>
                  ))}
                </select>
              </div>

              {/* ترم */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <Calendar size={16} className="text-blue-400" />
                  ترم آموزشی <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                  placeholder="مثال: بهار ۱۴۰۴"
                />
              </div>

              {/* روز برگزاری */}
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
                    <option key={day.value} value={day.fa}>
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
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                  placeholder="مثال: ۱۰۴"
                />
              </div>

              {/* ظرفیت کلاس */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold">
                  ظرفیت کلاس
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min={selectedStudents.length}
                  max={50}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                />
                <p className="text-gray-500 text-[10px]">
                  حداقل: {selectedStudents.length} نفر
                </p>
              </div>

              {/* شهریه */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold flex items-center gap-2">
                  <DollarSign size={16} className="text-blue-400" />
                  شهریه کلاس (تومان)
                </label>
                <input
                  type="text"
                  name="tuition"
                  value={
                    formData.tuition
                      ? Number(formData.tuition).toLocaleString()
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({ ...prev, tuition: rawValue }));
                  }}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400 text-left"
                  placeholder="مثال: ۳,۵۰۰,۰۰۰"
                />
              </div>

              {/* وضعیت کلاس */}
              <div className="space-y-2">
                <label className="text-gray-400 text-sm font-bold">
                  وضعیت کلاس
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* توضیحات */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-400 text-sm font-bold">
                  توضیحات کلاس
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-[#0F1420] border border-blue-500/20 text-white rounded-xl p-3 focus:outline-none focus:border-blue-400 resize-y"
                  placeholder="توضیحات اضافی درباره کلاس..."
                />
              </div>
            </div>
          </div>

          {/* بخش دانشجویان کلاس */}
          <div className="bg-[#1a1f2e] rounded-3xl border border-blue-500/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-black text-xl flex items-center gap-2">
                <Users className="text-blue-400" size={24} />
                دانشجویان کلاس
                <span className="text-sm text-gray-500">
                  ({selectedStudents.length} / {formData.capacity} نفر)
                </span>
              </h2>
              <button
                type="button"
                onClick={selectAll}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-500/30 transition"
              >
                {selectedStudents.length === filteredStudents.length &&
                filteredStudents.length > 0
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
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
              {filteredStudents.length === 0 ? (
                <div className="col-span-3 text-center py-20 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 opacity-30" />
                  <p>هیچ زبان‌آموزی یافت نشد</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => toggleStudent(student.id)}
                    className={`bg-[#0F1420] border rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02] ${
                      selectedStudents.includes(student.id)
                        ? "border-blue-400 bg-blue-500/10"
                        : "border-blue-500/20 hover:border-blue-400/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 overflow-hidden">
                          {student.profileImage &&
                          student.profileImage !== "default-avatar.png" ? (
                            <img
                              src={`http://localhost:5000/uploads/${student.profileImage}`}
                              alt={student.name}
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            <GraduationCap size={20} />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {student.name}
                          </p>
                          <p className="text-gray-500 text-[9px]">
                            کد: {student.employeeCode}
                          </p>
                        </div>
                      </div>
                      {selectedStudents.includes(student.id) ? (
                        <CheckCircle className="text-emerald-400" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                      )}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500">
                      <p>سطح: {student.studentProfile?.level || "نامشخص"}</p>
                      <p>شماره: {student.phone || "—"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* دکمه ارسال */}
          <div className="flex justify-center pb-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg italic transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? "در حال ذخیره تغییرات..." : "ذخیره تغییرات"}
                {!isSubmitting && <GraduationCap size={22} />}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

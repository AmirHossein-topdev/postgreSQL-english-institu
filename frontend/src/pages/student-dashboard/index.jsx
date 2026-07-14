"use client";

import React from "react";
import {
  GraduationCap,
  Clock,
  CreditCard,
  BookOpen,
  ChevronLeft,
  Zap,
  Target,
  Bell,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  MessageCircle,
  TrendingUp,
  Coffee,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "./layout";
import Link from "next/link";

export default function StudentDashboard() {
  // داده‌های واقعی برای زبان‌آموز
  const dashboardState = {
    // کلاس بعدی
    nextClass: {
      name: "آیلتس پیشرفته - سطح C1",
      time: "۱۰:۰۰ فردا",
      room: "اتاق ۲۰۴",
      teacher: "احمد رضایی",
      remains: "۱۴ ساعت دیگر",
    },
    // وضعیت اشتراک و کلاس‌ها
    subscription: {
      activeClasses: 3,
      totalClasses: 4,
      attendedThisMonth: 12,
      totalSessions: 24,
    },
    // آخرین فعالیت
    lastActivity: {
      type: "حضور در کلاس",
      title: "کلاس مکالمه سطح B1",
      time: "دیروز",
      status: "حاضر",
    },
    // عملکرد تحصیلی
    academicProgress: {
      averageGrade: 78,
      completedAssignments: 8,
      totalAssignments: 10,
      nextExam: "آزمون آیلتس - ۱۵ خرداد",
    },
  };

  // لیست اعلانات
  const notifications = [
    {
      icon: <Calendar size={16} />,
      title: "کلاس فردا لغو شد",
      desc: "کلاس آیلتس فردا به دلیل تعطیلی برگزار نمی‌شود",
      time: "۲ ساعت پیش",
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      icon: <Award size={16} />,
      title: "نمره آزمون اعلام شد",
      desc: "نمره آزمون ماک آیلتس شما: ۶.۵",
      time: "دیروز",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: <BookOpen size={16} />,
      title: "کتاب جدید اضافه شد",
      desc: "کتاب Cambridge IELTS 19 به فروشگاه اضافه شد",
      time: "۲ روز پیش",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  // لیست کلاس‌های فعال
  const activeClasses = [
    {
      name: "آیلتس پیشرفته",
      level: "C1",
      teacher: "احمد رضایی",
      schedule: "شنبه و دوشنبه ۱۰-۱۲",
      progress: 65,
      nextSession: "فردا ۱۰:۰۰",
    },
    {
      name: "مکالمه متوسط",
      level: "B1",
      teacher: "سارا محمدی",
      schedule: "یکشنبه و سه‌شنبه ۱۴-۱۶",
      progress: 40,
      nextSession: "امروز ۱۴:۰۰",
    },
    {
      name: "گرامر پیشرفته",
      level: "B2",
      teacher: "علی کریمی",
      schedule: "چهارشنبه ۱۶-۱۸",
      progress: 80,
      nextSession: "پس‌فردا ۱۶:۰۰",
    },
  ];

  return (
    <DashboardLayout>
      <div
        className="p-4 md:p-8 min-h-screen bg-[#0F1420] rounded-4xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              پنل{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                زبان‌آموز
              </span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black mt-1 uppercase tracking-widest">
              دوره بهار ۱۴۰۴ | ترم جاری
            </p>
          </div>
          <div className="bg-[#1a1f2e] p-3 rounded-2xl border border-blue-500/20 relative">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* کارت‌های اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* کارت ۱: کلاس بعدی */}
          <div className="bg-[#1a1f2e] border border-blue-500/20 p-5 rounded-2xl hover:border-blue-400/60 transition-all">
            <div className="flex justify-between items-start mb-3">
              <GraduationCap className="text-blue-400" size={22} />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                Next Class
              </span>
            </div>
            <h3 className="text-white font-black text-base">
              {dashboardState.nextClass.name}
            </h3>
            <div className="mt-2 space-y-1 text-[11px] text-gray-400">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-blue-400" />
                <span>{dashboardState.nextClass.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={12} className="text-blue-400" />
                <span>{dashboardState.nextClass.teacher}</span>
              </div>
            </div>
            <div className="mt-3 inline-block bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-[9px] font-black">
              {dashboardState.nextClass.remains}
            </div>
          </div>

          {/* کارت ۲: آمار کلاس‌ها */}
          <div className="bg-[#1a1f2e] border border-blue-500/20 p-5 rounded-2xl hover:border-blue-400/60 transition-all">
            <div className="flex justify-between items-start mb-3">
              <Users className="text-emerald-400" size={22} />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                My Classes
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-white text-2xl font-black">
                {dashboardState.subscription.activeClasses}
              </h3>
              <span className="text-gray-500 text-sm">/</span>
              <span className="text-gray-500 text-sm">
                {dashboardState.subscription.totalClasses}
              </span>
            </div>
            <p className="text-gray-500 text-[10px] font-bold mt-1">
              کلاس فعال
            </p>
            <div className="mt-3 flex justify-between text-[10px] text-gray-500">
              <span>حضور: {dashboardState.subscription.attendedThisMonth}</span>
              <span>جلسات: {dashboardState.subscription.totalSessions}</span>
            </div>
          </div>

          {/* کارت ۳: عملکرد تحصیلی */}
          <div className="bg-[#1a1f2e] border border-blue-500/20 p-5 rounded-2xl hover:border-blue-400/60 transition-all">
            <div className="flex justify-between items-start mb-3">
              <Award className="text-purple-400" size={22} />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                Performance
              </span>
            </div>
            <h3 className="text-white text-2xl font-black">
              {dashboardState.academicProgress.averageGrade}%
            </h3>
            <p className="text-gray-500 text-[10px] font-bold mt-1">
              میانگین نمرات
            </p>
            <div className="w-full h-1.5 bg-gray-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{
                  width: `${dashboardState.academicProgress.averageGrade}%`,
                }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-gray-500">
              <span>
                تکالیف: {dashboardState.academicProgress.completedAssignments}/
                {dashboardState.academicProgress.totalAssignments}
              </span>
            </div>
          </div>

          {/* کارت ۴: آزمون بعدی */}
          <div className="bg-[#1a1f2e] border border-blue-500/20 p-5 rounded-2xl hover:border-blue-400/60 transition-all">
            <div className="flex justify-between items-start mb-3">
              <Target className="text-yellow-400" size={22} />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                Next Exam
              </span>
            </div>
            <h3 className="text-white text-sm font-black leading-tight">
              {dashboardState.academicProgress.nextExam}
            </h3>
            <p className="text-gray-500 text-[10px] font-bold mt-2">
              آمادگی خود را کامل کنید
            </p>
            <button className="w-full mt-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-[9px] font-black rounded-xl transition-all border border-yellow-500/20">
              مشاهده برنامه مطالعه
            </button>
          </div>
        </div>

        {/* بخش کلاس‌های فعال */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-black italic text-xl flex items-center gap-2">
              <GraduationCap className="text-blue-400" size={22} />
              کلاس‌های فعال من
            </h2>
            <Link
              href="/student-dashboard/classes"
              className="text-blue-400 text-xs font-bold hover:underline"
            >
              مشاهده همه
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeClasses.map((cls, idx) => (
              <div
                key={idx}
                className="bg-[#1a1f2e] border border-blue-500/20 p-5 rounded-2xl hover:border-blue-400/60 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-black text-base">
                      {cls.name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                        سطح {cls.level}
                      </span>
                      <span className="text-[9px] font-black text-gray-500">
                        {cls.schedule}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-blue-400" />
                    <span>مدرس: {cls.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-blue-400" />
                    <span>جلسه بعد: {cls.nextSession}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[9px] mb-1">
                    <span className="text-gray-500">پیشرفت دوره</span>
                    <span className="text-white">{cls.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{ width: `${cls.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* دو ستون پایینی */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* لاگ فعالیت‌ها */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-white font-black italic text-lg flex items-center gap-2">
              <TrendingUp className="text-blue-400" size={20} />
              آخرین فعالیت‌ها
            </h2>

            <div className="space-y-3">
              {[
                {
                  icon: <CheckCircle2 size={16} />,
                  title: "حضور در کلاس مکالمه",
                  desc: "جلسه ۸ - موضوع: صحبت درباره سفر",
                  time: "دیروز",
                  status: "حاضر",
                  color: "text-emerald-400",
                },
                {
                  icon: <Award size={16} />,
                  title: "ارسال تکلیف گرامر",
                  desc: "تکلیف فصل ۵ - زمان‌های شرطی",
                  time: "۲ روز پیش",
                  status: "تصحیح نشده",
                  color: "text-yellow-400",
                },
                {
                  icon: <BookOpen size={16} />,
                  title: "خرید کتاب آموزشی",
                  desc: "Cambridge IELTS 18 Academic",
                  time: "۳ روز پیش",
                  status: "تحویل شده",
                  color: "text-blue-400",
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className="bg-[#1a1f2e]/50 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between group hover:bg-[#1a1f2e] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center ${log.color}`}
                    >
                      {log.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm">
                        {log.title}
                      </h4>
                      <p className="text-gray-500 text-[9px] font-bold mt-0.5">
                        {log.desc} | {log.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`text-[10px] font-black ${log.color}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* اعلانات و دسترسی سریع */}
          <div className="space-y-5">
            {/* اعلانات */}
            <div>
              <h2 className="text-white font-black italic text-lg flex items-center gap-2 mb-4">
                <Bell className="text-blue-400" size={18} />
                اعلانات
              </h2>
              <div className="space-y-3">
                {notifications.map((notif, i) => (
                  <div
                    key={i}
                    className={`${notif.bg} p-3 rounded-xl border border-blue-500/20`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={notif.color}>{notif.icon}</div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-bold">
                          {notif.title}
                        </p>
                        <p className="text-gray-500 text-[9px] mt-0.5">
                          {notif.desc}
                        </p>
                        <p className="text-gray-600 text-[8px] mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* دسترسی سریع */}
            <div>
              <h2 className="text-white font-black italic text-lg flex items-center gap-2 mb-4">
                <Zap className="text-blue-400" size={18} />
                دسترسی سریع
              </h2>
              <div className="space-y-2">
                <Link
                  href="/student-dashboard/classes"
                  className="flex items-center justify-between p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all border border-blue-500/20 group"
                >
                  <span className="text-white font-bold text-xs">
                    کلاس‌های من
                  </span>
                  <ChevronLeft
                    size={16}
                    className="text-blue-400 group-hover:translate-x-[-3px] transition-transform"
                  />
                </Link>
                <Link
                  href="/student-dashboard/attendance"
                  className="flex items-center justify-between p-3 bg-[#1a1f2e] hover:bg-blue-500/10 rounded-xl transition-all border border-blue-500/20 group"
                >
                  <span className="text-white font-bold text-xs">
                    حضور و غیاب
                  </span>
                  <ChevronLeft
                    size={16}
                    className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-[-3px] transition-all"
                  />
                </Link>
                <Link
                  href="/student-dashboard/books"
                  className="flex items-center justify-between p-3 bg-[#1a1f2e] hover:bg-blue-500/10 rounded-xl transition-all border border-blue-500/20 group"
                >
                  <span className="text-white font-bold text-xs">
                    کتاب‌های آموزشی
                  </span>
                  <ChevronLeft
                    size={16}
                    className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-[-3px] transition-all"
                  />
                </Link>
                <Link
                  href="/student-dashboard/finance"
                  className="flex items-center justify-between p-3 bg-[#1a1f2e] hover:bg-blue-500/10 rounded-xl transition-all border border-blue-500/20 group"
                >
                  <span className="text-white font-bold text-xs">
                    امور مالی
                  </span>
                  <ChevronLeft
                    size={16}
                    className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-[-3px] transition-all"
                  />
                </Link>
              </div>
            </div>

            {/* نکته آموزشی */}
            <div className="mt-4 p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-[9px] font-black uppercase mb-2 flex items-center gap-1">
                <ShieldCheck size={12} /> نکته آموزشی
              </p>
              <p className="text-gray-300 text-[10px] font-medium leading-relaxed">
                "تمرین مداوم کلید موفقیت در یادگیری زبان است. هر روز ۳۰ دقیقه به
                مکالمه و لیسنینگ اختصاص بده."
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

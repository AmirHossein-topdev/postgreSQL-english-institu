"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  BookOpen,
  TrendingUp,
  Activity,
  DollarSign,
  Zap,
  BarChart3,
  Settings,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ClipboardList,
  GraduationCap,
  Calendar,
  CheckCircle,
  MessageCircle,
  Award,
  Target,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "./layout";

// داده‌های تحلیلی: مقایسه حضور دانشجویان و عملکرد کلاس‌ها
const performanceData = [
  { name: "شنبه", students: 120, classes: 8 },
  { name: "۱شنبه", students: 145, classes: 10 },
  { name: "۲شنبه", students: 98, classes: 7 },
  { name: "۳شنبه", students: 156, classes: 11 },
  { name: "۴شنبه", students: 134, classes: 9 },
  { name: "۵شنبه", students: 167, classes: 12 },
  { name: "جمعه", students: 89, classes: 6 },
];

export default function TeacherDashboard() {
  // کارت‌های آمار حیاتی برای استاد
  const kpiStats = [
    {
      label: "کلاس‌های فعال من",
      val: "۴",
      sub: "+۱ کلاس جدید این هفته",
      icon: <GraduationCap />,
      color: "text-blue-400",
    },
    {
      label: "تعداد زبان‌آموزان",
      val: "۳۲",
      sub: "در ۴ کلاس فعال",
      icon: <Users />,
      color: "text-emerald-400",
    },
    {
      label: "حضور و غیاب امروز",
      val: "۲۴",
      sub: "۸ نفر غایب",
      icon: <CheckCircle />,
      color: "text-yellow-400",
    },
    {
      label: "نمرات ثبت شده",
      val: "۱۲",
      sub: "+۴ نمره جدید این هفته",
      icon: <Award />,
      color: "text-purple-400",
    },
  ];

  // کلاس‌های فعال استاد
  const activeClasses = [
    {
      id: 1,
      name: "آیلتس پیشرفته",
      level: "C1",
      students: 8,
      capacity: 10,
      schedule: "شنبه و دوشنبه ۱۰-۱۲",
      progress: 75,
      nextSession: "فردا ۱۰:۰۰",
    },
    {
      id: 2,
      name: "مکالمه متوسط",
      level: "B1",
      students: 12,
      capacity: 12,
      schedule: "یکشنبه و سه‌شنبه ۱۴-۱۶",
      progress: 60,
      nextSession: "امروز ۱۴:۰۰",
    },
    {
      id: 3,
      name: "گرامر پایه",
      level: "A2",
      students: 7,
      capacity: 8,
      schedule: "چهارشنبه ۱۶-۱۸",
      progress: 40,
      nextSession: "پس‌فردا ۱۶:۰۰",
    },
    {
      id: 4,
      name: "تافل مقدماتی",
      level: "B2",
      students: 5,
      capacity: 8,
      schedule: "پنجشنبه ۰۹-۱۲",
      progress: 20,
      nextSession: "پنجشنبه ۰۹:۰۰",
    },
  ];

  // وظایف امروز استاد
  const todayTasks = [
    {
      time: "۱۰:۰۰",
      task: "تدریس کلاس آیلتس پیشرفته - جلسه ۱۲",
      priority: "high",
      status: "pending",
    },
    {
      time: "۱۲:۰۰",
      task: "تصحیح آزمون کلاس مکالمه",
      priority: "medium",
      status: "pending",
    },
    {
      time: "۱۴:۰۰",
      task: "کلاس مکالمه متوسط - جلسه ۸",
      priority: "high",
      status: "pending",
    },
    {
      time: "۱۶:۰۰",
      task: "جلسه آنلاین با همکاران آموزشی",
      priority: "low",
      status: "pending",
    },
  ];

  // فعالیت‌های اخیر
  const recentActivities = [
    {
      time: "۱۰:۴۵",
      text: "نمرات آزمون آیلتس کلاس C1 ثبت شد",
      type: "grade",
    },
    {
      time: "۰۹:۳۰",
      text: "حضور و غیاب کلاس مکالمه انجام شد",
      type: "attendance",
    },
    {
      time: "دیروز",
      text: "فایل تمرین جدید برای کلاس گرامر آپلود شد",
      type: "material",
    },
    {
      time: "دیروز",
      text: "۲ نفر از زبان‌آموزان جدید به کلاس اضافه شدند",
      type: "enrollment",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400 border-red-400";
      case "medium":
        return "text-yellow-400 border-yellow-400";
      case "low":
        return "text-blue-400 border-blue-400";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "grade":
        return <Award size={14} className="text-purple-400" />;
      case "attendance":
        return <CheckCircle size={14} className="text-emerald-400" />;
      case "material":
        return <BookOpen size={14} className="text-blue-400" />;
      case "enrollment":
        return <Users size={14} className="text-yellow-400" />;
      default:
        return <Activity size={14} className="text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-4xl"
        dir="rtl"
      >
        {/* Header - پنل استاد */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-blue-500/20">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              پنل استاد{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                {(() => {
                  try {
                    const currentUser = JSON.parse(
                      sessionStorage.getItem("currentUser") || "{}",
                    );
                    return currentUser?.name || "احمد رضایی";
                  } catch (error) {
                    console.error("Error getting current user:", error);
                    return "";
                  }
                })()}
              </span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <GraduationCap size={14} className="text-blue-400" />
              مدیریت کلاس‌ها، حضور و غیاب و نمرات
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-2xl hidden md:block">
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                ترم جاری
              </p>
              <p className="text-white font-mono text-sm">بهار ۱۴۰۴</p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black px-5 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 italic text-sm shadow-lg shadow-blue-500/25">
              <Activity size={16} /> گزارش عملکرد ماهانه
            </button>
          </div>
        </div>

        {/* KPI Grid - آمار ۴ رکن اصلی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiStats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] p-6 rounded-[2rem] border border-blue-500/20 relative overflow-hidden group hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              <div className="relative z-10">
                <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <div className={stat.color}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                  </div>
                </div>
                <p className="text-gray-500 text-[10px] uppercase font-black mb-1 tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-white italic">
                  {stat.val}
                </h3>
                <p className="text-[9px] mt-2 text-gray-500 font-bold flex items-center gap-1">
                  <ArrowUpRight size={10} className="text-emerald-400" />{" "}
                  {stat.sub}
                </p>
              </div>
              <div
                className={`absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 ${stat.color}`}
              >
                {React.cloneElement(stat.icon, { size: 80 })}
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
          {/* نمودار تحلیل حضور دانشجویان */}
          <div className="xl:col-span-2 bg-[#1a1f2e] p-6 rounded-[2rem] border border-blue-500/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
                  <BarChart3 className="text-blue-400" size={22} />
                  تحلیل حضور دانشجویان
                </h3>
                <p className="text-gray-500 text-[10px] mt-1">
                  تعداد زبان‌آموزان حاضر در کلاس‌های هفته جاری
                </p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                  تعداد دانشجو
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                  تعداد کلاس
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorClasses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2d3139"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#4b5563"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#4b5563"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f2e",
                      border: "1px solid #3b82f6",
                      borderRadius: "12px",
                      textAlign: "right",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorStudents)"
                  />
                  <Area
                    type="monotone"
                    dataKey="classes"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorClasses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* امروز - وظایف و برنامه‌ها */}
          <div className="bg-[#1a1f2e] rounded-[2rem] border border-blue-500/20 overflow-hidden">
            <div className="p-5 border-b border-blue-500/20 bg-blue-500/5">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Clock className="text-blue-400" size={18} />
                وظایف امروز
              </h3>
            </div>
            <div className="divide-y divide-blue-500/10 max-h-[280px] overflow-y-auto">
              {todayTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 hover:bg-blue-500/5 transition-colors"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority).split(" ")[0]}`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-bold">{task.task}</p>
                    <p className="text-gray-500 text-[9px] mt-0.5">
                      {task.time}
                    </p>
                  </div>
                  <div
                    className={`text-[8px] font-black px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority === "high"
                      ? "فوری"
                      : task.priority === "medium"
                        ? "معمولی"
                        : "عادی"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* کلاس‌های فعال */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-base">
              <GraduationCap className="text-blue-400" size={22} />
              کلاس‌های فعال من
            </h3>
            <Link
              href="/teacher-dashboard/classes"
              className="text-blue-400 text-xs font-bold hover:underline"
            >
              مشاهده همه
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-[#1a1f2e] rounded-[2rem] border border-blue-500/20 overflow-hidden hover:border-blue-400/60 transition-all"
              >
                <div className="p-5 border-b border-blue-500/20 bg-blue-500/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-black text-lg">
                        {classItem.name}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                          سطح {classItem.level}
                        </span>
                        <span className="text-[9px] font-black text-gray-500">
                          {classItem.schedule}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/teacher-dashboard/class/${classItem.id}`}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Settings size={16} />
                    </Link>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-gray-500" />
                      <span className="text-gray-300 text-sm">دانشجو:</span>
                    </div>
                    <span className="text-white font-bold">
                      {classItem.students}/{classItem.capacity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-500" />
                      <span className="text-gray-300 text-sm">جلسه بعد:</span>
                    </div>
                    <span className="text-yellow-400 text-sm font-bold">
                      {classItem.nextSession}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-gray-500">پیشرفت دوره</span>
                      <span className="text-white">{classItem.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${classItem.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold py-2 rounded-xl transition-all">
                      ثبت حضور
                    </button>
                    <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold py-2 rounded-xl transition-all">
                      ثبت نمره
                    </button>
                    <button className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold py-2 rounded-xl transition-all">
                      مدیریت کلاس
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* فعالیت‌های اخیر */}
          <div className="bg-[#1a1f2e] rounded-[2rem] border border-blue-500/20 overflow-hidden">
            <div className="p-5 border-b border-blue-500/20 bg-blue-500/5">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Activity className="text-blue-400" size={18} />
                فعالیت‌های اخیر
              </h3>
            </div>
            <div className="divide-y divide-blue-500/10 max-h-[300px] overflow-y-auto">
              {recentActivities.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center">
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-bold">
                      {activity.text}
                    </p>
                    <p className="text-gray-500 text-[9px] mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* دسترسی سریع */}
          <div className="bg-[#1a1f2e] rounded-[2rem] border border-blue-500/20 overflow-hidden">
            <div className="p-5 border-b border-blue-500/20 bg-blue-500/5">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Target className="text-blue-400" size={18} />
                دسترسی سریع
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/teacher-dashboard/attendance"
                  className="bg-gray-800/50 hover:bg-blue-500/10 p-4 rounded-xl text-center transition-all border border-blue-500/20"
                >
                  <CheckCircle
                    size={24}
                    className="text-emerald-400 mx-auto mb-2"
                  />
                  <p className="text-white text-xs font-bold">
                    ثبت حضور و غیاب
                  </p>
                </Link>
                <Link
                  href="/teacher-dashboard/grades"
                  className="bg-gray-800/50 hover:bg-blue-500/10 p-4 rounded-xl text-center transition-all border border-blue-500/20"
                >
                  <Award size={24} className="text-purple-400 mx-auto mb-2" />
                  <p className="text-white text-xs font-bold">ثبت نمرات</p>
                </Link>
                <Link
                  href="/teacher-dashboard/classes"
                  className="bg-gray-800/50 hover:bg-blue-500/10 p-4 rounded-xl text-center transition-all border border-blue-500/20"
                >
                  <GraduationCap
                    size={24}
                    className="text-blue-400 mx-auto mb-2"
                  />
                  <p className="text-white text-xs font-bold">کلاس‌های من</p>
                </Link>
                <Link
                  href="/teacher-dashboard/students"
                  className="bg-gray-800/50 hover:bg-blue-500/10 p-4 rounded-xl text-center transition-all border border-blue-500/20"
                >
                  <Users size={24} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-white text-xs font-bold">لیست دانشجویان</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-between text-gray-600 bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest italic text-gray-400">
              جلسه بعدی: کلاس مکالمه متوسط - امروز ۱۴:۰۰
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={12} className="text-blue-400" />
            <p className="text-[10px] font-bold text-gray-500">
              پیام‌های خوانده نشده: ۳
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  Activity,
  DollarSign,
  Zap,
  BarChart3,
  Settings,
  ShieldCheck,
  BookOpen,
  ArrowUpRight,
  ClipboardList,
  Award,
  CalendarDays,
  MessageSquare,
  Library,
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

// داده‌های تحلیلی: مقایسه حضور زبان‌آموزان و درآمد کل
const performanceData = [
  { name: "شنبه", students: 320, revenue: 3200000 },
  { name: "یکشنبه", students: 350, revenue: 3500000 },
  { name: "دوشنبه", students: 410, revenue: 4100000 },
  { name: "سه‌شنبه", students: 480, revenue: 4800000 },
  { name: "چهارشنبه", students: 520, revenue: 5200000 },
  { name: "پنجشنبه", students: 560, revenue: 5600000 },
  { name: "جمعه", students: 430, revenue: 4300000 },
];

export default function AdminLanguageDashboard() {
  // کارت‌های آمار حیاتی آموزشگاه
  const kpiStats = [
    {
      label: "کل زبان‌آموزان فعال",
      val: "۱,۲۸۰",
      sub: "+۱۸٪ این ترم",
      icon: <Users />,
      color: "text-blue-400",
    },
    {
      label: "مربیان مجرب",
      val: "۲۴",
      sub: "۱۲ دوره فعال",
      icon: <UserCheck />,
      color: "text-green-400",
    },
    {
      label: "دوره‌های آموزشی",
      val: "۳۶",
      sub: "۴ سطح مختلف",
      icon: <Library />,
      color: "text-cyan-400",
    },
    {
      label: "درآمد کل (شهریه)",
      val: "۱,۸۴۲ M",
      sub: "برآورد فصلی",
      icon: <DollarSign />,
      color: "text-purple-400",
    },
  ];

  // بخش‌های مختلف مدیریتی آموزشگاه
  const adminSections = [
    {
      id: 1,
      title: "مدیریت زبان‌آموزان",
      desc: "ثبت‌نام، تمدید و ارزیابی",
      icon: <ShieldCheck />,
      link: "/admin-dashboard/students",
    },
    {
      id: 2,
      title: "مدیریت مربیان",
      desc: "برنامه تدریس و حقوق",
      icon: <ClipboardList />,
      link: "/admin-dashboard/teachers",
    },
    {
      id: 3,
      title: "دوره‌ها و کلاس‌ها",
      desc: "زمان‌بندی و ظرفیت",
      icon: <BookOpen />,
      link: "/admin-dashboard/courses",
    },
    {
      id: 4,
      title: "ارزیابی و نمرات",
      desc: "آزمون‌ها و پیشرفت تحصیلی",
      icon: <Award />,
      link: "/admin-dashboard/grades",
    },
  ];

  // دوره‌های در حال ثبت‌نام
  const activeCourses = [
    {
      name: "دوره مکالمه پیشرفته",
      level: "C1",
      students: 24,
      capacity: 30,
      teacher: "استاد رحیمی",
    },
    {
      name: "دوره گرامر پایه",
      level: "A2",
      students: 18,
      capacity: 25,
      teacher: "استاد کریمی",
    },
    {
      name: "دوره آیلتس",
      level: "B2-C1",
      students: 32,
      capacity: 35,
      teacher: "استاد صفوی",
    },
    {
      name: "دوره کودکان",
      level: "Starter",
      students: 15,
      capacity: 20,
      teacher: "استاد حسینی",
    },
  ];

  // آخرین فعالیت‌های سیستم
  const recentActivities = [
    {
      time: "۱۰:۴۵",
      text: "ثبت‌نام <span class='text-blue-400 font-black'>۲۴ زبان‌آموز جدید</span> در ترم تابستان",
      color: "blue",
    },
    {
      time: "۰۹:۳۰",
      text: "ایجاد <span class='text-green-400 font-black'>۴ کلاس جدید</span> سطح متوسط",
      color: "green",
    },
    {
      time: "۰۸:۱۵",
      text: "تمدید قرارداد <span class='text-cyan-400 font-black'>استاد محمدی</span> برای ترم آینده",
      color: "cyan",
    },
    {
      time: "۰۷:۴۵",
      text: "برگزاری آزمون تعیین سطح برای <span class='text-purple-400 font-black'>۵۶ نفر</span>",
      color: "purple",
    },
  ];

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen bg-gradient-to-br from-[#0a1628] to-[#0d1b2a] rounded-[2.5rem]"
        dir="rtl"
      >
        {/* Header - استایل مدیریت آموزشگاه */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 pb-8 border-b border-blue-500/20">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              داشبورد مدیریتی{" "}
              <span className="text-blue-400 text-5xl">آموزشگاه زبان</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-[0.5em] mt-3 flex items-center gap-2">
              <Zap size={14} className="text-blue-400" />
              سامانه جامع مدیریت آموزشگاه v2.0
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#1a1f2e] border border-blue-500/20 p-2 px-4 rounded-2xl hidden md:block">
              <p className="text-[10px] text-gray-500 font-bold uppercase">
                آخرین آپدیت سیستم
              </p>
              <p className="text-white font-mono text-sm">2025/01/15 - ۲۳:۱۵</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-black px-6 py-4 rounded-2xl flex items-center gap-2 transition-all active:scale-95 italic text-sm shadow-lg shadow-blue-500/30">
              <Activity size={18} /> گزارش جامع ترم
            </button>
          </div>
        </div>

        {/* دوره‌های فعال در حال ثبت‌نام - جابجا شده به بالا */}
        <div className="mb-10">
          <div className="bg-[#1a1f2e] rounded-[2.5rem] border border-blue-500/20 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Library className="text-blue-400" size={18} /> دوره‌های فعال
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeCourses.map((course, i) => (
                  <div
                    key={i}
                    className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-black text-lg">
                          {course.name}
                        </h4>
                        <p className="text-blue-400 text-xs font-bold">
                          سطح {course.level}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-gray-400 text-xs">مربی:</p>
                        <p className="text-white text-sm font-bold">
                          {course.teacher}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-500" />
                        <span className="text-gray-300 text-sm">
                          {course.students} / {course.capacity} نفر
                        </span>
                      </div>
                      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${(course.students / course.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Grid - آمار ۴ رکن اصلی آموزشگاه - جابجا شده به وسط */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiStats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] p-6 rounded-[2rem] border border-blue-500/20 relative overflow-hidden group hover:border-blue-400/60 transition-all shadow-lg"
            >
              <div className="relative z-10">
                <p className="text-gray-500 text-[10px] uppercase font-black mb-1 tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-white italic">
                  {stat.val}
                </h3>
                <p className="text-[10px] mt-2 text-gray-400 font-bold flex items-center gap-1">
                  <ArrowUpRight size={12} className="text-green-400" />{" "}
                  {stat.sub}
                </p>
              </div>
              <div
                className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 ${stat.color}`}
              >
                {React.cloneElement(stat.icon, { size: 100 })}
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Section - نمودار و دسترسی سریع */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          {/* نمودار پیشرفته - تحلیل حضور و درآمد */}
          <div className="xl:col-span-2 bg-[#1a1f2e] p-8 rounded-[2.5rem] border border-blue-500/20 shadow-inner">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-white text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                  <BarChart3 className="text-blue-400" size={24} /> آنالیز
                  عملکرد آموزشگاه
                </h3>
                <p className="text-gray-500 text-[10px] mt-1">
                  تطبیق تعداد زبان‌آموزان با درآمد شهریه هفتگی
                </p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                  درآمد (هزار تومان)
                </span>
                <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                  تعداد زبان‌آموزان
                </span>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#4b5563"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#4b5563"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f1420",
                      border: "1px solid #3b82f6",
                      borderRadius: "15px",
                      textAlign: "right",
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="students"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* آخرین فعالیت‌های سیستم - جابجا شده به کنار نمودار */}
          <div className="bg-[#1a1f2e] rounded-[2.5rem] border border-blue-500/20 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-blue-500/20 bg-blue-500/5">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Activity className="text-blue-400" size={18} /> آخرین فعالیت‌ها
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, i) => {
                  const colorClasses = {
                    blue: "border-blue-400 text-blue-400",
                    green: "border-green-400 text-green-400",
                    cyan: "border-cyan-400 text-cyan-400",
                    purple: "border-purple-400 text-purple-400",
                  };
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-4 text-xs p-3 bg-blue-500/5 rounded-2xl border-r-4 ${colorClasses[activity.color].split(" ")[0]} text-gray-400`}
                    >
                      <span
                        className={`shrink-0 font-black ${colorClasses[activity.color].split(" ")[1]}`}
                      >
                        {activity.time}
                      </span>
                      <p dangerouslySetInnerHTML={{ __html: activity.text }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Menu - دسترسی سریع بخش‌ها - جابجا شده به پایین */}
        <div className="mb-10">
          <h3 className="text-white font-black italic uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <Settings className="text-blue-400" size={18} /> دسترسی سریع
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {adminSections.map((section) => (
              <Link
                key={section.id}
                href={section.link}
                className="block p-5 bg-[#1a1f2e] border border-blue-500/20 rounded-3xl hover:bg-blue-500 group transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                    {section.icon}
                  </div>
                  <div>
                    <h4 className="text-white group-hover:text-white font-black text-lg italic uppercase tracking-tighter leading-none">
                      {section.title}
                    </h4>
                    <p className="text-gray-500 group-hover:text-white/80 text-xs mt-1 font-bold">
                      {section.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* پیام ویژه مدیر */}
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-[2rem] border border-blue-500/20 text-center">
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <MessageSquare size={16} className="text-blue-400" />
            ترم جدید از ۱۵ بهمن ماه آغاز می‌شود. ثبت‌نام تا ۱۰ بهمن ادامه دارد.
            <CalendarDays size={14} className="text-cyan-400 mr-2" />
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

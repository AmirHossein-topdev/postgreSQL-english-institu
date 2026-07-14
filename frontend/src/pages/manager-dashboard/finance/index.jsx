"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  ClipboardList,
  Activity,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Users,
  Calendar,
  Award,
  CreditCard,
  Wallet,
  TrendingDown,
  PieChart,
  Download,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardLayout from "../layout";

// داده‌های نمونه برای نمودار درآمد و هزینه
const financeData = [
  { name: "هفته 1", revenue: 2400, expenses: 1200 },
  { name: "هفته 2", revenue: 3000, expenses: 1800 },
  { name: "هفته 3", revenue: 2000, expenses: 800 },
  { name: "هفته 4", revenue: 3500, expenses: 1500 },
  { name: "هفته 5", revenue: 4000, expenses: 2200 },
];

// داده‌های توزیع درآمد
const incomeDistribution = [
  { name: "شهریه کلاس‌ها", value: 65, color: "#3b82f6" },
  { name: "فروش کتاب", value: 20, color: "#10b981" },
  { name: "آزمون‌ها", value: 10, color: "#f59e0b" },
  { name: "متفرقه", value: 5, color: "#8b5cf6" },
];

export default function FinanceDashboard() {
  const kpiStats = [
    {
      label: "درآمد کل ماه",
      val: "۲۸,۴۰۰,۰۰۰",
      sub: "+۱۵٪ نسبت به ماه قبل",
      icon: <DollarSign />,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "شهریه کلاس‌ها",
      val: "۱۸,۵۰۰,۰۰۰",
      sub: "۶۵٪ از کل درآمد",
      icon: <GraduationCap />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "فروش کتاب‌ها",
      val: "۵,۶۰۰,۰۰۰",
      sub: "+۳۲٪ رشد فروش",
      icon: <BookOpen />,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "کل تراکنش‌ها",
      val: "۳۴۲",
      sub: "۲۸ تراکنش جدید",
      icon: <CreditCard />,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  const recentTransactions = [
    {
      time: "۱۰:۳۰",
      text: "پرداخت شهریه کلاس آیلتس - محمد رضایی",
      amount: "+۳,۵۰۰,۰۰۰",
      type: "income",
      category: "شهریه",
    },
    {
      time: "۱۲:۱۵",
      text: "خرید کتاب Cambridge IELTS 18 - سارا احمدی",
      amount: "+۴۵۰,۰۰۰",
      type: "income",
      category: "فروش کتاب",
    },
    {
      time: "۱۴:۰۰",
      text: "ثبت‌نام ترم جدید - کلاس مکالمه",
      amount: "+۲,۸۰۰,۰۰۰",
      type: "income",
      category: "شهریه",
    },
    {
      time: "۱۵:۳۰",
      text: "هزینه چاپ جزوات آموزشی",
      amount: "-۸۵۰,۰۰۰",
      type: "expense",
      category: "هزینه",
    },
    {
      time: "۱۷:۰۰",
      text: "خرید کتاب Oxford Word Skills - علی نوری",
      amount: "+۳۵۰,۰۰۰",
      type: "income",
      category: "فروش کتاب",
    },
  ];

  const upcomingPayments = [
    {
      dueDate: "۲۵ اردیبهشت",
      title: "حقوق اساتید ماه جاری",
      amount: "۱۲,۵۰۰,۰۰۰",
      status: "در انتظار",
    },
    {
      dueDate: "۳۰ اردیبهشت",
      title: "اجاره ساختمان",
      amount: "۸,۰۰۰,۰۰۰",
      status: "در انتظار",
    },
    {
      dueDate: "۱۵ خرداد",
      title: "خرید کتاب‌های جدید",
      amount: "۳,۲۰۰,۰۰۰",
      status: "برنامه‌ریزی شده",
    },
  ];

  return (
    <DashboardLayout>
      <div
        className="p-4 sm:p-8 min-h-screen bg-[#0F1420] rounded-4xl"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-6 border-b border-blue-500/20">
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              داشبورد مالی{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                آموزشگاه زبان
              </span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <Activity size={14} className="text-blue-400" />
              مدیریت درآمد، هزینه‌ها و تراکنش‌های مالی
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#1a1f2e] border border-blue-500/20 hover:bg-blue-500/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <Filter size={16} />
              فیلتر
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25">
              <Download size={16} />
              گزارش مالی
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiStats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#1a1f2e] p-6 rounded-[2rem] border border-blue-500/20 relative overflow-hidden group hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
            >
              <div className="relative z-10">
                <div
                  className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}
                >
                  <div className={`${stat.color}`}>
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
                  <ArrowUpRight size={10} className="text-green-400" />{" "}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* نمودار درآمد و هزینه */}
          <div className="lg:col-span-2 bg-[#1a1f2e] p-6 rounded-[2rem] border border-blue-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
                <BarChart3 className="text-blue-400" size={22} />
                روند درآمد و هزینه
              </h3>
              <div className="flex gap-4 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-gray-400">درآمد</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <span className="text-gray-400">هزینه</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f2e",
                      border: "1px solid #3b82f6",
                      borderRadius: "12px",
                      textAlign: "right",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${value.toLocaleString()} تومان`,
                      "",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fill="url(#colorExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* نمودار دایره‌ای توزیع درآمد */}
          <div className="bg-[#1a1f2e] p-6 rounded-[2rem] border border-blue-500/20">
            <h3 className="text-white text-lg font-black italic uppercase tracking-tighter flex items-center gap-2 mb-6">
              <PieChart className="text-blue-400" size={22} />
              توزیع درآمدها
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={incomeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {incomeDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1f2e",
                      border: "1px solid #3b82f6",
                      borderRadius: "12px",
                      textAlign: "right",
                    }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {incomeDistribution.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* لاگ تراکنش‌های مالی اخیر */}
          <div className="bg-[#1a1f2e] rounded-[2rem] border border-blue-500/20 overflow-hidden">
            <div className="p-6 border-b border-blue-500/20">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Activity className="text-blue-400" size={18} />
                آخرین تراکنش‌های مالی
              </h3>
            </div>
            <div className="divide-y divide-blue-500/10 max-h-[400px] overflow-y-auto">
              {recentTransactions.map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        log.type === "income"
                          ? "bg-emerald-500/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      {log.type === "income" ? (
                        <Wallet size={18} className="text-emerald-400" />
                      ) : (
                        <TrendingDown size={18} className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{log.text}</p>
                      <p className="text-gray-500 text-[10px] mt-1">
                        {log.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-black text-sm ${log.type === "income" ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {log.amount}
                    </p>
                    <p className="text-gray-600 text-[8px] uppercase tracking-wider">
                      {log.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* پرداخت‌های پیش‌رو */}
          <div className="bg-[#1a1f2e] rounded-[2rem] border border-blue-500/20 overflow-hidden">
            <div className="p-6 border-b border-blue-500/20">
              <h3 className="text-white font-black italic flex items-center gap-2 uppercase tracking-widest text-sm">
                <Calendar className="text-blue-400" size={18} />
                پرداخت‌های پیش‌رو
              </h3>
            </div>
            <div className="divide-y divide-blue-500/10">
              {upcomingPayments.map((payment, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <Award size={18} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">
                        {payment.title}
                      </p>
                      <p className="text-gray-500 text-[10px] mt-1">
                        سررسید: {payment.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-white">
                      {payment.amount.toLocaleString()} تومان
                    </p>
                    <p
                      className={`text-[9px] font-bold mt-1 ${
                        payment.status === "در انتظار"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    >
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* جمع کل */}
            <div className="p-5 bg-blue-500/5 border-t border-blue-500/20">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs font-bold">
                  مجموع پرداخت‌های پیش‌رو:
                </span>
                <span className="text-white font-black text-lg">
                  ۲۳,۷۰۰,۰۰۰ تومان
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-between text-gray-600 bg-[#1a1f2e] p-4 rounded-2xl border border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest italic text-gray-400">
              آخرین بروزرسانی: امروز ۱۸:۳۰
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} className="text-blue-400" />
            <p className="text-[10px] font-bold text-gray-500">
              تعداد زبان‌آموزان فعال: ۱۴۲ نفر
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

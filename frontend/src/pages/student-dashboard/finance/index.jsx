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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
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
import Link from "next/link";

// داده‌های مالی زبان‌آموز (از sessionStorage یا API میاد)
const studentFinanceData = {
  totalPaid: 12500000,
  remainingFees: 3500000,
  lastPayment: {
    amount: 3500000,
    date: "۱۴۰۴/۰۲/۱۵",
    for: "شهریه ترم بهار - کلاس آیلتس",
    status: "پرداخت شده",
  },
  nextPayment: {
    amount: 4500000,
    dueDate: "۱۴۰۴/۰۳/۰۱",
    for: "شهریه ترم تابستان",
    status: "در انتظار پرداخت",
  },
  paymentHistory: [
    { month: "فروردین", amount: 3500000, status: "paid", date: "۱۴۰۴/۰۱/۲۰" },
    { month: "اسفند", amount: 3500000, status: "paid", date: "۱۴۰۳/۱۲/۱۵" },
    { month: "بهمن", amount: 3500000, status: "paid", date: "۱۴۰۳/۱۱/۱۰" },
    { month: "دی", amount: 3500000, status: "paid", date: "۱۴۰۳/۱۰/۰۵" },
  ],
  monthlyChart: [
    { month: "دی", paid: 3500000, pending: 0 },
    { month: "بهمن", paid: 3500000, pending: 0 },
    { month: "اسفند", paid: 3500000, pending: 0 },
    { month: "فروردین", paid: 3500000, pending: 0 },
    { month: "اردیبهشت", paid: 0, pending: 4500000 },
  ],
};

// آمار کارت‌ها
const statsCards = [
  {
    label: "مجموع پرداختی",
    value: "۱۲,۵۰۰,۰۰۰",
    sub: "از ابتدای سال",
    icon: <Wallet />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "باقی‌مانده شهریه",
    value: "۳,۵۰۰,۰۰۰",
    sub: "مهلت پرداخت: ۱۰ روز",
    icon: <AlertCircle />,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    label: "آخرین پرداخت",
    value: "۳,۵۰۰,۰۰۰",
    sub: "۱۴۰۴/۰۲/۱۵",
    icon: <CheckCircle />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "پرداخت بعدی",
    value: "۴,۵۰۰,۰۰۰",
    sub: "سررسید: ۱۴۰۴/۰۳/۰۱",
    icon: <Calendar />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

export default function StudentFinanceDashboard() {
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
              امور مالی{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
                من
              </span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <CreditCard size={14} className="text-blue-400" />
              مدیریت پرداخت‌ها و صورتحساب‌های مالی
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#1a1f2e] border border-blue-500/20 hover:bg-blue-500/10 text-gray-300 px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <Download size={16} />
              دریافت فیش مالی
            </button>
            <Link
              href="/student-dashboard/finance/pay"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25"
            >
              <DollarSign size={16} />
              پرداخت شهریه
            </Link>
          </div>
        </div>

        {/* کارت‌های آماری */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statsCards.map((stat, i) => (
            <div
              key={i}
              className={`bg-[#1a1f2e] p-5 rounded-2xl border ${stat.border} relative overflow-hidden group hover:shadow-lg transition-all`}
            >
              <div className="relative z-10">
                <div
                  className={`${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}
                >
                  <div className={stat.color}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                  </div>
                </div>
                <p className="text-gray-500 text-[10px] uppercase font-black mb-1 tracking-widest">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-white italic">
                  {stat.value}
                </h3>
                <p className="text-[9px] mt-2 text-gray-500 font-bold">
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

        {/* دو ستون اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* نمودار روند پرداخت‌ها */}
          <div className="lg:col-span-2 bg-[#1a1f2e] p-6 rounded-2xl border border-blue-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-black italic flex items-center gap-2">
                <BarChart3 className="text-blue-400" size={22} />
                روند پرداخت‌های ماهانه
              </h3>
              <div className="flex gap-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-gray-400">پرداخت شده</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-gray-400">در انتظار</span>
                </div>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentFinanceData.monthlyChart}>
                  <defs>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorPending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2d3139"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
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
                    tickFormatter={(v) => `${v / 1000}K`}
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
                    dataKey="paid"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#colorPaid)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fill="url(#colorPending)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* خلاصه شهریه */}
          <div className="bg-[#1a1f2e] p-6 rounded-2xl border border-blue-500/20">
            <h3 className="text-white text-lg font-black italic flex items-center gap-2 mb-5">
              <GraduationCap className="text-blue-400" size={22} />
              خلاصه شهریه کلاس‌ها
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-blue-500/20">
                <span className="text-gray-400 text-sm">کلاس آیلتس (C1)</span>
                <span className="text-white font-bold">۳,۵۰۰,۰۰۰ تومان</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-blue-500/20">
                <span className="text-gray-400 text-sm">کلاس مکالمه (B1)</span>
                <span className="text-white font-bold">۲,۸۰۰,۰۰۰ تومان</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-blue-500/20">
                <span className="text-gray-400 text-sm">کلاس گرامر (B2)</span>
                <span className="text-white font-bold">۲,۲۰۰,۰۰۰ تومان</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-blue-400 font-bold">جمع کل</span>
                <span className="text-white font-black text-lg">
                  ۸,۵۰۰,۰۰۰ تومان
                </span>
              </div>
            </div>
            <div className="mt-5 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="flex justify-between items-center text-xs">
                <span className="text-yellow-400">مبلغ پرداخت شده</span>
                <span className="text-white font-bold">۵,۰۰۰,۰۰۰ تومان</span>
              </div>
              <div className="flex justify-between items-center text-xs mt-2">
                <span className="text-red-400">باقی‌مانده</span>
                <span className="text-white font-bold">۳,۵۰۰,۰۰۰ تومان</span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* دو ستون پایینی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* آخرین پرداخت‌ها */}
          <div className="bg-[#1a1f2e] rounded-2xl border border-blue-500/20 overflow-hidden">
            <div className="p-5 border-b border-blue-500/20 bg-blue-500/5">
              <h3 className="text-white font-black italic flex items-center gap-2 text-base">
                <Clock className="text-blue-400" size={18} />
                آخرین پرداخت‌ها
              </h3>
            </div>
            <div className="divide-y divide-blue-500/10 max-h-[350px] overflow-y-auto">
              {studentFinanceData.paymentHistory.map((payment, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-blue-500/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">
                        شهریه ماه {payment.month}
                      </p>
                      <p className="text-gray-500 text-[9px] mt-0.5">
                        {payment.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-emerald-400">
                      {payment.amount.toLocaleString()} تومان
                    </p>
                    <p className="text-gray-600 text-[8px] uppercase">
                      پرداخت شده
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* پرداخت بعدی و اطلاعات */}
          <div className="space-y-5">
            {/* کارت پرداخت بعدی */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-5 rounded-2xl border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-yellow-400" />
                <h3 className="text-white font-black text-sm">پرداخت بعدی</h3>
              </div>
              <p className="text-yellow-400 text-lg font-black">
                {studentFinanceData.nextPayment.for}
              </p>
              <div className="flex justify-between mt-3 pt-3 border-t border-yellow-500/20">
                <span className="text-gray-400 text-xs">مبلغ</span>
                <span className="text-white font-bold">
                  {studentFinanceData.nextPayment.amount.toLocaleString()} تومان
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-400 text-xs">سررسید</span>
                <span className="text-yellow-400 text-xs font-bold">
                  {studentFinanceData.nextPayment.dueDate}
                </span>
              </div>
              <Link
                href="/student-dashboard/finance/pay"
                className="w-full mt-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-center text-xs font-black rounded-xl transition-all border border-yellow-500/30 block"
              >
                پرداخت آنلاین
              </Link>
            </div>

            {/* اطلاعات حساب */}
            <div className="bg-[#1a1f2e] p-5 rounded-2xl border border-blue-500/20">
              <h3 className="text-white font-black text-sm flex items-center gap-2 mb-3">
                <CreditCard size={16} className="text-blue-400" />
                اطلاعات حساب
              </h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">شماره حساب:</span>
                  <span className="text-white font-mono">
                    IR60-0120-0000-1234-5678-9012
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">شماره کارت:</span>
                  <span className="text-white font-mono">
                    ****-****-****-1234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">صاحب حساب:</span>
                  <span className="text-white">آموزشگاه زبان HUB</span>
                </div>
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
            <GraduationCap size={12} className="text-blue-400" />
            <p className="text-[10px] font-bold text-gray-500">
              در صورت نیاز به مشاوره مالی با واحد حسابداری تماس بگیرید
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

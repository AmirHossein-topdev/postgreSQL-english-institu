"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Home,
  AlertOctagon,
  ChevronLeft,
  GraduationCap,
  Languages,
} from "lucide-react";

const ErrorPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628] flex items-center justify-center p-6 overflow-hidden relative">
      {/* المان‌های گرافیکی پس‌زمینه (تزئینی) */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-400/5 rounded-full blur-[100px]"></div>

      {/* دایره‌های کوچک تزئینی */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-300"></div>
      <div className="absolute top-1/3 right-32 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping delay-700"></div>

      <div className="container max-w-2xl relative z-10">
        <div className="text-center">
          {/* بخش عدد 404 با استایل خشن */}
          <div className="relative inline-block mb-8">
            <h1 className="text-[12rem] md:text-[18rem] font-black italic leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-blue-400 to-teal-600 select-none opacity-20">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertOctagon
                size={120}
                className="text-cyan-400 animate-pulse"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* محتوای متنی */}
          <div className="space-y-4 -mt-10 md:-mt-20">
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
              مسیر رو{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400">
                اشتباه اومدی!
              </span>
            </h2>

            <div className="flex items-center justify-center gap-2 text-cyan-400/60 uppercase tracking-[0.3em] text-xs font-bold mb-6">
              <Languages size={14} className="text-cyan-400" />
              <span>Wrong Learning Zone</span>
              <GraduationCap size={14} className="text-cyan-400" />
            </div>

            <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed font-medium">
              زبان‌آموز عزیز، صفحه‌ای که دنبالش می‌گردی توی لیست دوره‌های آموزشی
              ما نیست. شاید آدرس رو اشتباه وارد کردی یا صفحه جابجا شده!
            </p>
          </div>

          {/* دکمه‌های عملیاتی */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="group relative w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 hover:from-cyan-600 hover:via-blue-600 hover:to-teal-600 text-white px-10 py-5 rounded-2xl font-black text-sm italic uppercase transition-all shadow-[0_15px_30px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 overflow-hidden"
            >
              <Home size={18} />
              <span>بازگشت به خانه / Home</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white border border-cyan-500/50 hover:border-cyan-400 px-10 py-5 rounded-2xl font-black text-sm italic uppercase transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft size={18} />
              <span>برگشت به عقب</span>
            </button>
          </div>

          {/* دکمه کمک / پشتیبانی */}
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors"
            >
              <BookOpen size={16} />
              <span>گزارش مشکل به پشتیبانی آموزشگاه</span>
            </Link>
          </div>

          {/* فوتر کوچک */}
          <p className="mt-16 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            Language School Management System • Version 2025
          </p>
        </div>
      </div>

      {/* استایل متحرک خطوط پس‌زمینه (اختیاری) */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="h-full w-full shadow-[inset_0_0_100px_rgba(0,0,0,1)] bg-[linear-gradient(to_right,#00ffff_1px,transparent_1px),linear-gradient(to_bottom,#00ffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
    </section>
  );
};

export default ErrorPage;

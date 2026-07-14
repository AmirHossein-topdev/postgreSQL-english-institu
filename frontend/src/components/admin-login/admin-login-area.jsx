"use client";
import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  BookOpen,
  History,
  LockKeyhole,
  UserRoundCheck,
  Instagram,
  Send,
  Phone,
  GraduationCap,
  Globe,
  Award,
} from "lucide-react";
import AdminLoginForm from "../forms/AdminLoginForm";

const languageTips = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    text: "برای تقویت مهارت گفتاری، روزانه <span class='text-blue-400 font-bold'>۱۰ دقیقه به زبان انگلیسی</span> صحبت کنید.",
  },
  {
    icon: <LockKeyhole className="w-5 h-5" />,
    text: "جهت امنیت حساب، <span class='text-blue-400 font-bold'>رمز عبور</span> خود را در اختیار سایر زبان‌آموزان قرار ندهید.",
  },
  {
    icon: <UserRoundCheck className="w-5 h-5" />,
    text: "پس از اتمام کار با سیستم آموزشگاه، حتماً از حساب خود <span class='text-blue-400 font-bold'>خارج شوید</span>.",
  },
  {
    icon: <History className="w-5 h-5" />,
    text: "تاریخ انقضای <span class='text-blue-400 font-bold'>ترم آموزشی</span> خود را از طریق پنل چک کنید.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    text: "روزانه <span class='text-blue-400 font-bold'>۵ لغت جدید</span> یاد بگیرید و در جملات استفاده کنید.",
  },
  {
    icon: <Award className="w-5 h-5" />,
    text: "مدرک <span class='text-blue-400 font-bold'>IELTS یا TOEFL</span> برنامه‌ریزی مشخصی نیاز دارد.",
  },
];

export default function AdminLoginArea() {
  return (
    <section
      className="fixed inset-0 bg-gradient-to-br from-[#0a1628] to-[#0d1b2a] flex flex-col lg:flex-row overflow-hidden font-sans"
      dir="rtl"
    >
      {/* بخش راست: فرم و محتوا */}
      <section className="w-full lg:w-[45%] p-6 lg:p-12 flex flex-col justify-between h-screen z-10 bg-gradient-to-br from-[#0a1628] to-[#0d1b2a] shadow-2xl">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 justify-center lg:justify-start">
            <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white text-2xl font-black italic tracking-tighter">
              LANGUAGE <span className="text-blue-400">HUB</span>
            </h1>
          </div>

          {/* Warning Message */}
          <div className="mt-8 bg-blue-500/10 border-r-4 border-blue-500 text-gray-200 p-4 rounded-xl flex items-start gap-3 w-full animate-pulse-slow">
            <ShieldAlert className="text-blue-400 shrink-0 w-6 h-6" />
            <p className="text-[13px] leading-relaxed">
              زبان‌آموز گرامی، جهت جلوگیری از سوءاستفاده از{" "}
              <span className="font-bold text-blue-400">حساب کاربری</span> و
              دسترسی به دوره‌ها، ورود دو مرحله‌ای را فعال کنید.
            </p>
          </div>

          {/* Language Tips */}
          <ul className="space-y-4 mt-12 hidden md:block max-h-[320px] overflow-y-auto custom-scrollbar">
            {languageTips.map((item, i) => (
              <li key={i} className="flex items-start gap-4 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3
                  className="text-gray-400 text-[13px] mt-2 group-hover:text-white transition-colors leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Social Medias & Footer */}
        <div className="mt-auto">
          <div className="flex items-center gap-4 mb-6 justify-center lg:justify-start">
            <Link
              href="#"
              className="p-3 bg-blue-500/10 rounded-full text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="#"
              className="p-3 bg-blue-500/10 rounded-full text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Send size={20} />
            </Link>
            <Link
              href="#"
              className="p-3 bg-blue-500/10 rounded-full text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
            >
              <Phone size={20} />
            </Link>
          </div>

          <p className="text-gray-500 text-xs text-center lg:text-right border-t border-blue-500/20 pt-4 leading-loose">
            پورتال مدیریت هوشمند آموزشگاه زبان | پشتیبانی فنی: ۰۲۱-۱۲۳۴۵۶ <br />
            تمام حقوق برای آموزشگاه زبان محفوظ است.
          </p>
        </div>
      </section>

      {/* بخش فرم (شناور در وسط برای موبایل و دسکتاپ) */}
      <div className="absolute inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md">
          <AdminLoginForm />
        </div>
      </div>

      {/* بخش چپ: تصویر پس‌زمینه آموزشگاهی */}
      <section className="hidden lg:block fixed inset-y-0 left-0 w-6/12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10" />

        <img
          src="https://picsum.photos/id/20/1920/1080"
          alt="Language School Background"
          className="h-full w-full object-cover scale-105 hover:scale-100 transition-transform duration-[10s]"
        />

        {/* متن روی تصویر */}
        <div className="absolute bottom-12 left-12 z-20 text-white">
          <h2 className="text-6xl font-black italic opacity-20 select-none">
            LEARN & GROW
          </h2>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.8);
        }
      `}</style>
    </section>
  );
}

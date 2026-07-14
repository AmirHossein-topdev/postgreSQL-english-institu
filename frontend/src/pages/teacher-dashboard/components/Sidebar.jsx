"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRound,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  Library,
  ClipboardList,
  Trophy,
  MessageSquare,
  Book,
  User,
} from "lucide-react";

const menuItems = [
  {
    label: "داشبورد",
    icon: <LayoutDashboard size={20} />,
    href: "/teacher-dashboard",
  },
  {
    label: "پروفایل من",
    icon: <User size={20} />,
    href: "/teacher-dashboard/profile",
  },

  {
    label: "کلاس‌ها و ترم‌ها",
    icon: <Library size={20} />,
    href: "/teacher-dashboard/class",
  },

  {
    label: " کتاب ",
    icon: <Book size={20} />,
    href: "/teacher-dashboard/book",
  },
  {
    label: "امور مالی و شهریه",
    icon: <CreditCard size={20} />,
    href: "/teacher-dashboard/finance",
  },
];

function MenuItem({ item, pathname, onClose, level = 0 }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (item.subMenu && pathname) {
      const matchSub = item.subMenu.some(
        (sub) => pathname === sub.href || pathname.startsWith(sub.href),
      );
      if (matchSub) setOpen(true);
    }
  }, [pathname, item.subMenu]);

  const isActive = pathname
    ? item.href === "/teacher-dashboard"
      ? pathname === "/teacher-dashboard"
      : pathname.startsWith(item.href)
    : false;

  const paddingRight = 16 + level * 12;

  if (item.subMenu) {
    return (
      <li className="list-none">
        <div
          className={`flex items-center justify-between rounded-xl p-3 mb-1 transition-all duration-200 cursor-pointer ${
            isActive
              ? "bg-blue-500/10 text-blue-400"
              : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
          }`}
          style={{ paddingRight }}
        >
          <div
            className="flex items-center gap-3 flex-1"
            onClick={() => setOpen(!open)}
          >
            {item.icon}
            <span className="text-[14px] font-medium">{item.label}</span>
          </div>
          <button onClick={() => setOpen(!open)}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {open && (
          <ul className="mt-1 space-y-1 overflow-hidden transition-all">
            {item.subMenu.map((sub, i) => (
              <MenuItem
                key={i}
                item={sub}
                pathname={pathname}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="list-none">
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-xl p-3 mb-1 transition-all duration-200 ${
          isActive
            ? "bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
        }`}
        style={{ paddingRight }}
        onClick={onClose}
      >
        {item.icon}
        <span className="text-[14px]">{item.label}</span>
      </Link>
    </li>
  );
}

export default function Sidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname() || "";

  useEffect(() => {
    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");

    const toggleSidebar = () => {
      if (window.innerWidth >= 1024) {
        sidebar.classList.toggle("lg:w-20");
        sidebar.classList.toggle("lg:w-64");
        if (mainContent) {
          mainContent.classList.toggle("lg:mr-20");
          mainContent.classList.toggle("lg:mr-64");
        }
        const texts = document.querySelectorAll(".sidebar-text");
        texts.forEach((t) => t.classList.toggle("hidden"));
      }
    };

    sidebarLogo?.addEventListener("click", toggleSidebar);
    return () => sidebarLogo?.removeEventListener("click", toggleSidebar);
  }, []);

  let roleTitle = "کاربر";
  if (pathname.includes("teacher-dashboard")) {
    roleTitle = "مربی زبان";
  } else if (pathname.includes("teacher-dashboard")) {
    if (pathname.includes("student-dashboard")) {
      roleTitle = "زبان‌آموز";
    } else {
      roleTitle = "مدیر آموزشگاه";
    }
  } else if (pathname.includes("student-dashboard")) {
    roleTitle = "زبان‌آموز";
  }

  return (
    <div
      id="sidebar"
      className={`fixed top-0 right-0 h-full w-56 z-[60] bg-[#0f1420] border-l border-blue-500/20 text-white flex flex-col transition-all duration-300 transform ${
        isMobileOpen ? "translate-x-0" : "translate-x-full"
      } lg:translate-x-0 lg:flex`}
      dir="rtl"
    >
      {/* بخش لوگو */}
      <div className="flex items-center justify-between p-6 mb-4">
        <div
          id="sidebarLogo"
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-blue-500 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="sidebar-text font-black italic text-xl tracking-tighter">
            LANGUAGE <span className="text-blue-400">HUB</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* منوها */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <p className="sidebar-text text-[10px] uppercase tracking-widest text-gray-500 mb-4 mr-2">
          منوی اصلی
        </p>
        <ul className="space-y-1">
          {menuItems.map((item, i) => (
            <MenuItem
              key={i}
              item={item}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </ul>
      </nav>

      {/* فوتر سایدبار (پروفایل کوتاه) */}
      <div className="p-4 border-t border-blue-500/20">
        <div className="flex items-center gap-3 p-2 bg-blue-500/10 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
            {roleTitle === "مدیر آموزشگاه"
              ? "AD"
              : roleTitle === "مربی زبان"
                ? "TE"
                : "ST"}
          </div>
          <div className="sidebar-text">
            <p className="text-sm font-bold">{roleTitle}</p>
            <p className="text-[10px] text-gray-500">خوش آمدید</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

// frontend\src\pages\manager-dashboard\book\index.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Coffee,
  Target,
  Search,
  FlameIcon,
  PlusIcon,
  Pencil,
  Trash2,
  Book,
  BookOpen,
  Globe,
  MessageCircle,
  BookMarked,
  BookCopy,
  BookOpenCheck,
  PenTool,
  Smile,
  Headphones,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardLayout from "../layout";
import { useGetAllBooksQuery } from "@/redux/features/bookApi";

export default function BookPage() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllBooksQuery();

  const products = data?.books ?? data ?? [];
  const [activeCategory, setActiveCategory] = useState("همه");
  const [searchTerm, setSearchTerm] = useState("");

  // Logging
  useEffect(() => {
    if (data) {
      console.log("📚 Data loaded:", data);
    }
  }, [data]);

  const handleDeleteBook = async (id, bookName) => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: `کتاب "${bookName || id}" حذف خواهد شد!`,
      icon: "warning",
      background: "#1a1f2e",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "انصراف",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/book/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        await refetch();
        Swal.fire({
          title: "حذف شد!",
          text: "کتاب با موفقیت حذف گردید.",
          icon: "success",
          background: "#1a1f2e",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("[Book] delete error:", err);
      Swal.fire({
        title: "خطا!",
        text: err.message || "خطا در حذف کتاب",
        icon: "error",
        background: "#1a1f2e",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const categories = [
    { id: 1, name: "همه", value: "همه", icon: <BookOpen size={18} /> },
    { id: 2, name: "IELTS", value: "IELTS", icon: <Target size={18} /> },
    { id: 3, name: "TOEFL", value: "TOEFL", icon: <Globe size={18} /> },
    {
      id: 4,
      name: "Conversation",
      value: "Conversation",
      icon: <MessageCircle size={18} />,
    },
    {
      id: 5,
      name: "Grammar",
      value: "Grammar",
      icon: <BookMarked size={18} />,
    },
    {
      id: 6,
      name: "Vocabulary",
      value: "Vocabulary",
      icon: <BookCopy size={18} />,
    },
    {
      id: 7,
      name: "Listening",
      value: "Listening",
      icon: <Headphones size={18} />,
    },
    {
      id: 8,
      name: "Reading",
      value: "Reading",
      icon: <BookOpenCheck size={18} />,
    },
    { id: 9, name: "Writing", value: "Writing", icon: <PenTool size={18} /> },
    { id: 10, name: "Kids", value: "Kids", icon: <Smile size={18} /> },
  ];

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    let filtered = products;
    
    // فیلتر بر اساس دسته‌بندی
    if (activeCategory !== "همه") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }
    
    // فیلتر بر اساس جستجو
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }
    
    return filtered;
  }, [products, activeCategory, searchTerm]);

  return (
    <DashboardLayout>
      <div 
        className="w-full rounded-4xl max-w-full min-h-screen bg-[#0F1420] text-right overflow-x-hidden"
        dir="rtl"
      >
        {/* container با محدودیت عرض */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          
          {/* Header */}
          <div className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="w-full md:w-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                فروشگاه <span className="text-blue-400">کتاب</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-black mt-3 flex items-center gap-2 uppercase tracking-[0.4em]">
                <FlameIcon size={14} className="text-blue-400 flex-shrink-0" />
                <span className="truncate">TACTICAL REFUELING STATION</span>
              </p>
            </div>

            <Link
              href="/manager-dashboard/book/create"
              className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-black font-bold uppercase px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-lg transition-all flex-shrink-0 text-sm sm:text-base"
            >
              <PlusIcon size={16} className="flex-shrink-0" /> 
              <span className="whitespace-nowrap">ایجاد آیتم</span>
            </Link>
          </div>

          {/* Categories - با اسکرول افقی و محدودیت عرض */}
          <div className="w-full overflow-x-auto overflow-y-hidden pb-4 mb-8 md:mb-10 border-b border-gray-800/50 scrollbar-hide">
            <div className="flex gap-3 min-w-max md:min-w-0 md:flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black italic text-xs sm:text-sm whitespace-nowrap transition-all flex-shrink-0
                    ${
                      activeCategory === cat.name
                        ? "bg-blue-400 text-black scale-105 shadow-lg"
                        : "bg-[#1a1d23] text-gray-500 border border-gray-800 hover:border-gray-600"
                    }`}
                >
                  <span className="flex-shrink-0">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-full sm:max-w-md">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 flex-shrink-0"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی سریع کتاب..."
              className="w-full bg-[#1a1d23] border border-gray-800 rounded-2xl py-3.5 sm:py-4 pr-12 pl-4 text-white text-sm font-bold focus:outline-none focus:border-blue-400 italic"
            />
          </div>

          {/* Loading */}
          {(isLoading || isFetching) && (
            <p className="text-gray-500 font-bold italic text-center py-20">
              در حال بارگذاری منو...
            </p>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className="w-full">
              {/* تعداد نتایج */}
              <p className="text-gray-500 text-sm mb-4">
                {filteredProducts.length} کتاب یافت شد
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id || product._id}
                    className="bg-[#1a1d23] border border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-400/50 transition-all shadow-xl w-full min-w-0"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-900/30 flex items-center justify-center">
                      {/* Edit Icon */}
                      <Link
                        href={`/manager-dashboard/book/${product.id || product._id}/edit`}
                        className="absolute cursor-pointer top-3 left-3 z-10 bg-black/70 border border-blue-400/40 text-blue-400 p-2 rounded-full hover:bg-blue-400 hover:text-black transition-all"
                      >
                        <Pencil size={14} className="flex-shrink-0" />
                      </Link>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBook(product.id || product._id, product.name);
                        }}
                        className="absolute cursor-pointer top-3 left-12 z-10 bg-black/70 border border-red-400/40 text-red-400 p-2 rounded-full hover:bg-red-400 hover:text-black transition-all"
                        title="حذف"
                      >
                        <Trash2 size={14} className="flex-shrink-0" />
                      </button>

                      {/* تصویر */}
                      {product.img ? (
                        <img
                          src={`http://localhost:5000/uploads/images/${product.img}`}
                          alt={product.name || "book image"}
                          className="w-full h-full object-contain hover:scale-110 transition-transform duration-700 max-w-full"
                          onError={(e) => {
                            console.warn("[Book] image load error for:", product.img);
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                          <Coffee size={32} className="text-gray-600 mb-2 flex-shrink-0" />
                          <p className="text-gray-500 text-xs font-bold">تصویری موجود نیست</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest truncate">
                          {product.category || "دسته‌بندی نشده"}
                        </p>
                        <span className="text-gray-600 font-mono text-[10px] flex-shrink-0">
                          #{product.productId || "---"}
                        </span>
                      </div>

                      <h3 className="text-white font-black italic text-base sm:text-lg mb-4 break-words line-clamp-2">
                        {product.name || "بدون نام"}
                      </h3>

                      <div className="border-t border-gray-800 pt-4 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-gray-500 text-[10px] font-bold mb-1">قیمت واحد:</p>
                          <span className="text-white font-black text-lg sm:text-xl italic truncate block">
                            {Number(product.price || 0).toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-[10px]">تومان</span>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-gray-500 text-[10px] font-bold mb-1">موجودی</p>
                          <span className="text-red-600 font-black text-lg sm:text-xl italic block text-center">
                            {product.stock || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16 sm:py-20 bg-[#1a1d23] rounded-[3rem] border-2 border-dashed border-gray-800">
              <Book size={48} className="mx-auto text-gray-700 mb-4 flex-shrink-0" />
              <p className="text-gray-500 font-black italic">
                {searchTerm ? "نتیجه‌ای برای جستجوی شما یافت نشد!" : "موردی در این دسته یافت نشد!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
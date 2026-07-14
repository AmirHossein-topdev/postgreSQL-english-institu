// frontend\src\pages\manager-dashboard\book\index.jsx
"use client";

import React, { useEffect } from "react";
import {
  Coffee,
  Beef,
  Zap,
  Apple,
  Droplets,
  Flame,
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
  Mic,
  Smile,
  Library,
  Headphones,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import DashboardLayout from "../layout";
import { useGetAllBooksQuery } from "@/redux/features/bookApi";
export default function BookPage() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllBooksQuery();

  console.log("RTK Query Status:", {
    isLoading,
    isFetching,
    isError,
    error: error?.data || error,
    data,
  });

  const products = data?.books ?? data ?? [];

  console.log("HOOK CALLED");
  console.log("DATA:", data);
  const [activeCategory, setActiveCategory] = React.useState("همه");

  useEffect(() => {
    console.log("DATA CHANGED:", data);
  }, [data]);

  const handleDeleteBook = async (id, bookName) => {
    console.log("[Book] handleDeleteBook called, id:", id);

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

    if (!result.isConfirmed) {
      console.log("[Book] delete cancelled by user:", id);
      return;
    }

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

  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (activeCategory === "همه") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <DashboardLayout>
      <div
        className="p-4 md:p-8 min-h-screen rounded-4xl bg-[#0F1420] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              فروشگاه <span className="text-blue-400">کتاب</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-black mt-3 flex items-center gap-2 uppercase tracking-[0.4em]">
              <FlameIcon size={14} className="text-blue-400" />
              TACTICAL REFUELING STATION
            </p>
          </div>

          <Link
            href="/manager-dashboard/book/create"
            className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-black font-bold uppercase px-5 py-3 rounded-2xl shadow-lg transition-all"
          >
            <PlusIcon size={16} /> ایجاد آیتم
          </Link>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-10 border-b border-gray-800/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black italic text-xs md:text-sm whitespace-nowrap transition-all
                ${
                  activeCategory === cat.name
                    ? "bg-blue-400 text-black scale-105 shadow-lg"
                    : "bg-[#1a1d23] text-gray-500 border border-gray-800 hover:border-gray-600"
                }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search (UI only) */}
        <div className="relative mb-8 max-w-md">
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="جستجوی سریع کتاب..."
            className="w-full bg-[#1a1d23] border border-gray-800 rounded-2xl py-4 pr-12 pl-4 text-white text-sm font-bold focus:outline-none focus:border-blue-400 italic"
          />
        </div>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <p className="text-gray-500 font-bold italic text-center py-20">
            در حال بارگذاری منو...
          </p>
        )}

        {/* Products */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id || product._id}
                className="bg-[#1a1d23] border border-gray-800 rounded-[2rem] overflow-hidden hover:border-blue-400/50 transition-all shadow-xl"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-900/30 flex items-center justify-center">
                  {/* Edit Icon */}
                  <Link
                    href={`/manager-dashboard/book/${product.id || product._id}/edit`}
                    className="absolute cursor-pointer top-4 left-4 z-10 bg-black/70 border border-blue-400/40 text-blue-400 p-2 rounded-full hover:bg-blue-400 hover:text-black transition-all"
                  >
                    <Pencil size={14} />
                  </Link>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(product.id || product._id, product.name);
                    }}
                    className="absolute cursor-pointer top-4 left-14 z-10 bg-black/70 border border-red-400/40 text-red-400 p-2 rounded-full hover:bg-red-400 hover:text-black transition-all"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* تصویر یا placeholder */}
                  {product.img ? (
                    // محافظت از فضای src در صورت وجود مقدار نادرست
                    <img
                      src={`http://localhost:5000/uploads/images/${product.img}`}
                      alt={product.name || "book image"}
                      className="w-full h-full object-contain hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        console.warn(
                          "[Book] image load error for:",
                          product.img,
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                      <Coffee size={32} className="text-gray-600 mb-2" />
                      <p className="text-gray-500 text-xs font-bold">
                        تصویری موجود نیست
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest">
                      {product.category}
                    </p>
                    <span className="text-gray-600 font-mono text-[10px]">
                      #{product.productId}
                    </span>
                  </div>

                  <h3 className="text-white font-black italic text-lg mb-4">
                    {product.name}
                  </h3>

                  <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold mb-1">
                        قیمت واحد:
                      </p>
                      <span className="text-white font-black text-xl italic">
                        {Number(product.price || 0).toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-[10px] mr-2">
                        تومان
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold mb-1">
                        موجودی
                      </p>
                      <span className="text-red-600 mx-auto font-black text-xl italic">
                        {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#1a1d23] rounded-[3rem] border-2 border-dashed border-gray-800">
            <Book size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-black italic">
              موردی در این دسته یافت نشد !
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

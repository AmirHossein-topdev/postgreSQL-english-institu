// frontend/src/app/manager-dashboard/cafe-book/page.jsx
"use client";

import React from "react";
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
// RTK Query hooks (اطمینان حاصل کن که bookApi مشابه نمونه قبلی در پروژه تعریف شده)
import {
  useGetAllBooksQuery,
  useDeleteBookMutation,
} from "../../../redux/features/bookApi";

export default function BookPage() {
  // گرفتن دیتا از سرور با RTK Query
  const {
    data: productsData, // ✅ این درسته
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBooksQuery();

  // بعد اضافه کن:
  const products = productsData?.books || [];

  const [activeCategory, setActiveCategory] = React.useState("همه");

  const handleDeletebook = async (id) => {
    // لاگ اولیه برای دیباگ
    console.log("[Book] handleDeletebook called, id:", id);

    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این آیتم منو حذف خواهد شد!",
      icon: "warning",
      background: "#1a1d23",
      color: "#fff",
      showCancelButton: true,
      confirmButtonColor: "#facc15",
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
      console.log("[Book] sending delete request for id:", id);
      const response = await deletebook(id).unwrap(); // unwrap to get actual response or throw
      console.log("[Book] delete success:", response);

      await refetch(); // اطمینان از تازه‌سازی لیست
      Swal.fire({
        title: "حذف شد!",
        icon: "success",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#facc15",
      });
    } catch (err) {
      // لاگ کامل خطا برای دیباگ (شامل err.data اگر backend پیام داده)
      console.error("[Book] delete error:", err);
      const serverMsg =
        err?.data?.message || err?.error || err?.message || "خطا در حذف";

      Swal.fire({
        title: "خطا!",
        text: serverMsg,
        icon: "error",
        background: "#1a1d23",
        color: "#fff",
        confirmButtonColor: "#facc15",
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
                key={product._id}
                className={`bg-[#1a1d23] border rounded-[2rem] overflow-hidden transition-all shadow-xl ${
                  product.stock === 0
                    ? "border-red-500/30 opacity-70 hover:border-red-500/50"
                    : product.stock < 5
                      ? "border-orange-500/30 hover:border-orange-500/50"
                      : "border-gray-800 hover:border-blue-400/50"
                }`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-900/30 flex items-center justify-center">
                  {product.img ? (
                    <img
                      src={`http://localhost:5000/uploads/images${product.img}`}
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

                  {/* نشان‌دهنده وضعیت موجودی روی عکس */}
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                      ❌ ناموجود
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 5 && (
                    <div className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                      ⚡ فقط {product.stock} عدد باقی مونده
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

                  <h3 className="text-white font-black italic text-lg mb-4 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-gray-500 text-[10px] font-bold mb-1">
                      💰 قیمت واحد:
                    </p>
                    <span className="text-white font-black text-xl italic">
                      {Number(product.price || 0).toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-[10px] mr-2">
                      تومان
                    </span>
                  </div>

                  {/* موجودی با طراحی خاص */}
                  <div className="border-t border-gray-800 pt-4 mt-2">
                    <p className="text-gray-500 text-[10px] font-bold mb-2">
                      📦 موجودی
                    </p>
                    {product.stock === 0 ? (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                        <span className="text-red-400 font-black text-base block">
                          ❌ متاسفانه ناموجود
                        </span>
                        <span className="text-gray-500 text-[9px] mt-1 block">
                          به زودی موجود میشه!
                        </span>
                      </div>
                    ) : product.stock < 5 ? (
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-orange-400 font-black text-2xl italic">
                            {product.stock}
                          </span>
                          <span className="text-orange-400 text-[10px] font-bold">
                            عدد باقی مونده
                          </span>
                        </div>
                        <span className="text-gray-500 text-[9px] mt-1 block text-center">
                          ⚡ عجله کن! تعداد محدود
                        </span>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
                        <span className="text-emerald-400 font-black text-base">
                          ✅ موجود در انبار
                        </span>
                        <span className="text-gray-500 text-[9px] mt-1 block">
                          {product.stock} عدد موجود است
                        </span>
                      </div>
                    )}
                  </div>

                  {/* دکمه رزرو کتاب */}
                  {product.stock > 0 && (
                    <button
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: "✨ رزرو کتاب",
                          text: `کتاب "${product.name}" برای شما رزرو شد!`,
                          html: `
                    <div class="text-right" style="direction: rtl">
                      <p class="text-white mb-3">📚 <strong>${product.name}</strong> با موفقیت برای شما رزرو شد.</p>
                      <p class="text-emerald-400 mb-3">⏰ تا <strong>۲۴ ساعت آینده</strong> فرصت دارید!</p>
                      <p class="text-gray-400 text-sm">📍 برای خرید حضوری به آموزشگاه مراجعه کنید.</p>
                      <p class="text-blue-400 text-xs mt-3">💡 کتاب رو تا فردا همین ساعت براتون نگه می‌داریم</p>
                    </div>
                  `,
                          icon: "success",
                          background: "#1a1d23",
                          color: "#fff",
                          confirmButtonColor: "#3b82f6",
                          confirmButtonText: "🙏 ممنونم!",
                          showCancelButton: true,
                          cancelButtonColor: "#374151",
                          cancelButtonText: "بعداً",
                          reverseButtons: true,
                        });

                        if (result.isConfirmed) {
                          Swal.fire({
                            title: "🎉 موفق باشید!",
                            text: "منتظر دیدارتون در آموزشگاه هستیم",
                            icon: "success",
                            background: "#1a1d23",
                            color: "#fff",
                            confirmButtonColor: "#3b82f6",
                            confirmButtonText: "باشه 🤝",
                            timer: 2000,
                          });
                        }
                      }}
                      className={`w-full mt-4 py-3 rounded-xl font-black text-sm transition-all transform hover:scale-[1.02] active:scale-95 ${
                        product.stock < 5
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25"
                      }`}
                    >
                      📖 رزرو کتاب {product.stock < 5 && "🔥"}
                    </button>
                  )}

                  {product.stock === 0 && (
                    <button
                      disabled
                      className="w-full mt-4 py-3 rounded-xl font-black text-sm bg-gray-700/50 text-gray-500 cursor-not-allowed"
                    >
                      ❌ ناموجود
                    </button>
                  )}
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

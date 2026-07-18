// frontend/src/redux/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    credentials: "include",
    prepareHeaders: (headers) => {
      try {
        if (typeof window === "undefined") return headers;

        // ✅ از localStorage بخوان
        const userInfo = localStorage.getItem("userInfo");
        console.log("🔍 localStorage userInfo:", userInfo);

        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          if (parsed?.accessToken) {
            headers.set("Authorization", `Bearer ${parsed.accessToken}`);
            console.log("✅ Token set from localStorage");
            return headers;
          }
        }

        // ✅ اگر در localStorage نبود، از sessionStorage بخوان
        const sessionUserInfo = sessionStorage.getItem("userInfo");
        if (sessionUserInfo) {
          const parsed = JSON.parse(sessionUserInfo);
          if (parsed?.accessToken) {
            headers.set("Authorization", `Bearer ${parsed.accessToken}`);
            console.log("✅ Token set from sessionStorage");
            return headers;
          }
        }

        console.warn("⚠️ No token found!");
      } catch (error) {
        console.error("❌ Header error:", error);
      }
      return headers;
    },
  }),
  tagTypes: ["Book", "Users", "Class", "Teacher", "Student", "Enrollment"],
  endpoints: () => ({}),
});
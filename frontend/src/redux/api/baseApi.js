// frontend\src\redux\api\baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api"; // ← اینجا 5000

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      try {
        if (typeof window !== "undefined") {
          const userInfo = localStorage.getItem("userInfo");
          if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user?.accessToken) {
              headers.set("Authorization", `Bearer ${user.accessToken}`);
            }
          }
        }
      } catch (error) {
        console.error("Header error:", error);
      }
      return headers;
    },
  }),
  tagTypes: ["Book", "Users", "Class", "Teacher", "Student", "Enrollment"],
  endpoints: () => ({}),
});

// frontend/src/redux/features/auth/authApi.js
import { baseApi } from "@/redux/api/baseApi";
import { userLoggedIn } from "./authSlice";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ===============================
    // 🔹 Login User
    // ===============================
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/auth/login`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          // ذخیره در Cookies
          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.token,
              user: result.data.user,
            }),
            { expires: 1 },
          );

          // ذخیره در Redux
          dispatch(
            userLoggedIn({
              accessToken: result.data.token,
              user: result.data.user,
            }),
          );

          // پیام موفقیت
          Swal.fire({
            icon: "success",
            title: "ورود موفقیت‌آمیز بود",
          });
        } catch (err) {
          // پیام خطا
          Swal.fire({
            icon: "error",
            title: "ورود موفقیت‌آمیز نبود",
            text: err?.error?.data?.message || "اطلاعات اشتباه است",
          });
        }
      },
    }),

    // ===============================
    // 🔹 Get Current User
    // ===============================
    getUser: builder.query({
      query: () => `${BASE_URL}/user/me`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              user: result.data,
            }),
          );
        } catch (err) {
          console.error("Get user failed:", err);
        }
      },
    }),

    // ===============================
    // 🔹 Confirm Email
    // ===============================
    confirmEmail: builder.query({
      query: (token) => `${BASE_URL}/user/confirmEmail/${token}`,
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.token,
              user: result.data.user,
            }),
            { expires: 0.5 },
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.token,
              user: result.data.user,
            }),
          );
        } catch (err) {
          console.error("Confirm email failed:", err);
        }
      },
    }),

    // ===============================
    // 🔹 Reset Password
    // ===============================
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/user/forget-password`,
        method: "PATCH",
        body: data,
      }),
    }),

    // ===============================
    // 🔹 Confirm Forgot Password
    // ===============================
    confirmForgotPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/user/confirm-forget-password`,
        method: "PATCH",
        body: data,
      }),
    }),

    // ===============================
    // 🔹 Change Password
    // ===============================
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/user/change-password`,
        method: "PATCH",
        body: data,
      }),
    }),

    // ===============================
    // 🔹 Update Profile
    // ===============================
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BASE_URL}/user/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "userInfo",
            JSON.stringify({
              accessToken: result.data.token,
              user: result.data.user,
            }),
            { expires: 0.5 },
          );

          dispatch(
            userLoggedIn({
              accessToken: result.data.token,
              user: result.data.user,
            }),
          );
        } catch (err) {
          console.error("Update profile failed:", err);
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetUserQuery,
  useConfirmEmailQuery,
  useResetPasswordMutation,
  useConfirmForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;

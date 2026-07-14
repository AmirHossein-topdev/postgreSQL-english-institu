// frontend/src/redux/features/userApi.js
import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // لیست کاربران با pagination, search, filter
    listUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        role,
        status,
        sortBy,
        sortOrder,
      } = {}) => ({
        url: "/users",
        params: { page, limit, search, role, status, sortBy, sortOrder },
      }),
      transformResponse: (response) => {
        // Normalize response
        return {
          users: response.data?.users || response.users || [],
          pagination: response.data?.pagination || {},
        };
      },
      providesTags: ["Users"],
    }),

    // دریافت کاربر با ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      transformResponse: (response) => response.data || response,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // دریافت کاربر با employeeCode
    getUserByEmployeeCode: builder.query({
      query: (code) => `/users/employee/${code}`,
      transformResponse: (response) => response.data || response,
    }),

    // ایجاد کاربر جدید
    createUser: builder.mutation({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // بروزرسانی کاربر
    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),

    // حذف کاربر
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useListUsersQuery,
  useGetUserByIdQuery,
  useGetUserByEmployeeCodeQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

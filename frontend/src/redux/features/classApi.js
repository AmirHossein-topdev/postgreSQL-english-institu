// frontend/src/redux/features/classApi.js
import { baseApi } from "@/redux/api/baseApi";

export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // لیست کلاس‌ها
    getclasss: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status,
        teacherId,
        sortBy,
        sortOrder,
      } = {}) => ({
        url: "/class",
        params: { page, limit, search, status, teacherId, sortBy, sortOrder },
      }),
      transformResponse: (response) => ({
        data: response.data || response || [],
        pagination: response.pagination || {},
      }),
      providesTags: ["Class"],
    }),

    // دریافت کلاس خاص
    getClassById: builder.query({
      query: (id) => `/class/${id}`,
      transformResponse: (response) => response.data || response,
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),

    // ایجاد کلاس
    createClass: builder.mutation({
      query: (body) => ({
        url: "/class",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),

    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/class/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetclasssQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} = classApi;

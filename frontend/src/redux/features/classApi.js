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
        level,
        term,
        teacherId,
        isConfirmed,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = {}) => ({
        url: "/class",
        params: {
          page,
          limit,
          search,
          status,
          level,
          term,
          teacherId,
          isConfirmed,
          sortBy,
          sortOrder,
        },
      }),
      transformResponse: (response) => {
        // سازگاری با ساختار Prisma: { success: true, data: [...], pagination: {...} }
        if (response?.data && Array.isArray(response.data)) {
          return {
            data: response.data,
            pagination: response.pagination || {},
          };
        }
        if (Array.isArray(response)) {
          return {
            data: response,
            pagination: {},
          };
        }
        if (response?.data?.data && Array.isArray(response.data.data)) {
          return {
            data: response.data.data,
            pagination: response.data.pagination || {},
          };
        }
        return {
          data: response?.data || response || [],
          pagination: response?.pagination || {},
        };
      },
      providesTags: ["Class"],
    }),

    // دریافت کلاس خاص
    getClassById: builder.query({
      query: (id) => `/class/${id}`,
      transformResponse: (response) => {
        // سازگاری با ساختار Prisma: { success: true, data: {...} }
        if (response?.data) {
          return response.data;
        }
        return response;
      },
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),

    // دریافت کلاس‌های یک دانشجو
    getClassesByStudent: builder.query({
      query: (studentId) => `/class/student/${studentId}`,
      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return response?.data || response || [];
      },
      providesTags: ["Class"],
    }),

    // دریافت کلاس‌های یک استاد
    getClassesByTeacher: builder.query({
      query: (teacherId) => `/class/teacher/${teacherId}`,
      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        if (response?.data?.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
        return response?.data || response || [];
      },
      providesTags: ["Class"],
    }),

    // دریافت دانشجویان یک کلاس
    getClassStudents: builder.query({
      query: (classId) => `/class/${classId}/students`,
      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) {
          return response.data;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return response?.data || response || [];
      },
      providesTags: ["Class"],
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

    // آپدیت کلاس
    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/class/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Class"],
    }),

    // حذف کلاس
    deleteClass: builder.mutation({
      query: (id) => ({
        url: `/class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),

    // تأیید کلاس
    confirmClass: builder.mutation({
      query: (id) => ({
        url: `/class/${id}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: ["Class"],
    }),

    // لغو کلاس
    cancelClass: builder.mutation({
      query: (id) => ({
        url: `/class/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Class"],
    }),

    // تکمیل کلاس
    completeClass: builder.mutation({
      query: (id) => ({
        url: `/class/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Class"],
    }),

    // افزودن دانشجو به کلاس
    addStudentToClass: builder.mutation({
      query: ({ classId, studentId }) => ({
        url: `/class/${classId}/add-student`,
        method: "POST",
        body: { studentId },
      }),
      invalidatesTags: ["Class"],
    }),

    // حذف دانشجو از کلاس
    removeStudentFromClass: builder.mutation({
      query: ({ classId, studentId }) => ({
        url: `/class/${classId}/remove-student/${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetclasssQuery,
  useGetClassByIdQuery,
  useGetClassesByStudentQuery,
  useGetClassesByTeacherQuery,
  useGetClassStudentsQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useConfirmClassMutation,
  useCancelClassMutation,
  useCompleteClassMutation,
  useAddStudentToClassMutation,
  useRemoveStudentFromClassMutation,
} = classApi;

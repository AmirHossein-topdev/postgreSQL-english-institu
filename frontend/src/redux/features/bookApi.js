// frontend\src\redux\features\bookApi.js
import { baseApi } from "../api/baseApi";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooks: builder.query({
      query: () => "/books", // ← درست شد
      providesTags: ["Book"],
    }),

    getBookById: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),

    createBook: builder.mutation({
      query: (bookData) => ({
        url: "/books",
        method: "POST",
        body: bookData,
      }),
      invalidatesTags: ["Book"],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...bookData }) => ({
        url: `/books/${id}`,
        method: "PUT",
        body: bookData,
      }),
      invalidatesTags: ["Book"],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useGetAllBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;

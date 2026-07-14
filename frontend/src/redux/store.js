// frontend\src\redux\store.js
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (gdm) => gdm().concat(baseApi.middleware),
});

export default store;

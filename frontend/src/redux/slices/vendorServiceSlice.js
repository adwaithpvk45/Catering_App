import { createSlice } from "@reduxjs/toolkit";

const vendorServiceSlice = createSlice({
  name: "vendorService",
  initialState: {
    services: [],
    pagination: {},
    service: [],
    error: null,
  },
  reducers: {
    serviceAddSuccess: (state, action) => {
      state.service = action.payload;
    },
    serviceAddFail: (state, action) => {
      state.error = action.payload;
      state.service = [];
    },

    fetchServiceSuccess: (state, action) => {
      state.services = action.payload;
      state.pagination = action.payload.pagination;
    },
    fetchServiceFail: (state, action) => {
      state.error = action.payload;
      state.services = [];
    },
  },
});

export const {
  fetchServiceSuccess,
  fetchServiceFail,
  serviceAddFail,
  serviceAddSuccess,
} = vendorServiceSlice.actions;

export default vendorServiceSlice.reducer;

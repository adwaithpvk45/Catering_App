import { createSlice } from "@reduxjs/toolkit";

const vendorServiceSlice = createSlice({
  name: "vendorService",
  initialState: {
    services: [],
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

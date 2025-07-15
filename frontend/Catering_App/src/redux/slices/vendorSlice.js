import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    menus: [],
    error: null,
    services: [],
  },
  reducers: {
    fetchMenusSuccess: (state, action) => {
      state.menus = action.payload;
    },
    fetchMenusFail: (state, action) => {
      state.error = action.payload;
      state.menus = [];
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
  fetchMenusSuccess,
  fetchMenusFail,
  fetchServiceSuccess,
  fetchServiceFail,
} = vendorSlice.actions;

export default vendorSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    vendors: [],
    users: [],
    errors: null,
  },
  reducers: {
    fetchVendorsSuccess: (state, action) => {
      state.vendors = action.payload;
    },
    fetchVendorsFail: (state, action) => {
      state.errors = action.payload;
      state.vendors = [];
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
    },
    fetchUsersFail: (state, action) => {
      state.errors = action.payload;
      state.users = [];
    },
  },
});

export const {
  fetchMenusSuccess,
  fetchVendorsFail,
  fetchUsersSuccess,
  fetchUsersFail,
} = adminSlice.actions;
export default adminSlice.reducer;

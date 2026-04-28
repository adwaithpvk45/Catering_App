import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    vendors: [],
    users: [],
    complaints: [],
    stats: null,
    errors: null,
  },
  reducers: {
    fetchVendorsSuccess: (state, action) => {
      state.vendors = action.payload.vendors;
    },
    fetchVendorsFail: (state, action) => {
      state.errors = action.payload;
      state.vendors = [];
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload.users;
    },
    fetchUsersFail: (state, action) => {
      state.errors = action.payload;
      state.users = [];
    },
    fetchComplaintsSuccess: (state, action) => {
      state.complaints = action.payload.complaints;
    },
    fetchComplaintsFail: (state, action) => {
      state.errors = action.payload;
      state.complaints = [];
    },
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload.stats;
    },
    updateComplaintStatusSuccess: (state, action) => {
        const updated = action.payload.updatedComplaint;
        state.complaints = state.complaints.map(c => c._id === updated._id ? updated : c);
    }
  },
});

export const {
  fetchVendorsSuccess,
  fetchVendorsFail,
  fetchUsersSuccess,
  fetchUsersFail,
  fetchComplaintsSuccess,
  fetchComplaintsFail,
  fetchStatsSuccess,
  updateComplaintStatusSuccess
} = adminSlice.actions;
export default adminSlice.reducer;

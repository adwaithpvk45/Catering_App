import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    vendors: [],
    users: [],
    complaints: [],
    bookings: [],
    pagination: {
      users: { total: 0, page: 1, limit: 5, pages: 1 },
      vendors: { total: 0, page: 1, limit: 5, pages: 1 },
      bookings: { total: 0, page: 1, limit: 5, pages: 1 },
      complaints: { total: 0, page: 1, limit: 5, pages: 1 }
    },
    stats: null,
    adminInsights: null,
    aiAssistMap: {},
    errors: null,
  },
  reducers: {
    fetchVendorsSuccess: (state, action) => {
      state.vendors = action.payload.vendors;
      state.pagination.vendors = action.payload.pagination || { total: action.payload.vendors.length, page: 1, limit: 5, pages: 1 };
    },
    fetchVendorsFail: (state, action) => {
      state.errors = action.payload;
      state.vendors = [];
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload.users;
      state.pagination.users = action.payload.pagination || { total: action.payload.users.length, page: 1, limit: 5, pages: 1 };
    },
    fetchUsersFail: (state, action) => {
      state.errors = action.payload;
      state.users = [];
    },
    fetchComplaintsSuccess: (state, action) => {
      state.complaints = action.payload.complaints;
      state.pagination.complaints = action.payload.pagination || { total: action.payload.complaints.length, page: 1, limit: 5, pages: 1 };
    },
    fetchComplaintsFail: (state, action) => {
      state.errors = action.payload;
      state.complaints = [];
    },
    fetchBookingsSuccess: (state, action) => {
      state.bookings = action.payload.bookings;
      state.pagination.bookings = action.payload.pagination || { total: action.payload.bookings.length, page: 1, limit: 5, pages: 1 };
    },
    fetchBookingsFail: (state, action) => {
      state.errors = action.payload;
      state.bookings = [];
    },
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload.stats;
    },
    fetchAdminInsightsSuccess: (state, action) => {
      state.adminInsights = action.payload.insights;
    },
    fetchAiAssistSuccess: (state, action) => {
      if (action.payload.complaintId) {
        state.aiAssistMap[action.payload.complaintId] = action.payload;
      }
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
  fetchBookingsSuccess,
  fetchBookingsFail,
  fetchStatsSuccess,
  fetchAdminInsightsSuccess,
  fetchAiAssistSuccess,
  updateComplaintStatusSuccess
} = adminSlice.actions;
export default adminSlice.reducer;

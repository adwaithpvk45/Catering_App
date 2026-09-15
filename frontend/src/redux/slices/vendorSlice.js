import { createSlice } from "@reduxjs/toolkit";

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    stats: null,
    vendorInsights: null,
    bookings: [],
    services: [],
    errors: null,
  },
  reducers: {
    fetchVendorStatsSuccess: (state, action) => {
      state.stats = action.payload.stats;
    },
    fetchVendorStatsFail: (state, action) => {
      state.errors = action.payload;
    },
    fetchVendorInsightsSuccess: (state, action) => {
      state.vendorInsights = action.payload.insights;
    },
    fetchVendorBookingsSuccess: (state, action) => {
      state.bookings = action.payload.bookings;
    },
    fetchVendorBookingsFail: (state, action) => {
      state.errors = action.payload;
      state.bookings = [];
    },
    fetchVendorServicesSuccess: (state, action) => {
      state.services = action.payload.services;
    },
    fetchVendorServicesFail: (state, action) => {
      state.errors = action.payload;
      state.services = [];
    },
  },
});

export const {
  fetchVendorStatsSuccess,
  fetchVendorStatsFail,
  fetchVendorInsightsSuccess,
  fetchVendorBookingsSuccess,
  fetchVendorBookingsFail,
  fetchVendorServicesSuccess,
  fetchVendorServicesFail,
} = vendorSlice.actions;

export default vendorSlice.reducer;

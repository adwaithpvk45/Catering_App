import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    menus: [],
    Food: [],
    Service: [],
    Booking: [],
    complaints: [],
    error: "",
  },
  reducers: {
    fetchFoodSuccess: (state, action) => {
      state.Food = action.payload;
    },
    fetchFoodFail: (state, action) => {
      state.error = action.payload;
      state.Food = [];
    },
    fetchServiceSuccess: (state, action) => {
      state.Service = action.payload;
    },
    fetchServiceFail: (state, action) => {
      state.error = action.payload;
      state.Service = [];
    },
    fetchBookingSuccess: (state, action) => {
      state.Booking = action.payload.bookings || action.payload;
    },
    fetchBookingFail: (state, action) => {
      state.Booking = [];
      state.error = action.payload;
    },
    fetchComplaintsSuccess: (state, action) => {
      state.complaints = action.payload.complaints;
    },
    fetchComplaintsFail: (state, action) => {
      state.complaints = [];
      state.error = action.payload;
    },
    fetchMenusSuccess: (state, action) => {
      state.menus = action.payload;
    },
  },
});

export const {
  fetchFoodSuccess,
  fetchFoodFail,
  fetchServiceSuccess,
  fetchServiceFail,
  fetchBookingSuccess,
  fetchBookingFail,
  fetchComplaintsSuccess,
  fetchComplaintsFail,
  fetchMenusSuccess,
} = userSlice.actions;

export default userSlice.reducer;

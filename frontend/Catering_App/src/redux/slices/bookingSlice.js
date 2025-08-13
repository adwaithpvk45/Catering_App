import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    booking: [],
    error: null,
    status:[]
  },
  reducers: {
    fetchBookingSuccess: (state, action) => {
      state.booking = action.payload.data;
    },
    fetchBookingFail: (state, action) => {
      state.error = action.payload;
      state.booking = [];
    },
    statusSuccess: (state, action) => {
      state.status = action.payload.data;
    },
    statusFail: (state, action) => {
      state.error = action.payload;
      state.status = [];
    },


    // fetchServiceSuccess: (state, action) => {
    //   state.services = action.payload;
    // },
    // fetchServiceFail: (state, action) => {
    //   state.error = action.payload;
    //   state.services = [];
    // },
  },
});

export const {
  fetchBookingFail,fetchBookingSuccess
} = bookingSlice.actions;

export default bookingSlice.reducer;

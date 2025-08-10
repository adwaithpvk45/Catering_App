import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    menus: [],
    Food:[],
    Service:[],
    Booking:[],
    error:"",
  },
  reducers: {
    fetchFoodSuccess: (state, action) => {
      state.Food = action.payload;
    },
    fetchFoodFail: (state, action) => {
      state.error=action.payload,
      state.Food = []
    },
    fetchServiceSuccess: (state, action) => {
      state.Service = action.payload;
    },
    fetchServiceFail: (state, action) => {
      state.error = action.payload;
      state.Service = []
    },
    fetchBookingSuccess: (state, action) => {
      state.Booking = action.payload;
    },
    fetchBookingFail: (state, action) => {
      state.Booking = [];
      state.error=action.payload
    },
    fetchMenusSuccess: (state, action) => {
      state.menus = action.payload;
    },
    fetchMenusSuccess: (state, action) => {
      state.menus = action.payload;
    },
  },
});

export const { fetchMenusSuccess } = userSlice.actions;
export default userSlice.reducer;

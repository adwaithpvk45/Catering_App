import { createSlice } from "@reduxjs/toolkit";

const vendorFoodSlice = createSlice({
  name: "vendorFood",
  initialState: {
    menus: [],
    food:[],
    error: null,
  },
  reducers: {
    foodAddSuccess: (state, action) => {
      state.food = action.payload;
    },
    foodAddFail: (state, action) => {
      state.error = action.payload;
      state.food = [];
    },
    fetchMenusSuccess: (state, action) => {
      state.menus = action.payload;
    },
    fetchMenusFail: (state, action) => {
      state.error = action.payload;
      state.menus = [];
    },
  },
});

export const {
  fetchMenusSuccess,
  fetchMenusFail,
  foodAddFail,foodAddSuccess
} = vendorFoodSlice.actions;

export default vendorFoodSlice.reducer;

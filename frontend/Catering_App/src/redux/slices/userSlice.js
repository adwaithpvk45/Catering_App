import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: "vendor",
  initialState: {
    menus: [],
  },
  reducers: {
    fetchMenusSuccess: (state, action) => {
      state.menus = action.payload;
    },
  },
});

export const { fetchMenusSuccess } = userSlice.actions;
export default userSlice.reducer;
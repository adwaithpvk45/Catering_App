import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "Profile",
  initialState: {
    data: [],
    pic:"",
    // Service:[],
    // Booking:[],
    error:"",
  },
  reducers: {
    fetchProfileSuccess: (state, action) => {
      state.data = action.payload;
    },
    fetchProfileFail: (state, action) => {
      state.error=action.payload,
      state.data = []
    },
    postProfileSuccess: (state, action) => {
      state.data = action.payload;
    },
    postProfileFail: (state, action) => {
      state.error = action.payload;
      state.data = []
    },
    fetchProfilePicSuccess: (state, action) => {
      state.pic = action.payload;
    },
    fetchProfilePicFail: (state, action) => {
      state.error=action.payload,
      state.pic = []
    },
    postProfilePicSuccess: (state, action) => {
      state.pic = action.payload;
    },
    postProfilePicFail: (state, action) => {
      state.error = action.payload;
      state.pic = []
    },
  },
});

export const { fetchProfileFail,fetchProfileSuccess,postProfileFail,postProfileSuccess,fetchProfilePicFail,fetchProfilePicSuccess,postProfilePicFail,postProfilePicSuccess } = profileSlice.actions;
export default profileSlice.reducer;

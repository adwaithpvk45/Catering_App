import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    loginData: [],
    logoutData: [],
    registerData: [],
    error: null,
    // services: [],
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.loginData = action.payload;
    },
    loginFail: (state, action) => {
      state.error = action.payload;
      state.loginData = [];
    },
    logoutSuccess: (state, action) => {
      state.logoutData = action.payload;
    },
    logoutFail: (state, action) => {
      state.error = action.payload;
      state.logoutData = [];
    },
    registerSuccess: (state, action) => {
      state.registerData = action.payload;
    },
    registerFail: (state, action) => {
      state.error = action.payload;
      state.registerData = [];
    },
  },
});

export const { loginSuccess, loginFail, registerFail, registerSuccess } =
  loginSlice.actions;

export default loginSlice.reducer;

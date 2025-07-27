import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    isAuthenticated: !!localStorage.getItem("userDetails"), // for each page reloads if the user is logged in checking if
    // authenticaated by the presenece of loginData, if no data in localstorage then the user is not authenticated.
    loginData: [],
    logoutData: [],
    registerData: [],
    error: null,
    role: null,
    // services: [],
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true; // Instantly after login authenticated is checked.
      state.loginData = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
      state.role = action.payload.existingUser.role;
    },
    loginFail: (state, action) => {
      state.error = action.payload;
      state.loginData = [];
    },
    logoutSuccess: (state, action) => {
      state.logoutData = action.payload;
      localStorage.removeItem("userDetails");
      state.isAuthenticated = false;
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

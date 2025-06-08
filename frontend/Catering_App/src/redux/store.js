import { configureStore } from "@reduxjs/toolkit";
import vendorReducer from "./slices/vendorSlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    vendor: vendorReducer,
    admin: adminReducer,
    user: userReducer,
  },
});

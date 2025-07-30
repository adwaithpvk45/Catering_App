import { configureStore } from "@reduxjs/toolkit";
import vendorReducer from "./slices/vendorSlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import loginReducer from "./slices/loginSlice";
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    vendor: vendorReducer,
    admin: adminReducer,
    user: userReducer,
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;

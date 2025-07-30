import { configureStore } from "@reduxjs/toolkit";
import vendorFoodReducer from "./slices/vendorFoodSlice";
import vendorServiceReducer from "./slices/vendorServiceSlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import loginReducer from './slices/loginSlice'

const store = configureStore({
  reducer: {
    vendorFood: vendorFoodReducer,
    vendorService:vendorServiceReducer,
    admin: adminReducer,
    user: userReducer,
    login:loginReducer
  },
});

export default store;

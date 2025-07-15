import { toast } from "react-toastify";
import commonFunction from "../common/commonApi";

export const login = (values, navigate) => async (dispatch) => {
  try {
    const res = await commonFunction(
      {
        api: "/api/auth/login",
        method: "POST",
        body: JSON.stringify(values),
        successAction: "login/loginSuccess",
        failureAction: "login/loginFail",
        showSuccess: true,
        successMessage: "Logged In successfully!",
      },
      dispatch
    );
    console.log("🚀 ~ login ~ res:", res);
    if (res?.message === "Logged in successfully") {
      toast.success(res?.message);
      localStorage.setItem("userDetails", JSON.stringify(res));
      if (res?.existingUser?.role === "vendor") {
        navigate("/vendor/vendorDashboard");
      } else if (res?.existingUser?.role === "user") {
        navigate("/Home");
      } else {
        navigate("/admin/dashboard");
      }
    }
  } catch (error) {
    toast.error(error);
  }
};

export const signUp = (values, navigate) => async (dispatch) => {
  try {
    const res = await commonFunction(
      {
        api: "/api/auth/signup",
        method: "POST",
        body: JSON.stringify(values),
        successAction: "login/registerSuccess",
        failureAction: "login/registerFail",
        showSuccess: true,
        successMessage: "Signup successfully!",
      },
      dispatch
    );
    if (res?.message) {
      toast.success(res?.message);
      if (navigate) {
        navigate("/login");
      }
    }
  } catch (err) {
    toast.error("Error in signing up");
  }
};

export const logout = (values, navigate) => async (dispatch) => {
  try {
    const res = await commonFunction(
      {
        api: "/api/auth/logout",
        method: "POST",
        body:{},
        successAction: "login/logoutSuccess",
        failureAction: "login/logoutFail",
        showSuccess: true,
        successMessage: "Logged out successfully!",
      },
      dispatch
    );
    if (res?.message) {
      toast.success(res?.message);
      if (navigate) {
        navigate("/Home");
      }
    }
  } catch (err) {
    toast.error("Error in signing up");
  }
};

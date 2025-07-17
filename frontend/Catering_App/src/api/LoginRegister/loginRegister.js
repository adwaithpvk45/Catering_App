import { toast } from "react-hot-toast";
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
    if (res?.message === "Loggedin successfully") {
      toast.success(res?.message, { duration: 3000 });
      localStorage.setItem("userDetails", JSON.stringify(res));
      if (res?.existingUser?.role === "vendor") {
        navigate("/vendor/vendorDashboard");
      } else if (res?.existingUser?.role === "user") {
        navigate("/Home");
      } else {
        navigate("/admin/dashboard");
      }
    } else {
      toast.error(res?.message, { duration: 3000 });
    }
  } catch (error) {
    toast.error(error, { duration: 3000 });
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
      toast.success(res?.message, { duration: 3000 });
      if (navigate) {
        navigate("/login");
      }
    }
  } catch (err) {
    toast.error("Error in signing up", { duration: 3000 });
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    const res = await commonFunction(
      {
        api: "/api/auth/logout",
        method: "POST",
        body: {},
        successAction: "login/logoutSuccess",
        failureAction: "login/logoutFail",
        showSuccess: true,
        successMessage: "Logged out successfully!",
      },
      dispatch
    );
    if (res?.message === "logged out") {
      localStorage.removeItem("userDetails");
      toast.success(res?.message, { duration: 3000 });
      if (navigate) {
        navigate("/Home");
      }
    }
  } catch (err) {
    toast.error("Error in signing up", { duration: 3000 });
  }
};

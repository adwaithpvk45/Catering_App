import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const getAllFood = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  return await commonFunction(
    {
      api: `/api/food/getAllFood`,
      method: "GET",
      body: null,
      successAction: "User/fetchFoodSuccess",
      failureAction: "vendorFood/fetchFoodFail",
      showSuccess: true,
      successMessage: "All Food Items fetched successfully!",
    },
    dispatch
  );
};

export const getVendorFood = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  return await commonFunction(
    {
      api: `/api/food/getVendorFood/${id}`,
      method: "GET",
      body: null,
      successAction: "User/fetchFoodSuccess",
      failureAction: "User/fetchFoodFail",
      showSuccess: true,
      successMessage: "Vendor Food Items fetched successfully!",
    },
    dispatch
  );
};


export const getAllServices = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  return await commonFunction(
    {
      api: `/api/service/getAllServices`,
      method: "GET",
      body: null,
      successAction: "User/fetchServiceSuccess",
      failureAction: "User/fetchServiceFail",
      showSuccess: true,
      successMessage: "All Services fetched successfully!",
    },
    dispatch
  );
};

export const getVendorServices = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  return await commonFunction(
    {
      api: `/api/food/getVendorFood/${id}`,
      method: "GET",
      body: null,
      successAction: "User/fetchServiceSuccess",
      failureAction: "User/fetchServiceFail",
      showSuccess: true,
      successMessage: "Service Items fetched successfully!",
    },
    dispatch
  );
};

export const deleteFoodData = (id) => async (dispatch) => {
  const res = await commonFunction(
    {
      api: `/api/food/deleteFood/${id}`,
      method: "DELETE",
      body: null,
      successAction: "vendorFood/foodAddSuccess",
      failureAction: "vendorFood/foodAddFail",
      showSuccess: true,
      successMessage: "Food deleted successfully!",
    },
    dispatch
  );
  if (res.message === "Item deleted") {
    dispatch(getVendorFood());
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
};

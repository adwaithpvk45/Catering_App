import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const addFoodData = (formData) => async (dispatch) => {
  const res = await commonFunction(
    {
      api: "/api/food/addFood",
      method: "POST",
      body: formData,
      successAction: "vendorFood/foodAddSuccess",
      failureAction: "vendorFood/foodAddFail",
      showSuccess: true,
      successMessage: "Food added successfully!",
    },
    dispatch
  );

  console.log(res);

  if (res.message === "New Item added") {
    dispatch(getVendorFood());
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
};

export const editFoodData = ({ formData, id }) => {
  return async (dispatch) => {

    const res = await commonFunction(
      {
        api: `/api/food/editFood/${id}`,
        method: "PUT",
        body: formData,
        successAction: "vendorFood/foodAddSuccess",
        failureAction: "vendorFood/foodAddFail",
        showSuccess: true,
        successMessage: "Food data edited successfully!",
      },
      dispatch
    );
    console.log(res);
    if (res.message === "Food item updated") {
      dispatch(getVendorFood());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };
};

export const getVendorFood = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  return await commonFunction(
    {
      api: `/api/food/getVendorFood/${id}`,
      method: "GET",
      body: null,
      successAction: "vendorFood/fetchMenusSuccess",
      failureAction: "vendorFood/fetchMenusFail",
      showSuccess: true,
      successMessage: "Food Items fetched successfully!",
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

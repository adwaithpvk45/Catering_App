import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const addFoodData = (formData) => async (dispatch) => {
  const res = await commonFunction(
    {
      api: "/api/food/addFood",
      method: "POST",
      body: formData,
      successAction: "vendor/foodAddSuccess",
      failureAction: "vendor/foodAddFail",
      showSuccess: true,
      successMessage: "Food added successfully!",
    },
    dispatch
  );

  console.log(res);

  if (res.message === "New Item added") {
    dispatch(getVendorFood());
  }else{
    toast.error(res.message)
  }
};


export const getVendorFood = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  console.log("🚀 ~ getVendorFood ~ id:", id);
  return await commonFunction(
    {
      api: `/api/food/getVendorFood/${id}`,
      method: "GET",
      body: null,
      successAction: "vendor/fetchMenusSuccess",
      failureAction: "vendor/fetchMenusFail",
      showSuccess: true,
      successMessage: "Food Items fetched successfully!",
    },
    dispatch
  );
};

export const deleteFoodData = (id) => async (dispatch) => {
  const res= await commonFunction(
    {
      api: `/api/food/deleteFood/${id}`,
      method: "DELETE",
      body: null,
      successAction: "vendor/foodAddSuccess",
      failureAction: "vendor/foodAddFail",
      showSuccess: true,
      successMessage: "Food deleted successfully!",
    },
    dispatch
  );
   if (res.message === "Item deleted") {
    dispatch(getVendorFood());
  }else{
    toast.error(res.message)
  }
};

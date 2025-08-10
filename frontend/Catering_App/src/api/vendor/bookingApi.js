import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const getVendorBookings = (id) => async (dispatch) => {
  const res = await commonFunction(
    {
      api: `/api/booking/vendor/${id}`,
      method: "GET",
      body: null,
      successAction: "booking/fetchBookingSuccess",
      failureAction: "booking/fetchBookingFail",
      showSuccess: true,
      successMessage: "Bookings fetched successfully!",
    },
    dispatch
  );

  console.log(res);

  if (res.message === "Booking data fetched") {
    return
  } else {
    toast.error(res.message);
  }
};

export const statusChange = ({ formData, id }) => {
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

// export const getVendorFood = () => async (dispatch) => {
//   const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
//   return await commonFunction(
//     {
//       api: `/api/food/getVendorFood/${id}`,
//       method: "GET",
//       body: null,
//       successAction: "vendorFood/fetchMenusSuccess",
//       failureAction: "vendorFood/fetchMenusFail",
//       showSuccess: true,
//       successMessage: "Food Items fetched successfully!",
//     },
//     dispatch
//   );
// };

// export const deleteFoodData = (id) => async (dispatch) => {
//   const res = await commonFunction(
//     {
//       api: `/api/food/deleteFood/${id}`,
//       method: "DELETE",
//       body: null,
//       successAction: "vendorFood/foodAddSuccess",
//       failureAction: "vendorFood/foodAddFail",
//       showSuccess: true,
//       successMessage: "Food deleted successfully!",
//     },
//     dispatch
//   );
//   if (res.message === "Item deleted") {
//     dispatch(getVendorFood());
//     toast.success(res.message);
//   } else {
//     toast.error(res.message);
//   }
// };

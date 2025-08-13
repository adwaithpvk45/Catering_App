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

  if (res.message === "Booking data fetched") {
    return;
  } else {
    toast.error(res.message);
  }
};

export const statusChange = ({ status, id }) => {
  const _id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  console.log("sdfghjk");
  return async (dispatch) => {
    const res = await commonFunction(
      {
        api: `/api/booking/${id}`,
        method: "PUT",
        body: JSON.stringify({ status }),
        successAction: "booking/statusSuccess",
        failureAction: "booking/statusFail",
        showSuccess: true,
        successMessage: "Status updated successfully!",
      },
      dispatch
    );
    console.log(res);
    if (res.message === "Status updated successfully") {
      dispatch(getVendorBookings(_id));
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

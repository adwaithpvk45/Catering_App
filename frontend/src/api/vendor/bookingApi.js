import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const getVendorBookings = (id, page = 1, limit = 5, search = "", status = "", paymentStatus = "", startDate = "", endDate = "") => async (dispatch) => {
  const res = await commonFunction(
    {
      api: `/api/booking/vendor/${id}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}&paymentStatus=${paymentStatus}&startDate=${startDate}&endDate=${endDate}`,
      method: "GET",
      body: null,
      successAction: "booking/fetchBookingSuccess",
      failureAction: "booking/fetchBookingFail",
    },
    dispatch
  );

  if (res && res.message === "Booking data fetched") {
    return;
  } else if (res) {
    toast.error(res.message);
  }
};

export const statusChange = ({ status, id }, page = 1, limit = 5, search = "", statusFilter = "", paymentFilter = "", startDate = "", endDate = "") => {
  const _id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
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
    if (res && res.message === "Status updated successfully") {
      dispatch(getVendorBookings(_id, page, limit, search, statusFilter, paymentFilter, startDate, endDate));
    } else if (res) {
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

export const markBookingFullyPaidAction = (id, page = 1, limit = 5, search = "", statusFilter = "", paymentFilter = "", startDate = "", endDate = "") => async (dispatch) => {
  const _id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  const res = await commonFunction(
    {
      api: `/api/booking/${id}/mark-fully-paid`,
      method: "PATCH",
      showSuccess: true,
      successMessage: "Booking marked as fully paid!",
    },
    dispatch
  );
  if (res && res.success) {
    dispatch(getVendorBookings(_id, page, limit, search, statusFilter, paymentFilter, startDate, endDate));
  } else if (res) {
    toast.error(res.message || "Failed to mark as fully paid");
  }
};

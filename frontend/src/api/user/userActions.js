import commonFunction from "../common/commonApi";

export const getUserBookings = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/booking/user",
        method: "GET",
        successAction: "User/fetchBookingSuccess",
        failureAction: "User/fetchBookingFail",
    }, dispatch);
};

export const getUserComplaints = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/complaints/user",
        method: "GET",
        successAction: "User/fetchComplaintsSuccess",
        failureAction: "User/fetchComplaintsFail",
    }, dispatch);
};

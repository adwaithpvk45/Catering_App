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

export const createComplaintAction = (complaintData) => async (dispatch) => {
    return await commonFunction({
        api: "/api/complaints/submit",
        method: "POST",
        body: complaintData,
        showSuccess: true,
        successMessage: "Ticket submitted successfully!",
    }, dispatch);
};

export const createBookingAction = (bookingData) => async (dispatch) => {
    return await commonFunction({
        api: "/api/booking/enquire",
        method: "POST",
        body: JSON.stringify(bookingData),
        showSuccess: true,
        successMessage: "Booking request submitted successfully!",
    }, dispatch);
};

export const payBookingAdvanceAction = (id, paymentData) => async (dispatch) => {
    return await commonFunction({
        api: `/api/booking/${id}/pay-advance`,
        method: "PATCH",
        body: JSON.stringify(paymentData),
        showSuccess: true,
        successMessage: "Advance paid successfully! Booking Confirmed.",
    }, dispatch);
};

export const createRazorpayOrderAction = (id) => async (dispatch) => {
    return await commonFunction({
        api: `/api/booking/${id}/razorpay-order`,
        method: "POST",
        body: null,
        showSuccess: false,
    }, dispatch);
};

export const verifyRazorpayPaymentAction = (id, verificationData) => async (dispatch) => {
    return await commonFunction({
        api: `/api/booking/${id}/verify-payment`,
        method: "POST",
        body: JSON.stringify(verificationData),
        showSuccess: true,
        successMessage: "Payment verified successfully! Booking Confirmed.",
    }, dispatch);
};


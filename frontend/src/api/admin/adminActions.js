import commonFunction from "../common/commonApi";

export const getComplaints = (page = 1, limit = 5, search = "") => async (dispatch) => {
    return await commonFunction({
        api: `/api/admin/complaints?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
        successAction: "admin/fetchComplaintsSuccess",
        failureAction: "admin/fetchComplaintsFail",
    }, dispatch);
};

export const updateStatus = (id, status, replyMessage) => async (dispatch) => {
    return await commonFunction({
        api: `/api/admin/complaints/${id}`,
        method: "PATCH",
        body: { status, replyMessage },
        successAction: "admin/updateComplaintStatusSuccess",
        showSuccess: true,
        successMessage: `Status updated to ${status}`,
    }, dispatch);
};

export const getStats = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/admin/stats",
        method: "GET",
        successAction: "admin/fetchStatsSuccess",
    }, dispatch);
};

export const getUsers = (page = 1, limit = 5, search = "") => async (dispatch) => {
    return await commonFunction({
        api: `/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
        successAction: "admin/fetchUsersSuccess",
        failureAction: "admin/fetchUsersFail",
    }, dispatch);
};

export const getVendors = (page = 1, limit = 5, search = "") => async (dispatch) => {
    return await commonFunction({
        api: `/api/admin/vendors?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
        successAction: "admin/fetchVendorsSuccess",
        failureAction: "admin/fetchVendorsFail",
    }, dispatch);
};

export const getBookings = (page = 1, limit = 5, search = "") => async (dispatch) => {
    return await commonFunction({
        api: `/api/admin/bookings?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
        method: "GET",
        successAction: "admin/fetchBookingsSuccess",
        failureAction: "admin/fetchBookingsFail",
    }, dispatch);
};

export const toggleAccountStatusAction = (id, status, role, page = 1, limit = 5, search = "") => async (dispatch) => {
    const res = await commonFunction({
        api: `/api/admin/status/${id}`,
        method: "PATCH",
        body: JSON.stringify({ status }),
        showSuccess: true,
        successMessage: `Account successfully ${status === "blocked" ? "blocked" : "unblocked"}!`,
    }, dispatch);

    if (res && res.success) {
        if (role === "vendor") {
            dispatch(getVendors(page, limit, search));
        } else {
            dispatch(getUsers(page, limit, search));
        }
    }
};

import commonFunction from "../common/commonApi";

export const getComplaints = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/admin/complaints",
        method: "GET",
        successAction: "admin/fetchComplaintsSuccess",
        failureAction: "admin/fetchComplaintsFail",
    }, dispatch);
};

export const updateStatus = (id, status) => async (dispatch) => {
    return await commonFunction({
        api: `/api/admin/complaints/${id}`,
        method: "PATCH",
        body: { status },
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

export const getUsers = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/admin/users",
        method: "GET",
        successAction: "admin/fetchUsersSuccess",
        failureAction: "admin/fetchUsersFail",
    }, dispatch);
};

export const getVendors = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/admin/vendors",
        method: "GET",
        successAction: "admin/fetchVendorsSuccess",
        failureAction: "admin/fetchVendorsFail",
    }, dispatch);
};

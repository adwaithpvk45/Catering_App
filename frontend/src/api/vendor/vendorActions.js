import commonFunction from "../common/commonApi";

export const getVendorStats = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/vendor/stats",
        method: "GET",
        successAction: "vendor/fetchVendorStatsSuccess",
        failureAction: "vendor/fetchVendorStatsFail",
    }, dispatch);
};

export const getVendorBookings = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/vendor/bookings",
        method: "GET",
        successAction: "vendor/fetchVendorBookingsSuccess",
        failureAction: "vendor/fetchVendorBookingsFail",
    }, dispatch);
};

export const getVendorServices = () => async (dispatch) => {
    return await commonFunction({
        api: "/api/vendor/services",
        method: "GET",
        successAction: "vendor/fetchVendorServicesSuccess",
        failureAction: "vendor/fetchVendorServicesFail",
    }, dispatch);
};

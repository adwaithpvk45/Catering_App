import commonFunction from "../common/commonApi";

export const updateVendorProfile = (profileDetails) => {
  return async (dispatch) => {
    return await commonFunction(
      {
        api: `/api/vendor/updateVendorProfile`,
        method: "PATCH",
        body: JSON.stringify(profileDetails),
        successAction: "vendor/updateProfileSuccess",
        failureAction: "vendor/updateProfileFail",
        showSuccess: true,
        successMessage: "Vendor profile updated successfully!",
      },
      dispatch
    );
  };
};

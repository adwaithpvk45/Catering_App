import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const profileData = () => {
  return async (dispatch) => {
    const res = await commonFunction(
      {
        api: `/api/vendor/updateVendorProfile`,
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

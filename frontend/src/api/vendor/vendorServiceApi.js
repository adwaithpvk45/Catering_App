import toast from "react-hot-toast";
import commonFunction from "../common/commonApi";

export const addServiceData = (formData) => async (dispatch) => {
  const res = await commonFunction(
    {
      api: "/api/service/addService",
      method: "POST",
      body: formData,
      successAction: "vendorService/serviceAddSuccess",
      failureAction: "vendorService/serviceAddFail",
      showSuccess: true,
      successMessage: "Service added successfully!",
    },
    dispatch
  );

  console.log(res);

  if (res.message === "New Item added") {
    dispatch(getVendorService());
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
};

export const editServiceData = ({ formData, id }) => {
  return async (dispatch) => {
    const res = await commonFunction(
      {
        api: `/api/service/editService/${id}`,
        method: "PUT",
        body: formData,
        successAction: "vendorService/foodAddSuccess",
        failureAction: "vendorService/foodAddFail",
        showSuccess: true,
        successMessage: "Service data edited successfully!",
      },
      dispatch
    );
    console.log(res);
    if (res.message === "Service updated") {
      dispatch(getVendorService());
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };
};

export const getVendorService = () => async (dispatch) => {
  const id = JSON.parse(localStorage.getItem("userDetails")).existingUser._id;
  return await commonFunction(
    {
      api: `/api/service/getVendorService/${id}`,
      method: "GET",
      body: null,
      successAction: "vendorService/fetchServiceSuccess",
      failureAction: "vendorService/fetchServiceFail",
      showSuccess: true,
      successMessage: "Services fetched successfully!",
    },
    dispatch
  );
};

export const deleteServiceData = (id) => async (dispatch) => {
  const res = await commonFunction(
    {
      api: `/api/service/deleteService/${id}`,
      method: "DELETE",
      body: null,
      successAction: "vendorService/serviceAddSuccess",
      failureAction: "vendorService/serviceAddFail",
      showSuccess: true,
      successMessage: "Service deleted successfully!",
    },
    dispatch
  );
  if (res.message === "Item deleted") {
    dispatch(getVendorService());
    toast.success(res.message);
  } else {
    toast.error(res.message);
  }
};

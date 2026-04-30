import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";

const commonFunction = async (
  {
    api,
    method = "GET",
    body = null,
    successAction,
    extraAction,
    failureAction,
    showSuccess = false,
    showError = true,
    successMessage = "Operation successful",
    errorMessage = "Something went wrong",
  },
  dispatch
) => {
  try {
    const response = await axiosInstance({
      url: api,
      method,
  ...(body ? { data: body } : {}), // Only include data if body is not null ?? null,
    });

    const data = response.data;

    if (successAction) {
      dispatch({ type: successAction, payload: data });
    }

    if (extraAction) {
      dispatch({ type: extraAction, payload: data });
    }

    if (showSuccess) {
      toast.success(successMessage);
    }

    return data;
  } catch (error) {
    const errorData = error?.response?.data || error.message;

    if (failureAction) {
      dispatch({ type: failureAction, payload: errorData });
    }

    if (showError) {
      toast.error(errorData?.message || errorMessage);
    }

    throw errorData;
  }
};

export default commonFunction;

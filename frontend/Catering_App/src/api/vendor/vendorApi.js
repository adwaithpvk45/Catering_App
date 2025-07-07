import commonFunction from "../common/commonApi";

export const addFoodData = (formData) => async (dispatch) => {
  return await commonFunction({
    api: '/api/food/addFood',
    method: 'POST',
    body: formData,
    successAction: 'vendor/uploadImageSuccess',
    failureAction: 'vendor/uploadImageFail',
    showSuccess: true,
    successMessage: 'Image uploaded successfully!',
  }, dispatch);
};


import commonFunction from "../common/commonApi";

export const uploadMenuImage = (formData) => async (dispatch) => {
  return await commonFunction({
    api: '/vendor/menu/upload',
    method: 'POST',
    body: formData,
    successAction: 'vendor/uploadImageSuccess',
    failureAction: 'vendor/uploadImageFail',
    showSuccess: true,
    successMessage: 'Image uploaded successfully!',
  }, dispatch);
};


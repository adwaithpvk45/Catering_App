import axiosInstance from "../common/axiosInstance";

export const submitComplaint = async (complaintData) => {
    try {
        const response = await axiosInstance.post("/api/complaints/submit", complaintData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};

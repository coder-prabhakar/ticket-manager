import axiosInstance from "./axiosInstance.js";

export const getReport = async (payload) => {
    const res = await axiosInstance.post("/api/report", payload);
    return res.data;
};
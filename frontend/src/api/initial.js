import axiosInstance from "./axiosInstance.js";

export const getInitialData = async ({
    fromDate,
    toDate,
} = {}) => {

    const params = {};

    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const res = await axiosInstance.get("/api/initial", {
        params,
    });

    return res.data;
};
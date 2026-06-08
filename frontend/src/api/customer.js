import axiosInstance from "./axiosInstance.js";

/*========== For Admin ==========*/

export const getAllCustomers = async () => {
    const res = await axiosInstance.get("/api/customer");
    return res.data;
};

export const createCustomer = async (data) => {
    const res = await axiosInstance.post("/api/customer", data);
    return res.data;
};

export const updateCustomer = async (id, data) => {
    const res = await axiosInstance.put(`/api/customer/${id}`, data);
    return res.data;
};

export const deleteCustomer = async (id) => {
    const res = await axiosInstance.delete(`/api/customer/${id}`);
    return res.data;
};
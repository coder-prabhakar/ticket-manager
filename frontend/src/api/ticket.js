import axiosInstance from "./axiosInstance.js";

export const getAllTickets = async () => {
    const res = await axiosInstance.get("/api/ticket");
    return res.data;
};

export const createTicket = async (data) => {
    const res = await axiosInstance.post("/api/ticket", data);
    return res.data;
};

export const updateTicket = async (id, data) => {
    const res = await axiosInstance.put(`/api/ticket/${id}`, data);
    return res.data;
};
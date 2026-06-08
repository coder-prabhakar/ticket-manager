import axiosInstance from "./axiosInstance.js";

/*========== For Admin ==========*/

export const getAllContacts = async () => {
    const res = await axiosInstance.get("/api/contact");
    return res.data;
};

export const createContact = async (data) => {
    const res = await axiosInstance.post("/api/contact", data);
    return res.data;
};

export const updateContact = async (contact_id, data) => {
    const res = await axiosInstance.put(`/api/contact/${contact_id}`, data);
    return res.data;
};

export const deleteContact = async (contact_id) => {
    const res = await axiosInstance.delete(`/api/contact/${contact_id}`);
    return res.data;
};
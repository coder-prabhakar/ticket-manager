import axiosInstance from "./axiosInstance.js";

/*========== For Admin ==========*/

export const getAllMembers = async () => {
    const res = await axiosInstance.get("/api/member");
    return res.data;
};

export const createMember = async (data) => {
    const res = await axiosInstance.post("/api/member", data);
    return res.data;
};

export const updateMember = async (id, data) => {
    const res = await axiosInstance.put(`/api/member/${id}`, data);
    return res.data;
};

export const deleteMember = async (id) => {
    const res = await axiosInstance.delete(`/api/member/${id}`);
    return res.data;
};
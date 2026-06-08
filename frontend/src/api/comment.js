import axiosInstance from "./axiosInstance.js";

export const getCommentsByTaskId = async (taskId) => {
    const res = await axiosInstance.get(`/api/comment/${taskId}`);
    return res.data;
};

export const createComment = async (data) => {
    const res = await axiosInstance.post("/api/comment", data);
    return res.data;
};
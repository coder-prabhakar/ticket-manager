import axiosInstance from "./axiosInstance.js";

/*========== For Admin ==========*/

export const getAllProjects = async () => {
    const res = await axiosInstance.get("/api/project");
    return res.data;
};

export const createProject = async (data) => {
    const res = await axiosInstance.post("/api/project", data);
    return res.data;
};

export const updateProject = async (project_id, data) => {
    const res = await axiosInstance.put(`/api/project/${project_id}`, data);
    return res.data;
};

export const deleteProject = async (project_id) => {
    const res = await axiosInstance.delete(`/api/project/${project_id}`);
    return res.data;
};
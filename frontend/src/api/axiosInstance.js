import axios from "axios";
import { getDataFromLocalStorage } from "../utils/localStorage.js";

const axiosInstance = axios.create({
    // baseURL: "http://192.168.1.37:5000",
    baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use((config) => {
    const data = getDataFromLocalStorage();

    if (data) {
        config.headers.Authorization = `Bearer ${data.token}`;
    };

    return config;
});

export default axiosInstance;
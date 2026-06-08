import { Navigate, Outlet } from "react-router";
import { getDataFromLocalStorage } from "../utils/localStorage.js";


export default function ProtectedRoute({ allowedRoles }) {
    const data = getDataFromLocalStorage();

    const userRole = data?.user?.role;

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}
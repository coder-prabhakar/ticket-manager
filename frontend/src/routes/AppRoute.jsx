import Sidebar from "../components/Sidebar";
import { DataProvider } from "../context/DataContext.jsx";
import { getDataFromLocalStorage } from "../utils/localStorage.js";
import { ScrollRestoration, Navigate, Outlet } from "react-router";


export default function AppRoute() {
    const data = getDataFromLocalStorage();
    if (!data) return <Navigate to="/login" />;

    return (
        <DataProvider user={data?.user}>
            <div className="flex layout">
                <Sidebar userRole={data?.user?.role}/>
                <main className="main flex-1 h-screen overflow-y-auto bg-gray-100 px-4 pb-4 md:px-6 md:pb-6">
                    <Outlet />
                </main>
                <ScrollRestoration />
            </div>
        </DataProvider>
    )
};